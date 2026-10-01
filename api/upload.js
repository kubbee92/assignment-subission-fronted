import { put } from '@vercel/blob'

const MAX_FILE_BYTES = 10 * 1024 * 1024
const ALLOWED_EXTENSIONS = new Set(['pdf', 'xls', 'xlsx'])

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const form = await request.formData()
    const file = form.get('file')
    const studentId = String(form.get('student_id') || '').trim().toUpperCase()

    if (!(file instanceof File)) {
      return response.status(400).json({ error: 'No file was provided' })
    }

    if (!/^IGR\/[A-Z0-9]+\/[A-Z0-9]+$/i.test(studentId)) {
      return response.status(400).json({ error: 'Invalid student ID' })
    }

    const extension = file.name.split('.').pop()?.toLowerCase()
    if (!extension || !ALLOWED_EXTENSIONS.has(extension)) {
      return response.status(400).json({ error: 'Only PDF, XLS, and XLSX files are accepted' })
    }

    if (file.size <= 0 || file.size > MAX_FILE_BYTES) {
      return response.status(400).json({ error: 'File must be between 1 byte and 10 MB' })
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const pathname = `assignments/${studentId.replaceAll('/', '-')}/${Date.now()}-${safeName}`
    const blob = await put(pathname, file, {
      access: 'public',
      contentType: file.type || 'application/octet-stream',
      addRandomSuffix: false,
    })

    return response.status(200).json({
      file_url: blob.url,
      filename: file.name,
    })
  } catch (error) {
    console.error('[upload] Blob upload failed:', error)
    return response.status(500).json({ error: 'Upload failed' })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
