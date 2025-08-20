import { NextRequest, NextResponse } from 'next/server'
import { executeCode, SupportedLanguage, LANGUAGE_IDS } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { sourceCode, language, stdin } = await request.json()

    if (!sourceCode || !language) {
      return NextResponse.json(
        { error: 'Source code and language are required' },
        { status: 400 }
      )
    }

    if (!Object.keys(LANGUAGE_IDS).includes(language)) {
      return NextResponse.json(
        { error: 'Unsupported language' },
        { status: 400 }
      )
    }

    const result = await executeCode(
      sourceCode,
      language as SupportedLanguage,
      stdin || ''
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Code execution error:', error)
    return NextResponse.json(
      { error: 'Failed to execute code' },
      { status: 500 }
    )
  }
} 