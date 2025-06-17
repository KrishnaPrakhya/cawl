import { MongoClient, type Db, ObjectId } from "mongodb"
import { cache } from 'react'

declare global {
  var mongo: {
    conn: MongoClient | null
    promise: Promise<MongoClient> | null
  } | null
}

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not set")
}

const client = new MongoClient(process.env.MONGODB_URI, {
  maxPoolSize: 10,
})

export const connectToDatabase = cache(async () => {
  if (!global.mongo) {
    global.mongo = { conn: null, promise: null }
  }

  if (!global.mongo.conn) {
    global.mongo.promise = client.connect()
    global.mongo.conn = await global.mongo.promise
  }

  const db = client.db("quiz_app")
  return db
})

export { ObjectId }

export type Quiz = {
  _id?: ObjectId
  title: string
  description: string
  time_limit: number
  is_public: boolean
  created_by: string
  created_at: Date
  updated_at: Date
  questions: Question[]
}

export type Question = {
  _id?: ObjectId
  text: string
  type: "multiple_choice" | "true_false" | "text"
  options: string[]
  correct_answer: string
  points: number
  order_index: number
}

export type QuizSession = {
  _id?: ObjectId
  session_id: string
  quiz_id: ObjectId
  user_name: string
  started_at: Date
  completed_at?: Date
  score: number
  total_points: number
  answers: Answer[]
}

export type Answer = {
  question_id: ObjectId
  answer: string
  is_correct: boolean
  points_earned: number
}

export type QuizWithQuestions = Quiz

export type SessionWithAnswers = QuizSession
