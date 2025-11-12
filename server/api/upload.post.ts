import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event)
    
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No file uploaded'
      })
    }

    const uploadedFiles = []
    const uploadDir = join(process.cwd(), 'public', 'uploads')

    // Create uploads directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    for (const file of formData) {
      if (file.name === 'file' && file.filename) {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm']
        
        if (!file.type || !allowedTypes.includes(file.type)) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Invalid file type. Only images (JPEG, PNG, GIF, WebP) and videos (MP4, WebM) are allowed'
          })
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024 // 10MB in bytes
        if (file.data.length > maxSize) {
          throw createError({
            statusCode: 400,
            statusMessage: 'File size exceeds 10MB limit'
          })
        }

        // Generate unique filename
        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(7)
        const ext = file.filename.split('.').pop()
        const filename = `${timestamp}-${randomString}.${ext}`
        const filepath = join(uploadDir, filename)

        // Write file to disk
        await writeFile(filepath, file.data)

        // Return public URL
        uploadedFiles.push({
          filename,
          url: `/uploads/${filename}`,
          type: file.type,
          size: file.data.length
        })
      }
    }

    if (uploadedFiles.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No valid files uploaded'
      })
    }

    return {
      success: true,
      files: uploadedFiles,
      message: `${uploadedFiles.length} file(s) uploaded successfully`
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    console.error('Upload error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error uploading file',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})
