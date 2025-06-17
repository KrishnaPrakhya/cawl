import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase, ObjectId } from "@/lib/mongodb";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = await context.params.id;
    const format = request.nextUrl.searchParams.get("format") || "csv";
    
    const db = await connectToDatabase();
    
    // Get quiz with all results
    const quiz = await db.collection("quizzes").findOne({ _id: new ObjectId(id) });
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const sessions = await db
      .collection("quiz_sessions")
      .find({ quiz_id: new ObjectId(id) })
      .toArray();

    // Prepare data for export
    const exportData = sessions.map((session: any) => ({
      session_id: session.session_id,
      total_score: session.total_score,
      total_possible: session.total_possible,
      percentage: ((session.total_score / session.total_possible) * 100).toFixed(2) + "%",
      completion_time: new Date(session.completed_at).toLocaleString(),
      answers: session.answers.map((ans: any) => ({
        question: quiz.questions.find((q: any) => q._id.toString() === ans.question_id.toString())?.text || "Unknown",
        answer: ans.answer,
        is_correct: ans.is_correct,
        points_earned: ans.points_earned
      }))
    }));

    if (format === "csv") {
      // Generate CSV
      const csvRows = [];
      const headers = ["Session ID", "Score", "Possible Score", "Percentage", "Completion Time"];
      csvRows.push(headers.join(","));

      for (const data of exportData) {
        const row = [
          data.session_id,
          data.total_score,
          data.total_possible,
          data.percentage,
          data.completion_time
        ];
        csvRows.push(row.join(","));
      }

      const csv = csvRows.join("\\n");
      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename=quiz-${id}-results.csv`
        }
      });
    }

    // Return JSON for PDF generation on client
    return NextResponse.json(exportData);
  } catch (error: any) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Failed to export quiz results" },
      { status: 500 }
    );
  }
}
