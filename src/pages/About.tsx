import React from 'react';
import Navbar from '@/components/Navbar';
import ParallaxSection from '@/components/ParallaxSection';
import ProfilePhoto from '@/components/ProfilePhoto';
import { useTheme } from '@/components/ThemeProvider';
import { FileText, Github, Linkedin, Code, Cpu, Database, Smartphone } from 'lucide-react';
import Profile3D from '@/components/Flutter3DLogo';

const About = () => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950' : 'bg-white'}`}>
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ParallaxSection speed={0.05} className="mb-16">
            <h1 className={`text-4xl md:text-5xl font-bold mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              About <span className={theme === 'dark' ? 'text-gradient' : 'text-gradient-light'}>Me</span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Text and Buttons Section - Add bottom margin on mobile */}
              <div className="md:col-span-2 mb-8 md:mb-0 lg:col-span-2">
                <ParallaxSection speed={0.1} className="space-y-6">
                  <p className={`text-lg leading-relaxed text-justify ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    I'm Gokulan, a passionate Flutter developer and Computer Science student at Shri Shakthi College. I build elegant cross-platform apps and AI-driven systems using Flutter, Python, FastAPI, and ML.
                  </p>

                  <p className={`text-lg leading-relaxed text-justify ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    I've worked on projects like FALO AI (Top 12 Finalist) and a real-time face recognition system. My expertise spans from front-end mobile development to backend engineering and machine learning integration.
                  </p>

                  <p className={`text-lg leading-relaxed text-justify ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    When I'm not coding, I enjoy exploring new technologies, contributing to open-source projects, and sharing knowledge with the developer community.
                  </p>

                  <div className="flex flex-wrap gap-4 pt-12 justify-center md:justify-start w-full">
                    <a
                      href="#"
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${theme === 'dark' ?
                        'bg-purple-600 hover:bg-purple-700' :
                        'bg-purple-500 hover:bg-purple-600'} text-white transition-colors min-w-[120px] justify-center`}
                    >
                      <FileText size={18} />
                      Resume
                    </a>
                    <a
                      href="https://github.com/GokulanV7"
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${theme === 'dark' ?
                        'bg-gray-800 hover:bg-gray-700' :
                        'bg-gray-200 hover:bg-gray-300'} ${theme === 'dark' ? 'text-white' : 'text-gray-900'} transition-colors min-w-[120px] justify-center`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github size={18} />
                      GitHub
                    </a>
                    <a
                      href="https://www.linkedin.com/in/gokulan-v-40424b293/"
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${theme === 'dark' ?
                        'bg-blue-700 hover:bg-blue-800' :
                        'bg-blue-600 hover:bg-blue-700'} text-white transition-colors min-w-[120px] justify-center`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin size={18} />
                      LinkedIn
                    </a>
                  </div>
                </ParallaxSection>
              </div>

              {/* Photo and Personal Info Section */}
              {/* On mobile, this section will stack below the first section */}
              {/* The space-y-24 is between the photo and personal info *within* this column */}
              {/* The mb-8 md:mb-0 on the first column adds space *between* the columns on mobile */}
              <div className="flex flex-col items-center space-y-24 w-full md:items-start">
                {/* Profile Photo - Now visible on all screen sizes */}
                <ParallaxSection speed={0.15} className="w-full flex justify-center"> {/* Removed hidden md:flex */}
                  <ProfilePhoto
                    src="/IMG_4921.jpg"
                    alt="Gokulan"
                    className="w-48 h-48 md:w-56 md:h-56 mx-auto"
                    themeAware
                  />
                </ParallaxSection>

                {/* Personal Info - Always visible */}
                <ParallaxSection speed={0.15} className="w-full">
                  <div className={`p-6 rounded-xl w-full ${theme === 'dark' ?
                    'glass-effect-dark' :
                    'glass-effect-light'}`}>
                    <h3 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-center md:text-left`}>
                      Personal Info
                    </h3>
                    <ul className="space-y-3 text-sm md:text-left text-center">
                      <li className={`flex justify-between ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-center md:text-left`}>
                        <span className="font-medium">Name:</span>
                        <span>Gokulan</span>
                      </li>
                      <li className={`flex justify-between ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-center md:text-left`}>
                        <span className="font-medium">Email:</span>
                        <span>gokulhope97@gmail.com</span>
                      </li>
                      <li className={`flex justify-between ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-justify`}>
                        <span className="font-medium">Location:</span>
                        <span>Coimbatore, IN</span>
                      </li>
                      <li className={`flex justify-between ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        <span className="font-medium">College:</span>
                        <span>Shri Shakthi</span>
                      </li>
                      <li className={`flex justify-between ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        <span className="font-medium">Degree:</span>
                        <span>Computer Science</span>
                      </li>
                    </ul>
                  </div>
                </ParallaxSection>
              </div>
            </div>
          </ParallaxSection>

          {/* Skills Section with 3D Flutter Logo */}
          <ParallaxSection speed={0.07} className="mt-16">
            <h2 className={`text-3xl font-bold mb-8 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              My <span className={theme === 'dark' ? 'text-gradient' : 'text-gradient-light'}>Skills</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className={`p-6 rounded-xl ${theme === 'dark' ? 'glass-effect-dark' : 'glass-effect-light'}`}>
                  <h3 className={`text-xl font-semibold mb-4 flex items-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    <Code className="mr-2 text-purple-500" size={24} />
                    Frontend Development
                  </h3>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Building beautiful, responsive user interfaces with modern web technologies and frameworks.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {['Flutter', 'React', 'TypeScript', 'Tailwind CSS', 'HTML5', 'CSS3'].map((skill) => (
                      <span
                        key={skill}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          theme === 'dark'
                            ? 'bg-gray-800 text-purple-300'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={`p-6 rounded-xl ${theme === 'dark' ? 'glass-effect-dark' : 'glass-effect-light'}`}>
                  <h3 className={`text-xl font-semibold mb-4 flex items-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    <Cpu className="mr-2 text-purple-500" size={24} />
                    Backend & AI/ML
                  </h3>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Developing robust backend systems and implementing machine learning solutions.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {['Python', 'Node.js', 'FastAPI', 'TensorFlow', 'MongoDB', 'Firebase'].map((skill) => (
                      <span
                        key={skill}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          theme === 'dark'
                            ? 'bg-gray-800 text-purple-300'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={`p-6 rounded-xl ${theme === 'dark' ? 'glass-effect-dark' : 'glass-effect-light'}`}>
                  <h3 className={`text-xl font-semibold mb-4 flex items-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    <Smartphone className="mr-2 text-purple-500" size={24} />
                    Mobile Development
                  </h3>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Creating cross-platform mobile applications with native performance.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {['Flutter', 'Dart', 'React Native', 'Firebase', 'Bloc', 'Provider'].map((skill) => (
                      <span
                        key={skill}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          theme === 'dark'
                            ? 'bg-gray-800 text-purple-300'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3D Flutter Logo */}
              <div className="h-full">
                <Profile3D />
                <p className={`mt-4 text-center italic ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Interactive 3D Profile - Drag to rotate
                </p>
              </div>
            </div>
          </ParallaxSection>

          <ParallaxSection speed={0.07}>
            <div className={`mt-16 p-8 rounded-xl ${theme === 'dark' ?
              'glass-effect-dark' :
              'glass-effect-light'}`}>
              <h2 className={`text-2xl font-bold mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Education & Experience
              </h2>

              <div className="space-y-8">
                <div className="relative pl-8 border-l-2 border-purple-500">
                  <div className="absolute w-4 h-4 bg-purple-500 rounded-full -left-[9px] top-1"></div>
                  <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Computer Science Student
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>
                    Shri Shakthi College | 2021 - Present
                  </p>
                  <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Pursuing a Bachelor's degree in Computer Science with focus on mobile development and artificial intelligence.
                  </p>
                </div>

                <div className="relative pl-8 border-l-2 border-purple-500">
                  <div className="absolute w-4 h-4 bg-purple-500 rounded-full -left-[9px] top-1"></div>
                  <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Flutter Developer Intern
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>
                    Tech Solutions Inc. | 2022 - 2023
                  </p>
                  <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Developed cross-platform mobile applications using Flutter and integrated with REST APIs. Implemented state management using BLoC pattern.
                  </p>
                </div>

                <div className="relative pl-8 border-l-2 border-purple-500">
                  <div className="absolute w-4 h-4 bg-purple-500 rounded-full -left-[9px] top-1"></div>
                  <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Hackathon Finalist
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>
                    National Innovation Challenge | 2023
                  </p>
                  <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Led a team that developed FALO AI, a real-time fake news detection platform that was selected among the Top 12 Finalists in a national hackathon.
                  </p>
                </div>
              </div>
            </div>
          </ParallaxSection>
        </div>
      </div>

      <footer className={`py-6 ${theme === 'dark' ?
        'bg-gray-900 border-t border-gray-800' :
        'bg-gray-100 border-t border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>
            © {new Date().getFullYear()} Gokulan | Flutter Developer & ML Specialist
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;