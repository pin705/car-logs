import { Question } from '../../models/Question'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { sort = 'recent', status = '' } = query

    // Build filter
    const filter: any = {}
    if (status && status !== 'all') {
      filter.status = status
    }

    // Sort options
    const sortOptions: any = {}
    switch (sort) {
      case 'popular':
        sortOptions.views = -1
        break
      case 'unanswered':
        sortOptions['answers.0'] = 1 // Sort by questions with no answers first
        sortOptions.createdAt = -1
        break
      case 'recent':
      default:
        sortOptions.createdAt = -1
        break
    }

    const questions = await Question
      .find(filter)
      .populate('author', 'username reputation badges')
      .populate('answers.author', 'username reputation badges')
      .sort(sortOptions)
      .limit(50)
      .lean()

    return questions
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching questions',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})
