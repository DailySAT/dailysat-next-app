import React, { MutableRefObject } from "react"

interface ResultProps {
    answerComponent: MutableRefObject<HTMLDivElement | null>
    isAnswerCorrect: boolean | null;
    handleToggleEditorial: () => void;
    openEditorial: boolean
    explanation: string | undefined;
}

const Result: React.FC<ResultProps> = ({answerComponent, isAnswerCorrect, handleToggleEditorial, openEditorial, explanation}) => {
    return (
        <div className="mt-4 pl-7 pb-10" ref={answerComponent}>
            {isAnswerCorrect ? (
                <p className="text-green-500 text-lg font-semibold">
                    You are correct!
                </p>
                ) : (
                    <div>
                    <p className="text-red-500 text-lg font-semibold">
                    You are wrong :(
                    </p>
                    <button onClick={handleToggleEditorial}>
                        Do you want to see the editorials? Click here!
                    </button>
                    {openEditorial && (
                        <p className="mt-6">{explanation}</p>
                    )}
                    </div>
                  )}
        </div>
    )
}

export default Result