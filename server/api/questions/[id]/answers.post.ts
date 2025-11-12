export default defineEventHandler(async (event) => {
  try {
    const questionId = getRouterParam(event, 'id')
    const body = await readBody(event)
    
    // Get models from mongoose
    const Question = await useMongooseModel('Question')
    const User = await useMongooseModel('User')

    // TODO: Get user from session (temporary mock user)
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
    if (!body.content || !body.content.trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Content is required'
      })
    }

    // Find the question
    const question = await Question.findById(questionId)
    if (!question) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Question not found'
      })
    }

    // Create answer object
    const answer = {
      author: user._id,
      content: body.content.trim(),
      upvotes: 0,
      upvotedBy: [],
      accepted: false,
      createdAt: new Date()
    }

    // Add answer to question
    question.answers.push(answer)
    
    // Update question status
    if (question.status === 'open') {
      question.status = 'answered'
    }
    
    await question.save()

    // Populate the author field before returning
    await question.populate('answers.author', 'username reputation badges')

    return {
      success: true,
      answer: question.answers[question.answers.length - 1]
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Error adding answer',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})
