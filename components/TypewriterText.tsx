"use client";

import { useState, useEffect } from "react";

interface TypewriterTextProps {
    text: string;
    speed?: number; // ms per character
    delay?: number; // initial delay in ms
    trigger?: any; // value change triggers restart
    className?: string;
}

export default function TypewriterText({
    text,
    speed = 30, // Fast technical typing
    delay = 0,
    trigger,
    className = ""
}: TypewriterTextProps) {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        let currentIndex = 0;
        setDisplayedText(""); // Reset

        let timeout: NodeJS.Timeout;

        const startTyping = () => {
            const interval = setInterval(() => {
                if (currentIndex < text.length) {
                    setDisplayedText(prev => prev + text.charAt(currentIndex));
                    currentIndex++;
                } else {
                    clearInterval(interval);
                }
            }, speed);
            return interval;
        };

        if (delay > 0) {
            timeout = setTimeout(() => {
                const interval = startTyping();
                return () => clearInterval(interval);
            }, delay);
        } else {
            const interval = startTyping();
            return () => clearInterval(interval);
        }

        return () => {
            clearTimeout(timeout);
        };
    }, [text, speed, delay, trigger]);

    return (
        <span className={className}>
            {displayedText}
        </span>
    );
}
