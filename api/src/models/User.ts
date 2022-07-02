'use strict'

import { Schema, model } from "mongoose"
import jwt from "jsonwebtoken"
import { ObjectId } from "mongodb"
import { TypeOfTag } from "typescript"

interface IUser {
  firstName: string
  lastName?: string
  email: string
  password: string

  avatar: string
  premium: boolean
  role: string

  savings: any
  fees: Array<object>
  monthly: Array<object>
  extra: Array<object>

  categories: Array<object>
  generateAuthToken: () => any
}



const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: String,
  email: { type: String, unique: true, lowercase: true, required: true },
  password: { type: String, required: true },

  avatar: String,
  premium: { type: Boolean, default: false },
  role: { type: String, default: 'user' },

  savings:[{
    name: { type: String, required: true },
    start: { type: Date, required: true, default: Date.now()},
    end: Date,
    goal: Number,
    currentAmount: Number,
    depositPlace: String,
    currency: { type: String, required: true, default: "Peso Argentino" },
  }],

  fees: [{
    start: Date,
    end: Date,
    name: String,
    category: String,
    amount: Number,
  }],

  monthly: {
    input: [{
      start: Date,
      end: Date,
      name: String,
      category: String,
      amount: Number,
    }],

    output: [{
      start: Date,
      end: Date,
      name: String,
      category: String,
      amount: Number,
    }]
  },

  extra: {
    input: [{
      date: Date,
      entries: [{
        date: { type:Date, default: Date.now() },
        name: String,
        description: String,
        category: String,
        amount: Number,
      }]
    }],

    output: [{
      date: Date,
      entries: [{
        date: { type:Date, default: Date.now() },
        name: String,
        description: String,
        category: String,
        amount: Number,
        description: String
      }]
    }],
  },

  categories: [{
    name: String,
    frequency: {
      type: String,
      enum:['monthly', 'extra'], 
      required: true},
    type: {
      type: String,
      enum: ['input', 'output'],
      required: true}
  }]
})

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, { expiresIn: "7d" })
  return token
};

export default model<IUser>('user', userSchema);

