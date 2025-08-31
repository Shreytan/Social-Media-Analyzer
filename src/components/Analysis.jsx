import { Star, Loader } from 'lucide-react';

const Analysis = ({ 
  analysis, 
  onAnalyze, 
  isAnalyzing, 
  hasAnalyzed 
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Analysis & Suggestions
        </h3>
        <button 
          onClick={onAnalyze} 
          disabled={isAnalyzing || hasAnalyzed} 
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg disabled:from-gray-400 disabled:to-gray-400 dark:disabled:from-gray-600 dark:disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-300"
        >
          {isAnalyzing ? 
            <Loader className="animate-spin h-5 w-5" /> : 
            'Analyze'
          }
        </button>
      </div>
      
      {analysis && (
        <>
          <div className="bg-gray-100/80 dark:bg-gray-900/70 p-4 rounded-lg border border-gray-200/80 dark:border-gray-700/80">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Engagement Score
            </p>
            <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              {analysis.engagementScore}/10
            </p>
          </div>
          <ul className="space-y-2">
            {analysis.suggestions.map((suggestion, i) => (
              <li 
                key={i} 
                className="flex items-start gap-3 text-sm p-3 bg-gray-100/80 dark:bg-gray-900/70 rounded-lg hover:bg-gray-200/80 dark:hover:bg-gray-700/70 transition-colors"
              >
                <Star className="h-4 w-4 mt-0.5 text-yellow-500 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">{suggestion}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Analysis;
