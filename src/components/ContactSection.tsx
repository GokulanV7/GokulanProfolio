import { Github, Linkedin, Mail, Phone, FileText, Send } from 'lucide-react';
import { useTheme } from './ThemeProvider'; // Keep one import
import { useState } from 'react'; // Keep one import
import ParallaxSection from './ParallaxSection'; // Keep one import
import { downloadResume } from '../utils/downloadUtils'; // Keep one import
import emailjs from '@emailjs/browser'; // Keep one import

// EmailJS configuration
// It's good practice to store these in environment variables,
// but for this correction, I'll leave them as is.
const EMAILJS_PUBLIC_KEY = 'B1Ua6b8iEPmQu3fHM';
const EMAILJS_SERVICE_ID = 'service_fdg4s29';
const EMAILJS_TEMPLATE_ID = 'template_u8kd609';

// Note: The global declaration for window.emailjs is not strictly necessary
// if you are consistently using the imported 'emailjs' object from '@emailjs/browser'.
// The package itself should provide the necessary typings.
// I've removed it as it's not being directly used by the imported module.

const ContactSection = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null); // For inline error messages

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false); // Reset success state
    setError(null); // Reset error state

    const form = e.currentTarget;
    const formData = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };

    // Basic client-side validation (optional, but good practice)
    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      // Initialize EmailJS (Consider calling this once in your app's entry point if preferred)
      // emailjs.init(EMAILJS_PUBLIC_KEY); // This is fine here for simplicity for now

      const templateParams = {
        from_name: formData.name, // Use 'from_name' as commonly expected by EmailJS templates
        from_email: formData.email, // Use 'from_email'
        to_name: 'Gokulan V', // Or your name
        message: formData.message,
        reply_to: formData.email, // EmailJS will use this for the "Reply-To" header
        // 'title' and 'time' might not be standard EmailJS template params unless you've set them up.
        // Adjust templateParams based on your EmailJS template.
      };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY // Pass public key here if not initialized globally
      );

      console.log('Email sent successfully');
      setSuccess(true);
      form.reset();
      // The inline success message will be displayed, no need for an alert.

    } catch (err: any) {
      console.error('Error sending email:', err);
      let errorMessage = 'Failed to send email. Please try again later.';
      if (err && typeof err.text === 'string') {
        errorMessage = err.text; // EmailJS often returns error details in err.text
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      // alert(errorMessage); // Replaced by inline error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 relative overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ParallaxSection speed={0.05}>
          <h2 className={`text-4xl font-bold mb-2 text-center ${theme === 'dark' ? 'text-gradient' : 'text-gradient-light'}`}>
            Get In Touch
          </h2>
          {/* Corrected the paragraph structure below */}
          <p className={`text-center mb-12 max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Feel free to reach out to me for collaboration, opportunities, or just to say hello!
          </p>
        </ParallaxSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <ParallaxSection speed={0.1} className="w-full">
            <div className={`p-8 rounded-xl ${theme === 'dark' ? 'glass-effect-dark' : 'glass-effect-light'}`}>
              <h3 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Contact Form
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name" // Added name attribute
                    className={`mt-1 w-full px-4 py-2 rounded-md ${theme === 'dark' ?
                      'bg-gray-800 border-gray-700 text-white focus:border-purple-500' :
                      'bg-white border-gray-300 text-gray-900 focus:border-purple-500'}
                      focus:outline-none focus:ring-1 focus:ring-purple-500`}
                    placeholder="Your name"
                    required // Added required attribute
                  />
                </div>

                <div>
                  <label htmlFor="email" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email" // Added name attribute
                    className={`mt-1 w-full px-4 py-2 rounded-md ${theme === 'dark' ?
                      'bg-gray-800 border-gray-700 text-white focus:border-purple-500' :
                      'bg-white border-gray-300 text-gray-900 focus:border-purple-500'}
                      focus:outline-none focus:ring-1 focus:ring-purple-500`}
                    placeholder="Your email"
                    required // Added required attribute
                  />
                </div>

                <div>
                  <label htmlFor="message" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message" // Added name attribute
                    rows={5}
                    className={`mt-1 w-full px-4 py-2 rounded-md ${theme === 'dark' ?
                      'bg-gray-800 border-gray-700 text-white focus:border-purple-500' :
                      'bg-white border-gray-300 text-gray-900 focus:border-purple-500'}
                      focus:outline-none focus:ring-1 focus:ring-purple-500`}
                    placeholder="Your message"
                    required // Added required attribute
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center justify-center gap-2 w-full py-3 rounded-lg ${theme === 'dark' ?
                    'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' :
                    'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'}
                    text-white font-semibold transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </button>

                {success && (
                  <div className="mt-4 p-3 rounded-lg bg-green-500/20 text-green-300 border border-green-500/30 text-sm">
                    Message sent successfully! I'll get back to you soon.
                  </div>
                )}
                {error && (
                  <div className="mt-4 p-3 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 text-sm">
                    {error}
                  </div>
                )}
              </form>
            </div>
          </ParallaxSection>

          <ParallaxSection speed={0.15} className="w-full space-y-8">
            <div className={`p-8 rounded-xl ${theme === 'dark' ? 'glass-effect-dark' : 'glass-effect-light'}`}>
              <h3 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Contact Information
              </h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <Mail className={theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} />
                  </div>
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Email
                    </p>
                    <a
                      href="mailto:gokulhope97@gmail.com"
                      className={`font-medium ${theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-800'}`}
                    >
                      gokulhope97@gmail.com
                    </a>
                  </div>
                </li>

                <li className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <Phone className={theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} />
                  </div>
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Phone
                    </p>
                    <a
                      href="tel:+919361620860"
                      className={`font-medium ${theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-800'}`}
                    >
                      +91 93616 20860
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg text-lg ${theme === 'dark' ? 'bg-gray-800 text-purple-400' : 'bg-gray-100 text-purple-600'}`}>
                    📍
                  </div>
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Location
                    </p>
                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Shri Shakthi College, Coimbatore {/* Make sure this is the intended display */}
                    </p>
                  </div>
                </li>
              </ul>

              <div className="mt-8">
                <p className={`font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Connect with me
                </p>
                <div className="flex space-x-4">
                  <a
                    href="https://github.com/GokulanV7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                    aria-label="GitHub Profile"
                  >
                    <Github className={theme === 'dark' ? 'text-white' : 'text-gray-900'} />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/gokulan-v-40424b293/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                    aria-label="LinkedIn Profile"
                  >
                    <Linkedin className={theme === 'dark' ? 'text-white' : 'text-gray-900'} />
                  </a>
                  <a
                    href="mailto:gokulhope97@gmail.com"
                    className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                    aria-label="Email"
                  >
                    <Mail className={theme === 'dark' ? 'text-white' : 'text-gray-900'} />
                  </a>
                </div>
              </div>
            </div>

            <div className={`p-8 rounded-xl ${theme === 'dark' ? 'glass-effect-dark' : 'glass-effect-light'}`}>
              <h3 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                My Resume
              </h3>
              <div className="group relative">
                {/* Resume Preview Card */}
                <div className={`relative overflow-hidden rounded-lg border-0 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} transition-all duration-300 hover:shadow-lg hover:-translate-y-1 w-full max-w-xs mx-auto`}>
                  {/* Preview Image */}
                  <div className="relative w-full h-64 overflow-hidden">
                    <img 
                      src="/preview.png" 
                      alt="Resume Preview" 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <div className="w-full">
                        <h4 className="text-white font-semibold text-lg">Gokulan V</h4>
                        <p className="text-gray-200 text-sm">Flutter and React Developer</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Preview Content */}
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Professional Resume</h4>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Updated: June 2024</p>
                      </div>
                      <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <FileText className={theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} size={20} />
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
                      Flutter
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                        Web Development
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-pink-900/50 text-pink-300' : 'bg-pink-100 text-pink-700'}`}>
                      AIML
                      </span>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        downloadResume();
                      }}
                      className={`mt-4 w-full py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                        theme === 'dark' 
                          ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                          : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                      }`}
                    >
                      <FileText size={16} />
                      Download Resume
                    </button>
                  </div>
                </div>
                
                {/* Quick View Button */}
                <button
                  onClick={() => window.open('/GOKULANV.pdf', '_blank', 'noopener,noreferrer')}
                  className={`mt-3 text-sm w-full text-center ${
                    theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-800'
                  }`}
                >
                  Quick View
                </button>
              </div>
            </div>
          </ParallaxSection>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600"></div>
    </section>
  );
};

export default ContactSection;