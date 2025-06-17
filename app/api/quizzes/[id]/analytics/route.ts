import { MongoClient, type Db } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not set")
}

const client = new MongoClient(process.env.MONGODB_URI)
let db: Db

export async function connectToDatabase() {
  if (!db) {
    await client.connect()
    db = client.db("quiz_app")
  }
  return db
}

export { ObjectId }

// Removed duplicate Quiz type to avoid conflict with the interface Quiz below


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

import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { ObjectId } from "mongodb"

interface Question {
  _id: ObjectId
  text: string
  type: "multiple_choice" | "true_false" | "text"
  options: string[]
  correct_answer: string
  points: number
  order_index: number
}

interface Quiz {
  _id: ObjectId
  title: string
  description: string
  time_limit: number
  is_public: boolean
  created_by: string
  created_at: Date
  updated_at: Date
  questions: Question[]
}

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const params = context.params
    if (!params || !params.id || !ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid quiz ID" }, { status: 400 })
    }

    const quizId = new ObjectId(params.id)
    const db = await getDb()

    // Get quiz details
    const quiz = await db.collection<Quiz>("quizzes").findOne({ _id: quizId })
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    // Get all completed sessions for this quiz
    const sessions = await db
      .collection("quiz_sessions")
      .find({
        quiz_id: quizId,
        completed_at: { $ne: null },
      })
      .toArray()

    // Get all answers for this quiz
    const answers = await db
      .collection("quiz_answers")
      .find({
        quiz_id: quizId,
      })
      .toArray()

    // Calculate analytics
    const totalAttempts = sessions.length
    const averageScore = totalAttempts > 0
      ? sessions.reduce((sum, session) => sum + (session.score || 0), 0) / totalAttempts
      : 0
    
    // Calculate completion time statistics
    const completionTimes = sessions.map(session => {
      const start = new Date(session.started_at)
      const end = new Date(session.completed_at || start) // fallback to start if completed_at is null
      return Math.floor((end.getTime() - start.getTime()) / 1000) // in seconds
    })

    const averageCompletionTime = completionTimes.length > 0
      ? completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length
      : 0

    // Calculate per-question statistics
    const questionStats = quiz.questions.map((question) => {
      const questionAnswers = answers.filter(
        a => a.question_id.toString() === (question._id?.toString() || '')
      )
      const totalAnswers = questionAnswers.length
      const correctAnswers = questionAnswers.filter(a => a.is_correct).length
      
      return {
        question_id: question._id?.toString() || '',
        text: question.text,
        total_attempts: totalAnswers,
        correct_answers: correctAnswers,
        accuracy: totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0,
      }
    })

    // Prepare score distribution data for chart
    const scoreRanges = [0, 20, 40, 60, 80, 100]
    const scoreDistribution = scoreRanges.map((min, index) => {
      const max = scoreRanges[index + 1] || 100
      const count = sessions.filter(session => {
        const percentage = session.total_points > 0 
          ? (session.score / session.total_points) * 100 
          : 0
        return percentage >= min && percentage <= max
      }).length

      return {
        range: `${min}-${max}%`,
        count,
      }
    })

    const serializedResponse = {
      quiz_id: quiz._id.toString(),
      title: quiz.title,
      total_attempts: totalAttempts,
      average_score: Math.round(averageScore * 10) / 10,
      average_completion_time: Math.round(averageCompletionTime),
      question_statistics: questionStats,
      score_distribution: scoreDistribution,
      completion_times: sessions.map(session => ({
        session_id: session.session_id,
        user_name: session.user_name,
        score: session.score,
        total_points: session.total_points,
        score_percentage: session.total_points > 0 
          ? Math.round((session.score / session.total_points) * 1000) / 10 
          : 0,
        completion_time: Math.floor(
          (new Date(session.completed_at || session.started_at).getTime() - 
           new Date(session.started_at).getTime()) / 1000
        ),
      })),
    }

    return NextResponse.json(serializedResponse)
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    )
  }
}
