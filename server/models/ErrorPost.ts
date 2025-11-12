import { defineMongooseModel } from '#nuxt/mongoose'

export const ErrorPost = defineMongooseModel({
  name: 'ErrorPost',
  schema: {
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    symptoms: {
      type: String,
      required: true
    },
    errorCode: {
      type: String,
      trim: true,
      uppercase: true
    },
    car: {
      type: 'ObjectId',
      ref: 'CarModel',
      required: true
    },
    author: {
      type: 'ObjectId',
      ref: 'User',
      required: true
    },
    images: [{
      type: String
    }],
    videos: [{
      type: String
    }],
    solutions: [{
      author: {
        type: 'ObjectId',
        ref: 'User',
        required: true
      },
      description: {
        type: String,
        required: true
      },
      cost: {
        type: Number
      },
      timeRequired: {
        type: String
      },
      upvotes: {
        type: Number,
        default: 0
      },
      upvotedBy: [{
        type: 'ObjectId',
        ref: 'User'
      }],
      verified: {
        type: Boolean,
        default: false
      },
      images: [{
        type: String
      }],
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    views: {
      type: Number,
      default: 0
    },
    popularity: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['open', 'resolved', 'pending'],
      default: 'open'
    },
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
