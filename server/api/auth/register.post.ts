import { User } from '../../models/User'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Validate input
    if (!body.username || !body.username.trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Username is required'
      })
    }

    if (!body.email || !body.email.trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email is required'
      })
    }

    if (!body.password || body.password.length < 6) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Password must be at least 6 characters'
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: body.email.toLowerCase().trim() },
        { username: body.username.toLowerCase().trim() }
      ]
    })

    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: 'User already exists with this email or username'
      })
    }

    // Create user (in production, password should be hashed)
    const user = await User.create({
      username: body.username.trim(),
      email: body.email.toLowerCase().trim(),
      password: body.password, // TODO: Hash password with bcrypt
      reputation: 0,
      badges: ['beginner']
    })

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
      message: 'User registered successfully'
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Error registering user',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})
