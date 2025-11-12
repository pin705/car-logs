export default defineEventHandler(async (event) => {
  try {
    const errorId = getRouterParam(event, 'id')
    const body = await readBody(event)
    
    // Get models from mongoose
    const ErrorPost = await useMongooseModel('ErrorPost')
    const User = await useMongooseModel('User')

    // TODO: Get user from session (temporary mock user)
    // For now, we'll create/get a default user
    let user = await User.findOne({ username: 'guest' })
    if (!user) {
      user = await User.create({
        username: 'guest',
        email: 'guest@example.com',
        password: 'password', // In real app, this would be hashed
        reputation: 0,
        badges: []
      })
    }

    // Validate input
    if (!body.description || !body.description.trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Description is required'
      })
    }

    // Find the error post
    const errorPost = await ErrorPost.findById(errorId)
    if (!errorPost) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Error post not found'
      })
    }

    // Create solution object
    const solution = {
      author: user._id,
      description: body.description.trim(),
      cost: body.cost || 0,
      timeRequired: body.timeRequired || '',
      upvotes: 0,
      upvotedBy: [],
      verified: false,
      images: body.images || [],
      createdAt: new Date()
    }

    // Add solution to error post
    errorPost.solutions.push(solution)
    await errorPost.save()

    // Populate the author field before returning
    await errorPost.populate('solutions.author', 'username reputation badges')

    return {
      success: true,
      solution: errorPost.solutions[errorPost.solutions.length - 1]
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Error adding solution',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})
