import { Sparkles, Loader } from 'lucide-react';

const TextExtraction = ({ 
  extractedText, 
  isLoading, 
  onRewrite, 
  isRewriting 
}) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
        Extracted Text
      </h3>
      <div className="text-gray-600 dark:text-gray-300 bg-gray-100/80 dark:bg-gray-900/70 p-4 rounded-lg text-sm leading-relaxed max-h-48 overflow-y-auto border border-gray-200/80 dark:border-gray-700/80">
        {isLoading ? 'Extracting text...' : extractedText}
      </div>
      <div className="mt-4">
        <button 
          onClick={onRewrite} 
          disabled={isRewriting || !extractedText} 
          className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 transition-all duration-300"
        >
          {isRewriting ? 
            <Loader className="animate-spin h-5 w-5" /> : 
            <>
              <Sparkles className="h-5 w-5 text-yellow-500" /> 
              Rewrite Post
            </>
          }
        </button>
      </div>
    </div>
  );
};

export default TextExtraction;
