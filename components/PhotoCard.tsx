import React from 'react';
import { GeneratedPhoto, GenerationStatus, StyleDefinition } from '../types';

interface PhotoCardProps {
  styleDef: StyleDefinition;
  data: GeneratedPhoto;
  onRetry: (styleId: string) => void;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ styleDef, data, onRetry }) => {
  const { status, imageUrl, error } = data;

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `${styleDef.name}_AI写真.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 flex flex-col h-full group transition-all duration-300 hover:border-indigo-500/50">
      
      {/* Header */}
      <div className="p-3 bg-gray-900 border-b border-gray-800 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-200">{styleDef.name}</h3>
        <span className="text-xs text-gray-500 truncate max-w-[120px]">{styleDef.description}</span>
      </div>

      {/* Content Area */}
      <div className="relative aspect-[3/4] w-full bg-gray-850">
        
        {/* Loading State */}
        {status === GenerationStatus.LOADING && (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 z-10">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-gray-400 animate-pulse">正在生成...</p>
          </div>
        )}

        {/* Idle State */}
        {status === GenerationStatus.IDLE && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-600">
            <span className="text-sm">等待开始</span>
          </div>
        )}

        {/* Success State - The Image */}
        {status === GenerationStatus.SUCCESS && imageUrl && (
          <div className="relative w-full h-full group/image">
            <img 
              src={imageUrl} 
              alt={styleDef.name} 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
              <button 
                onClick={handleDownload}
                className="px-4 py-2 bg-white text-gray-900 rounded-full text-sm font-medium hover:bg-gray-100 shadow-lg transform translate-y-2 group-hover/image:translate-y-0 transition-transform duration-200"
              >
                下载原图
              </button>
            </div>
          </div>
        )}

        {/* Error State */}
        {status === GenerationStatus.ERROR && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-xs text-red-400 mb-3">{error || "生成失败"}</p>
            <button 
              onClick={() => onRetry(styleDef.id)}
              className="px-3 py-1 bg-gray-700 text-gray-200 rounded text-xs hover:bg-gray-600 transition-colors"
            >
              重试
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoCard;