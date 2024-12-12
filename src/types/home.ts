export interface Topic {
    id: number;
    name: string;
    description: string;
  }
  
  export interface QuestionData {
    id: string;
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctAnswer: number;
    explanation: string;
    skill: string;
  }
  