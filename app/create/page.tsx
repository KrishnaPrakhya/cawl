"use client";

import type React from "react";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Save, Database } from "lucide-react";

type Question = {
  text: string;
  type: "multiple_choice" | "true_false" | "text";
  options: string[];
  correct_answer: string;
  points: number;
};

export default function CreateQuizPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    time_limit: 30,
    is_public: true,
    created_by: "Anonymous",
  });
  const [questions, setQuestions] = useState<Question[]>([
    {
      text: "",
      type: "multiple_choice",
      options: ["", "", "", ""],
      correct_answer: "",
      points: 1,
    },
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        type: "multiple_choice",
        options: ["", "", "", ""],
        correct_answer: "",
        points: 1,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    if (field === "type") {
      // Reset options and correct_answer when type changes
      updated[index] = {
        ...updated[index],
        [field]: value,
        options:
          value === "multiple_choice"
            ? ["", "", "", ""]
            : value === "true_false"
            ? ["True", "False"]
            : [],
        correct_answer: "",
      };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setQuestions(updated);
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex] = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...quiz,
          questions: questions.filter((q) => q.text.trim() !== ""),
        }),
      });

      if (response.ok) {
        const createdQuiz = await response.json();
        router.push(`/quiz/${createdQuiz._id}`);
      } else {
        alert("Failed to create quiz");
      }
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("Failed to create quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Database className="h-8 w-8 text-green-600" />
          Create New Quiz
        </h1>
        <p className="text-gray-600 mt-2">
          Build an engaging quiz with custom questions
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Quiz Details */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle>Quiz Details</CardTitle>
            <CardDescription>Basic information about your quiz</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Quiz Title *</Label>
                <Input
                  id="title"
                  value={quiz.title}
                  onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                  placeholder="Enter quiz title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="created_by">Created By *</Label>
                <Input
                  id="created_by"
                  value={quiz.created_by}
                  onChange={(e) =>
                    setQuiz({ ...quiz, created_by: e.target.value })
                  }
                  placeholder="Your name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={quiz.description}
                onChange={(e) =>
                  setQuiz({ ...quiz, description: e.target.value })
                }
                placeholder="Describe what this quiz is about"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time_limit">Time Limit (minutes)</Label>
                <Input
                  id="time_limit"
                  type="number"
                  min="1"
                  max="180"
                  value={quiz.time_limit}
                  onChange={(e) =>
                    setQuiz({
                      ...quiz,
                      time_limit: Number.parseInt(e.target.value) || 30,
                    })
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_public"
                  checked={quiz.is_public}
                  onCheckedChange={(checked) =>
                    setQuiz({ ...quiz, is_public: checked })
                  }
                />
                <Label htmlFor="is_public">Make quiz public</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Questions</h2>
            <Button
              type="button"
              onClick={addQuestion}
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>

          {questions.map((question, questionIndex) => (
            <Card key={questionIndex} className="border-green-100">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Question {questionIndex + 1}</span>
                  {questions.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeQuestion(questionIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Question Text *</Label>
                  <Textarea
                    value={question.text}
                    onChange={(e) =>
                      updateQuestion(questionIndex, "text", e.target.value)
                    }
                    placeholder="Enter your question"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Question Type</Label>
                    <Select
                      value={question.type}
                      onValueChange={(value) =>
                        updateQuestion(questionIndex, "type", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="multiple_choice">
                          Multiple Choice
                        </SelectItem>
                        <SelectItem value="true_false">True/False</SelectItem>
                        <SelectItem value="text">Text Answer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Points</Label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={question.points}
                      onChange={(e) =>
                        updateQuestion(
                          questionIndex,
                          "points",
                          Number.parseInt(e.target.value) || 1
                        )
                      }
                    />
                  </div>
                </div>

                {question.type === "multiple_choice" && (
                  <div className="space-y-2">
                    <Label>Answer Options</Label>
                    {question.options.map((option, optionIndex) => (
                      <Input
                        key={optionIndex}
                        value={option}
                        onChange={(e) =>
                          updateOption(
                            questionIndex,
                            optionIndex,
                            e.target.value
                          )
                        }
                        placeholder={`Option ${optionIndex + 1}`}
                      />
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Correct Answer *</Label>
                  {question.type === "multiple_choice" ? (
                    <Select
                      value={question.correct_answer}
                      onValueChange={(value) =>
                        updateQuestion(questionIndex, "correct_answer", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select correct answer" />
                      </SelectTrigger>
                      <SelectContent>
                        {question.options
                          .filter((opt) => opt.trim())
                          .map((option, index) => (
                            <SelectItem key={index} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  ) : question.type === "true_false" ? (
                    <Select
                      value={question.correct_answer}
                      onValueChange={(value) =>
                        updateQuestion(questionIndex, "correct_answer", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select correct answer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="True">True</SelectItem>
                        <SelectItem value="False">False</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      value={question.correct_answer}
                      onChange={(e) =>
                        updateQuestion(
                          questionIndex,
                          "correct_answer",
                          e.target.value
                        )
                      }
                      placeholder="Enter the correct answer"
                      required
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <Save className="h-4 w-4" />
            {loading ? "Creating..." : "Create Quiz"}
          </Button>
        </div>
      </form>
    </div>
  );
}
