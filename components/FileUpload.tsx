import React, { useRef, useState } from 'react';

interface FileUploadProps {
  onImageSelected: (base64: string) => void;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onImageSelected, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件');
      return;
    }
    
    // Check file size (e.g., limit to 10MB to be safe for base64)
    if (file.size > 10 * 1024 * 1024) {
        alert('图片大小不能超过 10MB');
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      onImageSelected(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div 
      className={`relative group w-full max-w-xl mx-auto border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ease-in-out cursor-pointer
        ${isDragging ? 'border-indigo-500 bg-gray-800/80 scale-[1.02]' : 'border-gray-700 bg-gray-900/50 hover:border-gray-500 hover:bg-gray-800/50'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      onClick={() => !disabled && fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
        disabled={disabled}
      />
      
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className={`p-4 rounded-full bg-gray-800 transition-transform duration-300 ${isDragging ? 'scale-110' : 'group-hover:scale-110'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-200">点击或拖拽上传人物照片</h3>
          <p className="text-sm text-gray-500 mt-1">支持 JPG, PNG 格式，建议上传清晰的半身照</p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;