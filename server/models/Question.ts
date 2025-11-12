import { defineMongooseModel } from '#nuxt/mongoose'

export const Question = defineMongooseModel({
  name: 'Question',
  schema: {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['general', 'maintenance', 'repair', 'diagnosis', 'parts', 'other'],
      default: 'general'
    },
    author: {
      type: 'ObjectId',
      ref: 'User',
      required: true
    },
    tags: [{
      type: String,
      trim: true
    }],
    answers: [{
      author: {
        type: 'ObjectId',
        ref: 'User',
        required: true
      },
      content: {
        type: String,
        required: true
      },
      upvotes: {
        type: Number,
        default: 0
      },
      upvotedBy: [{
        type: 'ObjectId',
        ref: 'User'
      }],
      accepted: {
        type: Boolean,
        default: false
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    views: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['open', 'answered', 'closed'],
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
