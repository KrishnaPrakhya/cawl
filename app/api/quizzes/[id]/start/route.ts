import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, ObjectId } from "@/lib/mongodb"

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params
    const db = await connectToDatabase()
    const body = await request.json()
    const { user_name } = body

    if (!user_name) {
      return NextResponse.json(
        { error: "User name is required" },
        { status: 400 }
      )
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid quiz ID" }, { status: 400 })
    }

    // Verify quiz exists
    const quiz = await db.collection("quizzes").findOne({ _id: new ObjectId(id) })
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    // Create new session
    const session = {
      session_id: new ObjectId().toString(), // Use ObjectId as session ID
      quiz_id: new ObjectId(id),
      user_name,
      started_at: new Date(),
      completed_at: null,
      score: 0,
      total_points: quiz.questions.reduce((sum: number, q: any) => sum + (q.points || 0), 0),
    }

    await db.collection("quiz_sessions").insertOne(session)

    return NextResponse.json({
      ...session,
      quiz_id: session.quiz_id.toString(),
      started_at: session.started_at.toISOString(),
    })
  } catch (error) {
    console.error("Error starting quiz:", error)
    return NextResponse.json(
      { error: "Failed to start quiz" },
      { status: 500 }
    )
  }
}
