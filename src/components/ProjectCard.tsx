
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import ParallaxSection from './ParallaxSection';
import { useTheme } from './ThemeProvider';
import { Github, ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  image?: string;
  github?: string;
  demo?: string;
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  title, 
  description, 
  technologies, 
  image = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80", 
  github,
  demo,
  className 
}) => {
  const { theme } = useTheme();
  
  return (
    <ParallaxSection speed={0.05}>
      <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${theme === 'dark' ? 
        'bg-gray-900/50 backdrop-blur-sm border-gray-800 hover:border-purple-500/50 hover:shadow-purple-500/10' : 
        'bg-white/80 backdrop-blur-sm border-gray-200 hover:border-purple-400/50 hover:shadow-purple-400/10'}`}>
        <div className="h-52 overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
          />
        </div>
        
        <CardHeader>
          <CardTitle className={theme === 'dark' ? 'text-gradient' : 'text-gradient-light'}>
            {title}
          </CardTitle>
          <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
            {description}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-wrap gap-2 mt-2">
            {technologies.map((tech) => (
              <span 
                key={tech} 
                className={`px-2 py-1 text-xs rounded-full ${theme === 'dark' ? 
                  'bg-purple-900/30 text-purple-300 border border-purple-700/30' : 
                  'bg-purple-100 text-purple-700 border border-purple-200'}`}
              >
                {tech}
              </span>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {github && (
            <a 
              href={github} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`flex items-center gap-2 ${theme === 'dark' ? 
                'text-gray-400 hover:text-white' : 
                'text-gray-600 hover:text-gray-900'} transition-colors`}
            >
              <Github size={18} /> View Code
            </a>
          )}
          {demo && (
            <a 
              href={demo}
              target="_blank" 
              rel="noopener noreferrer" 
              className={`flex items-center gap-2 ${theme === 'dark' ? 
                'text-purple-400 hover:text-purple-300' : 
                'text-purple-600 hover:text-purple-800'} transition-colors`}
            >
              <ExternalLink size={18} /> Live Demo
            </a>
          )}
        </CardFooter>
      </Card>
    </ParallaxSection>
  );
};

export default ProjectCard;
