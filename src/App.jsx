import { useState, useEffect } from 'react';
import AnimatedBlobs from './components/AnimatedBlobs';
import Header from './components/Header';

export default function App() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  return (
    <div className="relative min-h-screen w-full text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300 overflow-hidden bg-gray-100 dark:bg-black">
      <AnimatedBlobs />
      
      <Header theme={theme} toggleTheme={toggleTheme} />

      <main className="relative z-10 flex flex-col items-center p-4 sm:p-6 lg:p-8">
        <section className="text-center max-w-3xl mx-auto mt-8 mb-12">
          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white animate-text-reveal">
            Unlock Peak Engagement
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 animate-text-reveal-delayed">
            Transform your social media posts with AI-driven insights. Upload a file to see how you can captivate your audience.
          </p>
        </section>

        <div className="w-full max-w-4xl mx-auto bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-2xl p-6 sm:p-8 transition-all duration-500">
          <div className="text-center animate-fade-in">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800">
              Select a File
            </button>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              or drag and drop file here
            </p>
          </div>
        </div>

        <section className="w-full max-w-5xl mx-auto mt-20 text-center">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">A Simpler Workflow</h3>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-200/80 dark:border-gray-700/80">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-bold text-xl">1</div>
              <h4 className="mt-4 text-lg font-semibold">Select a file</h4>
              <p className="mt-1 text-gray-600 dark:text-gray-400">Upload a PDF or image file from your device.</p>
            </div>
            <div className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-200/80 dark:border-gray-700/80">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-bold text-xl">2</div>
              <h4 className="mt-4 text-lg font-semibold">Analyze & Rewrite</h4>
              <p className="mt-1 text-gray-600 dark:text-gray-400">Our AI analyzes your content and offers creative rewrites.</p>
            </div>
            <div className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-200/80 dark:border-gray-700/80">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-bold text-xl">3</div>
              <h4 className="mt-4 text-lg font-semibold">Get Suggestions</h4>
              <p className="mt-1 text-gray-600 dark:text-gray-400">Receive actionable tips to improve your post's impact.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 py-8 border-t border-gray-200/80 dark:border-gray-700/80 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} Content Analyzer. All rights reserved.</p>
      </footer>
    </div>
  );
}
