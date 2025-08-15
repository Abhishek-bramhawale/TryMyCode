import { NextResponse } from 'next/server'

const JUDGE0_API = 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true'

export async function POST(req: Request) {
  const { code, language } = await req.json()

  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY as string,
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
    },
    body: JSON.stringify({
      source_code: code,
      language_id: language,
    }),
  }

  try {
    const response = await fetch(JUDGE0_API, options)
    const result = await response.json()

    const output =
      result.stderr || result.compile_output || result.stdout || 'No output'

      console.log(result);
      

    return NextResponse.json({ output })
  } catch (error) {
    return NextResponse.json({ output: 'Error running code' })
  }
}
