"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Card = {
  id: number;
  content: JSX.Element | React.ReactNode | string;
  className: string;
  thumbnail: string;
};

export const DetailsGrid = ({ cards }: { cards: Card[] }) => {
  const [hovered, setHovered] = useState<Card | null>(null);

  const handleMouseEnter = (card: Card) => {
    setHovered(card);
  };

  const handleMouseLeave = () => {
    setHovered(null);
  };

  return (
    <div className="flex justify-center">
      <div className="md:pb-[15%] md:w-[100vw] md:px-[15%] md:h-[100vh] grid grid-cols-1 md:grid-cols-2 gap-4 relative">
        {cards.map((card, i) => (
          <div
            key={i}
            className={cn(card.className, "")}
            onMouseEnter={() => handleMouseEnter(card)}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              className={cn(
                card.className,
                "relative overflow-hidden",
                hovered?.id === card.id
                  ? "rounded-lg cursor-pointer absolute inset-0 h-[70vh] w-full md:w-[50vw] mx-auto my-[15vh] z-50 flex justify-center items-center"
                  : "bg-white rounded-xl h-full w-full"
              )}
              layout
            >
              {hovered?.id === card.id && <SelectedCard selected={hovered} />}
              <BlurImage card={card} />
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BlurImage = ({ card }: { card: Card }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <Image
      src={card.thumbnail}
      height="5000"
      width="500"
      onLoad={() => setLoaded(true)}
      className={cn(
        "object-cover object-center absolute inset-0 h-full w-full transition duration-200",
        loaded ? "blur-none" : "blur-md"
      )}
      alt="thumbnail"
    />
  );
};

const SelectedCard = ({ selected }: { selected: Card | null }) => {
  return (
    <div className="bg-transparent h-full w-full flex flex-col justify-center rounded-lg shadow-2xl relative z-[60]">
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 0.6,
        }}
        className="absolute inset-0 h-full w-full bg-black opacity-60 z-10"
      />
      <motion.div
        initial={{
          opacity: 0,
          y: 100,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className="relative px-8 pb-4 z-[70]"
      >
        {selected?.content}
      </motion.div>
    </div>
  );
};
