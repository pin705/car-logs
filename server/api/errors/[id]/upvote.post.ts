export default defineEventHandler(async (event) => {
  try {
    const errorId = getRouterParam(event, 'id')
    const body = await readBody(event)
    const solutionIndex = body.solutionIndex
    
    // Get models from mongoose
    const ErrorPost = await useMongooseModel('ErrorPost')
    const User = await useMongooseModel('User')

    // Validate solution index
    if (solutionIndex === undefined || solutionIndex === null) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Solution index is required'
      })
    }

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

    // Find the error post
    const errorPost = await ErrorPost.findById(errorId)
    if (!errorPost) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Error post not found'
      })
    }

    // Check if solution exists
    if (!errorPost.solutions || !errorPost.solutions[solutionIndex]) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Solution not found'
      })
    }

    const solution = errorPost.solutions[solutionIndex]
    const userId = user._id.toString()
    const upvotedByIds = solution.upvotedBy.map((id: any) => id.toString())

    // Check if user already upvoted
    if (upvotedByIds.includes(userId)) {
      // Remove upvote
      solution.upvotedBy = solution.upvotedBy.filter((id: any) => id.toString() !== userId)
      solution.upvotes = Math.max(0, solution.upvotes - 1)
    } else {
      // Add upvote
      solution.upvotedBy.push(user._id)
      solution.upvotes += 1

      // Update reputation of solution author
      const solutionAuthor = await User.findById(solution.author)
      if (solutionAuthor) {
        solutionAuthor.reputation += 10 // Award 10 points per upvote
        
        // Update badges based on reputation
        if (solutionAuthor.reputation >= 100 && !solutionAuthor.badges.includes('contributor')) {
          solutionAuthor.badges.push('contributor')
        }
        if (solutionAuthor.reputation >= 500 && !solutionAuthor.badges.includes('expert')) {
          solutionAuthor.badges.push('expert')
        }
        if (solutionAuthor.reputation >= 1000 && !solutionAuthor.badges.includes('trusted')) {
          solutionAuthor.badges.push('trusted')
        }
        if (solutionAuthor.reputation >= 5000 && !solutionAuthor.badges.includes('master')) {
          solutionAuthor.badges.push('master')
        }
        
        await solutionAuthor.save()
      }
    }

    await errorPost.save()

    // Populate the author field before returning
    await errorPost.populate('solutions.author', 'username reputation badges')

    return {
      success: true,
      solution: errorPost.solutions[solutionIndex],
      upvoted: !upvotedByIds.includes(userId)
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Error upvoting solution',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})
