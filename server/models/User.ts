import { defineMongooseModel } from '#nuxt/mongoose'

export const User = defineMongooseModel({
  name: 'User',
  schema: {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    reputation: {
      type: Number,
      default: 0
    },
    badges: [{
      type: String,
      enum: ['beginner', 'contributor', 'expert', 'trusted', 'master']
    }],
    savedCars: [{
      type: 'ObjectId',
      ref: 'CarModel'
    }],
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  options: {
    timestamps: true
  }
})
