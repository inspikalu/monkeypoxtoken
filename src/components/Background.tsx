"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Background: React.FC = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div
                className="absolute inset-0"
                style={{
                    background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(250,204,21,0.15), transparent 50%)`,
                    zIndex: 0,
                }}
            />
            {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-yellow-400/10 rounded-full"
                    initial={{
                        x: typeof window !== "undefined" ? Math.random() * window.innerWidth : 0,
                        y: typeof window !== "undefined" ? Math.random() * window.innerHeight : 0,
                        scale: Math.random() * 0.5 + 0.5,
                    }}
                    animate={{
                        y: [null, Math.random() * -100],
                        x: Math.random() * 50,
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    style={{
                        width: `${Math.random() * 20 + 10}px`,
                        height: `${Math.random() * 20 + 10}px`,
                    }}
                />
            ))}
        </div>
    );
};

export default Background;