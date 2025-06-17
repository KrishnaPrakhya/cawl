import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { ObjectId } from "mongodb"

interface Question {
  _id?: ObjectId
  text: string
  type: "multiple_choice" | "true_false" | "text"
  options: string[]
  correct_answer: string
  points: number
  order_index: number
}

export async function GET() {
  try {
    const db = await getDb()
    const quizzes = await db
      .collection("quizzes")
      .find({ is_public: true })
      .sort({ created_at: -1 })
      .toArray()

    // Serialize the quizzes for JSON response
    const serializedQuizzes = quizzes.map((quiz) => ({
      ...quiz,
      _id: quiz._id.toString(),
      id: quiz._id.toString(),
      created_at: quiz.created_at.toISOString(),
      updated_at: quiz.updated_at.toISOString(),
    }))

    return NextResponse.json(serializedQuizzes)
  } catch (error) {
    console.error("Error fetching quizzes:", error)
    return NextResponse.json(
      { error: "Failed to fetch quizzes" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDb()
    const body = await request.json()
    const { title, description, time_limit, is_public, questions } = body

    // Validate required fields
    if (!title || !description || !time_limit || typeof is_public !== "boolean") {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Ensure each question has an _id
    const questionsWithIds = (questions || []).map((q: Question) => ({
      ...q,
      _id: new ObjectId(),
    }))

    // Create the quiz
    const quiz = {
      title,
      description,
      time_limit,
      is_public,
      questions: questionsWithIds,
      created_by: "user", // You can replace this with actual user info when you add authentication
      created_at: new Date(),
      updated_at: new Date(),
    }

    const result = await db.collection("quizzes").insertOne(quiz)

    // Return the created quiz with serialized IDs
    return NextResponse.json({
      ...quiz,
      _id: result.insertedId.toString(),
      id: result.insertedId.toString(),
      created_at: quiz.created_at.toISOString(),
      updated_at: quiz.updated_at.toISOString(),
      questions: questionsWithIds.map((q: Question & { _id: ObjectId }) => ({
        ...q,
        _id: q._id.toString(),
        id: q._id.toString(),
      })),
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating quiz:", error)
    return NextResponse.json(
      { error: "Failed to create quiz" },
      { status: 500 }
    )
  }
}
