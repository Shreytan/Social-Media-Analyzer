import { useState, useEffect, useCallback } from 'react';
import AnimatedBlobs from './components/AnimatedBlobs';
import Header from './components/Header';
import { useDropzone } from 'react-dropzone';
import { FileText, Image, Loader, BarChart2, Sparkles, Star, Copy, Check, Upload, AlertCircle } from 'lucide-react';

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

  // Text extraction simulation (Mock OCR/PDF parsing)
  const extractTextFromFile = (file) => {
    const mockTexts = {
      'image': [
        "Just had the most amazing brunch at The Sunny Side! ☀️🥞 The avocado toast was divine and the coffee was perfectly brewed. Highly recommend this cozy spot for a weekend treat! 🌟 #brunch #foodie #weekendvibes",
        "Check out this incredible sunset from my evening run! 🌅 Nothing beats the feeling of accomplishment after a good workout. Who else is staying active this weekend? #fitness #motivation #sunset",
        "Excited to announce that I just finished reading 'The Seven Habits of Highly Effective People'! 📚 This book has completely changed my perspective on productivity and leadership. Highly recommend! #reading #selfimprovement #leadership"
      ],
      'pdf': [
        "QUARTERLY BUSINESS REPORT: Our social media engagement has increased by 150% this quarter through strategic content optimization and community building initiatives. Key achievements include viral campaign success and influencer partnerships.",
        "RESEARCH FINDINGS: Study shows that posts with authentic storytelling receive 300% more engagement than purely promotional content. Recommendation: Focus on personal narratives and behind-the-scenes content.",
        "MARKETING STRATEGY: Analysis of top-performing posts reveals that user-generated content drives 5x more engagement than brand-created posts. Strategic pivot recommended towards community-driven content creation."
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
      setError('File size must be less than 10MB');
      return;
    }

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

    // Simulate text extraction with realistic timing
    const extractionTime = file.type === 'application/pdf' ? 3000 : 2500;
    
    setTimeout(() => {
      try {
        if (file.type.startsWith('image/') || file.type === 'application/pdf') {
          const mockExtractedText = extractTextFromFile(file);
          setExtractedText(mockExtractedText);
          setAppState('file-uploaded');
        } else {
          throw new Error('Unsupported file type');
        }
      } catch (err) {
        setError('Failed to extract text from file. Please try a different file.');
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
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  // Mock AI Analysis (simulates Gemini API call)
  const handleAnalyze = async () => {
    if (!extractedText) return;
    setIsAnalyzing(true);
    setAnalysis(null);
    setError('');

    try {
      // Simulate API call timing
      await new Promise(resolve => setTimeout(resolve, 3500));
      
      // Mock analysis based on text content
      const wordCount = extractedText.split(' ').length;
      const hasHashtags = extractedText.includes('#');
      const hasEmojis = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(extractedText);
      
      let score = 5.0;
      if (hasHashtags) score += 1.5;
      if (hasEmojis) score += 1.0;
      if (wordCount > 20 && wordCount < 100) score += 1.0;
      if (extractedText.toLowerCase().includes('recommend')) score += 0.5;
      
      const engagementScore = Math.min(Math.max(score + (Math.random() * 2 - 1), 3.0), 10.0);

      const suggestions = [
        "Add more specific hashtags to increase discoverability",
        "Include a clear call-to-action to encourage engagement",
        "Consider posting during peak hours (11 AM - 1 PM, 7 PM - 9 PM)",
        "Add location tags to boost local engagement",
        "Use more emojis to make the post more visually appealing",
        "Ask a question to encourage comments and interaction",
        "Share personal experiences to create authentic connections",
        "Include relevant trending hashtags for broader reach"
      ].sort(() => 0.5 - Math.random()).slice(0, 4);

      setAnalysis({
        engagementScore: parseFloat(engagementScore.toFixed(1)),
        sentiment: engagementScore > 7 ? "Very Positive" : engagementScore > 5 ? "Positive" : "Neutral",
        suggestions
      });
    } catch (error) {
      setError('Analysis failed. Please try again.');
    }
    setIsAnalyzing(false);
  };

  // Mock Post Rewriting (simulates Gemini API call)
  const handleRewrite = async () => {
    if (!extractedText) return;
    setIsRewriting(true);
    setRewrittenPosts(null);
    setError('');

    try {
      // Simulate API call timing
      await new Promise(resolve => setTimeout(resolve, 2800));

      // Generate mock rewrites based on original content
      const baseTopic = extractedText.includes('brunch') ? 'brunch' : 
                       extractedText.includes('fitness') ? 'fitness' :
                       extractedText.includes('business') ? 'business' : 'general';

      const rewriteTemplates = {
        brunch: {
          casual: "Just discovered this amazing brunch spot! 🥞 The food was incredible and the vibes were perfect. Definitely going back soon! Who wants to join next time? #brunchlife",
          professional: "Experienced exceptional service and cuisine at a local establishment today. The attention to detail in both presentation and flavor profiles was noteworthy. Would recommend for business dining.",
          excited: "OMG THIS BRUNCH WAS ABSOLUTELY INCREDIBLE!!! 🤩✨ I'm literally obsessed and already planning my next visit! You NEED to check this place out - it's pure perfection! #OBSESSED"
        },
        fitness: {
          casual: "Great workout session today! 💪 Feeling energized and ready to tackle the week. Love these evening runs - they really clear my head. #fitness #motivation",
          professional: "Completed today's training regimen with excellent results. Consistent physical activity continues to enhance both mental clarity and professional performance. Recommend incorporating regular exercise.",
          excited: "CRUSHED my workout today!!! 🔥💪 The endorphins are REAL and I'm feeling absolutely unstoppable! Who else is staying committed to their fitness goals? Let's GO! #MOTIVATION"
        },
        business: {
          casual: "Some interesting insights from our latest business review. It's amazing how small changes can lead to big improvements. Always learning! #business #growth",
          professional: "Recent performance analysis demonstrates significant growth opportunities through strategic optimization. Data-driven approaches continue to yield measurable improvements in key metrics.",
          excited: "WOW! The results from our latest initiatives are AMAZING! 📈 So proud of what we've accomplished and excited for what's next! Team work makes the dream work! #SUCCESS"
        }
      };

      const selectedTemplate = rewriteTemplates[baseTopic] || rewriteTemplates.general;
      
      setRewrittenPosts(selectedTemplate || {
        casual: "Here's a more casual take on your content! Added some friendly vibes while keeping the main message clear and engaging.",
        professional: "This version maintains professionalism while emphasizing key points. Suitable for business contexts while remaining accessible.",
        excited: "This version is full of energy and enthusiasm! Perfect for grabbing attention and creating excitement around your message!"
      });
    } catch (error) {
      setError('Rewriting failed. Please try again.');
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
        <section className="text-center max-w-3xl mx-auto mt-8 mb-12">
          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white animate-text-reveal">
            Unlock Peak Engagement
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 animate-text-reveal-delayed">
            Transform your social media posts with AI-driven insights. Upload a file to see how you can captivate your audience.
          </p>
        </section>

        <div className="w-full max-w-4xl mx-auto bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-2xl p-6 sm:p-8 transition-all duration-500">
          
          {/* File Upload Section */}
          {appState === 'idle' && (
            <div {...getRootProps()} className={`text-center p-8 border-2 border-dashed rounded-xl transition-all cursor-pointer ${
              isDragActive 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105' 
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}>
              <input {...getInputProps()} />
              <div className="animate-fade-in">
                <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800">
                  {isDragActive ? 'Drop files here...' : 'Select a File'}
                </button>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  or drag and drop PDF or image files here
                </p>
                <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                  Supports: PDF, JPG, PNG, GIF, BMP, WebP (Max 10MB)
                </p>
              </div>
              {error && (
                <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}
            </div>
          )}

          {/* File Processing Section */}
          {appState !== 'idle' && (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-center pb-6 border-b border-gray-200/80 dark:border-gray-700/80">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                    {files[0]?.type.startsWith('image/') ? 
                      <Image className="h-6 w-6 text-blue-600 dark:text-blue-400" /> : 
                      <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    }
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{files[0]?.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {isLoading ? 'Processing...' : 'Ready for analysis'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={handleReset} 
                  className="mt-4 sm:mt-0 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Start Over
                </button>
              </div>

              {/* Extracted Text Section */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  Extracted Text {isLoading && <span className="text-sm font-normal text-gray-500">(Processing...)</span>}
                </h3>
                <div className="text-gray-600 dark:text-gray-300 bg-gray-100/80 dark:bg-gray-900/70 p-4 rounded-lg text-sm leading-relaxed max-h-48 overflow-y-auto border border-gray-200/80 dark:border-gray-700/80">
                  {isLoading ? (
                    <div className="flex items-center gap-2 justify-center py-4">
                      <Loader className="animate-spin h-5 w-5" />
                      <span>
                        {files[0]?.type === 'application/pdf' 
                          ? 'Parsing PDF and extracting text...' 
                          : 'Running OCR on image...'}
                      </span>
                    </div>
                  ) : extractedText || 'No text extracted yet.'}
                </div>

                {/* Action Buttons */}
                {!isLoading && extractedText && (
                  <div className="mt-4 flex gap-4">
                    <button 
                      onClick={handleAnalyze} 
                      disabled={isAnalyzing} 
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 transition-all duration-300"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader className="animate-spin h-5 w-5" />
                          Analyzing...
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
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 transition-all duration-300"
                    >
                      {isRewriting ? (
                        <>
                          <Loader className="animate-spin h-5 w-5" />
                          Rewriting...
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
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Analysis Results */}
                  {analysis && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">📊 Analysis Results</h3>
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg border border-gray-200/80 dark:border-gray-700/80">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Engagement Score</p>
                        <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                          {analysis.engagementScore}/10
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Sentiment: <span className="font-medium">{analysis.sentiment}</span>
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">💡 Suggestions</h4>
                        {analysis.suggestions.map((suggestion, i) => (
                          <div key={i} className="flex items-start gap-3 text-sm p-3 bg-gray-100/80 dark:bg-gray-900/70 rounded-lg hover:bg-gray-200/80 dark:hover:bg-gray-700/70 transition-colors">
                            <Star className="h-4 w-4 mt-0.5 text-yellow-500 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{suggestion}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rewritten Posts */}
                  {rewrittenPosts && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">✨ Rewritten Posts</h3>
                      {Object.entries(rewrittenPosts).map(([tone, text]) => (
                        <div key={tone} className="p-4 bg-gray-100/80 dark:bg-gray-900/70 rounded-lg border border-gray-200/80 dark:border-gray-700/80">
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-semibold capitalize text-blue-600 dark:text-blue-400 text-lg">
                              {tone} Tone
                            </span>
                            <button 
                              onClick={() => handleCopy(text, tone)} 
                              className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                              title="Copy to clipboard"
                            >
                              {copied === tone ? 
                                <Check className="h-4 w-4 text-green-500" /> : 
                                <Copy className="h-4 w-4 text-gray-500" />
                              }
                            </button>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Error Display */}
              {error && !isLoading && (
                <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Workflow Section */}
        <section className="w-full max-w-5xl mx-auto mt-20 text-center">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">How It Works</h3>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-200/80 dark:border-gray-700/80">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-bold text-xl mx-auto">
                <Upload className="h-8 w-8" />
              </div>
              <h4 className="mt-4 text-lg font-semibold">Upload & Extract</h4>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Upload PDF or image files. Our OCR technology extracts text while preserving formatting.
              </p>
            </div>
            <div className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-200/80 dark:border-gray-700/80">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 font-bold text-xl mx-auto">
                <BarChart2 className="h-8 w-8" />
              </div>
              <h4 className="mt-4 text-lg font-semibold">AI Analysis</h4>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Advanced AI analyzes engagement potential, sentiment, and provides actionable improvement suggestions.
              </p>
            </div>
            <div className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-200/80 dark:border-gray-700/80">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 font-bold text-xl mx-auto">
                <Sparkles className="h-8 w-8" />
              </div>
              <h4 className="mt-4 text-lg font-semibold">Optimize & Share</h4>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Get rewritten versions in different tones and implement suggestions to maximize engagement.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 py-8 border-t border-gray-200/80 dark:border-gray-700/80 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} Content Analyzer. Built for technical assessment demonstration.</p>
      </footer>
    </div>
  );
}
