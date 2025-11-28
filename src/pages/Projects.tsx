import { motion } from 'framer-motion';
import ProjectCard from '@/components/ProjectCard';

const Projects = () => {
    const projects = [
        {
            title: "La Patisserie - Full-Stack E-Commerce",
            description: "A modern online ordering platform for a bakery featuring handcrafted desserts. Complete e-commerce solution with secure payments, delivery/pickup options, loyalty rewards, and real-time order tracking.",
            technologies: ["React", "Node.js", "Express", "MongoDB", "Stripe", "Full-Stack"],
            image: "/la-pat.png",
            github: "https://github.com/GokulanV7/La_Patisserie-FullStack-",
            demo: "https://lapatisserie.shop/",
        },
        {
            title: "Falo - AI Misinformation Detection",
            description: "An intelligent guardian against misinformation. Detects fake news with 95%+ accuracy using advanced ML algorithms and NLP. Features voice intelligence and real-time verification.",
            technologies: ["Flutter", "Python", "FastAPI", "Machine Learning", "NLP"],
            image: "https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=800&q=80",
            github: "https://github.com/GokulanV7/Falo-app",
            demo: "https://github.com/GokulanV7/Falo-app",
        },
        {
            title: "SmartGeni - AI Knowledge Assistant",
            description: "An intelligent AI assistant that provides accurate answers by integrating Groq's LLaMA models with DuckDuckGo web search and YouTube video search for comprehensive responses.",
            technologies: ["React", "FastAPI", "Groq AI", "DuckDuckGo", "YouTube API"],
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
            github: "https://github.com/GokulanV7/SmartGenei",
        },
        {
            title: "SimboAgent - AI Social Media Assistant",
            description: "A modern Flutter mobile app featuring an AI assistant that generates and posts content to social media platforms like LinkedIn and Twitter using Gemini AI.",
            technologies: ["Flutter", "Dart", "Gemini AI", "n8n", "Provider"],
            image: "https://images.unsplash.com/photo-1683721003111-070bcc053d8b?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c29jaWFsJTIwbWVkaWF8ZW58MHx8MHx8fDA%3D",
            github: "https://github.com/GokulanV7/simboAgent",
        },
        {
            title: "DocuAgent - AI Document Analysis",
            description: "A full-stack platform allowing users to upload documents and chat with an AI assistant. Features RAG pipeline for analyzing PDFs, DOCX, and CSV files.",
            technologies: ["React", "TypeScript", "FastAPI", "LangChain", "ChromaDB"],
            image: "https://plus.unsplash.com/premium_vector-1745327645447-37b123404462?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE2fHx8ZW58MHx8fHx8",
            github: "https://github.com/GokulanV7/DocuAgent",
        },
        {
            title: "Intelligent Complaint RAG System",
            description: "AI-powered pipeline for processing and managing citizen complaints. Automatically extracts content, classifies urgency, and routes to departments using Gemini 2.0.",
            technologies: ["Python", "FastAPI", "Streamlit", "Gemini API", "ChromaDB"],
            image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
            github: "https://github.com/GokulanV7/gov-portal",
        },
        {
            title: "TamilWeb - Modern Web Solutions",
            description: "A modern web development platform for students and entrepreneurs. Features an AI chatbot powered by Groq and high-performance Next.js architecture.",
            technologies: ["React", "Next.js", "Tailwind CSS", "Groq AI", "Framer Motion"],
            image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
            github: "https://github.com/GokulanV7/TamilWeb1",
            demo: "https://tamilweb.dev",
        }
    ];

    return (
        <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center max-w-2xl mx-auto mb-8 md:mb-16"
            >
                <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-3 md:mb-4">Featured Projects</h1>
                <p className="text-sm md:text-base text-gray-600">
                    A collection of my recent work in AI, Mobile Development, and Full Stack Engineering.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {projects.map((project, index) => (
                    <ProjectCard
                        key={index}
                        index={index}
                        {...project}
                    />
                ))}
            </div>
        </div>
    );
};

export default Projects;
