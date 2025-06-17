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
import { BarChart3, Users, Clock, TrendingUp, Database } from "lucide-react";

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

export default function AnalyticsListPage() {
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
          Loading analytics...
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
            Quiz Analytics
          </h1>
          <p className="text-gray-600 mt-2">
            View detailed analytics for all quizzes
          </p>
        </div>
        <Link href="/quizzes">
          <Button
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            Back to Quizzes
          </Button>
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <div className="text-center py-12">
          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">
            No quizzes available for analytics
          </p>
          <Link href="/create">
            <Button className="bg-green-600 hover:bg-green-700">
              Create Your First Quiz
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Card
              key={quiz._id}
              className="hover:shadow-lg transition-shadow border-green-200"
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
                    <Users className="h-3 w-3" />
                    {quiz.created_by}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Link href={`/analytics/${quiz._id}`} className="flex-1">
                    <Button className="w-full flex items-center gap-2 bg-green-600 hover:bg-green-700">
                      <TrendingUp className="h-4 w-4" />
                      View Analytics
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
