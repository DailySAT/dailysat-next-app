"use client"

import Sidebar from "@/components/features/Sidebar/Sidebar";
import { mathTopics } from '@/data/topics'; // Assuming readingTopics is an array of topics
import MathSVG from "@/components/features/Questions/icons/MathSVG"
import { Topic } from "@/types/topic";
import { useState } from "react";

const Home = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  
  const handleTopicClick = (topic: Topic) => {
    setSelectedTopic(topic);
    // Fetch new question based on selected topic
  };

  const openScoreModal = () => {
    // Open score modal logic
  };

  const openStreakModal = () => {
    // Open streak modal logic
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Sidebar
        title="Math"
        svg={<MathSVG />}
        topics={mathTopics} // Pass topics
        selectedTopic={selectedTopic!} // Pass selected topic
        handleTopicClick={handleTopicClick} // Handle topic click
        openScoreModal={openScoreModal}
        openStreakModal={openStreakModal}
      />
      {/* Main content goes here */}
    </div>
  );
};

export default Home;
