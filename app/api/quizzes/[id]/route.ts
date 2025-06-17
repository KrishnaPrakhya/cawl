import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, ObjectId } from "@/lib/mongodb"

// GET /api/quizzes/[id] - Get a specific quiz with questions
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params
    const db = await connectToDatabase()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid quiz ID" }, { status: 400 })
    }

    const quiz = await db.collection("quizzes").findOne({ _id: new ObjectId(id) })

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    // Serialize the quiz for JSON response
    const serializedQuiz = {
      ...quiz,
      _id: quiz._id.toString(),
      id: quiz._id.toString(),
      created_at: quiz.created_at.toISOString(),
      updated_at: quiz.updated_at.toISOString(),
      questions: (quiz.questions || []).map((q: any) => {
        // Ensure each question has an _id
        if (!q._id) {
          q._id = new ObjectId()
        }
        return {
          ...q,
          _id: q._id.toString(),
          id: q._id.toString(),
        }
      }),
    }

    return NextResponse.json(serializedQuiz)
  } catch (error) {
    console.error("Error fetching quiz:", error)
    return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 })
  }
}

// PUT /api/quizzes/[id] - Update a quiz
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params
    const db = await connectToDatabase()
    const body = await request.json()
    const { title, description, time_limit, is_public } = body

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid quiz ID" }, { status: 400 })
    }

    const updateData = {
      title,
      description,
      time_limit,
      is_public,
      updated_at: new Date(),
    }

    const result = await db
      .collection("quizzes")
      .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: updateData }, { returnDocument: "after" })

    if (!result) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    const serializedQuiz = {
      ...result,
      _id: result._id.toString(),
      id: result._id.toString(),
      created_at: result.created_at.toISOString(),
      updated_at: result.updated_at.toISOString(),
    }

    return NextResponse.json(serializedQuiz)
  } catch (error) {
    console.error("Error updating quiz:", error)
    return NextResponse.json({ error: "Failed to update quiz" }, { status: 500 })
  }
}

// DELETE /api/quizzes/[id] - Delete a quiz
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await connectToDatabase()

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid quiz ID" }, { status: 400 })
    }

    const result = await db.collection("quizzes").deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    // Also delete related quiz sessions
    await db.collection("quiz_sessions").deleteMany({ quiz_id: new ObjectId(params.id) })

    return NextResponse.json({ message: "Quiz deleted successfully" })
  } catch (error) {
    console.error("Error deleting quiz:", error)
    return NextResponse.json({ error: "Failed to delete quiz" }, { status: 500 })
  }
}
