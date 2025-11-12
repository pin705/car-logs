export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Get models from mongoose
    const Question = await useMongooseModel('Question')
    const User = await useMongooseModel('User')

    // TODO: Get user from session (temporary mock user)
    // For now, we'll create/get a default user
    let user = await User.findOne({ username: 'guest' })
    if (!user) {
      user = await User.create({
        username: 'guest',
        email: 'guest@example.com',
        password: 'password',
        reputation: 0,
        badges: []
      })
    }

    // Validate input
    if (!body.title || !body.title.trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title is required'
      })
    }

    if (!body.description || !body.description.trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Description is required'
      })
    }

    // Create question
    const question = await Question.create({
      title: body.title.trim(),
      description: body.description.trim(),
      category: body.category || 'general',
      author: user._id,
      tags: body.tags || [],
      answers: [],
      views: 0,
      status: 'open'
    })

    // Populate author before returning
    await question.populate('author', 'username reputation badges')

    return {
      success: true,
      question
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Error creating question',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})
