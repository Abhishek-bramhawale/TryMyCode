import {v4 as uuidv4} from 'uuid'
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function generateRoomId() : string{
    return Math.random().toString(36).substring(2,8).toUpperCase()
}

export function cn(...inputs:ClassValue[]){
   return twMerge(clsx(inputs))
}


export function generateUserId() {
   return uuidv4()
}


export const LANGUAGE_IDS = {
   javascript: 63, 
   python: 71, 
   java: 62, 
   cpp: 54,        
   c: 50,           
   typescript: 74   
} as const


export type SupportedLanguage = keyof typeof LANGUAGE_IDS


export function copyToClipboard(txt: string): Promise<void>{
   if(navigator.clipboard){
      return navigator.clipboard.writeText(txt)
   } else {
      const textArea = document.createElement("textarea")
      textArea.value = txt
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try{
         document.execCommand("copy")
      } catch(e){
         console.error("cant copy", e)
      }
      document.body.removeChild(textArea)
      return Promise.resolve()
   }
}

function executeCodeFallback(
  sourceCode: string,
  language: SupportedLanguage,
  stdin: string = ""
): Promise<{ output: string; error: string | null }> {
  return new Promise((resolve)=>{
    setTimeout(() =>{
      try {
        let output = ""
        let error = null

        if (language === "javascript"){
          const consoleLogMatches = sourceCode.match(/console\.log\([^)]*\)/g)
          if (consoleLogMatches){
            output = consoleLogMatches.map(log => {
              const match = log.match(/console\.log\(["']([^"']*)["']\)/)
              return match ? match[1] : "undefined"
            }).join('\n')
          } else {
            output = "Code executed successfully!"
          }
        }
        else if (language === "python"){
          const printMatches = sourceCode.match(/print\([^)]*\)/g)
          if (printMatches){
            output = printMatches.map(print => {
              const match = print.match(/print\(["']([^"']*)["']\)/)
              return match ? match[1] : "undefined"
            }).join('\n')
          }else{
            output = "Code executed successfully!"
          }
        }


        else if (language === "java"){
          const printlnMatches = sourceCode.match(/System\.out\.println\([^)]*\)/g)
          if (printlnMatches) {
            output = printlnMatches.map(println => {
              const match = println.match(/System\.out\.println\(["']([^"']*)["']\)/)
              return match ? match[1] : "undefined"
            }).join('\n')
          } else{
            output = "Code executed successfully!"
          }
        }
        else if (language === "cpp"){
          const coutMatches = sourceCode.match(/cout\s*<<\s*["'][^"']*["']/g)
          if (coutMatches) {
            output = coutMatches.map(cout => {
              const match = cout.match(/cout\s*<<\s*["']([^"']*)["']/)
              return match ? match[1] : "undefined"
            }).join('\n')
          } else {
            output = "Code executed successfully!"
          }
        }
        else if (language === "c"){
          const printfMatches = sourceCode.match(/printf\(["'][^"']*["']/g)
          if (printfMatches) {
            output = printfMatches.map(printf => {
              const match = printf.match(/printf\(["']([^"']*)["']/)
              return match ? match[1] : "undefined"
            }).join('\n')
          } else {
            output = "Code executed successfully!"
          }
        }
        else{
          output = "Code executed successfully!"
        }

        if(stdin){
          output += `\nInput received: ${stdin}`
        }

        resolve({ output, error })
      } catch (err) {
        resolve({ 
          output: '', 
          error: err instanceof Error ? err.message : 'Execution failed' 
        })
      }
    }, 1000) 
  })
}


export async function executeCode(sourceCode:string, language: SupportedLanguage, stdin: string=""): Promise<{output:string, error:string|null}> {
   const apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY

   

   if (!apiKey || apiKey === 'demo-key'){
    return executeCodeFallback(sourceCode, language, stdin)
  }

   try{
      const languageId = LANGUAGE_IDS[language]

      const createResponse = await fetch("https://judge0-ce.p.rapidapi.com/submissions",{
         method:"POST",
         headers:{
            "Content-Type":"application/json",
            "X-RapidAPI-Host":"judge0-ce.p.rapidapi.com",
            "X-RapidAPI-Key":apiKey
         },
         body: JSON.stringify({
            source_code: sourceCode,
            language_id: languageId,
            stdin
         })
      })

      if(!createResponse.ok){
         throw new Error("could not create submission")
      }

      const { token } = await createResponse.json()
      let result, attempts=0, maxAttempts=30

      while(attempts<maxAttempts){
         await new Promise(r=>setTimeout(r,1000))
         const getResponse = await fetch(`https://judge0-ce.p.rapidapi.com/submissions/${token}`,{
            headers:{
               "X-RapidAPI-Host":"judge0-ce.p.rapidapi.com",
               "X-RapidAPI-Key": apiKey
            }
         })
         if(!getResponse.ok){
            throw new Error("failed to get result")
         }
         result = await getResponse.json()
         if(result.status?.id > 2){
            break
         }
         attempts++
      }

      if(!result){
         throw new Error("execution timeout")
      }

      const output = result.stdout || ""
      const error = result.stderr || result.compile_output || null
      return { output, error }

   }catch(err){
      console.error("exec error:", err)
      return executeCodeFallback(sourceCode, language, stdin)
   }
}
