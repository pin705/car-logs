import { ErrorPost } from '../../models/ErrorPost'
import { CarModel } from '../../models/CarModel'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // For now, we'll use a mock user ID since auth is not fully implemented
    // In production, this should come from the session
    const mockUserId = '507f1f77bcf86cd799439011'

    // Validate required fields
    if (!body.title || !body.symptoms || !body.car) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields'
      })
    }

    // Find or create car model
    let carModel = await CarModel.findOne({
      make: body.car.make,
      model: body.car.model,
      year: body.car.year
    })

    if (!carModel) {
      carModel = await CarModel.create({
        make: body.car.make,
        model: body.car.model,
        year: body.car.year,
        variant: body.car.variant
      })
    }

    // Generate slug from title
    const { generateSlug } = await import('../../utils/slug')
    const baseSlug = generateSlug(body.title)
    
    // Check for existing slugs and make unique
    let slug = baseSlug
    let counter = 1
    while (await ErrorPost.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Create error post
    const errorPost = await ErrorPost.create({
      title: body.title,
      slug,
      description: body.description || body.symptoms,
      symptoms: body.symptoms,
      errorCode: body.errorCode?.toUpperCase(),
      car: carModel._id,
      author: mockUserId,
      images: body.images || [],
      videos: body.videos || []
    })

    const populatedError = await ErrorPost
      .findById(errorPost._id)
      .populate('car')
      .populate('author', 'username reputation badges')
      .lean()

    return populatedError
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Error creating error post',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})
