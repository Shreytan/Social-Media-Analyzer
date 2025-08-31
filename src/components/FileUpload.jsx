import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Image, RefreshCw, Loader } from 'lucide-react';

const FileUpload = ({ onFileUpload, isLoading, error, onReset }) => {
  const [files, setFiles] = useState([]);
  const dropzoneRef = useRef(null);

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    if (!file) return;
    
    const fileWithPreview = Object.assign(file, { 
      preview: URL.createObjectURL(file) 
    });
    
    setFiles([fileWithPreview]);
    onFileUpload(file);
  }, [onFileUpload]);

  const { getRootProps, getInputProps } = useDropzone({ 
    onDrop, 
    noClick: true, 
    noKeyboard: true, 
    accept: { 
      'image/*': ['.jpeg', '.png', '.jpg'], 
      'application/pdf': ['.pdf'] 
    }, 
    multiple: false 
  });

  const openFileDialog = () => dropzoneRef.current?.click();

  const handleReset = () => {
    setFiles([]);
    onReset();
  };

  if (files.length === 0) {
    return (
      <div {...getRootProps({ className: 'dropzone' })} className="text-center animate-fade-in">
        <input {...getInputProps()} ref={dropzoneRef} />
        <button 
          onClick={openFileDialog} 
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
        >
          Select a File
        </button>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          or drag and drop file here
        </p>
        {error && <p className="mt-4 text-red-600 dark:text-red-400">{error}</p>}
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
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
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <button 
            onClick={handleReset} 
            title="Start over" 
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>
      {error && <p className="mt-4 text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default FileUpload;
