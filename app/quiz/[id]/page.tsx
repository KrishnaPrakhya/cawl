"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, Database } from "lucide-react";

type Question = {
  _id: string;
  id: string;
  text: string;
  type: "multiple_choice" | "true_false" | "text";
  options: string[];
  correct_answer: string;
  points: number;
  order_index: number;
};

type QuizWithQuestions = {
  _id: string;
  id: string;
  title: string;
  description: string;
  time_limit: number;
  is_public: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  questions: Question[];
};

export default function QuizPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<QuizWithQuestions | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [phase, setPhase] = useState<"start" | "quiz" | "completed">("start");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuiz();
  }, [params.id]);

  useEffect(() => {
    if (phase === "quiz" && timeLeft !== null && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null || prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [phase, timeLeft]);

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`/api/quizzes/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setQuiz(data);
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async () => {
    if (!userName.trim()) return;

    try {
      const response = await fetch(`/api/quizzes/${params.id}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_name: userName }),
      });

      if (response.ok) {
        const session = await response.json();
        setSessionId(session.session_id);
        setTimeLeft(quiz!.time_limit * 60); // Convert minutes to seconds
        setPhase("quiz");
      }
    } catch (error) {
      console.error("Error starting quiz:", error);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmitQuiz = async () => {
    if (!sessionId || !quiz) return;

    const formattedAnswers = quiz.questions.map((q) => ({
      question_id: q._id,
      answer: answers[q._id] || "",
    }));

    try {
      const response = await fetch(`/api/quizzes/${params.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          answers: formattedAnswers,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        router.push(`/results/${params.id}/${sessionId}`);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Database className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
          Loading quiz...
        </div>
      </div>
    );
  }

  if (!quiz) {
    return <div className="container mx-auto px-4 py-8">Quiz not found</div>;
  }

  if (phase === "start") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-green-600" />
              {quiz.title}
            </CardTitle>
            <CardDescription>{quiz.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time Limit: {quiz.time_limit} minutes
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Questions: {quiz.questions.length}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="userName">Your Name</Label>
              <Input
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name to start"
              />
            </div>

            <Button
              onClick={startQuiz}
              disabled={!userName.trim()}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (phase === "quiz") {
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
            {timeLeft !== null && (
              <span
                className={`text-sm font-mono ${
                  timeLeft < 60 ? "text-red-600" : "text-gray-600"
                }`}
              >
                {formatTime(timeLeft)}
              </span>
            )}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-lg">{currentQuestion.text}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQuestion.type === "multiple_choice" && (
              <RadioGroup
                value={answers[currentQuestion._id] || ""}
                onValueChange={(value) =>
                  handleAnswerChange(currentQuestion._id, value)
                }
              >
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {currentQuestion.type === "true_false" && (
              <RadioGroup
                value={answers[currentQuestion._id] || ""}
                onValueChange={(value) =>
                  handleAnswerChange(currentQuestion._id, value)
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="True" id="true" />
                  <Label htmlFor="true">True</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="False" id="false" />
                  <Label htmlFor="false">False</Label>
                </div>
              </RadioGroup>
            )}

            {currentQuestion.type === "text" && (
              <Textarea
                value={answers[currentQuestion._id] || ""}
                onChange={(e) =>
                  handleAnswerChange(currentQuestion._id, e.target.value)
                }
                placeholder="Type your answer here..."
                rows={3}
              />
            )}

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
                }
                disabled={currentQuestionIndex === 0}
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                Previous
              </Button>

              {currentQuestionIndex === quiz.questions.length - 1 ? (
                <Button
                  onClick={handleSubmitQuiz}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Submit Quiz
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Next
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
