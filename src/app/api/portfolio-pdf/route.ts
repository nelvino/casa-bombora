import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const download = searchParams.get('download') === '1'

    const filePath = path.join(process.cwd(), 'src', 'images', 'PDF', 'Casa_bombora_Portofolio.pdf')
    const fileBuffer = await fs.readFile(filePath)

    const headers = new Headers({
      'Content-Type': 'application/pdf',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    })

    if (download) {
      headers.set('Content-Disposition', 'attachment; filename="Casa_bombora_Portfolio.pdf"')
    }

    return new NextResponse(fileBuffer, { status: 200, headers })
  } catch (err) {
    return NextResponse.json({ error: 'PDF not found' }, { status: 404 })
  }
}
