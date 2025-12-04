
import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Upload, 
  Image as ImageIcon, 
  BarChart2, 
  Smile, 
  Laugh, 
  AlertCircle, 
  Shield, 
  HelpCircle, 
  Mail, 
  Search
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

// Section Data Structure for Navigation
const SECTIONS = [
  { id: 'getting-started', title: 'Getting Started', icon: BookOpen },
  { id: 'uploading-comments', title: 'Uploading Comments', icon: Upload },
  { id: 'uploading-images', title: 'Uploading Images', icon: ImageIcon },
  { id: 'sentiment-results', title: 'Understanding Sentiment', icon: BarChart2 },
  { id: 'sarcasm-detection', title: 'Sarcasm Detection', icon: Smile },
  { id: 'humor-detection', title: 'Humor Detection', icon: Laugh },
  { id: 'handling-errors', title: 'Handling Errors', icon: AlertCircle },
  { id: 'privacy-data', title: 'Privacy & Data Consent', icon: Shield },
  { id: 'faqs', title: 'FAQs', icon: HelpCircle },
  { id: 'contact-support', title: 'Contact / Support', icon: Mail },
];

export const HelpGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle Scroll to highlight active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      for (const section of SECTIONS) {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
          setActiveSection(section.id);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  return (
    <div className="pb-10">
      
      {/* Header Search Area - Mobile Only (Desktop keeps sidebar) */}
      <div className="lg:hidden mb-6">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search help topics..." 
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 relative">
        
        {/* Sidebar Navigation */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-1">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors text-left
                  ${activeSection === section.id 
                    ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 border-l-4 border-purple-500' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border-l-4 border-transparent'
                  }`}
              >
                <section.icon size={18} />
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 space-y-16">
          
          {/* Top Search Bar (Desktop) */}
          <div className="hidden lg:block mb-8">
             <div className="relative max-w-2xl">
                <input 
                  type="text" 
                  placeholder="Search help topics..." 
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#333] shadow-sm focus:ring-2 focus:ring-purple-500 outline-none text-slate-900 dark:text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-4 top-4.5 text-slate-400" size={20} />
             </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Help & User Guide</h1>
            <p className="text-lg text-slate-500 dark:text-slate-400">
              Learn how to use the Sarcasm & Humor-Aware Sentiment Analyzer platform effectively.
            </p>
          </div>

          {/* Getting Started */}
          <section id="getting-started" className="space-y-6 scroll-mt-28">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="text-purple-600 dark:text-purple-400" size={28} />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Getting Started</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Welcome to the Sarcasm & Humor-Aware Sentiment Analyzer! This platform helps you analyze comments and images to detect sentiment, sarcasm, and humor with a focus on Sinhala language content.
            </p>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-2xl border border-purple-100 dark:border-purple-800/50">
              <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">What You Can Do</h3>
              <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-200">
                <li className="flex items-start gap-2">• <span>Analyze text comments for sentiment, sarcasm, and humor</span></li>
                <li className="flex items-start gap-2">• <span>Upload images with text for OCR and object detection</span></li>
                <li className="flex items-start gap-2">• <span>Get detailed confidence scores for each analysis</span></li>
                <li className="flex items-start gap-2">• <span>Understand context-aware sentiment analysis</span></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">System Requirements</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 list-disc list-inside ml-2">
                <li>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
                <li>Stable internet connection</li>
                <li>For images: JPG, PNG, or WebP format (max 5MB)</li>
                <li>Supported languages: Sinhala (primary), English</li>
              </ul>
            </div>
          </section>

          {/* Uploading Comments */}
          <section id="uploading-comments" className="space-y-6 scroll-mt-28 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <Upload className="text-purple-600 dark:text-purple-400" size={28} />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Uploading Comments</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              Analyzing text comments is straightforward. Follow these steps to get accurate sentiment analysis results.
            </p>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Step-by-Step Process</h3>
              <ol className="space-y-3 text-sm text-slate-600 dark:text-slate-400 list-decimal list-inside ml-2">
                <li><span className="font-medium">Navigate</span> to the comment analysis section</li>
                <li><span className="font-medium">Paste or type</span> your comment in the text area</li>
                <li><span className="font-medium">Select</span> the language (Sinhala or English)</li>
                <li>Click <span className="font-medium">"Analyze Comment"</span></li>
                <li><span className="font-medium">Wait</span> for results (typically 2-3 seconds)</li>
              </ol>
            </div>

            <div className="bg-cyan-50 dark:bg-cyan-900/20 p-6 rounded-2xl border border-cyan-100 dark:border-cyan-800/50">
              <h3 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-3">Tips for Best Results</h3>
              <ul className="space-y-2 text-sm text-cyan-800 dark:text-cyan-200">
                <li className="flex items-start gap-2">• <span>Keep comments under 500 characters for faster processing</span></li>
                <li className="flex items-start gap-2">• <span>Avoid excessive special characters or emojis</span></li>
                <li className="flex items-start gap-2">• <span>Ensure proper spelling for better accuracy</span></li>
                <li className="flex items-start gap-2">• <span>Provide context when analyzing sarcastic comments</span></li>
              </ul>
            </div>
          </section>

          {/* Uploading Images */}
          <section id="uploading-images" className="space-y-6 scroll-mt-28 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <ImageIcon className="text-purple-600 dark:text-purple-400" size={28} />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Uploading Images (OCR + Object Detection)</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              Upload images containing text for OCR (Optical Character Recognition) and object detection analysis.
            </p>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Upload Instructions</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 list-disc list-inside ml-2">
                <li>Click the upload area or drag and drop your image</li>
                <li>Supported formats: JPG, PNG, WebP</li>
                <li>Maximum file size: 5MB</li>
                <li>Image resolution: 800x600 minimum recommended</li>
              </ul>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-2xl border border-yellow-100 dark:border-yellow-800/50">
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">OCR Limitations</h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                 OCR accuracy depends on image quality, text clarity, and font style. Handwritten text may have lower accuracy. For best results, use high-contrast images with clear, printed text.
              </p>
            </div>

            <div>
               <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Object Detection</h3>
               <p className="text-sm text-slate-600 dark:text-slate-400">
                  Our system can identify objects in images to provide context for sentiment analysis. Common objects detected include people, products, scenes, and activities.
               </p>
            </div>
          </section>

           {/* Understanding Sentiment */}
           <section id="sentiment-results" className="space-y-6 scroll-mt-28 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <BarChart2 className="text-purple-600 dark:text-purple-400" size={28} />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Understanding Sentiment Results</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              Sentiment analysis results are categorized into three main types with confidence scores.
            </p>

            <div className="space-y-3">
              <div className="bg-slate-50 dark:bg-[#1A1A1A] p-4 rounded-lg flex flex-col sm:flex-row sm:items-center gap-4 border border-slate-100 dark:border-[#333]">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold w-fit">Positive</span>
                <span className="text-xs text-slate-500 font-mono">Confidence: 85-100%</span>
                <p className="text-sm text-slate-600 dark:text-slate-400">Indicates positive emotions, approval, happiness, or satisfaction.</p>
              </div>
              <div className="bg-slate-50 dark:bg-[#1A1A1A] p-4 rounded-lg flex flex-col sm:flex-row sm:items-center gap-4 border border-slate-100 dark:border-[#333]">
                <span className="bg-slate-500 text-white px-3 py-1 rounded-full text-xs font-bold w-fit">Neutral</span>
                <span className="text-xs text-slate-500 font-mono">Confidence: 60-85%</span>
                <p className="text-sm text-slate-600 dark:text-slate-400">Indicates factual statements, questions, or balanced opinions.</p>
              </div>
              <div className="bg-slate-50 dark:bg-[#1A1A1A] p-4 rounded-lg flex flex-col sm:flex-row sm:items-center gap-4 border border-slate-100 dark:border-[#333]">
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold w-fit">Negative</span>
                <span className="text-xs text-slate-500 font-mono">Confidence: 85-100%</span>
                <p className="text-sm text-slate-600 dark:text-slate-400">Indicates negative emotions, criticism, disappointment, or anger.</p>
              </div>
            </div>

            <div className="bg-purple-100 dark:bg-purple-900/30 p-6 rounded-2xl border border-purple-200 dark:border-purple-800/50">
              <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Understanding Confidence Scores</h3>
              <p className="text-sm text-purple-800 dark:text-purple-200">
                 Confidence scores indicate how certain the model is about its prediction. Higher scores (above 80%) suggest strong confidence, while lower scores may indicate ambiguous or complex sentiment.
              </p>
            </div>
          </section>

          {/* Sarcasm Detection */}
          <section id="sarcasm-detection" className="space-y-6 scroll-mt-28 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <Smile className="text-purple-600 dark:text-purple-400" size={28} />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sarcasm Detection Explained</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              Sarcasm detection identifies when the literal meaning differs from the intended meaning, often used for irony or mockery.
            </p>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">How It Works</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Our model analyzes linguistic patterns, context clues, and sentiment contradictions to identify sarcastic content. It looks for:</p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 list-disc list-inside ml-2">
                <li>Positive words in negative contexts</li>
                <li>Exaggerated expressions</li>
                <li>Contradictory sentiment indicators</li>
                <li>Cultural and contextual markers</li>
              </ul>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-2xl border border-amber-100 dark:border-amber-800/50">
              <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">Limitations</h3>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                 Sarcasm is highly context-dependent and culturally specific. The model may not catch all instances, especially subtle or culturally nuanced sarcasm. Results should be interpreted with human judgment.
              </p>
            </div>

            <div>
               <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Example Results</h3>
               <div className="bg-slate-100 dark:bg-[#111] p-4 rounded-lg font-mono text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#333]">
                  <p>Comment: "Oh great, another delay. Just what I needed!"</p>
                  <p className="mt-1">Sentiment: Negative (92% confidence)</p>
                  <p>Sarcasm: Detected (87% confidence)</p>
                  <p className="text-slate-500 mt-1">Analysis: Positive words ("great", "needed") in negative context</p>
               </div>
            </div>
          </section>

          {/* Humor Detection */}
          <section id="humor-detection" className="space-y-6 scroll-mt-28 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <Laugh className="text-purple-600 dark:text-purple-400" size={28} />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Humor Detection Explained</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              Humor detection identifies jokes, wordplay, and comedic content in comments and text.
            </p>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Detection Indicators</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 list-disc list-inside ml-2">
                <li>Puns and wordplay</li>
                <li>Unexpected twists or punchlines</li>
                <li>Exaggeration and absurdity</li>
                <li>Cultural references and memes</li>
                <li>Playful language patterns</li>
              </ul>
            </div>

            <div className="bg-purple-100 dark:bg-purple-900/30 p-6 rounded-2xl border border-purple-200 dark:border-purple-800/50">
              <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Confidence Values</h3>
              <p className="text-sm text-purple-800 dark:text-purple-200">
                 Humor confidence scores range from 0-100%. Scores above 70% indicate strong humor signals, while 40-70% suggests subtle or ambiguous humor. Below 40% typically indicates non-humorous content.
              </p>
            </div>
          </section>

          {/* Handling Errors */}
          <section id="handling-errors" className="space-y-6 scroll-mt-28 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-purple-600 dark:text-purple-400" size={28} />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Handling Errors / Failed Uploads</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              Common errors and their solutions to help you troubleshoot issues.
            </p>

            <div className="space-y-4">
                {[
                  { title: "Error: Image Too Large", desc: "Your image exceeds the 5MB size limit.", sol: "Compress your image or reduce its resolution before uploading." },
                  { title: "Error: Unsupported File Format", desc: "The file format is not supported.", sol: "Convert your image to JPG, PNG, or WebP format." },
                  { title: "Error: No Text Detected", desc: "OCR could not find readable text in the image.", sol: "Ensure the image has clear, visible text with good contrast and lighting." },
                  { title: "Error: Request Timeout", desc: "The analysis took too long and timed out.", sol: "Check your internet connection and try again. If the issue persists, try with a smaller image or shorter text." },
                ].map((err, i) => (
                    <div key={i} className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg border-l-4 border-red-500">
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{err.title}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{err.desc}</p>
                        <p className="text-sm text-teal-600 dark:text-teal-400 mt-2 font-medium">Solution: <span className="font-normal text-slate-600 dark:text-slate-400">{err.sol}</span></p>
                    </div>
                ))}
            </div>
          </section>

          {/* Privacy */}
          <section id="privacy-data" className="space-y-6 scroll-mt-28 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="text-purple-600 dark:text-purple-400" size={28} />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Privacy & Data Consent</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              We take your privacy seriously. Here's how we handle your data.
            </p>

            <div className="bg-purple-100 dark:bg-purple-900/30 p-6 rounded-2xl border border-purple-200 dark:border-purple-800/50">
              <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Why We Need Consent</h3>
              <p className="text-sm text-purple-800 dark:text-purple-200">
                 Your consent allows us to process and temporarily store your comments and images for analysis. This helps improve our models and provide better results.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">How Data Is Stored</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 list-disc list-inside ml-2">
                <li>Comments and images are processed in real-time</li>
                <li>Data is encrypted during transmission</li>
                <li>Temporary storage for analysis (deleted after 24 hours)</li>
                <li>No personal information is collected without consent</li>
                <li>Anonymized data may be used for model improvement</li>
              </ul>
            </div>

             <div>
               <h3 className="font-semibold text-slate-900 dark:text-white mb-2">How to Disable Data Collection</h3>
               <p className="text-sm text-slate-600 dark:text-slate-400">
                  You can opt out of data collection in your account settings. Note that this may affect the accuracy of results as the system won't be able to learn from your inputs.
               </p>
            </div>
          </section>

          {/* FAQs */}
          <section id="faqs" className="space-y-6 scroll-mt-28 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="text-purple-600 dark:text-purple-400" size={28} />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-4">
                {[
                    { q: "How accurate is the sentiment analysis?", a: "Our models achieve 85-92% accuracy on standard sentiment analysis. Sarcasm and humor detection are more challenging, with accuracy around 75-80%." },
                    { q: "Can I analyze comments in multiple languages?", a: "Currently, we support Sinhala and English. Support for Tamil and other languages is planned for future updates." },
                    { q: "What's the maximum image size for OCR?", a: "The maximum file size is 5MB. For best results, use images between 1-3MB with clear, high-contrast text." },
                    { q: "How long does analysis take?", a: "Text analysis typically takes 2-3 seconds. Image analysis with OCR may take 5-10 seconds depending on image size and complexity." },
                    { q: "Is my data secure?", a: "Yes. All data is encrypted during transmission and storage. We follow industry-standard security practices and comply with data protection regulations." }
                ].map((faq, i) => (
                    <div key={i} className="bg-slate-100 dark:bg-[#1A1A1A] p-6 rounded-xl border border-slate-200 dark:border-[#333]">
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2">{faq.q}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{faq.a}</p>
                    </div>
                ))}
            </div>
          </section>

          {/* Contact / Support */}
          <section id="contact-support" className="space-y-6 scroll-mt-28 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="text-purple-600 dark:text-purple-400" size={28} />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Contact / Support</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              Need help? Have questions? We're here to assist you.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-100 dark:bg-[#1A1A1A] p-6 rounded-xl border border-slate-200 dark:border-[#333]">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">Email Support</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">For technical issues and general inquiries:</p>
                    <a href="mailto:support@sentimentanalyzer.com" className="text-purple-600 dark:text-purple-400 font-medium hover:underline">support@sentimentanalyzer.com</a>
                </div>
                <div className="bg-slate-100 dark:bg-[#1A1A1A] p-6 rounded-xl border border-slate-200 dark:border-[#333]">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">Response Time</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">We typically respond within 24-48 hours during business days. For urgent issues, please mark your email as "Urgent".</p>
                </div>
            </div>

            <div className="bg-slate-50 dark:bg-[#1A1A1A] p-8 rounded-2xl border border-slate-200 dark:border-[#333]">
                <h3 className="font-bold text-slate-900 dark:text-white mb-6">Submit an Inquiry</h3>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                        <input type="text" placeholder="Your name" className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                        <input type="email" placeholder="your.email@example.com" className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
                        <textarea rows={4} placeholder="Describe your issue or question..." className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 outline-none"></textarea>
                    </div>
                    <Button type="submit" className="mt-2">Submit Inquiry</Button>
                </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
