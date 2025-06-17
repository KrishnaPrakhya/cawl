import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, ObjectId } from "@/lib/mongodb"

// POST /api/quizzes/[id]/submit - Submit quiz answers
export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {    const id = await context.params.id
    const db = await connectToDatabase()
    const body = await request.json()
    const { session_id, answers } = body

    if (!session_id || !answers) {
      return NextResponse.json(
        { error: "Session ID and answers are required" },
        { status: 400 }
      )
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid quiz ID" }, { status: 400 })
    }

    // Verify session exists and belongs to this quiz
    const session = await db.collection("quiz_sessions").findOne({
      session_id,
      quiz_id: new ObjectId(id),
    })

    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 404 })
    }

    // Get quiz with questions for scoring
    const quiz = await db.collection("quizzes").findOne({ _id: new ObjectId(id) })
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    let totalScore = 0
    const totalPoints = quiz.questions.reduce((sum: number, q: any) => sum + (q.points || 0), 0)
    const processedAnswers = []

    // Process each answer
    for (const answer of answers) {      const question = quiz.questions.find((q: any) => 
        q._id?.toString() === (answer.question_id instanceof ObjectId ? answer.question_id.toString() : answer.question_id)
      )
      if (!question) continue

      const isCorrect = answer.answer.toLowerCase().trim() === question.correct_answer.toLowerCase().trim()
      const pointsEarned = isCorrect ? (question.points || 0) : 0
      totalScore += pointsEarned

      processedAnswers.push({
        question_id: new ObjectId(answer.question_id),
        answer: answer.answer,
        is_correct: isCorrect,
        points_earned: pointsEarned,
      })
    }

    // Update session with completion info and score
    await db.collection("quiz_sessions").updateOne(
      { session_id },
      {
        $set: {
          completed_at: new Date(),
          score: totalScore,
          total_points: totalPoints,
        },
      }
    )

    // Save processed answers
    if (processedAnswers.length > 0) {
      await db.collection("quiz_answers").insertMany(
        processedAnswers.map(a => ({
          ...a,
          session_id,
          quiz_id: new ObjectId(id),
          created_at: new Date(),
        }))
      )
    }

    return NextResponse.json({
      session_id,
      total_score: totalScore,
      total_points: totalPoints,
      completed_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error submitting quiz:", error)
    return NextResponse.json(
      { error: "Failed to submit quiz answers" },
      { status: 500 }
    )
  }
}
