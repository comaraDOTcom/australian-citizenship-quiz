'use client';

import { CATEGORY_LABELS, CATEGORY_COLOURS, type Category } from '@/lib/questions';

interface QuizQuestion {
  id: string;
  category: Category;
  question: string;
  options: string[];
}

interface Props {
  question: QuizQuestion;
  selectedOption: number | null;
  onSelect: (index: number) => void;
  /** When showing post-submit review, pass the correct index and explanation */
  correctIndex?: number;
  explanation?: string;
  showExplanation?: boolean;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export default function QuestionCard({
  question,
  selectedOption,
  onSelect,
  correctIndex,
  explanation,
  showExplanation = false,
}: Props) {
  const locked = selectedOption !== null;

  function getOptionStyle(i: number): string {
    const base =
      'w-full text-left p-4 rounded-xl border-2 transition-all duration-150 flex items-start gap-3';

    if (!locked) {
      return `${base} border-gray-200 hover:border-au-green hover:bg-au-green-50 cursor-pointer`;
    }

    // After selection (during active quiz — no correct answer revealed)
    if (correctIndex === undefined) {
      if (i === selectedOption) {
        return `${base} border-au-green bg-au-green-50 cursor-default`;
      }
      return `${base} border-gray-100 bg-gray-50 opacity-60 cursor-default`;
    }

    // Review mode — show correct/incorrect
    if (i === correctIndex) {
      return `${base} border-green-500 bg-green-50 cursor-default`;
    }
    if (i === selectedOption && i !== correctIndex) {
      return `${base} border-red-400 bg-red-50 cursor-default`;
    }
    return `${base} border-gray-100 bg-gray-50 opacity-50 cursor-default`;
  }

  return (
    <div className="animate-slide-up">
      {/* Category badge */}
      <span
        className={`inline-block text-xs font-bold px-3 py-1 rounded-full border mb-4 ${
          CATEGORY_COLOURS[question.category]
        }`}
      >
        {CATEGORY_LABELS[question.category]}
      </span>

      {/* Question text */}
      <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6 leading-snug">
        {question.question}
      </h2>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, i) => (
          <button
            key={i}
            onClick={() => !locked && onSelect(i)}
            className={getOptionStyle(i)}
            aria-pressed={selectedOption === i}
          >
            {/* Letter badge */}
            <span
              className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold mt-0.5
                ${
                  correctIndex !== undefined && i === correctIndex
                    ? 'bg-green-500 text-white'
                    : correctIndex !== undefined && i === selectedOption && i !== correctIndex
                    ? 'bg-red-500 text-white'
                    : selectedOption === i && correctIndex === undefined
                    ? 'bg-au-green text-white'
                    : 'bg-gray-100 text-gray-600'
                }
              `}
            >
              {OPTION_LETTERS[i]}
            </span>
            <span className="text-sm md:text-base">{option}</span>
            {/* Tick/cross icons in review mode */}
            {correctIndex !== undefined && i === correctIndex && (
              <span className="ml-auto text-green-500 font-bold">✓</span>
            )}
            {correctIndex !== undefined && i === selectedOption && i !== correctIndex && (
              <span className="ml-auto text-red-500 font-bold">✗</span>
            )}
          </button>
        ))}
      </div>

      {/* Explanation (review mode) */}
      {showExplanation && explanation && (
        <div className="mt-5 p-4 bg-blue-50 border border-blue-100 rounded-xl animate-fade-in">
          <p className="text-sm text-blue-800">
            <span className="font-bold">💡 Explanation: </span>
            {explanation}
          </p>
        </div>
      )}
    </div>
  );
}
