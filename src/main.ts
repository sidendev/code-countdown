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

const loadQuestions = async () => {
    try {
        const response = await fetch('../public/html.json');
        const data = await response.json();
        // have to run as data.html to get the questions
        questions = data.html;
        // console.log('data.html: ', data.html);
    } catch (error) {
        console.error('Error: Failed to load questions:', error);
    }
};

const renderStartScreen = () => {
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
// timer function
const renderQuestion = (index: number) => {
    const questionData = questions[index];
    app.innerHTML = `
      <div class="question-screen">
          <h2>${questionData.question}</h2>
          <ul>
              ${questionData.options
                  .map(
                      (option, idx) =>
                          `<li>
                              <button class="option-btn" data-index="${idx}">
                                  ${option}
                              </button>
                          </li>`
                  )
                  .join('')}
          </ul>
          <div id="timer">Time Remaining: <span>10</span> seconds</div>
      </div>
  `;

    document
        .querySelectorAll<HTMLButtonElement>('.option-btn')
        .forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const selectedIndex = parseInt(
                    (e.target as HTMLButtonElement).dataset.index! // need to fix this, using ! for now
                );
                checkAnswer(selectedIndex, questionData.correctAnswer, index);
            });
        });
};

const checkAnswer = (
    selectedIndex: number,
    correctIndex: number,
    questionIndex: number
) => {
    const buttons = document.querySelectorAll<HTMLButtonElement>('.option-btn');
    buttons.forEach((button, idx) => {
        if (idx === correctIndex) {
            button.classList.add('correct');
        } else if (idx === selectedIndex) {
            button.classList.add('incorrect');
        }
    });

    // Wait before loading the next question
    setTimeout(() => {
        if (questionIndex + 1 < questions.length) {
            renderQuestion(questionIndex + 1);
        } else {
            renderEndScreen();
        }
    }, 1000);
};

const renderEndScreen = () => {
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
    await loadQuestions();
    if (questions.length > 0) {
        renderQuestion(0);
    } else {
        console.error('No questions available');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    renderStartScreen();
});
