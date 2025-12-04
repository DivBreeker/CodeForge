import React, { useState } from 'react';
import { api } from '../../services/mockBackend';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Upload as UploadIcon, Image, Type, CheckCircle } from 'lucide-react';

export const Upload: React.FC = () => {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [useOcr, setUseOcr] = useState(true);
  const [useObj, setUseObj] = useState(true);
  const [loading, setLoading] = useState(false);
  const [resultId, setResultId] = useState<string | null>(null);
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
    
    try {
      // Convert image to base64 for "mock" storage
      let imageBase64 = undefined;
      if (image) {
        imageBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(image);
        });
      }

      const result = await api.analysis.create(user!.id, text, imageBase64, useOcr, useObj);
      setResultId(result.id);
      // In a real app, we might redirect to details, but let's show success here
      setText('');
      setImage(null);
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">New Analysis</h1>
        <p className="text-slate-500 dark:text-slate-400">Upload Sinhala comments or screenshots for processing.</p>
      </div>

      {resultId ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-xl font-bold text-green-900 dark:text-green-100 mb-2">Analysis Complete!</h2>
          <p className="text-green-700 dark:text-green-300 mb-6">Your data has been successfully processed and stored.</p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => setResultId(null)} variant="secondary">Analyze Another</Button>
            <Button onClick={() => window.location.hash = `/history`} variant="primary">View Results</Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          
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
                className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-primary-500 focus:border-primary-500 p-3"
                placeholder="Type your text here... (e.g., මේක හරිම පුදුම වැඩක්)"
              />
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 my-4"></div>

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
                    {image ? <CheckCircle size={48} className="text-primary-500"/> : <Image size={48} />}
                  </div>
                  <div className="flex text-sm text-slate-600 dark:text-slate-400 justify-center">
                    <span className="font-medium text-primary-600 hover:text-primary-500">Upload a file</span>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                  {image && <p className="text-sm font-semibold text-primary-600 mt-2">{image.name}</p>}
                </div>
              </div>
            </div>

            {/* Toggles */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                <div className="flex items-center">
                  <Type className="text-slate-500 mr-3" />
                  <div>
                    <span className="block text-sm font-medium text-slate-900 dark:text-white">OCR Processing</span>
                    <span className="block text-xs text-slate-500">Extract text from image</span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={useOcr} onChange={e => setUseOcr(e.target.checked)} className="sr-only peer" disabled={!image} />
                  <div className={`w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 ${!image ? 'opacity-50' : ''}`}></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                <div className="flex items-center">
                  <UploadIcon className="text-slate-500 mr-3" />
                  <div>
                    <span className="block text-sm font-medium text-slate-900 dark:text-white">Object Detection</span>
                    <span className="block text-xs text-slate-500">Identify visual context</span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={useObj} onChange={e => setUseObj(e.target.checked)} className="sr-only peer" disabled={!image} />
                  <div className={`w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 ${!image ? 'opacity-50' : ''}`}></div>
                </label>
              </div>
            </div>
          </div>

          {error && (
            <div className="px-6 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex justify-end">
             <Button type="submit" isLoading={loading} size="lg">
                Analyze Comment
             </Button>
          </div>
        </form>
      )}
    </div>
  );
};