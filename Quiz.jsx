import { useEffect, useState } from "react";
import { decode } from "html-entities";
import Confetti from "react-confetti";

function shuffle(array) {
  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {
    const randomNum = Math.floor(Math.random() * (i + 1));

    [arr[i], arr[randomNum]] = [arr[randomNum], arr[i]];
  }

  return arr;
}

function Quiz({ questionsSetting, backToSettings }) {
  const [questionsArr, setQuestionsArr] = useState([]);
  const [selected, setSelected] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingFailed, setFetchingFailed] = useState(false);

  async function loadQuestions() {
    setFetchingFailed(false);
    setLoading(true);
    setError("");
    try {
      const { category, type, difficulty, numberOfQuestions } =
        questionsSetting;
      const res = await fetch(
        `https://opentdb.com/api.php?amount=${numberOfQuestions}&category=${category}&type=${type}&difficulty=${difficulty}`,
      );

      if (!res.ok) {
        throw new Error(res.status);
      }

      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        setError("No question found, try different settings.");
        setFetchingFailed(true);
      }

      const shuffled = data.results.map((q) => {
        const options = shuffle([
          ...q.incorrect_answers.map(decode),
          decode(q.correct_answer),
        ]);
        return {
          question: decode(q.question),
          correct: decode(q.correct_answer),
          options,
        };
      });

      setQuestionsArr(shuffled);
      setSelected({});
      setShowResults(false);
    } catch (err) {
      console.error(err);
      setQuestionsArr([]);
      setError("Failed to load questions, try different settings");
      setFetchingFailed(true);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadQuestions();
  }, [questionsSetting]);

  function handleChange(qIndex, value) {
    setSelected((prev) => ({
      ...prev,
      [qIndex]: value,
    }));
    setError("");
  }

  function checkAnswers() {
    if (Object.keys(selected).length !== questionsArr.length) {
      setError("Please answer all questions before checking.");
      return;
    }

    setError("");
    setShowResults(true);
  }

  function playAgain() {
    loadQuestions();
  }

  const score = questionsArr.reduce((total, q, i) => {
    return selected[i] === q.correct ? total + 1 : total;
  }, 0);

  const output = questionsArr.map((q, index) => (
    <div className="card" key={index}>
      <h2>{q.question}</h2>

      <div className="options">
        {q.options.map((opt, i) => {
          let className = "btn-radio";

          if (selected[index] === opt && !showResults) {
            className += " selected";
          }
          if (selected[index] !== opt && showResults) {
            className += " not-selected";
          }
          if (showResults) {
            if (opt === q.correct) className += " correct";
            else if (opt === selected[index]) className += " wrong";
            else if (selected[index] !== opt) className += " not-selected";
          }

          return (
            <label key={i} className={className}>
              <input
                type="radio"
                name={`option-${index}`}
                value={opt}
                disabled={showResults}
                checked={selected[index] === opt}
                onChange={() => handleChange(index, opt)}
              />
              {opt}
            </label>
          );
        })}
      </div>
    </div>
  ));

  return (
    <div className="quiz-section">
      {loading && (
        <div className="loading-overlay">
          <div className="loader"></div>
        </div>
      )}
      {showResults &&
        questionsArr.length > 0 &&
        score === questionsArr.length && (
          <Confetti
            recycle={false}
            tweenDuration={10000}
            numberOfPieces={600}
          />
        )}
      {output}
      {error && <p className="error-text">{error}</p>}

      {!fetchingFailed ? (
        !showResults ? (
          <>
            <button className="btn-check-answers" onClick={checkAnswers}>
              Check answers
            </button>
          </>
        ) : (
          <div className="score-section">
            <span>
              You scored {score} / {questionsArr.length} correct answers
            </span>
            <button className="btn-check-answers" onClick={playAgain}>
              Play again
            </button>

            <button className="btn-check-answers" onClick={backToSettings}>
              Back to settings
            </button>
          </div>
        )
      ) : (
        <button className="btn-check-answers" onClick={backToSettings}>
          Back to settings
        </button>
      )}
    </div>
  );
}

export default Quiz;
