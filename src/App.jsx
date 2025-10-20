import { useState, useEffect, useCallback } from 'react';
import AnimatedBlobs from './components/AnimatedBlobs';
import Header from './components/Header';
import { useDropzone } from 'react-dropzone';
import { FileText, Image, Loader, BarChart2, Sparkles, Star, Copy, Check, Upload, AlertCircle, RefreshCw } from 'lucide-react';
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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
  const [extractionProgress, setExtractionProgress] = useState(0);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  // REAL OCR Implementation using Tesseract.js
  const extractTextFromImage = async (file) => {
    try {
      const result = await Tesseract.recognize(file, 'eng', {
        logger: m => {
          if (m.status === 'recognizing text') {
            setExtractionProgress(Math.round(m.progress * 100));
          }
          console.log(m);
        }
      });
      return result.data.text.trim();
    } catch (error) {
      console.error('OCR Error:', error);
      throw new Error('Failed to extract text from image. Please try a clearer image.');
    }
  };

  // REAL PDF Parsing Implementation using PDF.js
  const extractTextFromPDF = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      
      let fullText = '';
      const totalPages = pdf.numPages;
      
      for (let i = 1; i <= totalPages; i++) {
        setExtractionProgress(Math.round((i / totalPages) * 100));
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
      }
      
      return fullText.trim();
    } catch (error) {
      console.error('PDF Error:', error);
      throw new Error('Failed to parse PDF. Please try a different PDF file.');
    }
  };

  // REAL AI Analysis using Google Gemini API
  const analyzeWithGemini = async (text) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const prompt = `Analyze the following social media post text and provide detailed engagement insights. 

Post: "${text}"

Please provide your analysis as a JSON object with:
1. engagementScore: A number from 1-10 rating the post's engagement potential
2. sentiment: One word describing sentiment (Positive, Negative, or Neutral)
3. suggestions: An array of exactly 4 specific, actionable improvement suggestions

Focus on practical improvements like hashtags, timing, call-to-actions, and content structure.`;

    const schema = {
      type: "OBJECT",
      properties: {
        engagementScore: { type: "NUMBER" },
        sentiment: { type: "STRING" },
        suggestions: { 
          type: "ARRAY", 
          items: { type: "STRING" },
          maxItems: 4
        }
      },
      required: ["engagementScore", "sentiment", "suggestions"]
    };

    const response = await fetch(
  `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7,
      },
    }),
  }
);



    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const result = await response.json();
    const text_response = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text_response) {
      throw new Error("Invalid response from Gemini API");
    }

    return JSON.parse(text_response);
  };

  // REAL Content Rewriting using Google Gemini API
  const rewriteWithGemini = async (text) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const prompt = `Rewrite the following social media post in three distinct tones while preserving the core message and key information:

Original Post: "${text}"

Please provide three versions as a JSON object with:
1. casual: Friendly, relaxed tone for personal/lifestyle brands
2. professional: Business-appropriate tone for corporate accounts  
3. excited: High-energy, enthusiastic tone for maximum engagement

Each rewrite should be engaging, appropriate for social media, and maintain the original meaning.`;

    const schema = {
      type: "OBJECT",
      properties: {
        casual: { type: "STRING" },
        professional: { type: "STRING" },
        excited: { type: "STRING" }
      },
      required: ["casual", "professional", "excited"]
    };

    const response = await fetch(
  `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.8,
      },
    }),
  }
);


    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const result = await response.json();
    const text_response = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text_response) {
      throw new Error("Invalid response from Gemini API");
    }

    return JSON.parse(text_response);
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
    setExtractionProgress(0);
    setAppState('loading-file');

    const fileWithPreview = Object.assign(file, { 
      preview: URL.createObjectURL(file) 
    });
    setFiles([fileWithPreview]);

    // Real text extraction
    const extractText = async () => {
      try {
        let text = '';
        
        if (file.type.startsWith('image/')) {
          // Real OCR processing
          text = await extractTextFromImage(file);
        } else if (file.type === 'application/pdf') {
          // Real PDF processing
          text = await extractTextFromPDF(file);
        } else {
          throw new Error('Unsupported file format');
        }

        if (!text || text.trim().length === 0) {
          throw new Error('No text could be extracted from this file. Please try a different file with clearer text.');
        }

        setExtractedText(text);
        setAppState('file-uploaded');
      } catch (err) {
        console.error('Extraction error:', err);
        setError(err.message || 'Failed to extract text from file. Please try a different file.');
        setFiles([]);
        setAppState('idle');
      }
      setIsLoading(false);
      setExtractionProgress(0);
    };

    extractText();
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

  // Real AI Analysis
  const handleAnalyze = async () => {
    if (!extractedText) return;
    setIsAnalyzing(true);
    setAnalysis(null);
    setError('');

    try {
      const result = await analyzeWithGemini(extractedText);
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis error:', error);
      setError(error.message || 'Failed to analyze content. Please check your internet connection and try again.');
    }
    setIsAnalyzing(false);
  };

  // Real Content Rewriting
  const handleRewrite = async () => {
    if (!extractedText) return;
    setIsRewriting(true);
    setRewrittenPosts(null);
    setError('');

    try {
      const result = await rewriteWithGemini(extractedText);
      setRewrittenPosts(result);
    } catch (error) {
      console.error('Rewrite error:', error);
      setError(error.message || 'Failed to rewrite content. Please check your internet connection and try again.');
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
    setExtractionProgress(0);
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
                          {extractionProgress > 0 && ` (${extractionProgress}%)`}
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
                  {isLoading && extractionProgress > 0 && (
                    <span className="text-sm font-normal text-gray-500">({extractionProgress}%)</span>
                  )}
                </h3>
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl border border-gray-200/80 dark:border-gray-700/80 max-h-64 overflow-y-auto">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-8 text-gray-500 dark:text-gray-400">
                      <Loader className="animate-spin h-8 w-8" />
                      <div className="text-center">
                        <p className="font-medium text-lg">
                          {files[0]?.type === 'application/pdf' 
                            ? 'Parsing PDF document...' 
                            : 'Processing image with OCR...'}
                        </p>
                        <p className="text-sm mt-1">
                          {files[0]?.type === 'application/pdf' 
                            ? 'Extracting text from all pages' 
                            : 'Recognizing text in image'}
                        </p>
                        {extractionProgress > 0 && (
                          <div className="mt-3 w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${extractionProgress}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : extractedText ? (
                    <div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{extractedText}</p>
                      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                        <span>Characters: {extractedText.length}</span>
                        <span>Words: {extractedText.split(/\s+/).length}</span>
                      </div>
                    </div>
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
                          Analyzing with AI...
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
                          AI Rewriting...
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
                        AI Analysis Results
                      </h3>
                      
                      {/* Engagement Score Card */}
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Engagement Score</p>
                          <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                            {analysis.engagementScore}/10
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              analysis.sentiment === 'Positive' ? 'bg-green-500' : 
                              analysis.sentiment === 'Negative' ? 'bg-red-500' : 'bg-yellow-500'
                            }`}></div>
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
                          AI Improvement Suggestions
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
                        AI-Generated Rewrites
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
              Real OCR technology and AI analysis to transform your social media content
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl border border-gray-200/80 dark:border-gray-700/80 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300">
              <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-xl mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Upload className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 text-center">Real Text Extraction</h4>
              <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                Upload PDF documents or images. Tesseract OCR and PDF.js extract text with high accuracy and formatting preservation.
              </p>
            </div>
            <div className="group p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl border border-gray-200/80 dark:border-gray-700/80 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300">
              <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white font-bold text-xl mx-auto mb-6 group-hover:scale-110 transition-transform">
                <BarChart2 className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 text-center">Google Gemini AI Analysis</h4>
              <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                Real Google Gemini AI analyzes engagement potential, sentiment, and provides specific, actionable improvement recommendations.
              </p>
            </div>
            <div className="group p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl border border-gray-200/80 dark:border-gray-700/80 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300">
              <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white font-bold text-xl mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 text-center">AI Content Optimization</h4>
              <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                Get AI-powered rewrites in multiple tones and implement specific suggestions to maximize your social media engagement.
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
            Powered by Tesseract OCR, PDF.js, and Google Gemini AI
          </p>
        </div>
      </footer>
    </div>
  );
}
