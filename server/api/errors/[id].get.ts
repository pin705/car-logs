import { ErrorPost } from '../../models/ErrorPost'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Error ID is required'
    })
  }

  try {
    
    const error = await ErrorPost
      .findById(id)
      .populate('car')
      .populate('author', 'username reputation badges')
      .populate('solutions.author', 'username reputation badges')
      .lean()

    if (!error) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Error not found'
      })
    }

    // Increment views
    await ErrorPost.findByIdAndUpdate(id, { $inc: { views: 1 } })

    return error
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching error details',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})
