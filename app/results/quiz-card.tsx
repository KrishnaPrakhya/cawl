"use client";

import { jsPDF } from "jspdf";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileDown } from "lucide-react";

type QuizCardProps = {
  quiz: {
    _id: string;
    title: string;
    description: string;
  };
};

export function QuizCard({ quiz }: QuizCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
        <CardDescription>{quiz.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={() =>
            window.open(`/api/quizzes/${quiz._id}/export?format=csv`, "_blank")
          }
          className="w-full bg-green-600 hover:bg-green-700 mb-2"
        >
          <FileDown className="w-4 h-4 mr-2" />
          Download CSV
        </Button>
        <Button
          onClick={async () => {
            const res = await fetch(`/api/quizzes/${quiz._id}/export`);
            const data = await res.json();

            const doc = new jsPDF();
            let y = 20;

            // Title
            doc.setFontSize(20);
            doc.text(quiz.title, 20, y);
            y += 15;

            // Quiz Info
            doc.setFontSize(12);
            doc.text(`Total Sessions: ${data.length}`, 20, y);
            y += 10;

            // Results Table
            doc.setFontSize(10);
            data.forEach((session: any, index: number) => {
              if (y > 270) {
                doc.addPage();
                y = 20;
              }

              doc.text(`Session ${index + 1}:`, 20, y);
              y += 5;
              doc.text(
                `Score: ${session.total_score}/${session.total_possible} (${session.percentage})`,
                30,
                y
              );
              y += 5;
              doc.text(`Completed: ${session.completion_time}`, 30, y);
              y += 10;
            });

            doc.save(`quiz-${quiz._id}-results.pdf`);
          }}
          className="w-full bg-white-600 hover:bg-green-700"
          variant="secondary"
        >
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </CardContent>
    </Card>
  );
}
