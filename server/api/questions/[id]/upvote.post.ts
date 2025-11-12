export default defineEventHandler(async (event) => {
  try {
    const questionId = getRouterParam(event, 'id')
    const body = await readBody(event)
    const answerIndex = body.answerIndex
    
    // Get models from mongoose
    const Question = await useMongooseModel('Question')
    const User = await useMongooseModel('User')

    // Validate answer index
    if (answerIndex === undefined || answerIndex === null) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Answer index is required'
      })
    }

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

    // Find the question
    const question = await Question.findById(questionId)
    if (!question) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Question not found'
      })
    }

    // Check if answer exists
    if (!question.answers || !question.answers[answerIndex]) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Answer not found'
      })
    }

    const answer = question.answers[answerIndex]
    const userId = user._id.toString()
    const upvotedByIds = answer.upvotedBy.map((id: any) => id.toString())

    // Check if user already upvoted
    if (upvotedByIds.includes(userId)) {
      // Remove upvote
      answer.upvotedBy = answer.upvotedBy.filter((id: any) => id.toString() !== userId)
      answer.upvotes = Math.max(0, answer.upvotes - 1)
    } else {
      // Add upvote
      answer.upvotedBy.push(user._id)
      answer.upvotes += 1

      // Update reputation of answer author
      const answerAuthor = await User.findById(answer.author)
      if (answerAuthor) {
        answerAuthor.reputation += 5 // Award 5 points per upvote on answers
        
        // Update badges based on reputation
        if (answerAuthor.reputation >= 100 && !answerAuthor.badges.includes('contributor')) {
          answerAuthor.badges.push('contributor')
        }
        if (answerAuthor.reputation >= 500 && !answerAuthor.badges.includes('expert')) {
          answerAuthor.badges.push('expert')
        }
        if (answerAuthor.reputation >= 1000 && !answerAuthor.badges.includes('trusted')) {
          answerAuthor.badges.push('trusted')
        }
        if (answerAuthor.reputation >= 5000 && !answerAuthor.badges.includes('master')) {
          answerAuthor.badges.push('master')
        }
        
        await answerAuthor.save()
      }
    }

    await question.save()

    // Populate the author field before returning
    await question.populate('answers.author', 'username reputation badges')

    return {
      success: true,
      answer: question.answers[answerIndex],
      upvoted: !upvotedByIds.includes(userId)
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Error upvoting answer',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})
