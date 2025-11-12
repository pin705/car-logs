import { User } from '../../models/User'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Validate input
    if (!body.email || !body.email.trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email is required'
      })
    }

    if (!body.password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Password is required'
      })
    }

    // Find user by email
    const user = await User.findOne({ email: body.email.toLowerCase().trim() })

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid email or password'
      })
    }

    // Verify password (in production, use bcrypt.compare)
    if (user.password !== body.password) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid email or password'
      })
    }

    // Return user data (excluding password)
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      reputation: user.reputation,
      badges: user.badges
    }

    // TODO: Set session using nuxt-auth-utils
    // For now, just return user data
    return {
      success: true,
      user: userResponse,
      message: 'Login successful'
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Error logging in',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})
