"use client";

import { useEffect, useState } from 'react';
import ProtectedRoute from "../wrappers/CheckSessionWrapper";
import Header from '../components/features/Questions/Header';
import Question from '../components/features/Questions/Question';
import httpService from '../utils/httpService';
import {useAnswerCounterStore, useScoreStore} from '@/store/score';
import ScoreModal from '@/components/features/Questions/Modals/ScoreModal';
import EditorialModal from '@/components/features/Questions/Modals/EditorialModal';
import BookSVG from '@/components/features/Questions/icons/BookSVG';
import { useEditorialModalStore, useScoreModalStore, useStreakAnnouncerModalStore, useStreakCounterModalStore } from '@/store/modals';
import useEditorialStore from '@/store/editorial';
import StreakAnnouncer from '@/components/features/Questions/Modals/StreakAnnouncer';
import CTASideBar from '@/components/features/shared-components/CTASideBar';
import StreakModal from '@/components/features/Questions/Modals/StreakModal';

interface Topic {
  id: number;
  name: string;
  description: string;
}

interface QuestionData {
  id: number;
  title: string;
  body: string;
  correctAnswer: string;
  topic: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
}

const Home = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [randomQuestion, setRandomQuestion] = useState<QuestionData | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  const increaseScore = useScoreStore((state) => state.increaseScore);

  const increaseCorrectCounter = useAnswerCounterStore((state) => state.increaseCount)
  const resetCorrectCounter = useAnswerCounterStore((state) => state.resetCount)
  const correctCount = useAnswerCounterStore((state) => state.count)

  // variables used to open the modals
  const openScoreModal = useScoreModalStore((state) => state.openModal);
  const isScoreModalOpen = useScoreModalStore((state) => state.isOpen); 

  const openEditorialModal = useEditorialModalStore((state) => state.openModal); 
  const isEditorialModalOpen = useEditorialModalStore((state) => state.isOpen); 
 
  const openAnnouncerModal = useStreakAnnouncerModalStore((state) => state.openModal)
  const isAnnouncerModalOpen = useStreakAnnouncerModalStore((state) => state.isOpen); 

  const openStreakModal = useStreakCounterModalStore((state) => state.openModal)
  const isStreakModalOpen = useStreakCounterModalStore((state) => state.isOpen)

  const setEditorial = useEditorialStore((state) => state.setEditorial);


  useEffect(() => {
    if (correctCount == 3) {
      openAnnouncerModal()
    }
  }, [correctCount, openAnnouncerModal])



  const topics: Topic[] = [
    { id: 1, name: "Information and Ideas", description: "Topic 1" },
    { id: 2, name: "Craft and Structure", description: "Topic 2" },
    { id: 3, name: "Expression of Ideas", description: "Topic 3" },
    { id: 4, name: "Standard English Conventions", description: "Topic 4" }
  ];

  const handleTopicClick = (topic: Topic) => {
    setSelectedTopic(topic);
    fetchRandomQuestion(topic);
  };

  const fetchRandomQuestion = async (topic: Topic) => {
    try {
      let type = "";
      switch (topic.name) {
        case "Information and Ideas":
          type = "information";
          break;
        case "Craft and Structure":
          type = "craft";
          break;
        case "Expression of Ideas":
          type = "idea";
          break;
        case "Standard English Conventions":
          type = "convention";
          break;
      }

      const response = await httpService.get(`/questions/get/reading?type=${type}`);
      const questionData: QuestionData = response.data.randomQuestion[0];

      if (questionData) {
        setRandomQuestion(questionData);
      }
      setIsAnswerCorrect(null);
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };


  const handleAnswerSubmit = (answer: string) => {
    // Map answer letters ('A', 'B', 'C', 'D') to their corresponding indices (0, 1, 2, 3)
    const correctAnswerMap = new Map([
      ['A', 0],
      ['B', 1],
      ['C', 2],
      ['D', 3]
    ]);
  
    // Get the selected answer's index from the map
    const selectedAnswerIndex = correctAnswerMap.get(answer);
  
    // Check if the selected answer index is equal to the correct answer index (which is a number)
    const correct = selectedAnswerIndex === parseInt(randomQuestion?.correctAnswer || "");
    alert(randomQuestion?.correctAnswer)
    alert(correctAnswerMap.get(answer))
  
    if (randomQuestion) {
      setIsAnswerCorrect(correct);
    }
  
    if (correct) {
      increaseCorrectCounter();
      increaseScore();
      // Fetch a new question after answering correctly
      setTimeout(() => {
        if (selectedTopic) {
          fetchRandomQuestion(selectedTopic);
        }
      }, 1500); // 1-second delay to allow user to see the correct answer they got
  
    } else {
      // Streak is lost because the user has got a question wrong, so reset the correct answer counter
      resetCorrectCounter();
    }
  };
  

  const handleGetEditorial = async () => {
    const editorialResponse = await httpService.get(`/questions/editorial/reading?questionID=${randomQuestion?.id}`);

    setEditorial(editorialResponse.data.editorials);
    openEditorialModal();
  };

  // Prevent rendering if either modal is open
  if (isScoreModalOpen || isEditorialModalOpen || isStreakModalOpen) {
    return (
      <>
        <ScoreModal />
        <EditorialModal />
        <StreakModal />
      </>
    );
  }


  return (
    <ProtectedRoute>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-96 flex flex-col p-5 md:p-10">
          <div className="w-full h-14 py-2 cursor-pointer duration-500 hover:bg-gray-50 flex items-center space-x-2">
            <div className="flex-col">
              <div className='flex space-x-2 items-center'>
                <BookSVG />
                <p className="font-semibold">Reading SAT</p>
              </div>
              <p className="uppercase text-[12px] text-gray-400">4 topics</p>
            </div>
          </div>

          <div className="mt-5">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className={`bg-blue-50 py-3 px-3 mb-2 cursor-pointer ${selectedTopic?.id === topic.id ? 'border-l-4 border-blue-500' : ''}`}
                onClick={() => handleTopicClick(topic)}
              >
                <p className="text-[11px] text-gray-400 uppercase">{topic.description}</p>
                <p className="text-[16px] font-semibold">{topic.name}</p>
              </div>
            ))}
          </div>

          {/* Challenge section */}
          <div className="border border-gray-200 rounded-sm px-1.5 py-3 mt-8">
            <div className="flex items-center mb-0.5">
              <p className="font-medium uppercase text-[12px]">Course Challenge</p>
            </div>
            <p className="text-[12px] text-gray-400 mb-1">Challenge yourself, better yourself! COMING SOON!</p>
            <p className="font-semibold text-sm text-blue-500 cursor-pointer">Start course challenge</p>
          </div>

          <CTASideBar open={openScoreModal} text='Click to open the scoreboard!'/>
          <CTASideBar open={openStreakModal} text='Click to see your current streak!'/>

        </div>

        <div className="w-px bg-gray-200 h-px md:h-full"></div>

        {/* Question content */}
        <div className="flex flex-col md:flex-grow p-5 md:p-10">
          {selectedTopic ? (
            <div className="w-full">
              <div className="text-center mb-16">
                <Header name={selectedTopic.name} />
              </div>
              {randomQuestion ? (
                <Question
                  title={randomQuestion.title}
                  optionA={randomQuestion.optionA}
                  optionB={randomQuestion.optionB}
                  optionC={randomQuestion.optionC}
                  optionD={randomQuestion.optionD}
                  onAnswerSubmit={handleAnswerSubmit}
                />
              ) : (
                <p>Loading question...</p>
              )}
              <div className="mt-4 pl-7">
                {isAnswerCorrect !== null ? (
                  <>
                    {isAnswerCorrect ? (
                      <>
                        <p className="text-green-500 text-lg font-semibold">You are correct!</p>
                      </>
                    ): (
                      <>
                        <p className="text-red-500 text-lg font-semibold">You are wrong :(</p>
                        <button onClick={handleGetEditorial}>Do you want to see the editorials? Click here!</button>                    
                      </>
                    )
                    }
                  </>
                ) : null}
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center flex-grow">
              <div className="mt-16 text-center">
                <hr className="mx-8 my-5 h-px border-0 bg-gray-200" />
                <p className="text-xl font-medium">Select a topic to start</p>
                <p className="text-gray-400">Get started by selecting a topic from the left.</p>
              </div>
            </div>
          )}
        </div>
        {isAnnouncerModalOpen && <StreakAnnouncer />}
      </div>
    </ProtectedRoute>
  );
};

export default Home;
