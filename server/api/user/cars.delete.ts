import { User } from '../../models/User'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (!body.userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID is required'
      })
    }

    if (!body.carId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Car ID is required'
      })
    }

    const user = await User.findById(body.userId)

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }

    // Remove car from user's savedCars
    user.savedCars = user.savedCars.filter(carId => carId.toString() !== body.carId)
    await user.save()

    return {
      success: true,
      message: 'Car removed successfully'
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Error removing car',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})
