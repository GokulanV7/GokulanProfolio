import { useState } from 'react';
// import { useTheme } from './ThemeProvider'; // Assuming this is not needed for the chat component itself
import axios from 'axios';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

// IMPORTANT: In a real application, NEVER expose your API key directly in front-end code.
// Use a backend server or serverless function to handle API calls securely.
// For this example, we'll keep it here as instructed, but be aware of the security risk.
const API_KEY = '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'; // Replace with your actual key

const generateResponse = async (prompt: string): Promise<string> => {
  try {
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'llama3-70b-8192', // Or 'llama3-8b-8192'
      messages: [{
        role: 'user',
        content: prompt // The carefully crafted prompt goes here
      }],
      max_tokens: 300, // Keep or adjust as needed
      temperature: 0.7, // You can experiment with temperature (0.5-1.0) for more varied responses, but 0.7 is usually good
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // Basic check for response structure
    if (response.data && response.data.choices && response.data.choices.length > 0 && response.data.choices[0].message) {
       return response.data.choices[0].message.content.trim(); // Trim whitespace
    } else {
       console.error('Unexpected API response structure:', response.data);
       return 'Hmm, I didn\'t get a clear response. Could you try asking that differently?'; // More human-like error
    }

  } catch (error: any) {
    console.error('Error generating response:', error.response?.data || error.message);
    // Provide a more human-friendly error message
    if (error.response && error.response.status === 401) {
         return 'Uh oh, it looks like there\'s an issue with the access key. I can\'t connect right now.';
    } else if (error.response && error.response.status === 429) {
         return 'Looks like things are a bit busy at the moment! Could you give it a minute and try again?';
    }
    return 'Oops! Something went wrong while I was trying to fetch that information. My apologies!'; // Casual error
  }
};

