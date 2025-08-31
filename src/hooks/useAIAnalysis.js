import { useState } from 'react';
import { analyzePost, rewritePost } from '../utils/aiService';

export const useAIAnalysis = () => {
  const [analysis, setAnalysis] = useState(null);
  const [rewrittenPosts, setRewrittenPosts] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async (text) => {
    if (!text) return;
    
    setIsAnalyzing(true);
    setAnalysis(null);
    setError('');
    
    try {
      const result = await analyzePost(text);
      setAnalysis(result);
    } catch (e) {
      console.error("Analysis failed:", e);
      setError("Failed to get analysis from the AI. Please try again.");
    }
    
    setIsAnalyzing(false);
  };

  const handleRewrite = async (text) => {
    if (!text) return;
    
    setIsRewriting(true);
    setRewrittenPosts(null);
    setError('');
    
    try {
      const result = await rewritePost(text);
      setRewrittenPosts(result);
    } catch (e) {
      console.error("Rewrite failed:", e);
      setError("Failed to get rewrites from the AI. Please try again.");
    }
    
    setIsRewriting(false);
  };

  const reset = () => {
    setAnalysis(null);
    setRewrittenPosts(null);
    setError('');
  };

  return {
    analysis,
    rewrittenPosts,
    isAnalyzing,
    isRewriting,
    error,
    handleAnalyze,
    handleRewrite,
    reset
  };
};
