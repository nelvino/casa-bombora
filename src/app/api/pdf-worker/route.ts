import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET() {
  try {
    const workerPath = path.join(process.cwd(), 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.js')
    const code = await fs.readFile(workerPath)
    // Convert Buffer to ArrayBuffer for Web Response body
    const arrayBuffer = code.buffer.slice(code.byteOffset, code.byteOffset + code.byteLength)
    return new NextResponse(arrayBuffer as ArrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (e) {
    return NextResponse.json({ error: 'Worker not found' }, { status: 404 })
  }
}
