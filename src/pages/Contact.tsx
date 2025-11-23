import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Github, Linkedin } from 'lucide-react';
import emailjs from '@emailjs/browser';

const Contact = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        setError(null);

        const form = e.currentTarget;
        const formData = {
            name: (form.elements.namedItem('name') as HTMLInputElement).value,
            email: (form.elements.namedItem('email') as HTMLInputElement).value,
            message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
        };

        if (!formData.name || !formData.email || !formData.message) {
            setError("Please fill in all required fields.");
            setLoading(false);
            return;
        }

        try {
            await emailjs.send(
                'service_fdg4s29',
                'template_u8kd609',
                {
                    from_name: formData.name,
                    from_email: formData.email,
                    to_name: 'Gokulan V',
                    message: formData.message,
                    reply_to: formData.email,
                },
                'B1Ua6b8iEPmQu3fHM'
            );

            setSuccess(true);
            form.reset();
        } catch (err) {
            console.error('Error sending email:', err);
            setError('Failed to send email. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center max-w-2xl mx-auto mb-8 md:mb-16"
            >
                <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-3 md:mb-4">Get In Touch</h1>
                <p className="text-sm md:text-base text-gray-600">
                    Feel free to reach out to me for collaboration, opportunities, or just to say hello!
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-6 md:space-y-8"
                >
                    <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-100">
                        <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Contact Information</h3>
                        <div className="space-y-4 md:space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white rounded-lg shadow-sm text-black">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Email</p>
                                    <a href="mailto:gokulhope97@gmail.com" className="font-medium hover:text-gray-600 transition-colors">
                                        gokulhope97@gmail.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white rounded-lg shadow-sm text-black">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Phone</p>
                                    <a href="tel:+919361620860" className="font-medium hover:text-gray-600 transition-colors">
                                        +91 93616 20860
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white rounded-lg shadow-sm text-black">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Location</p>
                                    <p className="font-medium">Shri Shakthi College, Coimbatore</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <p className="font-medium mb-4">Connect with me</p>
                            <div className="flex gap-4">
                                <a href="https://github.com/GokulanV7" target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-lg shadow-sm hover:bg-black hover:text-white transition-all">
                                    <Github size={20} />
                                </a>
                                <a href="https://www.linkedin.com/in/gokulan-v-40424b293/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-lg shadow-sm hover:bg-black hover:text-white transition-all">
                                    <Linkedin size={20} />
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm"
                >
                    <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Send Message</h3>
                    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                                placeholder="Your name"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                                placeholder="Your email"
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                required
                                rows={4}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all resize-none"
                                placeholder="Your message"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>Sending...</>
                            ) : (
                                <>
                                    Send Message <Send size={18} />
                                </>
                            )}
                        </button>

                        {success && (
                            <div className="p-4 bg-green-50 text-green-700 rounded-lg text-sm">
                                Message sent successfully! I'll get back to you soon.
                            </div>
                        )}
                        {error && (
                            <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;
