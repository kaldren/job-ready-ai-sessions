
# AI Interview Practice

A web application for practicing job interviews with AI-generated questions tailored to your role, experience level, and industry.

## Features

- Personalized interview questions based on job title, level, and industry
- Real-time interview sessions with pause/resume functionality
- Interview history and progress tracking
- AI-powered feedback and analysis
- User authentication and session management

## Technologies Used

This project is built with:

- React
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI
- Supabase (Backend & Database)
- Clerk (Authentication)

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

1. Clone the repository
```sh
git clone <YOUR_GIT_URL>
```

2. Navigate to the project directory
```sh
cd <YOUR_PROJECT_NAME>
```

3. Install dependencies
```sh
npm install
```

4. Start the development server
```sh
npm run dev
```

## Configuration

### Environment Variables

You'll need to set up the following services and add their keys to your environment:

1. **Clerk Authentication**: Get your publishable key from [Clerk Dashboard](https://clerk.com)
2. **Supabase**: Set up your Supabase project for database and API functions

### Database Setup

The application uses Supabase for data storage. Run the included migrations to set up the database schema.

## Usage

1. Sign up or log in to your account
2. Select your target job title, experience level, and industry
3. Start an interview session with AI-generated questions
4. Answer questions at your own pace
5. Pause and resume sessions as needed
6. Review your interview history and feedback

## Deployment

The application can be deployed to any static hosting service that supports React applications, such as:

- Vercel
- Netlify
- GitHub Pages
- Any other static hosting provider

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.
