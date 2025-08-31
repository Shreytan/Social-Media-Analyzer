import { BarChart2, Sun, Moon } from 'lucide-react';

const Header = ({ theme, toggleTheme }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/50 dark:bg-black/50 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-6 w-6 text-purple-500" />
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 tracking-wide">
            Content Analyzer
          </h1>
        </div>
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <Sun className="h-5 w-5 text-gray-800 dark:hidden" />
          <Moon className="h-5 w-5 text-gray-200 hidden dark:block" />
        </button>
      </div>
    </header>
  );
};

export default Header;
