import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  MessageSquare, 
  Zap, 
  Play, 
  BarChart2, 
  Eye, 
  Image as ImageIcon, 
  Smile, 
  Cpu, 
  Shield, 
  Clock, 
  CheckCircle2,
  ArrowRight,
  Menu,
  X,
  Quote,
  Upload,
  Search,
  Globe,
  Sun,
  Moon
} from 'lucide-react';

export const Landing: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check initial preference
    if (document.documentElement.classList.contains('dark')) {
      setDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans selection:bg-purple-500 selection:text-white">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-purple-600 p-1.5 rounded-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">CordForge</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400 transition-colors">How it Works</a>
              <a href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400 transition-colors">Testimonials</a>
              
              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                aria-label="Toggle Theme"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <div className="flex items-center space-x-4 ml-4">
                <Link to="/login" className="text-sm font-medium text-slate-900 dark:text-white hover:text-purple-600 transition-colors">Log in</Link>
                <Link to="/register" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all transform hover:-translate-y-0.5">
                  Get Started
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button & Theme Toggle */}
            <div className="md:hidden flex items-center gap-4">
              <button 
                onClick={toggleTheme} 
                className="p-2 text-slate-600 dark:text-slate-300"
                aria-label="Toggle Theme"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600 dark:text-slate-300">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 absolute w-full">
            <div className="px-4 pt-2 pb-6 space-y-2 shadow-lg">
              <a href="#features" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md">Features</a>
              <a href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md">How it Works</a>
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md">Log in</Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block w-full text-center mt-4 bg-purple-600 text-white px-5 py-3 rounded-lg font-semibold">Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-lighten animate-blob"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-lighten animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-1/2 w-72 h-72 bg-pink-500/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-lighten animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 dark:bg-purple-900/20 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-sm font-medium mb-8">
            <Zap size={16} className="fill-current" />
            <span>Advanced AI-Powered Analysis</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
            AI-Powered Sarcasm, <br className="hidden md:block"/>
            Humor & Sentiment <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500">Analysis</span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
            Analyze Sinhala text and images using advanced NLP, OCR, and object detection technologies. Understand sentiment with context.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all transform hover:-translate-y-1">
              Start Analyzing
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-8 py-4 flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 rounded-full font-semibold text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
              <Play size={20} className="fill-current" />
              Try Demo
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto border-t border-slate-200 dark:border-slate-800 pt-12">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-1">98.5%</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Accuracy</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-1">10K+</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Comments Analyzed</div>
            </div>
            <div className="col-span-2 md:col-span-1">
              <div className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-1">&lt;200ms</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Response Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Powerful Features */}
      <section id="features" className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Powerful Features</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">Everything you need for comprehensive sentiment analysis</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {[
              { icon: MessageSquare, title: "Sentiment Analysis", desc: "Accurate sentiment classification for Sinhala text with positive, neutral, and negative detection." },
              { icon: Zap, title: "Sarcasm Detection", desc: "Advanced transformer-based models identify sarcastic tones with contextual understanding." },
              { icon: Smile, title: "Humor Classification", desc: "Machine learning algorithms detect and classify different types of humorous content." },
              { icon: ImageIcon, title: "OCR Text Extraction", desc: "Extract Sinhala text from images using state-of-the-art optical character recognition." },
              { icon: Eye, title: "Object Detection", desc: "Identify objects in images to provide contextual clues for better sentiment analysis." },
              { icon: BarChart2, title: "Real-time Dashboard", desc: "Monitor system performance, model accuracy, and analyze trends with comprehensive analytics." }
            ].map((feature, i) => (
              <div key={i} className="group p-2">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">Simple four-step process from upload to insights</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-slate-200 dark:bg-slate-700 -z-10"></div>
            
            {[
              { icon: Upload, title: "Upload", desc: "Submit content or images" },
              { icon: Cpu, title: "AI Processing", desc: "Models analyze content" },
              { icon: Zap, title: "Get Results", desc: "View detailed analysis" },
              { icon: BarChart2, title: "Explore Insights", desc: "Data visualization" }
            ].map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm absolute -top-4 -right-2 z-10 border-4 border-slate-50 dark:border-slate-900 shadow-sm">
                  {i + 1}
                </div>
                <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6 group hover:-translate-y-2 transition-transform duration-300">
                  <step.icon size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{step.desc}</p>
                
                {i < 3 && <div className="md:hidden mt-8 text-slate-300 dark:text-slate-600"><ArrowRight className="rotate-90 md:rotate-0" /></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* See It In Action (Screenshots) */}
      <section className="py-24 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">See It In Action</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">Explore our intuitive interface and powerful analytics</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
             {[
               { title: "Interactive Dashboard", desc: "Comprehensive analytics and real-time monitoring", color: "bg-indigo-900" },
               { title: "Analysis Results", desc: "Detailed sentiment, sarcasm, and humor detection", color: "bg-slate-800" },
               { title: "Admin Monitoring", desc: "System performance and model accuracy tracking", color: "bg-purple-900" }
             ].map((item, i) => (
               <div key={i} className="group">
                  <div className={`aspect-video rounded-xl ${item.color} shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden relative mb-6 hover:shadow-purple-500/20 transition-all`}>
                      {/* Fake UI Elements for Screenshot */}
                      <div className="absolute top-0 w-full h-8 bg-black/20 flex items-center px-4 space-x-2">
                        <div className="w-2 h-2 rounded-full bg-red-400"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-50 group-hover:opacity-75 transition-opacity">
                        <ImageIcon size={48} className="text-white" />
                      </div>
                  </div>
                  <div className="text-center px-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our System */}
      <section className="py-24 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Why Choose Our System</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Globe, title: "Sinhala Language Expertise", desc: "Specialized models trained specifically for Sinhala text with cultural context understanding." },
              { icon: Shield, title: "Research-Backed", desc: "Built on academic research with rigorous testing and validation methodologies." },
              { icon: Clock, title: "Fast & Accurate", desc: "Sub-200ms response times with 98.5% accuracy across all detection models." }
            ].map((item, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 mx-auto bg-purple-600 rounded-2xl flex items-center justify-center text-white mb-6 transform rotate-3 hover:rotate-6 transition-transform">
                  <item.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">What People Say</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">Feedback from researchers and users</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                text: "This system has revolutionized how we understand sentiment in Sinhala social media comments. The sarcasm detection is remarkably accurate.",
                author: "Dr. Priya Wickramasinghe",
                role: "Senior Lecturer, Computer Science"
              },
              { 
                text: "The combination of NLP and computer vision provides context that traditional sentiment analysis misses. Impressive research work.",
                author: "Prof. Rajesh Kumar",
                role: "AI Research Lead"
              },
              { 
                text: "As a data analyst, the dashboard and monitoring tools make it easy to track model performance and understand trends in real-time.",
                author: "Amara Silva",
                role: "Data Analyst"
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl relative">
                <Quote className="text-purple-200 dark:text-purple-900/50 w-12 h-12 mb-4" />
                <p className="text-slate-700 dark:text-slate-300 mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{testimonial.author}</div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900 dark:bg-black">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-blue-900/50"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-slate-300 mb-10">Join researchers and analysts using our platform for advanced sentiment analysis</p>
          <Link to="/register" className="inline-block bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-100 transition-colors">
            Start Analyzing Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-900 pt-16 pb-8 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-purple-600 p-1.5 rounded-lg">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-900 dark:text-white">CordForge</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Advanced AI-powered sentiment analysis for Sinhala text with sarcasm and humor detection.
              </p>
              <a href="mailto:contact@cordforge.com" className="inline-flex items-center text-sm text-slate-600 dark:text-slate-400 mt-4 hover:text-purple-600">
                <div className="mr-2">✉️</div> contact@cordforge.com
              </a>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-purple-600">Features</a></li>
                <li><a href="#" className="hover:text-purple-600">How It Works</a></li>
                <li><a href="#" className="hover:text-purple-600">Pricing</a></li>
                <li><a href="#" className="hover:text-purple-600">Demo</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-purple-600">About</a></li>
                <li><a href="#" className="hover:text-purple-600">Team</a></li>
                <li><a href="#" className="hover:text-purple-600">Contact</a></li>
                <li><a href="#" className="hover:text-purple-600">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-purple-600">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-purple-600">Terms of Service</a></li>
                <li><a href="#" className="hover:text-purple-600">Data Consent</a></li>
                <li><a href="#" className="hover:text-purple-600">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p>© 2024 CordForge. Academic Research Project. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-slate-900 dark:hover:text-white">Privacy</a>
              <a href="#" className="hover:text-slate-900 dark:hover:text-white">Terms</a>
              <a href="#" className="hover:text-slate-900 dark:hover:text-white">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};