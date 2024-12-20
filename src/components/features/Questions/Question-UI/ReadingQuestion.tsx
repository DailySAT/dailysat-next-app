import React, { useState, useRef, useEffect } from "react";
import AnswerOption from "../../shared-components/AnswerOption";
import { Answers } from "@/types/answer";
import { useAnswerStore } from "@/store/answer";
import Image from "next/image";
import axios from "axios";
import { Highlight } from "@/types/questions";
import { QuestionsProps } from "@/types/questions";

const ReadingQuestion: React.FC<QuestionsProps> = ({
  title,
  optionA,
  optionB,
  optionC,
  optionD,
  id,
  onAnswerSubmit,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<Answers | null>(null);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [mode, setMode] = useState<"highlight" | "clear" | null>(null); // Current mode
  const [crossOffMode, setCrossOffMode] = useState(false); // Cross-off mode
  const [crossedOffOptions, setCrossedOffOptions] = useState<Set<Answers> | null>(
    new Set()
  ); // To track crossed off options
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const isAnswerCorrect = useAnswerStore((state) => state.isAnswerCorrect);

  useEffect(() => {
    if (isAnswerCorrect) {
      setSelectedAnswer(null);
      setCrossedOffOptions(null)
      setHighlights([])
      setMode(null)
    }
  }, [isAnswerCorrect]);

  // useEffect(() => {
  //   setCrossedOffOptions(new Set())
  //   setSelectedAnswer(null);
  // }, [id])

  // Toggle highlight/clear mode
  const toggleMode = (newMode: "highlight" | "clear") => {
    setMode((prevMode) => (prevMode === newMode ? null : newMode));
  };

  // Toggle cross-off mode
  const toggleCrossOffMode = () => {
    setCrossOffMode((prevMode) => !prevMode);
  };

  // Handle mouse selection
  const handleMouseUp = () => {
    if (!mode || !textRef.current) return;

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = selection.toString();

      if (selectedText.trim().length > 0) {
        const startOffset = range.startOffset;
        const endOffset = range.endOffset;

        if (mode === "highlight") {
          setHighlights((prev) => [
            ...prev,
            { text: selectedText, startOffset, endOffset },
          ]);
        } else if (mode === "clear") {
          removeHighlight(startOffset, endOffset);
        }
        selection.removeAllRanges(); // Clear selection
      }
    }
  };

  // Remove a highlight
  const removeHighlight = (start: number, end: number) => {
    setHighlights((prev) =>
      prev.filter(
        (highlight) =>
          highlight.endOffset <= start || highlight.startOffset >= end
      )
    );
  };

  // Render text with highlights
  const renderHighlightedText = () => {
    if (!textRef.current) return title;

    const nodes = [];
    let lastIndex = 0;

    for (const highlight of highlights) {
      if (highlight.startOffset > lastIndex) {
        nodes.push(
          <span key={lastIndex}>
            {title.slice(lastIndex, highlight.startOffset)}
          </span>
        );
      }
      nodes.push(
        <span
          key={highlight.startOffset}
          style={{ backgroundColor: "yellow", cursor: "pointer" }}
        >
          {title.slice(highlight.startOffset, highlight.endOffset)}
        </span>
      );
      lastIndex = highlight.endOffset;
    }

    if (lastIndex < title.length) {
      nodes.push(<span key={lastIndex}>{title.slice(lastIndex)}</span>);
    }

    return nodes;
  };

  // Handle answer click
  const handleAnswerClick = (answer: Answers) => {
    if (crossOffMode) {
      toggleCrossOffOption(answer);
    } else {
      setSelectedAnswer(answer);
    }
  };

  const betaBugReport = async () => {
    await axios.get("/api/beta/bug?id=" + id);
    window.location.reload();
  };

  // Toggle cross-off for an option
  const toggleCrossOffOption = (option: Answers) => {
    setCrossedOffOptions((prev) => {
      const updated = new Set(prev);
      if (updated.has(option)) {
        updated.delete(option);
      } else {
        updated.add(option);
      }
      return updated;
    });
  };

  // Handle answer submit
  const handleSubmit = () => {
    if (selectedAnswer) {
      onAnswerSubmit(selectedAnswer);
    }
  };

  return (
    <div className="flex flex-col items-start px-8 -mt-6">
      <div className="flex items-center mb-2 space-x-4">
        {/* Highlight Mode Button */}
        <button
          onClick={() => toggleMode("highlight")}
          className={`p-1 rounded ${
            mode === "highlight" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
        >
          <Image
            src={
              mode !== "highlight"
                ? "/icons/highlighter.png"
                : "/icons/full.png"
            }
            alt="Toggle highlight mode"
            className="w-4 h-4"
            width={500}
            height={500}
          />
        </button>

        {/* Clear Highlight Button */}
        <button
          onClick={() => toggleMode("clear")}
          className={`p-1 rounded ${
            mode === "clear" ? "bg-red-500 text-white" : "bg-gray-300"
          }`}
        >
          <Image
            src={mode !== "clear" ? "/icons/eraser.png" : "/icons/colored.png"}
            alt="Toggle clear highlight mode"
            className="w-4 h-4"
            width={500}
            height={500}
          />
        </button>

        {/* Cross-Off Mode Button */}
        <button
          onClick={toggleCrossOffMode}
          className={`p-1 rounded ${
            crossOffMode ? "bg-blue-300 text-white" : "bg-gray-300"
          }`}
        >
          Cross off
        </button>
      </div>

      {/* Bug Report */}
      <p
        className="text-xs font-extralight hover:text-red-500 hover:cursor-pointer transition-all"
        onClick={() => betaBugReport()}
      >
        {id} Report this question as bugged
      </p>

      <p
        className="mb-5 text-xl relative"
        ref={textRef}
        onMouseUp={handleMouseUp}
      >
        {renderHighlightedText()}
      </p>

      <span className="mb-3 text-sm font-semibold">Choose 1 answer:</span>
      <div className="w-full space-y-2">
        <AnswerOption
          text={optionA}
          onClick={() => handleAnswerClick("A")}
          isSelected={selectedAnswer === "A"}
          isCrossedOff={crossedOffOptions?.has("A")}
        />

        <AnswerOption
          text={optionB}
          onClick={() => handleAnswerClick("B")}
          isSelected={selectedAnswer === "B"}
          isCrossedOff={crossedOffOptions?.has("B")}
        />

        <AnswerOption
          text={optionC}
          onClick={() => handleAnswerClick("C")}
          isSelected={selectedAnswer === "C"}
          isCrossedOff={crossedOffOptions?.has("C")}
        />

        <AnswerOption
          text={optionD}
          onClick={() => handleAnswerClick("D")}
          isSelected={selectedAnswer === "D"}
          isCrossedOff={crossedOffOptions?.has("D")}
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={!selectedAnswer}
      >
        Submit Answer
      </button>
    </div>
  );
};

export default ReadingQuestion;
