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


export async function executeCode(sourceCode:string, lang: SupportedLanguage, stdin: string=""): Promise<{output:string, error:string|null}> {
   const apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY

   if(!apiKey || apiKey==='demo-key'){
      throw new Error("missing api key")
   }

   try{
      const languageId = LANGUAGE_IDS[lang]

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
      throw err instanceof Error ? err : new Error("unknown exec error")
   }
}
