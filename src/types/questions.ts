import { Answers } from "./answer";

// Shared between both components (props)

export interface QuestionsProps {
  title: string;
  onAnswerSubmit: (answer: Answers) => void;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  id: string;
}

// Types for READING question

export interface Highlight {
  text: string;
  startOffset: number;
  endOffset: number;
}