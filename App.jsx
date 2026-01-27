import Quiz from "./Quiz";
import { useState } from "react";

function App() {
  const [startQuizz, setStartQuizz] = useState(false);
  const [questionsSetting, setQuestionsSetting] = useState({
    category: "",
    difficulty: "",
    type: "",
    numberOfQuestions: "5",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setQuestionsSetting((prev) => ({ ...prev, [name]: value }));
  }

  function quiz() {
    setStartQuizz(true);
  }
  return (
    <main className="main">
      {startQuizz ? (
        <Quiz
          questionsSetting={questionsSetting}
          backToSettings={() => setStartQuizz(false)}
        />
      ) : (
        <div className="home-page">
          <h1>Quizzical</h1>
          <p>Let's test your knowledge</p>
          <div className="questions-setting-container">
            <label>
              Category
              <select
                name="category"
                value={questionsSetting.category}
                onChange={handleChange}
              >
                <option value="">Any Category</option>
                <option value="9">General knowledge</option>
                <option value="10">Entertainment: Books</option>
                <option value="11">Entertainment: Film</option>
                <option value="12">Entertainment: Music</option>
                <option value="14">Entertainment: Television</option>
                <option value="15">Entertainment: Video Games</option>
                <option value="16">Entertainment: Board Games</option>
                <option value="17">Science & Nature</option>
                <option value="18">Science: Computers</option>
                <option value="19">Science: Mathematics</option>
                <option value="20">Mythology</option>
                <option value="21">Sports</option>
                <option value="22">Geography</option>
                <option value="23">History</option>
                <option value="24">Politics</option>
                <option value="25">Art</option>
                <option value="26">Celebrities</option>
                <option value="27">Animals</option>
                <option value="28">Vehicles</option>
                <option value="29">Entertainment: Comics</option>
                <option value="30">Science: Gadgets</option>
              </select>
            </label>
            <label>
              Difficulty
              <select
                name="difficulty"
                value={questionsSetting.difficulty}
                onChange={handleChange}
              >
                <option value="">Any Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>

            <label>
              Type
              <select
                name="type"
                value={questionsSetting.type}
                onChange={handleChange}
              >
                <option value="">Any Type</option>
                <option value="multiple">Multiple</option>
                <option value="boolean">True/False</option>
              </select>
            </label>

            <label>
              Number of Questions
              <select
                name="numberOfQuestions"
                value={questionsSetting.numberOfQuestions}
                onChange={handleChange}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
                <option value="30">30</option>
              </select>
            </label>
          </div>

          <button onClick={quiz} className="btn-start">
            Start Quiz
          </button>
        </div>
      )}
    </main>
  );
}
export default App;
