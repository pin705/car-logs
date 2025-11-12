import { defineMongooseModel } from '#nuxt/mongoose'

export const CarModel = defineMongooseModel({
  name: 'CarModel',
  schema: {
    make: {
      type: String,
      required: true,
      trim: true
    },
    model: {
      type: String,
      required: true,
      trim: true
    },
    year: {
      type: Number,
      required: true
    },
    variant: {
      type: String,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  options: {
    timestamps: true
  }
})
