
import React from 'react';
import { cn } from '@/lib/utils';
import ParallaxSection from './ParallaxSection';
import { useTheme } from './ThemeProvider';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { useState } from 'react';

interface TechItemProps {
  name: string;
  icon: string;
  proficiency: number;
  category: string;
}

const TechItem: React.FC<TechItemProps> = ({ name, icon, proficiency, category }) => {
  const { theme } = useTheme();
  
  return (
    <div className={`flex flex-col items-center p-4 rounded-lg backdrop-blur-sm hover:scale-105 transition-all duration-300
      ${theme === 'dark' ? 'bg-gray-800/50 hover:bg-purple-900/30' : 'bg-white/80 hover:bg-purple-100/80 shadow-sm'}`}>
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{name}</h3>
      <div className={`text-xs mb-2 px-2 py-0.5 rounded-full ${theme === 'dark' ? 
        'bg-gray-700 text-gray-300' : 
        'bg-gray-200 text-gray-700'}`}>
        {category}
      </div>
      <div className={`w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2 mt-2`}>
        <div 
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" 
          style={{ width: `${proficiency}%` }}
        ></div>
      </div>
    </div>
  );
};

interface TechStackProps {
  className?: string;
}

const TechStack: React.FC<TechStackProps> = ({ className }) => {
  const { theme } = useTheme();
  const [filter, setFilter] = useState<string>("all");
  
  const technologies = [
    { name: 'Flutter', icon: '📱', proficiency: 95, category: 'Mobile' },
    { name: 'Dart', icon: '🎯', proficiency: 90, category: 'Mobile' },
    { name: 'Python', icon: '🐍', proficiency: 90, category: 'Backend' },
    { name: 'Machine Learning', icon: '🧠', proficiency: 85, category: 'AI/ML' },
    { name: 'React', icon: '⚛️', proficiency: 80, category: 'Frontend' },
    { name: 'MongoDB', icon: '🍃', proficiency: 85, category: 'Database' },
    { name: 'SQL', icon: '💾', proficiency: 80, category: 'Database' },
    { name: 'FastAPI', icon: '⚡', proficiency: 85, category: 'Backend' },
    { name: 'Flask', icon: '🌶️', proficiency: 80, category: 'Backend' },
    { name: 'MCP Agent', icon: '🤖', proficiency: 75, category: 'AI/ML' },
    { name: 'LangChain', icon: '⛓️', proficiency: 80, category: 'AI/ML' },
    { name: 'Groq', icon: '🔄', proficiency: 75, category: 'AI/ML' },
  ];
  
  const filteredTech = filter === 'all' 
    ? technologies 
    : technologies.filter(tech => tech.category === filter);
  
  const categories = ['all', ...Array.from(new Set(technologies.map(tech => tech.category)))];

  return (
    <div className={cn("w-full", className)}>
      <h2 className={`text-3xl font-bold mb-8 text-center ${theme === 'dark' ? 'text-gradient' : 'text-gradient-light'}`}>
        Technical Skills
      </h2>
      
      <div className="flex justify-center mb-8">
        <ToggleGroup type="single" value={filter} onValueChange={(value) => value && setFilter(value)}>
          {categories.map((category) => (
            <ToggleGroupItem key={category} value={category} 
              className={`capitalize ${theme === 'dark' ? 
                'data-[state=on]:bg-purple-700 data-[state=on]:text-white' : 
                'data-[state=on]:bg-purple-500 data-[state=on]:text-white'}`}>
              {category}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredTech.map((tech, index) => (
          <ParallaxSection key={tech.name} speed={0.03 + (index * 0.01)}>
            <TechItem {...tech} />
          </ParallaxSection>
        ))}
      </div>
    </div>
  );
};

export default TechStack;
