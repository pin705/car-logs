export default defineEventHandler(async (event) => {
  try {
    const questionId = getRouterParam(event, 'id')
    
    // Get models from mongoose
    const Question = await useMongooseModel('Question')

    // Find the question
    const question = await Question
      .findById(questionId)
      .populate('author', 'username reputation badges')
      .populate('answers.author', 'username reputation badges')
      .lean()

    if (!question) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Question not found'
      })
    }

    // Increment view count
    await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } })

    return question
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching question',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})
