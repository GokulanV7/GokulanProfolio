import { Link } from 'react-router-dom';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <div className="container mx-auto px-4 md:px-6">
            <section className="min-h-[80vh] flex flex-col md:flex-row items-center justify-between gap-8 md:gap-8 pb-12 pt-8 md:pt-0">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, staggerChildren: 0.1 }}
                    className="flex-1 space-y-6 md:space-y-8 md:pr-8 md:-mt-16 w-full"
                >
                    <div className="space-y-3 md:space-y-4">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg md:text-xl font-medium text-gray-500"
                        >
                            Hello, I'm
                        </motion.h2>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter text-black"
                        >
                            Gokulan V
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-base sm:text-lg md:text-2xl text-gray-600 max-w-xl leading-relaxed"
                        >
                            Developing innovative web applications and integrating cutting-edge <span className="bg-black text-white px-2 py-1 rounded-md mx-1 inline-block">AI</span> technologies. Building real-world <span className="bg-black text-white px-2 py-1 rounded-md mx-1 inline-block">Agentic AI</span> solutions with LangChain, CrewAI, smolagents, and custom frameworks.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-wrap gap-3 md:gap-4"
                    >
                        <Link
                            to="/projects"
                            className="px-6 md:px-8 py-2.5 md:py-3 bg-black text-white rounded-full text-sm md:text-base font-medium hover:bg-gray-800 transition-all hover:px-10 flex items-center gap-2"
                        >
                            View Work <ArrowRight size={18} />
                        </Link>
                        <Link
                            to="/contact"
                            className="px-6 md:px-8 py-2.5 md:py-3 border border-gray-200 rounded-full text-sm md:text-base font-medium hover:border-black transition-colors"
                        >
                            Contact Me
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex gap-6 pt-4"
                    >
                        <a href="https://github.com/GokulanV7" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black transition-colors hover:scale-110 transform">
                            <Github size={24} />
                        </a>
                        <a href="https://www.linkedin.com/in/gokulan-v-40424b293/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black transition-colors hover:scale-110 transform">
                            <Linkedin size={24} />
                        </a>
                        <a href="mailto:gokulhope97@gmail.com" className="text-gray-400 hover:text-black transition-colors hover:scale-110 transform">
                            <Mail size={24} />
                        </a>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex-1 relative w-full md:w-auto"
                >
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="relative w-full max-w-sm md:max-w-md mx-auto pb-8 md:pb-20 md:-mt-32"
                    >
                        <video
                            src="/Generated File November 23, 2025 - 4_46PM.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-contain"
                        />
                    </motion.div>
                </motion.div>
            </section>
        </div>
    );
};

export default Home;
