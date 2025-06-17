import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PlusCircle,
  BookOpen,
  BarChart3,
  Database,
  Users,
  Zap,
  Shield,
  TrendingUp,
  FileDown,
  Download,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Database className="h-16 w-16 text-green-600 animate-pulse" />
              <div className="absolute -top-2 -right-2">
                <Badge className="bg-green-600 text-white">v2.0</Badge>
              </div>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Quiz Master
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Create, take, and analyze quizzes with our comprehensive platform.
            Perfect for education, training, and fun challenges!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quizzes">
              <div
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                )}
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Browse Quizzes
              </div>
            </Link>
            <Link href="/create">
              <div
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-green-600 text-green-600 hover:bg-green-50 shadow-lg hover:shadow-xl transition-all duration-300"
                )}
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Create Quiz
              </div>
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          <Card className="group hover:shadow-xl transition-all duration-300 border-green-200 hover:border-green-300">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit group-hover:bg-green-200 transition-colors">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Take Quizzes</CardTitle>
              <CardDescription>
                Browse and take quizzes from our growing collection
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/quizzes">
                <div
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "w-full bg-green-600 hover:bg-green-700"
                  )}
                >
                  Start Learning
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-blue-200 hover:border-blue-300">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit group-hover:bg-blue-200 transition-colors">
                <PlusCircle className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Create Quizzes</CardTitle>
              <CardDescription>
                Design your own custom quizzes with our intuitive builder
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/create">
                <div
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "w-full bg-green-600 hover:bg-green-700"
                  )}
                >
                  Start Creating
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-purple-200 hover:border-purple-300">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit group-hover:bg-purple-200 transition-colors">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">View Analytics</CardTitle>
              <CardDescription>
                Get detailed insights into quiz performance and trends
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/analytics">
                <div
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "w-full bg-green-600 hover:bg-green-700"
                  )}
                >
                  View Insights
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-amber-200 hover:border-amber-300">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-amber-100 rounded-full w-fit group-hover:bg-amber-200 transition-colors">
                <Download className="h-8 w-8 text-amber-600" />
              </div>
              <CardTitle className="text-xl">Export Results</CardTitle>
              <CardDescription>
                Download quiz results in CSV or PDF format
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/results">
                <div
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "w-full bg-green-600 hover:bg-green-700 mt-4"
                  )}
                >
                  Export Data
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Powerful Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="mx-auto mb-4 p-4 bg-green-100 rounded-full w-fit group-hover:bg-green-200 transition-colors">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-time Results</h3>
              <p className="text-gray-600">
                Instant feedback and scoring for quiz participants
              </p>
            </div>
            <div className="text-center group">
              <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-fit group-hover:bg-blue-200 transition-colors">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-gray-600">
                Detailed insights into quiz performance and user behavior
              </p>
            </div>
            <div className="text-center group">
              <div className="mx-auto mb-4 p-4 bg-purple-100 rounded-full w-fit group-hover:bg-purple-200 transition-colors">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Multi-user Support</h3>
              <p className="text-gray-600">
                Built to handle multiple users and concurrent quiz sessions
              </p>
            </div>
            <div className="text-center group">
              <div className="mx-auto mb-4 p-4 bg-orange-100 rounded-full w-fit group-hover:bg-orange-200 transition-colors">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure & Reliable</h3>
              <p className="text-gray-600">
                MongoDB-powered backend ensures data security and reliability
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Platform Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">∞</div>
              <div className="text-gray-600">Quizzes Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">∞</div>
              <div className="text-gray-600">Quiz Attempts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">∞</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                24/7
              </div>
              <div className="text-gray-600">Uptime</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users creating and taking quizzes every day
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create">
              <div
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-white text-green-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
                )}
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Create Your First Quiz
              </div>
            </Link>
            <Link href="/quizzes">
              <div
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-white text-green-600 hover:text-green-600 shadow-lg hover:shadow-xl transition-all duration-300"
                )}
              >
                <BookOpen className=" text-green-600 h-5 w-5 mr-2" />
                Explore Quizzes
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
