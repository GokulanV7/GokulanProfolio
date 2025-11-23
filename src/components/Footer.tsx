import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-50 border-t border-gray-100 py-12">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-6 md:mb-0">
                        <h3 className="text-xl font-bold tracking-tighter mb-2">Gokulan V</h3>
                        <p className="text-gray-500 text-sm">
                            Flutter Developer & ML Specialist
                        </p>
                    </div>

                    <div className="flex space-x-6">
                        <a
                            href="https://github.com/GokulanV7"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-black transition-colors"
                        >
                            <Github size={20} />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/gokulan-v-40424b293/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-black transition-colors"
                        >
                            <Linkedin size={20} />
                        </a>
                        <a
                            href="mailto:gokulhope97@gmail.com"
                            className="text-gray-400 hover:text-black transition-colors"
                        >
                            <Mail size={20} />
                        </a>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-400">
                    <p>© {new Date().getFullYear()} Gokulan V. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
