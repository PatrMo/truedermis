"use client";

import { useState, useRef } from "react";

interface CardItem {
  img: string;
  title: string;
  text: string;
}

const diseases: CardItem[] = [
  {
    img: "/images/1.jpg",
    title: "Create a website using Html CSS and JavaScript",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
  },
  {
    img: "/images/2.jpg",
    title: "Complete portfolio website tutorial",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
  },
  {
    img: "/images/3.jpg",
    title: "Bootstrap 5 Complete tutorial",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
  },
  {
    img: "/images/4.jpg",
    title: "UIkit Complete tutorial",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
  },
  {
    img: "/images/5.jpg",
    title: "Tailwind CSS card design",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
  },
  {
    img: "/images/6.jpg",
    title: "Reactjs tutorial for beginner",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
  },
  {
    img: "/images/7.jpg",
    title: "Nextjs crash course",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
  },
  {
    img: "/images/8.jpg",
    title: "Create a website using Tailwind CSS",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
  },
  {
    img: "/images/9.jpg",
    title: "Create a one-page website using ReactJS",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
  },
];

/*Change the line below to "const Card: React.FC = async () => {" when its finally ready, this was reverted for testing purposes*/
const Card: React.FC = () => {
  return (
    <nav className="mt-24">
      <div className="flex flex-col gap-8 w-full px-4 sm:px-10 lg:px-20 pb-16"> {/* Added pb-16 here for bottom spacing */}
        {diseases.map((disease, index) => (
          <div
            key={index}
            className="w-full flex flex-col items-center justify-center text-center border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 
                       bg-white text-gray-900 border-gray-300 
                       dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
          >
            <h3 className="text-3xl font-semibold dark:text-white">{disease.title}</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-2 max-w-3xl">{disease.text}</p>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Card;