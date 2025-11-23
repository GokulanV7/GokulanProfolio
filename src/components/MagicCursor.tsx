import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Sparkle {
    id: number;
    x: number;
    y: number;
}

const MagicCursor = () => {
    const [sparkles, setSparkles] = useState<Sparkle[]>([]);

    useEffect(() => {
        let lastTime = Date.now();
        let sparkleId = 0;

        const handleMouseMove = (e: MouseEvent) => {
            const currentTime = Date.now();

            // Throttle sparkle generation
            if (currentTime - lastTime > 50) {
                const newSparkle: Sparkle = {
                    id: sparkleId++,
                    x: e.clientX,
                    y: e.clientY,
                };

                setSparkles((prev) => [...prev, newSparkle]);

                // Remove sparkle after animation
                setTimeout(() => {
                    setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id));
                }, 1000);

                lastTime = currentTime;
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <>
            <AnimatePresence>
                {sparkles.map((sparkle) => (
                    <motion.div
                        key={sparkle.id}
                        initial={{ opacity: 1, scale: 0, rotate: 0 }}
                        animate={{ 
                            opacity: 0, 
                            scale: 2,
                            rotate: 180,
                            y: -20,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                            position: 'fixed',
                            left: sparkle.x,
                            top: sparkle.y,
                            pointerEvents: 'none',
                            zIndex: 9999,
                        }}
                        className="w-3 h-3 -translate-x-1.5 -translate-y-1.5"
                    >
                        {/* Sharp star shape */}
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="drop-shadow-lg">
                            <path 
                                d="M6 0 L7 5 L12 6 L7 7 L6 12 L5 7 L0 6 L5 5 Z" 
                                fill="black"
                                stroke="white"
                                strokeWidth="0.5"
                            />
                        </svg>
                        {/* Additional sparkle dots */}
                        <div className="absolute -top-1 left-1/2 w-1 h-1 bg-black rounded-full" />
                        <div className="absolute -bottom-1 left-1/2 w-1 h-1 bg-black rounded-full" />
                        <div className="absolute top-1/2 -left-1 w-1 h-1 bg-black rounded-full" />
                        <div className="absolute top-1/2 -right-1 w-1 h-1 bg-black rounded-full" />
                    </motion.div>
                ))}
            </AnimatePresence>
        </>
    );
};

export default MagicCursor;
