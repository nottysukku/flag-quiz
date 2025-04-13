import { useEffect, useState } from "react";
import "./App.css";
import { createClient } from "@supabase/supabase-js";
import "./App.css";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [quiz, setQuiz] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [wasCorrect, setWasCorrect] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from("flags").select("*");
      if (error) {
        console.error("Supabase Error:", error);
        return;
      }
      setQuiz(data);
      const randomQ = data[Math.floor(Math.random() * data.length)];
      setCurrentQuestion(randomQ);
    }
    fetchData();
  }, []);

  const nextQuestion = () => {
    const newQuestion = quiz[Math.floor(Math.random() * quiz.length)];
    setCurrentQuestion(newQuestion);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentQuestion) return;

    const correct = userInput.trim().toLowerCase() === currentQuestion.name.toLowerCase();
    setWasCorrect(correct);

    if (correct) {
      const newScore = totalCorrect + 1;
      setTotalCorrect(newScore);
      if (newScore >= quiz.length) {
        setGameOver(true);
        return;
      }
    }

    setUserInput("");
    nextQuestion();
  };

  if (gameOver) {
    return (
      <div className="container">
        <h2>Game over! Final Score: {totalCorrect}</h2>
        <button onClick={() => window.location.reload()} className="restart-button">Restart</button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="horizontal-container">
        <h3>Total Score: <span>{totalCorrect}</span></h3>
      </div>

      {currentQuestion && (
        <div>
          <h1 id="countryFlag">
            <img src={currentQuestion.flag_url} alt="Country Flag" style={{ width: "300px", height: "auto" }} />
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="answer-container">
              <input
                type="text"
                placeholder="Name the country"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                autoFocus
                autoComplete="off"
              />
            </div>
            <button type="submit">
              SUBMIT{" "}
              {wasCorrect === true && <span className="checkmark">✔</span>}
              {wasCorrect === false && <span className="cross" id="error">✖</span>}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
