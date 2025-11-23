import { motion } from 'framer-motion';
import { Code, Cpu, Smartphone } from 'lucide-react';

const About = () => {
    const skills = [
        {
            category: "Certifications & Courses",
            icon: <Code size={24} />,
            items: ["Python", "Flutter", "Agents Course", "Open Source", "Udemy Certified"]
        },
        {
            category: "Agentic AI & LLMs",
            icon: <Cpu size={24} />,
            items: ["LangChain", "CrewAI", "smolagents", "Custom Agents", "OpenAI", "Gemini"]
        },
        {
            category: "Development",
            icon: <Smartphone size={24} />,
            items: ["React", "Node.js", "Flask", "FastAPI", "Python", "Flutter", "Vector DBs"]
        }
    ];

    return (
        <div className="container mx-auto px-4 md:px-6 pb-12 pt-8 md:-mt-32 space-y-12 md:space-y-20">
            {/* Bio Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-gray-100 max-w-sm md:max-w-lg mx-auto w-full"
                >
                    <img
                        src="/Web_Photo_Editor.jpg"
                        alt="Gokulan V"
                        className="w-full h-full object-cover object-top"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-4 md:space-y-6"
                >
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">About Me</h1>
                    <div className="space-y-3 md:space-y-4 text-base md:text-lg text-gray-600 leading-relaxed">
                        <p>
                            I'm Gokulan, a passionate developer and Computer Science student at Shri Shakthi College.
                            I specialize in developing real-world <span className="bg-black text-white px-2 py-1 rounded-md mx-1">Agentic AI</span> solutions using cutting-edge frameworks like LangChain, CrewAI, and smolagents.
                        </p>
                        <p>
                            Beyond existing tools, I am also building my own custom AI framework to push the boundaries of autonomous agents.
                            I've worked on projects like FALO AI (Top 12 Finalist) and various intelligent agent systems.
                        </p>
                        <p>
                            My expertise spans from building complex multi-agent systems to full-stack development with Flutter and Python.
                            I enjoy exploring new technologies and contributing to the open-source AI community.
                        </p>
                    </div>

                    <div className="pt-2 md:pt-4">
                        <a
                            href="/Gokulan Resume-2.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-5 md:px-6 py-2.5 md:py-3 border border-black text-black text-sm md:text-base rounded-full font-medium hover:bg-black hover:text-white transition-colors"
                        >
                            Download Resume
                        </a>
                    </div>
                </motion.div>
            </section>

            {/* Skills Section */}
            <section className="space-y-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-2xl mx-auto"
                >
                    <h2 className="text-3xl font-bold tracking-tighter mb-4">My Skills</h2>
                    <p className="text-gray-600">
                        A comprehensive overview of my technical expertise and the technologies I work with.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ staggerChildren: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {skills.map((skill) => (
                        <motion.div
                            key={skill.category}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5 }}
                            className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-black/10 hover:shadow-lg transition-all duration-300"
                        >
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                {skill.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-4">{skill.category}</h3>
                            <div className="flex flex-wrap gap-2">
                                {skill.items.map((item) => (
                                    <span
                                        key={item}
                                        className="px-3 py-1 bg-white text-sm font-medium text-gray-600 rounded-full border border-gray-100"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Experience Section */}
            <section className="max-w-4xl mx-auto space-y-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <h2 className="text-3xl font-bold tracking-tighter mb-4">Education & Experience</h2>
                </motion.div>

                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                    {[
                        {
                            title: "Full Time Trainee Intern",
                            org: "Genorai.com",
                            period: "Present",
                            desc: "Currently working as a full-time trainee intern, gaining hands-on experience in AI and software development."
                        },
                        {
                            title: "Top 12 Finalist - Truth Tell",
                            org: "International Hackathon",
                            period: "2023",
                            desc: "Developed FALO AI, a misinformation detection system, and secured a Top 12 position in the International Hackathon (Truth Tell)."
                        },
                        {
                            title: "B.E Computer Science",
                            org: "Coimbatore",
                            period: "2023 - 2027",
                            desc: "Pursuing Bachelor of Engineering in Computer Science. Building a strong foundation in algorithms, software engineering, and AI."
                        }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                        >
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-gray-200 group-hover:bg-black transition-colors shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow"></div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                                    <h3 className="font-bold text-lg">{item.title}</h3>
                                    <span className="text-sm text-gray-400 bg-gray-50 px-2 py-1 rounded-md">{item.period}</span>
                                </div>
                                <div className="text-sm font-medium text-gray-500 mb-2">{item.org}</div>
                                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default About;
