"use client";

import type { Variants } from "motion/react";

import { useEffect, useMemo, useState } from "react";

import { cn } from "cn";
import { motion } from "motion/react";

interface Props {
  className?: string;
  cursorAnimationVariants?: {
    initial: Variants["initial"];
    animate: Variants["animate"];
  };
  cursorChar?: string | React.ReactNode;
  cursorClassName?: string;
  deleteSpeed?: number;
  hideCursorOnType?: boolean;
  initialDelay?: number;
  loop?: boolean;
  showCursor?: boolean;
  speed?: number;
  text: string | string[];
  waitTime?: number;
}

export function Typewriter({
  text,
  speed = 50,
  initialDelay = 0,
  waitTime = 2000,
  deleteSpeed = 30,
  loop = true,
  className,
  showCursor = true,
  hideCursorOnType = false,
  cursorChar = "|",
  cursorClassName = "ml-1",
  cursorAnimationVariants = {
    animate: {
      opacity: 1,
      transition: {
        duration: 0.01,
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: 0.4,
        repeatType: "reverse",
      },
    },
    initial: { opacity: 0 },
  },
}: Props) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const texts = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);
  const currentText = texts[currentTextIndex];

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const startTyping = () => {
      if (isDeleting) {
        if (displayText === "") {
          setIsDeleting(false);
          if (currentTextIndex === texts.length - 1 && !loop) {
            return;
          }
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
          setCurrentIndex(0);
          timeout = setTimeout(() => {
            // Update the timeout
          }, waitTime);
        } else {
          timeout = setTimeout(() => {
            setDisplayText((prev) => prev.slice(0, -1));
          }, deleteSpeed);
        }
      } else if (currentText && currentIndex < currentText.length) {
        timeout = setTimeout(() => {
          setDisplayText((prev) => prev + currentText[currentIndex]);
          setCurrentIndex((prev) => prev + 1);
        }, speed);
      } else if (texts.length > 1) {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, waitTime);
      }
    };

    // Apply initial delay only at the start
    if (currentIndex === 0 && !isDeleting && displayText === "") {
      timeout = setTimeout(startTyping, initialDelay);
    } else {
      startTyping();
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [
    currentIndex,
    displayText,
    isDeleting,
    speed,
    deleteSpeed,
    waitTime,
    texts,
    currentTextIndex,
    loop,
    currentText,
    initialDelay,
  ]);

  return (
    <p className={cn("inline whitespace-pre-wrap tracking-tight", className)}>
      <span>{displayText}</span>
      {showCursor ? (
        <motion.span
          animate="animate"
          className={cn(
            cursorClassName,
            hideCursorOnType &&
              ((currentText && currentIndex < currentText.length) || isDeleting)
              ? "hidden"
              : ""
          )}
          initial="initial"
          variants={cursorAnimationVariants}
        >
          {cursorChar}
        </motion.span>
      ) : null}
    </p>
  );
}
