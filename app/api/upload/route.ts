import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_TYPES = new Set([
  'application/pdf',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
])

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const studentId = formData.get('studentId')

    if (!(file instanceof File) || typeof studentId !== 'string') {
      return NextResponse.json({ error: 'File and Student ID are required.' }, { status: 400 })
    }

    if (!/^UGR\/[^/]+\/[^/]+$/i.test(studentId.trim())) {
      return NextResponse.json({ error: 'Invalid Student ID.' }, { status: 400 })
    }

    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File must be between 1 byte and 10 MB.' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Only PDF, XLS, and XLSX files are allowed.' }, { status: 400 })
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const blob = await put(`assignments/${Date.now()}-${safeName}`, file, {
      access: 'public',
      addRandomSuffix: false,
      contentType: file.type,
    })

    return NextResponse.json({
      url: blob.url,
      filename: file.name,
      size: file.size,
      contentType: file.type,
    })
  } catch (error) {
    console.error('[v0] Assignment upload failed:', error)
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }
}
