import React, { useState } from 'react';
import { api } from '../../services/mockBackend';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { AnalysisResult } from '../../types';
import { Upload as UploadIcon, Image, Type, CheckCircle, AlertTriangle, Smile, Zap } from 'lucide-react';

export const Upload: React.FC = () => {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [useOcr, setUseOcr] = useState(true);
  const [useObj, setUseObj] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Validate file size (e.g., < 10MB)
      if (e.target.files[0].size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setImage(e.target.files[0]);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text && !image) {
      setError('Please provide text or upload an image.');
      return;
    }
    
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      // Convert image to base64
      let imageBase64 = undefined;
      if (image) {
        imageBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(image);
        });
      }

      const analysisResult = await api.analysis.create(user!.id, text, imageBase64, useOcr, useObj);
      setResult(analysisResult);
      setText('');
      setImage(null);
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">New Analysis</h1>
        <p className="text-slate-500 dark:text-slate-400">Upload Sinhala comments or screenshots for real-time AI processing.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div>
           <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden h-full">
            <div className="p-6 space-y-6">
              {/* Text Input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Comment Text (Sinhala)
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-purple-500 focus:border-purple-500 p-3"
                  placeholder="Type your text here... (e.g., මේක හරිම පුදුම වැඩක්)"
                />
              </div>

              {/* Image Input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Upload Context Image (Optional)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="space-y-1 text-center">
                    <div className="mx-auto h-12 w-12 text-slate-400">
                      {image ? <CheckCircle size={48} className="text-green-500"/> : <Image size={48} />}
                    </div>
                    <div className="flex text-sm text-slate-600 dark:text-slate-400 justify-center">
                      <span className="font-medium text-purple-600 hover:text-purple-500">Upload a file</span>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                    {image && <p className="text-sm font-semibold text-green-600 mt-2">{image.name}</p>}
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <div className="flex items-center">
                    <Type className="text-slate-500 mr-2" size={18} />
                    <span className="text-sm font-medium text-slate-900 dark:text-white">OCR</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={useOcr} 
                    onChange={e => setUseOcr(e.target.checked)} 
                    disabled={!image}
                    className="rounded text-purple-600 focus:ring-purple-500" 
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <div className="flex items-center">
                    <Image className="text-slate-500 mr-2" size={18} />
                    <span className="text-sm font-medium text-slate-900 dark:text-white">Objects</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={useObj} 
                    onChange={e => setUseObj(e.target.checked)} 
                    disabled={!image}
                    className="rounded text-purple-600 focus:ring-purple-500" 
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="px-6 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 text-sm border-t border-red-100 dark:border-red-800">
                {error}
              </div>
            )}

            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex justify-end">
               <Button type="submit" isLoading={loading} size="lg" className="w-full sm:w-auto">
                  Run Analysis
               </Button>
            </div>
           </form>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {result ? (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden animate-fade-in">
              <div className="bg-slate-900 dark:bg-black p-6 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="text-green-400" size={20} />
                  <h2 className="text-lg font-bold">Analysis Complete</h2>
                </div>
                <p className="text-slate-400 text-sm">Processed in {result.processingTimeMs}ms</p>
              </div>

              <div className="p-6 space-y-6">
                {/* Sentiment Badge */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Sentiment</span>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm
                    ${result.sentiment === 'Positive' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 
                      result.sentiment === 'Negative' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' : 
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'}`}>
                    {result.sentiment}
                  </span>
                </div>

                {/* Sarcasm & Humor Grid */}
                <div className="grid grid-cols-2 gap-4">
                   <div className={`p-4 rounded-xl border-2 text-center transition-all ${result.sarcasm ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                      <AlertTriangle className={`mx-auto mb-2 ${result.sarcasm ? 'text-purple-600' : 'text-slate-400'}`} />
                      <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Sarcasm</div>
                      <div className={`text-lg font-bold ${result.sarcasm ? 'text-purple-700 dark:text-purple-300' : 'text-slate-900 dark:text-white'}`}>
                        {result.sarcasm ? 'Detected' : 'None'}
                      </div>
                   </div>

                   <div className={`p-4 rounded-xl border-2 text-center transition-all ${result.humor ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                      <Smile className={`mx-auto mb-2 ${result.humor ? 'text-yellow-600' : 'text-slate-400'}`} />
                      <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Humor</div>
                      <div className={`text-lg font-bold ${result.humor ? 'text-yellow-700 dark:text-yellow-300' : 'text-slate-900 dark:text-white'}`}>
                        {result.humor ? 'Detected' : 'None'}
                      </div>
                   </div>
                </div>

                {/* Additional Info */}
                {(result.ocrText || (result.detectedObjects && result.detectedObjects.length > 0)) && (
                   <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-4">
                      {result.ocrText && (
                        <div>
                           <h4 className="text-xs font-semibold uppercase text-slate-500 mb-2">OCR Extracted Text</h4>
                           <p className="text-sm bg-slate-50 dark:bg-slate-900 p-3 rounded-lg text-slate-800 dark:text-slate-200 font-mono">
                             {result.ocrText}
                           </p>
                        </div>
                      )}
                      
                      {result.detectedObjects && result.detectedObjects.length > 0 && (
                        <div>
                           <h4 className="text-xs font-semibold uppercase text-slate-500 mb-2">Detected Objects</h4>
                           <div className="flex flex-wrap gap-2">
                              {result.detectedObjects.map((obj, i) => (
                                <span key={i} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-md font-medium">
                                  {obj}
                                </span>
                              ))}
                           </div>
                        </div>
                      )}
                   </div>
                )}
                
                <div className="pt-4">
                  <Button onClick={() => setResult(null)} variant="secondary" className="w-full">
                    Analyze Another
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            // Placeholder State
            <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-900/30 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400">
               {loading ? (
                 <div className="space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="text-slate-600 dark:text-slate-300 font-medium">Analyzing content...</p>
                    <p className="text-xs">Connecting to Gemini AI Model</p>
                 </div>
               ) : (
                 <>
                   <Zap size={48} className="mb-4 opacity-20" />
                   <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">Ready to Analyze</h3>
                   <p className="text-sm">Results will appear here instantly after processing.</p>
                 </>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};