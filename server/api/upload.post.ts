import { v2 as cloudinary } from 'cloudinary'

export default defineEventHandler(async (event) => {
  try {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    })

    const formData = await readMultipartFormData(event)
    
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No file uploaded'
      })
    }

    const uploadedFiles = []

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

        // Determine resource type based on file type
        const resourceType = file.type.startsWith('video/') ? 'video' : 'image'

        // Convert buffer to base64
        const base64Data = `data:${file.type};base64,${file.data.toString('base64')}`

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(base64Data, {
          folder: 'car-logs',
          resource_type: resourceType,
          transformation: resourceType === 'image' ? [
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ] : undefined
        })

        // Return Cloudinary URL
        uploadedFiles.push({
          filename: file.filename,
          url: result.secure_url,
          publicId: result.public_id,
          type: file.type,
          size: file.data.length,
          width: result.width,
          height: result.height
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
