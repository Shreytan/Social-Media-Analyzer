import { useState, useEffect, useCallback } from 'react';
import AnimatedBlobs from './components/AnimatedBlobs';
import Header from './components/Header';
import { useDropzone } from 'react-dropzone';
import { FileText, Image, Loader, BarChart2, Sparkles, Star, Copy, Check, Upload, AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [files, setFiles] = useState([]);
  const [extractedText, setExtractedText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [rewrittenPosts, setRewrittenPosts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const [error, setError] = useState('');
  const [appState, setAppState] = useState('idle');
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  // Mock text extraction (simulates OCR for images and PDF parsing)
  const extractTextFromFile = (file) => {
    const mockTexts = {
      'image': [
        "Just discovered this incredible sunset view from my evening jog! 🌅 There's something magical about ending the day with nature's masterpiece. Who else finds peace in these golden hour moments? #sunset #mindfulness #gratitude",
        "Excited to share my latest cooking experiment - homemade pasta with garden-fresh basil! 🍝 The aroma filling my kitchen right now is absolutely divine. Sometimes the simplest ingredients create the most memorable meals. #cooking #homemade #foodie",
        "Weekend project complete! Built this cozy reading nook by the window. 📚 Perfect spot for morning coffee and getting lost in a good book. There's nothing quite like creating your own little sanctuary at home. #DIY #reading #cozy"
      ],
      'pdf': [
        "QUARTERLY SOCIAL MEDIA REPORT: Our engagement metrics have improved significantly this quarter. Key findings include: 40% increase in user-generated content, 65% boost in story completion rates, and 30% growth in follower retention. Strategic recommendations focus on authentic storytelling and community building.",
        "CONTENT STRATEGY ANALYSIS: Research indicates that posts featuring behind-the-scenes content generate 3x more engagement than traditional promotional material. User behavior data suggests optimal posting times are 11 AM - 1 PM and 7 PM - 9 PM across all platforms.",
        "MARKETING INSIGHTS DOCUMENT: Study of 10,000 social media posts reveals that content with emotional storytelling achieves 250% higher engagement rates. Key elements include personal anecdotes, vulnerability, and clear calls-to-action. Hashtag optimization remains crucial for discoverability."
      ]
    };

    const fileType = file.type.startsWith('image/') ? 'image' : 'pdf';
    const texts = mockTexts[fileType];
    return texts[Math.floor(Math.random() * texts.length)];
  };

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    if (!file) return;

    // File validation
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('File size must be less than 10MB. Please choose a smaller file.');
      return;
    }

    // Reset states
    setError('');
    setExtractedText('');
    setAnalysis(null);
    setRewrittenPosts(null);
    setIsLoading(true);
    setAppState('loading-file');

    const fileWithPreview = Object.assign(file, { 
      preview: URL.createObjectURL(file) 
    });
    setFiles([fileWithPreview]);

    // Simulate realistic text extraction timing
    const extractionTime = file.type === 'application/pdf' ? 3500 : 2500;
    
    setTimeout(() => {
      try {
        if (file.type.startsWith('image/') || file.type === 'application/pdf') {
          const mockExtractedText = extractTextFromFile(file);
          setExtractedText(mockExtractedText);
          setAppState('file-uploaded');
        } else {
          throw new Error('Unsupported file format');
        }
      } catch (err) {
        setError('Failed to extract text from file. Please try uploading a different file.');
        setFiles([]);
        setAppState('idle');
      }
      setIsLoading(false);
    }, extractionTime);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp'], 
      'application/pdf': ['.pdf'] 
    }, 
    multiple: false,
    maxSize: 10 * 1024 * 1024
  });

  // Mock AI Analysis (simulates Gemini API response)
  const handleAnalyze = async () => {
    if (!extractedText) return;
    setIsAnalyzing(true);
    setAnalysis(null);
    setError('');

    try {
      // Simulate API processing time
      await new Promise(resolve => setTimeout(resolve, 3500));
      
      // Generate realistic engagement score based on content analysis
      const wordCount = extractedText.split(' ').length;
      const hasHashtags = extractedText.includes('#');
      const hasEmojis = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(extractedText);
      const hasQuestion = extractedText.includes('?');
      const hasCallToAction = /\b(share|comment|follow|like|subscribe|check out|visit|try|join)\b/i.test(extractedText);
      
      let score = 4.0; // Base score
      if (hasHashtags) score += 1.5;
      if (hasEmojis) score += 1.2;
      if (hasQuestion) score += 0.8;
      if (hasCallToAction) score += 1.0;
      if (wordCount > 15 && wordCount < 80) score += 0.8; // Optimal length
      if (extractedText.toLowerCase().includes('story') || extractedText.toLowerCase().includes('experience')) score += 0.7;
      
      const engagementScore = Math.min(Math.max(score + (Math.random() * 1.5 - 0.75), 2.0), 10.0);

      // Generate contextual suggestions
      const suggestions = [];
      if (!hasHashtags) suggestions.push("Add relevant hashtags to increase discoverability (aim for 5-10 hashtags)");
      if (!hasEmojis) suggestions.push("Include emojis to make your post more visually appealing and engaging");
      if (!hasQuestion) suggestions.push("Ask a question to encourage comments and boost engagement");
      if (!hasCallToAction) suggestions.push("Add a clear call-to-action to guide your audience's next step");
      
      // Always include these generic suggestions
      const additionalSuggestions = [
        "Post during peak engagement hours (11 AM - 1 PM, 7 PM - 9 PM)",
        "Tag relevant accounts or locations to increase reach",
        "Share behind-the-scenes content to build authentic connections",
        "Use trending topics or hashtags related to your content",
        "Engage with comments quickly to boost algorithmic visibility"
      ];

      // Select 4 total suggestions
      const allSuggestions = [...suggestions, ...additionalSuggestions];
      const finalSuggestions = allSuggestions.slice(0, 4);

      setAnalysis({
        engagementScore: parseFloat(engagementScore.toFixed(1)),
        sentiment: engagementScore > 7.5 ? "Very Positive" : 
                  engagementScore > 6 ? "Positive" : 
                  engagementScore > 4 ? "Neutral" : "Needs Improvement",
        suggestions: finalSuggestions
      });
    } catch (error) {
      setError('Analysis failed due to a technical issue. Please try again.');
      console.error('Analysis error:', error);
    }
    setIsAnalyzing(false);
  };

  // Mock post rewriting (simulates AI content generation)
  const handleRewrite = async () => {
    if (!extractedText) return;
    setIsRewriting(true);
    setRewrittenPosts(null);
    setError('');

    try {
      // Simulate API processing time
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Analyze original content to generate appropriate rewrites
      const isPersonal = /\b(I|my|me|myself|weekend|today|just|excited|love)\b/i.test(extractedText);
      const isBusiness = /\b(report|analysis|strategy|growth|performance|metrics|professional)\b/i.test(extractedText);
      const topic = extractedText.toLowerCase().includes('food') ? 'food' :
                   extractedText.toLowerCase().includes('sunset') ? 'sunset' :
                   extractedText.toLowerCase().includes('reading') ? 'reading' :
                   extractedText.toLowerCase().includes('business') ? 'business' : 'general';

      const generateRewrites = () => {
        if (topic === 'food') {
          return {
            casual: "Just whipped up something amazing in the kitchen! 🍝 The smells are incredible and I can't wait to dig in. Sometimes the best meals are the ones you make yourself. What's your go-to comfort food?",
            professional: "Exploring culinary creativity through homemade cuisine. Today's experiment demonstrates how quality ingredients and attention to technique can elevate simple recipes into memorable dining experiences. Highly recommend trying new approaches in your own kitchen.",
            excited: "OMG THIS SMELLS ABSOLUTELY INCREDIBLE!!! 🤩🍝 I'm basically drooling over here and can barely wait to taste this masterpiece! Home cooking is seriously the BEST therapy ever! Who else is obsessed with making their own food?!"
          };
        } else if (topic === 'sunset') {
          return {
            casual: "Caught this beautiful sunset during my evening walk! 🌅 These moments really help me unwind and appreciate the simple things. Nature has a way of putting everything in perspective, doesn't it?",
            professional: "Evening reflection time complemented by nature's spectacular display. Regular outdoor activities continue to provide valuable perspective and stress relief. Recommend incorporating mindful moments into daily routines for enhanced well-being.",
            excited: "THIS SUNSET IS ABSOLUTELY BREATHTAKING!!! 🌅✨ I literally stopped in my tracks because WOW! These are the moments that make everything worth it! Nature is the ultimate artist and I'm here for ALL of it!"
          };
        } else if (topic === 'business') {
          return {
            casual: "Really interesting insights from our latest review! 📊 It's amazing how small tweaks can lead to big improvements. Always learning something new in this business. What strategies have worked best for you?",
            professional: "Quarterly performance analysis reveals significant opportunities for strategic optimization. Data-driven approaches continue to demonstrate measurable impact across key performance indicators. Recommend implementing similar analytical frameworks for enhanced decision-making.",
            excited: "WOW! These results are INCREDIBLE! 🚀📈 So proud of what we've accomplished this quarter! The team absolutely crushed it and I can't wait to see what we achieve next! Success feels amazing!"
          };
        } else {
          return {
            casual: "Had such a great experience today! Sometimes it's the little moments that make the biggest impact. Hope everyone else is having an awesome day too! What's been the highlight of your day?",
            professional: "Today's activities provided valuable insights and positive outcomes. Consistent focus on meaningful experiences continues to yield beneficial results. Recommend prioritizing similar opportunities for personal and professional growth.",
            excited: "Today was absolutely AMAZING!!! ✨ I'm still buzzing with positive energy and can't contain my excitement! Days like this remind me why I love what I do! Who else is feeling this good energy?!"
          };
        }
      };

      setRewrittenPosts(generateRewrites());
    } catch (error) {
      setError('Post rewriting failed due to a technical issue. Please try again.');
      console.error('Rewrite error:', error);
    }
    setIsRewriting(false);
  };

  const handleCopy = async (text, tone) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(tone);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(tone);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const handleReset = () => {
    // Clean up object URLs to prevent memory leaks
    files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    
    setFiles([]);
    setExtractedText('');
    setAnalysis(null);
    setRewrittenPosts(null);
    setError('');
    setAppState('idle');
    setIsLoading(false);
    setIsAnalyzing(false);
    setIsRewriting(false);
  };

  return (
    <div className="relative min-h-screen w-full text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300 overflow-hidden bg-gray-100 dark:bg-black">
      <AnimatedBlobs />
      
      <Header theme={theme} toggleTheme={toggleTheme} />

      <main className="relative z-10 flex flex-col items-center p-4 sm:p-6 lg:p-8">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto mt-8 mb-12">
          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white animate-text-reveal">
            Unlock Peak Engagement
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 animate-text-reveal-delayed">
            Transform your social media posts with AI-driven insights. Upload a file to analyze your content and discover how to captivate your audience.
          </p>
        </section>

        {/* Main Application Card */}
        <div className="w-full max-w-4xl mx-auto bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-2xl p-6 sm:p-8 transition-all duration-500">
          
          {/* File Upload Section */}
          {appState === 'idle' && (
            <div {...getRootProps()} className={`text-center p-8 border-2 border-dashed rounded-xl transition-all cursor-pointer ${
              isDragActive 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105 shadow-lg' 
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}>
              <input {...getInputProps()} />
              <div className="animate-fade-in">
                <Upload className={`h-16 w-16 mx-auto mb-4 transition-colors ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800">
                  {isDragActive ? 'Drop your file here...' : 'Select a File'}
                </button>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  or drag and drop PDF or image files here
                </p>
                <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                  Supported formats: PDF, JPG, PNG, GIF, BMP, WebP • Maximum size: 10MB
                </p>
              </div>
              {error && (
                <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <p className="text-red-600 dark:text-red-400 text-sm text-left">{error}</p>
                </div>
              )}
            </div>
          )}

          {/* File Processing Section */}
          {appState !== 'idle' && (
            <>
              {/* File Info Header */}
              <div className="flex flex-col sm:flex-row justify-between items-center pb-6 border-b border-gray-200/80 dark:border-gray-700/80">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-xl flex items-center justify-center">
                    {files[0]?.type.startsWith('image/') ? 
                      <Image className="h-7 w-7 text-blue-600 dark:text-blue-400" /> : 
                      <FileText className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                    }
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-lg">{files[0]?.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      {isLoading ? (
                        <>
                          <Loader className="h-4 w-4 animate-spin" />
                          {files[0]?.type === 'application/pdf' ? 'Parsing PDF...' : 'Running OCR...'}
                        </>
                      ) : (
                        'Text extracted successfully'
                      )}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={handleReset} 
                  className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Start Over
                </button>
              </div>

              {/* Extracted Text Section */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Extracted Text
                </h3>
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl border border-gray-200/80 dark:border-gray-700/80 max-h-64 overflow-y-auto">
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3 py-8 text-gray-500 dark:text-gray-400">
                      <Loader className="animate-spin h-6 w-6" />
                      <div className="text-center">
                        <p className="font-medium">
                          {files[0]?.type === 'application/pdf' 
                            ? 'Parsing PDF and extracting text...' 
                            : 'Processing image with OCR technology...'}
                        </p>
                        <p className="text-sm mt-1">This may take a few moments</p>
                      </div>
                    </div>
                  ) : extractedText ? (
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{extractedText}</p>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">No text extracted yet.</p>
                  )}
                </div>

                {/* Action Buttons */}
                {!isLoading && extractedText && (
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button 
                      onClick={handleAnalyze} 
                      disabled={isAnalyzing} 
                      className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader className="animate-spin h-5 w-5" />
                          Analyzing Content...
                        </>
                      ) : (
                        <>
                          <BarChart2 className="h-5 w-5" />
                          Analyze Engagement
                        </>
                      )}
                    </button>
                    <button 
                      onClick={handleRewrite} 
                      disabled={isRewriting} 
                      className="flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                    >
                      {isRewriting ? (
                        <>
                          <Loader className="animate-spin h-5 w-5" />
                          Rewriting Posts...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5 text-yellow-500" />
                          Rewrite Post
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Results Section */}
              {(analysis || rewrittenPosts) && (
                <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Analysis Results */}
                  {analysis && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <BarChart2 className="h-5 w-5" />
                        Analysis Results
                      </h3>
                      
                      {/* Engagement Score Card */}
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Engagement Score</p>
                          <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                            {analysis.engagementScore}/10
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${analysis.sentiment === 'Very Positive' ? 'bg-green-500' : analysis.sentiment === 'Positive' ? 'bg-blue-500' : 'bg-yellow-500'}`}></div>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              Sentiment: {analysis.sentiment}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Suggestions List */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          Improvement Suggestions
                        </h4>
                        {analysis.suggestions.map((suggestion, i) => (
                          <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                              <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">{i + 1}</span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{suggestion}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rewritten Posts */}
                  {rewrittenPosts && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-yellow-500" />
                        Rewritten Posts
                      </h3>
                      {Object.entries(rewrittenPosts).map(([tone, text]) => (
                        <div key={tone} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                            <span className="font-semibold capitalize text-lg text-gray-800 dark:text-gray-200">
                              {tone} Tone
                            </span>
                            <button 
                              onClick={() => handleCopy(text, tone)} 
                              className="p-2 rounded-lg hover:bg-white dark:hover:bg-gray-600 transition-colors group"
                              title="Copy to clipboard"
                            >
                              {copied === tone ? 
                                <Check className="h-5 w-5 text-green-500" /> : 
                                <Copy className="h-5 w-5 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
                              }
                            </button>
                          </div>
                          <div className="p-4">
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Error Display */}
              {error && !isLoading && (
                <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* How It Works Section */}
        <section className="w-full max-w-6xl mx-auto mt-24">
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our AI-powered platform analyzes your content and provides actionable insights to maximize engagement
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl border border-gray-200/80 dark:border-gray-700/80 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300">
              <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-xl mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Upload className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 text-center">Upload & Extract</h4>
              <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                Upload PDF documents or image files. Our advanced OCR technology extracts text while preserving formatting and context.
              </p>
            </div>
            <div className="group p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl border border-gray-200/80 dark:border-gray-700/80 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300">
              <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white font-bold text-xl mx-auto mb-6 group-hover:scale-110 transition-transform">
                <BarChart2 className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 text-center">AI Analysis</h4>
              <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                Advanced AI analyzes engagement potential, sentiment, and content structure to provide personalized improvement recommendations.
              </p>
            </div>
            <div className="group p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl border border-gray-200/80 dark:border-gray-700/80 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300">
              <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white font-bold text-xl mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 text-center">Optimize & Share</h4>
              <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                Get rewritten versions in different tones and implement our suggestions to maximize your social media engagement.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 py-12 border-t border-gray-200/80 dark:border-gray-700/80">
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            &copy; {new Date().getFullYear()} Social Media Content Analyzer
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Built for technical assessment demonstration • Powered by AI
          </p>
        </div>
      </footer>
    </div>
  );
}
