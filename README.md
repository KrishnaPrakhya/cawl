# Quiz Master - Modern Quiz Platform

Quiz Master is a comprehensive quiz platform built with Next.js 13, MongoDB, and TypeScript. Create, take, and analyze quizzes with a beautiful, modern interface and powerful features.

## ✨ Features

- **Quiz Management**

  - Create custom quizzes with multiple questions
  - Set time limits and visibility options
  - Support for various question types
  - Easy quiz editing and management

- **Interactive Quiz Taking**

  - Real-time scoring and feedback
  - Timer functionality
  - Responsive design for all devices
  - Session-based quiz attempts

- **Analytics & Insights**

  - Detailed performance analytics
  - Individual and aggregate quiz statistics
  - Export results to CSV and PDF
  - Visual data representations

- **Modern UI/UX**
  - Clean, intuitive interface
  - Smooth animations and transitions
  - Responsive design
  - Dark/Light mode support

## 🚀 Tech Stack

- **Frontend**

  - Next.js 13 (App Router)
  - TypeScript
  - Tailwind CSS
  - Shadcn UI Components
  - Lucide Icons

- **Backend**

  - MongoDB
  - Next.js API Routes
  - MongoDB Atlas

- **Features**
  - Real-time Updates
  - PDF Generation (jsPDF)
  - CSV Export
  - Data Visualization

## 🛠️ Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/quiz-master.git
cd quiz-master
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env.local` file with:

```env
MONGODB_URI=your_mongodb_connection_string
```

4. Run the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📱 Usage

1. **Create a Quiz**

   - Click "Create Quiz" on the homepage
   - Add questions and configure settings
   - Set visibility and time limits
   - Save and publish your quiz

2. **Take a Quiz**

   - Browse available quizzes
   - Start a quiz session
   - Answer questions within the time limit
   - View results immediately

3. **View Analytics**
   - Access the analytics dashboard
   - View performance metrics
   - Export results in CSV/PDF formats
   - Track user progress

## 🔐 Environment Variables

Required environment variables:

```env
MONGODB_URI=your_mongodb_connection_string
```

## 📦 Project Structure

```
quiz-master/
├── app/                   # Next.js App Router
│   ├── analytics/        # Analytics pages
│   ├── api/             # API routes
│   ├── create/          # Quiz creation
│   ├── quiz/           # Quiz taking
│   └── results/        # Results viewing
├── components/          # React components
├── lib/                # Utilities and helpers
└── public/             # Static assets
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Shadcn for the beautiful UI components
- MongoDB team for the powerful database
- All contributors and users of the platform
