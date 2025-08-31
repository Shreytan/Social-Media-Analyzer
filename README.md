# Social Media Content Analyzer

A modern web application that analyzes social media posts and suggests engagement improvements using AI.

## 🚀 Features

- **Document Upload**: Support for PDF and image files with drag-and-drop interface
- **Text Extraction**: Mock extraction from PDFs and images (OCR simulation)
- **AI Analysis**: Engagement scoring, sentiment analysis, and improvement suggestions
- **Content Rewriting**: AI-powered post rewrites in different tones
- **Modern UI**: Dark/light theme, responsive design, smooth animations

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React icons
- **File Upload**: react-dropzone
- **AI Service**: Google Gemini API
- **Deployment**: Vercel

## 📦 Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/Shreytan/Social-Media-Analyzer.git
cd Social-Media-Analyzer
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env
# Add your Google Gemini API key to .env
\`\`\`

4. Start development server:
\`\`\`bash
npm run dev
\`\`\`

## 🎯 Usage

1. **Upload File**: Click "Select a File" or drag and drop a PDF or image
2. **Text Extraction**: Wait for text to be extracted from your file
3. **Analysis**: Click "Analyze" to get engagement insights and suggestions
4. **Rewrite**: Click "Rewrite Post" to see alternative versions

## 📁 Project Structure

\`\`\`
src/
├── components/          # React components
│   ├── AnimatedBlobs.jsx
│   ├── Header.jsx
│   ├── FileUpload.jsx
│   ├── TextExtraction.jsx
│   ├── Analysis.jsx
│   └── RewrittenPosts.jsx
├── hooks/              # Custom hooks
│   ├── useFileUpload.js
│   └── useAIAnalysis.js
├── utils/              # Utility functions
│   └── aiService.js
├── App.jsx            # Main application component
└── main.jsx           # Application entry point
\`\`\`

## 🤖 API Integration

The application uses Google's Gemini API for:
- Social media post analysis
- Engagement scoring
- Content rewriting in multiple tones

## 🎨 Design Features

- **Animated Background**: SVG blob animations
- **Responsive Design**: Works on all device sizes
- **Dark/Light Theme**: Toggle between themes
- **Smooth Animations**: CSS transitions and keyframes
- **Modern UI**: Glass morphism and backdrop blur effects

## 🚀 Deployment

Deploy to Vercel:
\`\`\`bash
npm i -g vercel
vercel
\`\`\`

Add environment variables in Vercel dashboard.

## 📝 Technical Approach

### Architecture Decisions:
- **Component-based architecture** for maintainability
- **Custom hooks** for state management
- **Mock data** for text extraction (production would use OCR libraries)
- **Real AI integration** with Google Gemini API

### User Experience:
- **Progressive disclosure** - features appear as needed
- **Loading states** for better user feedback
- **Error handling** with user-friendly messages
- **Responsive design** for all devices

## 🔧 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
