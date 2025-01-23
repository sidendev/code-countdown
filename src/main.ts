import './styles/styles.scss';
// import './data/html.json';

// import data first to be then put into an array and then shuffled? TBD

// import viteLogo from '/vite.svg';
// import { setupCounter } from './counter.ts'

// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
//   <div>
//     <a href="https://vite.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>

//     <h1>Vite + TypeScript</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p>
//       Test Game
//     </p>
//   </div>
// `;

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
    throw new Error('Some elements cannot be found');
}

let questions: {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
}[] = [];

// global timer so that can be reset on new game start
let timerId: number | null = null;

// function to escape HTML in questions to ensure displayed as a string in dom
const escapeHTML = (str: string): string =>
    str.replace(/</g, '&lt;').replace(/>/g, '&gt;');

const loadQuestions = async () => {
    try {
        const response = await fetch('../html.json');
        const data = await response.json();
        // have to run as data.html to get the questions
        questions = data.html;
        // console.log('data.html: ', data.html);
        // console.log('questions:', questions[0].question);
    } catch (error) {
        console.error('Error: Failed to load questions:', error);
    }
};

// function to reset game timer on new game start
const resetGame = () => {
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
    }
};

// sort class start-screen styling
const renderStartScreen = () => {
    resetGame();
    app.innerHTML = `
        <div class="start-screen">
            <h2>Welcome to Code Countdown!</h2>
            <p>Test your coding knowledge and race against the clock.</p>
            <button id="start-btn">Start Game</button>
        </div>
    `;

    document
        .querySelector<HTMLButtonElement>('#start-btn')
        ?.addEventListener('click', () => {
            startGame();
        });
};

// register the index on click for options
// question-screen and option-btn styling to be sorted
const renderQuestion = (index: number) => {
    const questionData = questions[index];
    let timeRemaining = 10; // Can change time per round here - also need to change the innerHTML below if you do
    app.innerHTML = `
      <div class="question-screen">
          <h2>${escapeHTML(questionData.question)}</h2>
          <ul>
              ${questionData.options
                  .map(
                      (option, idx) =>
                          `<li>
                              <button class="option-btn" data-index="${idx}">
                                  ${escapeHTML(option)}
                              </button>
                          </li>`
                  )
                  .join('')}
          </ul>
          <div id="timer">Time Remaining: <span>10</span> seconds</div>
      </div>
  `;

    const startTimer = () => {
        timerId = setInterval(() => {
            timeRemaining -= 1;
            const timerDisplay = document.querySelector('#timer span');
            if (timerDisplay) {
                timerDisplay.textContent = String(timeRemaining);
            }

            if (timeRemaining <= 0) {
                clearInterval(timerId!);
                timerId = null;
                handleTimeout(index);
            }
        }, 1000);
    };

    const handleTimeout = (currentIndex: number) => {
        if (currentIndex + 1 < questions.length) {
            renderQuestion(currentIndex + 1);
        } else {
            renderEndScreen();
        }
    };

    document
        .querySelectorAll<HTMLButtonElement>('.option-btn')
        .forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const selectedIndex = parseInt(
                    (e.target as HTMLButtonElement).dataset.index! // need to fix this, using ! for now
                );
                clearInterval(timerId!);
                timerId = null;
                checkAnswer(selectedIndex, questionData.correctAnswer, index);
            });
        });

    startTimer();
};

const checkAnswer = (
    selectedIndex: number,
    correctIndex: number,
    questionIndex: number
) => {
    const buttons = document.querySelectorAll<HTMLButtonElement>('.option-btn');
    buttons.forEach((button, index) => {
        if (index === correctIndex) {
            button.classList.add('correct');
        } else if (index === selectedIndex) {
            button.classList.add('incorrect');
        }
    });

    // Wait before loading the next question to see correct or not
    setTimeout(() => {
        if (questionIndex + 1 < questions.length) {
            renderQuestion(questionIndex + 1);
        } else {
            renderEndScreen();
        }
    }, 1000);
};

// sort class end-screen styling
const renderEndScreen = () => {
    resetGame();
    app.innerHTML = `
      <div class="end-screen">
          <h2>Game Over!</h2>
          <button id="restart-btn">Restart</button>
      </div>
  `;

    document
        .querySelector<HTMLButtonElement>('#restart-btn')
        ?.addEventListener('click', () => {
            renderStartScreen();
        });
};

const startGame = async () => {
    resetGame();
    await loadQuestions();
    if (questions.length > 0) {
        renderQuestion(0);
    } else {
        console.error('No questions available');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    renderStartScreen();

    const newGameButton =
        document.querySelector<HTMLButtonElement>('#new-game-btn');
    newGameButton?.addEventListener('click', () => {
        resetGame();
        renderStartScreen();
    });
});
