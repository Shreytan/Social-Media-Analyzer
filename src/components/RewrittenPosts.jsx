import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const RewrittenPosts = ({ rewrittenPosts }) => {
  const [copied, setCopied] = useState(null);

  const handleCopy = (text, tone) => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setCopied(tone);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!rewrittenPosts) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        ✨ Rewritten Posts
      </h3>
      {Object.entries(rewrittenPosts).map(([tone, text]) => (
        <div 
          key={tone} 
          className="p-3 bg-gray-100/80 dark:bg-gray-900/70 rounded-lg border border-gray-200/80 dark:border-gray-700/80"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold capitalize text-blue-600 dark:text-blue-400">
              {tone}
            </span>
            <button 
              onClick={() => handleCopy(text, tone)} 
              className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {copied === tone ? 
                <Check className="h-4 w-4 text-green-500" /> : 
                <Copy className="h-4 w-4 text-gray-500" />
              }
            </button>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">{text}</p>
        </div>
      ))}
    </div>
  );
};

export default RewrittenPosts;
