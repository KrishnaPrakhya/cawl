import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, ObjectId } from "@/lib/mongodb"

// GET /api/quizzes - Get all quizzes
export async function GET() {
  try {
    const db = await connectToDatabase()

    const quizzes = await db.collection("quizzes").find({ is_public: true }).sort({ created_at: -1 }).toArray()

    // Convert ObjectId to string for JSON serialization
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
    return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 })
  }
}

// POST /api/quizzes - Create a new quiz
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, time_limit, is_public, created_by, questions } = body

    if (!title || !created_by) {
      return NextResponse.json({ error: "Title and created_by are required" }, { status: 400 })
    }

    const db = await connectToDatabase()

    // Prepare questions with ObjectIds
    const preparedQuestions = (questions || []).map((q: any, index: number) => ({
      _id: new ObjectId(),
      text: q.text,
      type: q.type,
      options: q.options || [],
      correct_answer: q.correct_answer,
      points: q.points || 1,
      order_index: index + 1,
    }))

    const quiz = {
      title,
      description: description || "",
      time_limit: time_limit || 30,
      is_public: is_public !== false,
      created_by,
      created_at: new Date(),
      updated_at: new Date(),
      questions: preparedQuestions,
    }

    const result = await db.collection("quizzes").insertOne(quiz)

    const createdQuiz = {
      ...quiz,
      _id: result.insertedId.toString(),
      id: result.insertedId.toString(),
      created_at: quiz.created_at.toISOString(),
      updated_at: quiz.updated_at.toISOString(),
    }

    return NextResponse.json(createdQuiz, { status: 201 })
  } catch (error) {
    console.error("Error creating quiz:", error)
    return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 })
  }
}
