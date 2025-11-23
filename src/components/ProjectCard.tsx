import { Github, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProjectCardProps {
    title: string;
    description: string;
    technologies: string[];
    image: string;
    github?: string;
    demo?: string;
    index: number;
}

const ProjectCard = ({ title, description, technologies, image, github, demo, index }: ProjectCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-black/10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
        >
            <div className="relative aspect-video overflow-hidden bg-gray-100">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
                    {github && (
                        <a
                            href={github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-white rounded-full hover:bg-black hover:text-white transition-all transform hover:scale-110"
                            title="View Code"
                        >
                            <Github size={20} />
                        </a>
                    )}
                    {demo && (
                        <a
                            href={demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-white rounded-full hover:bg-black hover:text-white transition-all transform hover:scale-110"
                            title="Live Demo"
                        >
                            <ExternalLink size={20} />
                        </a>
                    )}
                </div>
            </div>

            <div className="p-5 md:p-6">
                <h3 className="text-lg md:text-xl font-bold mb-2 group-hover:text-black transition-colors">{title}</h3>
                <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4 line-clamp-2">{description}</p>

                <div className="flex flex-wrap gap-1.5 md:gap-2">
                    {technologies.map((tech) => (
                        <span
                            key={tech}
                            className="px-3 py-1 bg-gray-50 text-xs font-medium text-gray-600 rounded-full border border-gray-100 group-hover:border-gray-200 transition-colors"
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectCard;
