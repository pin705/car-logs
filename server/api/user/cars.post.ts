import { User } from '../../models/User'
import { CarModel } from '../../models/CarModel'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (!body.userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID is required'
      })
    }

    if (!body.car || !body.car.make || !body.car.model || !body.car.year) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Car information (make, model, year) is required'
      })
    }

    // Find or create car
    let car = await CarModel.findOne({
      make: body.car.make,
      model: body.car.model,
      year: body.car.year,
      variant: body.car.variant || ''
    })

    if (!car) {
      car = await CarModel.create({
        make: body.car.make,
        model: body.car.model,
        year: body.car.year,
        variant: body.car.variant || ''
      })
    }

    // Add car to user's savedCars if not already there
    const user = await User.findById(body.userId)

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }

    if (!user.savedCars.includes(car._id)) {
      user.savedCars.push(car._id)
      await user.save()
    }

    return {
      success: true,
      message: 'Car added successfully',
      car
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Error adding car',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})
