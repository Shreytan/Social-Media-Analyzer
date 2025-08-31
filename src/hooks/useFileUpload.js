import { useState, useCallback } from 'react';

export const useFileUpload = () => {
  const [extractedText, setExtractedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [appState, setAppState] = useState('idle');

  const handleFileUpload = useCallback((file) => {
    setError('');
    setExtractedText('');
    setIsLoading(true);
    setAppState('loading-file');

    // Mock text extraction - in a real app, use OCR/PDF parsing libraries
    setTimeout(() => {
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        const mockText = `Extracted text from ${file.name}: "Just had the most amazing brunch at The Sunny Side! ☀️🥞 The avocado toast was divine. Highly recommend this spot for a weekend treat! #brunch #foodie #weekendvibes"`;
        setExtractedText(mockText);
        setAppState('file-uploaded');
      } else {
        setError('Unsupported file type.');
        setAppState('idle');
      }
      setIsLoading(false);
    }, 2000);
  }, []);

  const reset = useCallback(() => {
    setExtractedText('');
    setError('');
    setAppState('idle');
  }, []);

  return {
    extractedText,
    isLoading,
    error,
    appState,
    handleFileUpload,
    reset
  };
};
