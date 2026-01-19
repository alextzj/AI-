import React, { useState, useCallback } from 'react';
import { APP_NAME, APP_DESCRIPTION, PHOTO_STYLES } from './constants';
import FileUpload from './components/FileUpload';
import PhotoCard from './components/PhotoCard';
import { GeneratedPhoto, GenerationStatus } from './types';
import { generateStyledPortrait } from './services/geminiService';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [results, setResults] = useState<GeneratedPhoto[]>(
    PHOTO_STYLES.map(style => ({ styleId: style.id, status: GenerationStatus.IDLE }))
  );
  const [isProcessing, setIsProcessing] = useState(false);

  // Helper to update state for a specific style
  const updateResultStatus = useCallback((styleId: string, updates: Partial<GeneratedPhoto>) => {
    setResults(prev => prev.map(item => 
      item.styleId === styleId ? { ...item, ...updates } : item
    ));
  }, []);

  const triggerGeneration = useCallback(async (base64Image: string, styleId: string) => {
    const styleDef = PHOTO_STYLES.find(s => s.id === styleId);
    if (!styleDef) return;

    updateResultStatus(styleId, { status: GenerationStatus.LOADING, error: undefined });

    try {
      const generatedImageBase64 = await generateStyledPortrait(base64Image, styleDef.prompt);
      updateResultStatus(styleId, { 
        status: GenerationStatus.SUCCESS, 
        imageUrl: generatedImageBase64 
      });
    } catch (err: any) {
      updateResultStatus(styleId, { 
        status: GenerationStatus.ERROR, 
        error: err.message || "生成失败，请稍后重试" 
      });
    }
  }, [updateResultStatus]);

  const handleImageSelected = useCallback((base64: string) => {
    setOriginalImage(base64);
    setIsProcessing(true);
    
    // Trigger generation for all styles simultaneously
    PHOTO_STYLES.forEach(style => {
      triggerGeneration(base64, style.id);
    });
  }, [triggerGeneration]);

  const handleRetry = useCallback((styleId: string) => {
    if (originalImage) {
      triggerGeneration(originalImage, styleId);
    }
  }, [originalImage, triggerGeneration]);

  const handleReset = () => {
    setOriginalImage(null);
    setResults(PHOTO_STYLES.map(style => ({ styleId: style.id, status: GenerationStatus.IDLE })));
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-indigo-500 selection:text-white">
      {/* Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-gray-900 to-gray-950 pointer-events-none z-0"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        
        {/* Header */}
        <header className="text-center mb-12 space-y-4">
          <div className="inline-block p-3 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 mb-4 backdrop-blur-sm">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-4-8-8s4-8 8-8 8 4 8 8-4 4-8 4zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z"/>
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
            {APP_NAME}
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {APP_DESCRIPTION}
          </p>
        </header>

        {/* Main Interface */}
        {!originalImage ? (
          // Upload View
          <div className="animate-fade-in-up">
            <FileUpload onImageSelected={handleImageSelected} />
            
            {/* Style Preview Grid (Static decorative) */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-6 gap-4 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
               {PHOTO_STYLES.map((style) => (
                 <div key={style.id} className="text-center">
                    <div className="w-full aspect-[3/4] bg-gray-800 rounded-lg mb-2 border border-gray-700"></div>
                    <span className="text-xs text-gray-500">{style.name}</span>
                 </div>
               ))}
            </div>
          </div>
        ) : (
          // Results View
          <div className="space-y-12 animate-fade-in">
            
            {/* Control Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between bg-gray-900/50 p-4 rounded-xl border border-gray-800 backdrop-blur-md sticky top-4 z-20 shadow-2xl">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-500 shadow-lg">
                  <img src={originalImage} alt="Original" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-200">原始图片</h3>
                  <p className="text-xs text-gray-500">正在为您生成 6 组不同风格的大片</p>
                </div>
              </div>
              
              <button 
                onClick={handleReset}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-all duration-200 text-sm font-medium border border-gray-700 hover:border-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                上传新照片
              </button>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {PHOTO_STYLES.map((style) => {
                const result = results.find(r => r.styleId === style.id)!;
                return (
                  <PhotoCard 
                    key={style.id}
                    styleDef={style}
                    data={result}
                    onRetry={handleRetry}
                  />
                );
              })}
            </div>

          </div>
        )}

        <footer className="mt-20 text-center text-gray-600 text-sm py-8 border-t border-gray-900">
          <p>Powered by Google Gemini 2.5 Flash Image & Nano Banana</p>
        </footer>

      </div>
    </div>
  );
};

export default App;