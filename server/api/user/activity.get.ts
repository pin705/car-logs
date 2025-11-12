import { ErrorPost } from '../../models/ErrorPost'
import { Question } from '../../models/Question'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const userId = query.userId as string

    if (!userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID is required'
      })
    }

    // Get user's error posts
    const errorPosts = await ErrorPost.find({ author: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('car')
      .select('title slug createdAt status')

    // Get user's questions
    const questions = await Question.find({ author: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title slug createdAt status')

    // Get user's solutions
    const errorPostsWithSolutions = await ErrorPost.find({ 'solutions.author': userId })
      .sort({ 'solutions.createdAt': -1 })
      .limit(10)
      .populate('car')
      .select('title slug solutions')

    const solutions = errorPostsWithSolutions.flatMap(post => 
      post.solutions
        .filter(s => s.author.toString() === userId)
        .map(s => ({
          type: 'solution',
          errorPost: {
            title: post.title,
            slug: post.slug
          },
          createdAt: s.createdAt
        }))
    )

    // Get user's answers
    const questionsWithAnswers = await Question.find({ 'answers.author': userId })
      .sort({ 'answers.createdAt': -1 })
      .limit(10)
      .select('title slug answers')

    const answers = questionsWithAnswers.flatMap(question => 
      question.answers
        .filter(a => a.author.toString() === userId)
        .map(a => ({
          type: 'answer',
          question: {
            title: question.title,
            slug: question.slug
          },
          createdAt: a.createdAt
        }))
    )

    // Combine and sort all activities
    const activities = [
      ...errorPosts.map(post => ({
        type: 'error_post',
        title: post.title,
        slug: post.slug,
        status: post.status,
        createdAt: post.createdAt
      })),
      ...questions.map(q => ({
        type: 'question',
        title: q.title,
        slug: q.slug,
        status: q.status,
        createdAt: q.createdAt
      })),
      ...solutions,
      ...answers
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 20)

    return {
      success: true,
      activities,
      stats: {
        errorPosts: errorPosts.length,
        questions: questions.length,
        solutions: solutions.length,
        answers: answers.length
      }
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching user activity',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})
