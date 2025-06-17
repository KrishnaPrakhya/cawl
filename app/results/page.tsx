import { connectToDatabase } from "@/lib/mongodb";
import { QuizCard } from "./quiz-card";

export default async function ResultsPage() {
  const db = await connectToDatabase();
  const quizzes = await db.collection("quizzes").find({}).toArray();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Quiz Results Export
        </h1>
        <p className="text-gray-600">
          Download quiz results in CSV or PDF format
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <QuizCard
            key={quiz._id.toString()}
            quiz={{
              _id: quiz._id.toString(),
              title: quiz.title,
              description: quiz.description,
            }}
          />
        ))}
      </div>
    </div>
  );
}
