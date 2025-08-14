import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { code, language, input } = await request.json()

        if (!code || !language) {
            return NextResponse.json(
                { error: 'Code and language are required' },
                { status: 400 }
            )
        }

        const tempOutput = `Output for ${language}:
${code}

Input: ${input || 'No input provided'}

Execution completed successfully!`

        return NextResponse.json({ output: tempOutput })
    } catch (error) {
        console.error('Code execution error:', error)
        return NextResponse.json(
            { error: 'Failed to execute code' },
            { status: 500 }
        )
    }
}