// Keep the portfolio content string the same
const portfolioContent = `ABOUT ME – GOKULAN V

BASIC INFO
Full Name: Gokulan V
Email: gokulanv93@gmail.com
LinkedIn: linkedin.com/in/gokulan-v-40424b293
GitHub: github.com/GokulanV7
Languages Known: English, Tamil
College: Sri Shakthi Institute of Engineering and Technology
Degree: Bachelor of Engineering (Computer Science)
Year: 2023–2027
CGPA: 8.02

SKILLSET OVERVIEW
- Programming Languages: Python, C, Dart
- Mobile Development: Flutter (cross-platform)
- Backend Development: Flask, Django, REST API
- Databases: SQLite, MongoDB
- Version Control: Git, GitHub
- Web Technologies: HTML, CSS, JavaScript
- Automation Tools: n8n
- Web Scraping: Python (BeautifulSoup, Selenium)
- Soft Skills: Teamwork, Problem Solving, Communication, Creativity
- Other Interests: AI/ML, DevOps, IoT Projects, Real-time systems

KEY HIGHLIGHTS
- Specialized in cross-platform mobile app development using Flutter
- Experienced in backend services using Flask and Django
- Capable of designing REST APIs for scalable applications
- Proficient in managing MongoDB and SQLite for app data
- Built apps integrating Firebase for real-time sync
- Passionate about integrating AI/ML features into mobile applications
- Learnt and used n8n for workflow automation and integration
- Actively solving problems on coding portals
- Enjoys contributing to open-source projects on GitHub
- Known for strong UI/UX optimization and collaborative efficiency

PROJECTS
1. Auto Genius (App)
   Role: Developer
   Description: A smart app to deliver current news, job updates, and automobile insights in real-time
   Features:
   - News and job aggregation
   - Built-in search engine
   - Language translation
   - Vehicle feature comparisons
   Tech Stack: Flutter, Python (Flask), MongoDB
   Purpose: To keep users updated and informed with intuitive app experience

2. Falo AI (App)
   Role: AI/Flutter Developer
   Description: Fake news detection application that flags false or harmful information in real-time
   Features:
   - Verifies news authenticity using AI
   - Promotes digital awareness
   - Provides fact-checking results
   Stack: Flutter, LangChain, Python (FastAPI), Groq LLM, HuggingFace, FAISS
   Special Note: Finalist in TruthTell Hackathon (Top 25 in India)

ACHIEVEMENTS
- Top 25 Finalist – National TruthTell Hackathon
    Completed Udemy Flutter Development Course
    Regularly solving problems on college coding platform
    Built multiple production-ready apps
    Designed backend APIs with Flask and deployed them on the cloud
    Created automation flows using n8n to integrate APIs, emails, and social platforms

FLUTTER EXPERIENCE

    Built apps for news aggregation, job search, and AI integration
    Developed UI with Material and Cupertino widgets
    Used Flutter Navigator 2.0 and Riverpod/Provider for state management
    Integrated with Firebase Auth, Firestore, and Cloud Functions
    Optimized performance with lazy loading, caching, and SQLite
    Implemented push notifications and deep linking

BACKEND EXPERIENCE

    Designed and deployed REST APIs using Flask
    Built secure login/signup APIs
    Integrated MongoDB with PyMongo
    Used Flask Blueprints for modular code structure
    Created scheduled tasks with cron and n8n
    Authenticated users using JWT

MACHINE LEARNING / AI / RAG EXPERIENCE

    Currently learning AI/ML
    Integrated AI/ML features in real-time apps
    Used LangChain and Groq LLaMA3 for fact-checking in Falo AI
    Worked on real-time data retrieval using Retrieval-Augmented Generation (RAG)
    Explored sentiment analysis, fake news classification, and keyword extraction
    Using FAISS for semantic similarity and document retrieval
    Interested in computer vision (working on barcode scanner and face recognition)

WEB AUTOMATION & SCRAPING

    Automated website scraping using Python (Selenium, BeautifulSoup)
    Scraped trending news and job listings
    Used n8n for no-code scraping pipelines
    Extracted structured data: Title, Author, Date, URL, Content, Sentiment
    Used data in mobile apps and dashboards

CURRENT INTERESTS

    AI/ML integrations in real-time mobile apps
    Fake news detection systems
    Decentralized automation with n8n
    Flutter + Firebase + Flask stack
    Automation bots for social media and emails
    Visual app builders
    Portfolio website building
    Web3 exploration
    Building tools for social good

IN PROGRESS / FUTURE GOALS

    Build a personal AI assistant with news/URL verification
    Launch a MicroSaaS product targeting foreign clients
    Master FastAPI and deploy to production
    Implement RAG pipelines with local vector databases
    Explore facial recognition and security apps
    Expand Flutter skills with animations and desktop apps
    Publish apps on Play Store
    Contribute to open-source AI tools
    Complete certifications in AI/ML`;

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: Date.now(), text: 'Hey there! I\'m Gokulan\'s AI assistant. Think of me as your guide to his portfolio. What can I help you find today?', sender: 'bot' as const }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message with unique timestamp ID
    const newUserMessage = { id: Date.now(), text: inputValue, sender: 'user' as const };
    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Create conversation context - Keep a short history to maintain flow, maybe last 4-6 turns
      const conversationHistory = messages
        .slice(Math.max(messages.length - 6, 0)) // Keep last 6 messages for context
        .map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
        .join('\n');

      // Refined Prompt for a human-like, casual assistant
      const prompt = `
        You are Gokulan V's personal AI Assistant.
        Your personality is friendly, approachable, conversational, and slightly casual, like a human assistant helping someone.
        Your primary function is to answer questions about Gokulan V using *only* the provided "Portfolio Context".
        Speak in the first person as the assistant ("I", "I'm", "my").
        When referring to Gokulan or his work, use his name ("Gokulan"), pronouns ("he", "him", "his"), or phrases like "in his portfolio", "Gokulan's project".
        Structure your answers clearly using paragraphs and maybe bullet points if listing things like skills or features, but maintain a conversational flow. Avoid overly formal phrasing.
        Use contractions naturally (like I'm, it's, he's).
        Keep responses relatively concise and directly relevant to the question based on the context.
        If the user asks about something NOT mentioned in the "Portfolio Context", politely explain that you can only share information available in Gokulan's portfolio. Phrase it like you're genuinely looking through his details but can't find that specific piece of info. For example: "Hmm, I'm looking through Gokulan's portfolio here, but I don't see details about [the topic]." or "Based on what's in the portfolio, I can tell you about his skills and projects, but I don't have information on [the topic]." Do NOT invent information or speculate.

        ---
        Portfolio Context:
        ${portfolioContent}
        ---

        Conversation History (for context, potentially influencing tone and flow):
        ${conversationHistory}
        ---

        User: ${inputValue}
        Assistant:
      `;

      const responseText = await generateResponse(prompt);
      // Add bot response with unique timestamp ID
      const botResponse = { id: Date.now(), text: responseText, sender: 'bot' as const };
      setMessages(prev => [...prev, botResponse]);

    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      const errorResponse = { 
        id: Date.now(), 
        text: 'Uh oh, something went wrong! Could you try asking again?', 
        sender: 'bot' as const 
      };
      setMessages(prev => [...prev, errorResponse]); // More casual error
    } finally {
      setIsLoading(false);
    }
  };

  // Optional: Scroll to the latest message when messages update
  // You would need a ref for the messages container div and a useEffect hook
  // import { useRef, useEffect } from 'react';
  // const messagesEndRef = useRef(null);
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);


  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-4 mr-2.5">
      {isOpen && (
        <div className="w-80 h-96 rounded-lg shadow-xl overflow-hidden flex flex-col bg-gradient-to-r from-purple-500/20 via-purple-600/20 to-purple-700/20 backdrop-blur-lg border border-purple-500/20">
          {/* Chat header */}
          <div className="p-4 flex justify-between items-center bg-gradient-to-r from-purple-500/15 via-purple-600/15 to-purple-700/15 border-b border-purple-500/20">
            <h3 className="font-semibold text-white">Chat with Gokulan's Assistant</h3> {/* Updated header text */}
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-purple-400"
              aria-label="Close chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-r from-purple-500/10 via-purple-600/10 to-purple-700/10 custom-scrollbar">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {/* Bot Avatar/Icon (Optional) */}
                  {/* {message.sender === 'bot' && (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-500/30 text-white mr-2 text-sm">
                       AI
                    </div>
                  )} */}
                  <div
                    className={`max-w-[75%] p-3 rounded-lg break-words ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-purple-500/30 to-purple-600/30 text-white rounded-br-none'
                        : 'bg-gradient-to-r from-purple-400/20 to-purple-500/20 text-white rounded-bl-none'
                    }`}
                  >
                     {/* Render newlines correctly */}
                     {message.text.split('\n').map((line, index) => (
                        <p key={index} className={index > 0 ? 'mt-2' : ''}>{line}</p>
                     ))}
                  </div>
                   {/* User Avatar/Icon (Optional) */}
                  {/* {message.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-400/30 text-white ml-2 text-sm">
                       You
                    </div>
                  )} */}
                </div>
              ))}
               {/* Optional: Loading indicator */}
               {isLoading && (
                    <div className="flex justify-start">
                         <div className="max-w-xs p-3 rounded-lg bg-gradient-to-r from-purple-400/20 to-purple-500/20 text-white rounded-bl-none text-sm italic">
                              ...thinking
                         </div>
                    </div>
               )}
              {/* <div ref={messagesEndRef} /> Optional: for auto-scrolling */}
            </div>
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-purple-500/20">
            <div className="flex space-x-2 items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isLoading ? 'Getting that for you...' : 'Ask me about Gokulan...'} // Hint while loading
                className="flex-1 p-2 rounded-lg bg-gradient-to-r from-purple-50/10 to-purple-600/10 border border-purple-500/20 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
                autoComplete="off"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500/50 to-purple-600/50 text-white hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !inputValue.trim()}
                aria-label="Send message"
              >
                 {isLoading ? (
                     <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2.001-2.647z"></path>
                     </svg>
                 ) : (
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                         <line x1="22" y1="2" x2="11" y2="13"></line>
                         <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                     </svg>
                 )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Chat toggle button */}
      {!isOpen && ( // Only show button when chat is closed
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-full p-4 bg-gradient-to-r from-purple-500/30 via-purple-600/30 to-purple-700/30 backdrop-blur-sm hover:from-purple-600/40 hover:via-purple-700/40 hover:to-purple-800/40 text-white shadow-lg hover:scale-110 transition-all duration-200"
          aria-label="Open chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      )}
    </div>
  );
}