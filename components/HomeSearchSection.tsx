import React from "react";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";

const HomeSearchSection = () => {
  const placeholders = [
    "Condos near Phra Khanong BTS?",
    "Condos around Asoke Rama 4?",
    "Listings under 30M Baht?",
    "2 Bathroom?",
    "2-Bedroom?",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-[545px] w-[1320px] bg-red-300"
      //   style={{ backgroundImage: "url('/mv_home_hero.jpg')" }}
    >
      <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">
        Ask US Anything at Mahar-Vertex
      </h2>
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default HomeSearchSection;
