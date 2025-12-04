
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { PublicHeader } from '../../components/PublicHeader';
import { PublicFooter } from '../../components/PublicFooter';
import { 
  Mail, 
  MapPin, 
  Phone, 
  Send, 
  CheckCircle,
} from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black transition-colors duration-300 font-sans flex flex-col">
      
      {/* Navigation */}
      <PublicHeader />

      {/* Main Content */}
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Get in Touch</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Have questions about our sentiment analysis platform? We're here to help you get the most out of CordForge.
            </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Contact Info */}
            <div className="space-y-8">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Contact Information</h3>
                    
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-900 dark:text-white">Email Us</h4>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">For general inquiries and support</p>
                                <a href="mailto:contact@cordforge.com" className="text-purple-600 dark:text-purple-400 font-medium hover:underline">contact@cordforge.com</a>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-900 dark:text-white">Office Location</h4>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">
                                    123 Research Avenue, Tech District,<br />
                                    Colombo 07, Sri Lanka
                                </p>
                            </div>
                        </div>

                         <div className="flex items-start gap-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-900 dark:text-white">Call Us</h4>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Mon-Fri from 8am to 5pm</p>
                                <a href="tel:+94112345678" className="text-slate-700 dark:text-slate-300 font-medium hover:text-purple-600">+94 11 234 5678</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-100 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">Technical Support</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        Already a user? Check our comprehensive Help Guide for tutorials and troubleshooting.
                    </p>
                    <Link to="/login">
                        <Button variant="secondary" size="sm" className="w-full bg-white dark:bg-slate-800">Go to Help Guide</Button>
                    </Link>
                </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg">
                    {submitted ? (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 animate-fade-in">
                                <CheckCircle size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Message Sent!</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
                                Thank you for contacting us. We have received your message and will get back to you within 24-48 hours.
                            </p>
                            <Button onClick={() => setSubmitted(false)} variant="secondary">Send Another Message</Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Send us a Message</h3>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Your Name</label>
                                    <input 
                                        type="text" 
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 outline-none text-slate-900 dark:text-white transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 outline-none text-slate-900 dark:text-white transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subject</label>
                                <input 
                                    type="text" 
                                    name="subject"
                                    required
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 outline-none text-slate-900 dark:text-white transition-all"
                                    placeholder="How can we help?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
                                <textarea 
                                    name="message"
                                    rows={6}
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 outline-none text-slate-900 dark:text-white transition-all resize-none"
                                    placeholder="Tell us more about your inquiry..."
                                ></textarea>
                            </div>

                            <Button type="submit" isLoading={loading} size="lg" className="w-full md:w-auto px-8">
                                <Send className="mr-2 h-5 w-5" />
                                Send Message
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};
