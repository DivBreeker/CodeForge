
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { PublicHeader } from '../../components/PublicHeader';
import { PublicFooter } from '../../components/PublicFooter';
import { 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  User, 
  Database, 
  Brain, 
  Image, 
  Lock, 
  AlertTriangle, 
  Scale, 
  Shield, 
  AlertCircle, 
  XOctagon, 
  Mail 
} from 'lucide-react';

export const TermsAndConditions: React.FC = () => {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState<string | null>('intro');
  const [agreed, setAgreed] = useState(false);

  // Content Sections
  const sections = [
    {
      id: 'intro',
      title: 'Introduction',
      icon: FileText,
      content: 'Welcome to CordForge Sentiment Analyzer. These Terms and Conditions govern your use of our website and services. By accessing or using our platform, you agree to be bound by these terms. Our service uses advanced AI to analyze sentiment, sarcasm, and humor in Sinhala social media comments.'
    },
    {
      id: 'account',
      title: 'Account Responsibilities',
      icon: User,
      content: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and complete information during registration and to update such information to keep it accurate, current, and complete.'
    },
    {
      id: 'data',
      title: 'Data Usage & Storage Policy',
      icon: Database,
      content: 'We collect and store text and images you upload solely for the purpose of providing analysis results. Your data is stored securely using industry-standard encryption. We do not sell your personal data to third parties. We may retain anonymized analysis metadata for system performance monitoring.'
    },
    {
      id: 'ml-consent',
      title: 'Consent for Machine Learning Training',
      icon: Brain,
      content: 'By using our services, you grant us a non-exclusive, royalty-free license to use anonymized versions of the text and images you upload to train and improve our machine learning models (Sentiment, Sarcasm, Humor, OCR, and Object Detection). This helps us enhance accuracy for the Sinhala language community.'
    },
    {
      id: 'processing',
      title: 'Image & Comment Processing Rules',
      icon: Image,
      content: 'You agree not to upload content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable. Our OCR and Object Detection systems process images automatically; however, we reserve the right to remove content that violates these rules.'
    },
    {
      id: 'privacy',
      title: 'Privacy & Confidentiality',
      icon: Lock,
      content: 'Your privacy is paramount. Personal Identifiable Information (PII) detected in uploads will be handled in accordance with our Privacy Policy. We implement strict access controls to ensure only authorized personnel and automated systems process your data.'
    },
    {
      id: 'limitations',
      title: 'Limitations of Detection Models',
      icon: AlertTriangle,
      content: 'Our AI models are provided "as is". While we strive for high accuracy (98.5%), we do not guarantee that the sentiment, sarcasm, or humor detection will be 100% correct in every instance. Contextual nuances in Sinhala may occasionally result in misclassification.'
    },
    {
      id: 'rights',
      title: 'User Rights',
      icon: Scale,
      content: 'You retain ownership of the original content you upload. You have the right to request the deletion of your account and associated data at any time through your profile settings or by contacting support.'
    },
    {
      id: 'security',
      title: 'Security Measures',
      icon: Shield,
      content: 'We employ robust security measures including SSL/TLS encryption for data in transit and AES-256 encryption for data at rest. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.'
    },
    {
      id: 'disclaimers',
      title: 'Disclaimers',
      icon: AlertCircle,
      content: 'To the fullest extent permitted by law, CordForge disclaims all warranties, express or implied. We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.'
    },
    {
      id: 'termination',
      title: 'Termination Rules',
      icon: XOctagon,
      content: 'We verify users and monitor usage patterns. We reserve the right to suspend or terminate your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.'
    },
    {
      id: 'contact',
      title: 'Contact Information',
      icon: Mail,
      content: 'If you have any questions about these Terms, please contact us at support@cordforge.com or via the Help Guide section in your dashboard.'
    }
  ];

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const handleAccept = () => {
    if (agreed) {
        // In a real app, save consent to user profile or local storage
        navigate(-1); // Go back to previous page
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-black transition-colors duration-300 font-sans flex flex-col">
      
      {/* Top Bar */}
      <PublicHeader />

      <main className="flex-grow pt-24 pb-20 max-w-4xl mx-auto px-6 w-full">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Terms & Conditions</h1>
        
        {/* Accordion Sections */}
        <div className="space-y-4">
            {sections.map((section) => (
                <div 
                    key={section.id}
                    className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-200"
                >
                    <button 
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
                                <section.icon size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white text-lg">{section.title}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    {openSection === section.id ? 'Click to collapse' : 'Click to expand details'}
                                </p>
                            </div>
                        </div>
                        {openSection === section.id ? 
                            <ChevronUp className="text-slate-400" /> : 
                            <ChevronDown className="text-slate-400" />
                        }
                    </button>
                    
                    {openSection === section.id && (
                        <div className="px-6 pb-6 pt-0 animate-fade-in">
                            <div className="border-t border-slate-100 dark:border-slate-800 my-4"></div>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                {section.content}
                            </p>
                        </div>
                    )}
                </div>
            ))}
        </div>

        {/* Consent Section */}
        <div className="mt-12 bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Consent Agreement</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                I have read and understood the Terms & Conditions. I consent to the processing of my text and images for sentiment, sarcasm, humor detection, OCR, and object detection. I agree to the storage of my data as outlined above.
            </p>

            <div className="flex items-center mb-8">
                <input
                    id="consent-checkbox"
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-5 h-5 text-slate-900 dark:text-white border-slate-300 rounded focus:ring-slate-900 dark:focus:ring-white cursor-pointer"
                />
                <label htmlFor="consent-checkbox" className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                    I agree to the terms and conditions stated above
                </label>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <Button 
                    onClick={handleAccept} 
                    disabled={!agreed}
                    className="w-full py-4 text-base"
                >
                    Accept & Continue
                </Button>
                <Button 
                    variant="secondary" 
                    onClick={() => navigate('/')}
                    className="w-full py-4 text-base bg-white dark:bg-black border border-slate-200 dark:border-slate-800"
                >
                    Decline
                </Button>
            </div>
            
            <p className="text-center text-xs text-slate-400 mt-4">
                Please read all sections above before accepting
            </p>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};
