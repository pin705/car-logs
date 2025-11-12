export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { sort = 'popularity', search = '', make = '', model = '' } = query

    // Get models from mongoose
    const ErrorPost = await useMongooseModel('ErrorPost')
    const CarModel = await useMongooseModel('CarModel')

    // Build filter
    const filter: any = {}
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { symptoms: { $regex: search, $options: 'i' } },
        { errorCode: { $regex: search, $options: 'i' } }
      ]
    }

    // Filter by make and model
    let carFilter: any = {}
    if (make) {
      carFilter.make = { $regex: make, $options: 'i' }
    }
    if (model) {
      carFilter.model = { $regex: model, $options: 'i' }
    }

    // If car filters exist, find matching car IDs
    if (Object.keys(carFilter).length > 0) {
      const matchingCars = await CarModel.find(carFilter).select('_id').lean()
      const carIds = matchingCars.map((car: any) => car._id)
      filter.car = { $in: carIds }
    }

    // Sort options
    const sortOptions: any = {}
    switch (sort) {
      case 'recent':
        sortOptions.createdAt = -1
        break
      case 'views':
        sortOptions.views = -1
        break
      case 'popularity':
      default:
        sortOptions.popularity = -1
        break
    }

    const errors = await ErrorPost
      .find(filter)
      .populate('car')
      .populate('author', 'username reputation badges')
      .sort(sortOptions)
      .limit(50)
      .lean()

    return errors
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching errors',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})
