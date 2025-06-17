"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Calendar, Database } from "lucide-react";

type Quiz = {
  _id: string;
  id: string;
  title: string;
  description: string;
  time_limit: number;
  is_public: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch("/api/quizzes");
      if (response.ok) {
        const data = await response.json();
        setQuizzes(data);
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Database className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
          Loading quizzes...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Database className="h-8 w-8 text-green-600" />
            Available Quizzes
          </h1>
          <p className="text-gray-600 mt-2">
            Choose a quiz to test your knowledge
          </p>
        </div>
        <Link href="/create">
          <Button className="bg-green-600 hover:bg-green-700">
            Create New Quiz
          </Button>
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <div className="text-center py-12">
          <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">
            No quizzes available yet.
          </p>
          <Link href="/create">
            <Button className="bg-green-600 hover:bg-green-700">
              Create the First Quiz
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Card
              key={quiz._id}
              className="hover:shadow-lg transition-shadow border-green-100"
            >
              <CardHeader>
                <CardTitle className="line-clamp-2">{quiz.title}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {quiz.description || "No description available"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 bg-green-100 text-green-800"
                  >
                    <Clock className="h-3 w-3" />
                    {quiz.time_limit} min
                  </Badge>
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 border-green-600 text-green-600"
                  >
                    <User className="h-3 w-3" />
                    {quiz.created_by}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 border-emerald-600 text-emerald-600"
                  >
                    <Calendar className="h-3 w-3" />
                    {new Date(quiz.created_at).toLocaleDateString()}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Link href={`/quiz/${quiz._id}`} className="flex-1">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Take Quiz
                    </Button>
                  </Link>
                  <Link href={`/analytics/${quiz._id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-600 text-green-600 hover:bg-green-50"
                    >
                      Analytics
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
