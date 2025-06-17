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
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Database,
} from "lucide-react";

type Analytics = {
  quiz_id: string;
  title: string;
  total_attempts: number;
  average_score: number;
  average_completion_time: number;
  question_statistics: Array<{
    question_id: string;
    text: string;
    total_attempts: number;
    correct_answers: number;
    accuracy: number;
  }>;
  score_distribution: Array<{
    range: string;
    count: number;
  }>;
  completion_times: Array<{
    session_id: string;
    user_name: string;
    score: number;
    total_points: number;
    score_percentage: number;
    completion_time: number;
  }>;
};

export default function AnalyticsPage({ params }: { params: { id: string } }) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [params.id]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/quizzes/${params.id}/analytics`);
      if (!response.ok) throw new Error("Failed to fetch analytics");
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
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

  if (!analytics) {
    return (
      <div className="container mx-auto px-4 py-8">Analytics not found</div>
    );
  }

  const scoreDistData = analytics.score_distribution.map((item) => ({
    name: item.range,
    value: item.count,
    color: "#10b981",
  }));

  const questionData = analytics.question_statistics.map((q, index) => ({
    name: `Q${index + 1}`,
    accuracy: Math.round(q.accuracy),
    attempts: q.total_attempts,
    tooltip: q.text,
  }));

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Database className="h-8 w-8 text-green-600" />
            {analytics.title}
          </h1>
          <p className="text-gray-600 mt-2">Quiz Analytics Dashboard</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/quiz/${params.id}`}>
            <Button
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50"
            >
              Take Quiz
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Attempts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              {analytics.total_attempts}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Average Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              {analytics.average_score.toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Avg. Completion Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              {Math.round(analytics.average_completion_time / 60)} min
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Highest Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              {Math.max(
                ...analytics.completion_times.map((s) => s.score_percentage)
              ).toFixed(1)}
              %
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
            <CardDescription>Distribution of quiz scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={scoreDistData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Question Performance</CardTitle>
            <CardDescription>Success rate per question</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={questionData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-4 shadow-lg rounded-lg border">
                            <p className="text-sm text-gray-500">
                              {data.tooltip}
                            </p>
                            <p className="font-bold">
                              Accuracy: {data.accuracy}%
                            </p>
                            <p className="text-sm">Attempts: {data.attempts}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="accuracy" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recent Attempts</CardTitle>
          <CardDescription>Latest quiz submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Score
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Time Taken
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {analytics.completion_times.slice(0, 10).map((session) => (
                  <tr key={session.session_id} className="bg-white border-b">
                    <td className="px-6 py-4">{session.user_name}</td>
                    <td className="px-6 py-4">
                      {session.score} / {session.total_points} (
                      {session.score_percentage.toFixed(1)}%)
                    </td>
                    <td className="px-6 py-4">
                      {Math.floor(session.completion_time / 60)}:
                      {(session.completion_time % 60)
                        .toString()
                        .padStart(2, "0")}
                    </td>
                    <td className="px-6 py-4">
                      {session.score_percentage >= 70 ? (
                        <Badge
                          variant="default"
                          className="bg-green-100 text-green-800"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Passed
                        </Badge>
                      ) : (
                        <Badge
                          variant="destructive"
                          className="bg-red-100 text-red-800"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Failed
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
