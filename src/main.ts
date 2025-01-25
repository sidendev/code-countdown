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

// Question interface to stop getting TS error warnings
interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
}

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
    throw new Error('App element cannot be found');
}

let questions: Question[] = [];
let timerId: number | null = null;
let correctAnswers: number = 0;
let incorrectAnswers: number = 0;
let questionTime: number = 10;
let selectedLanguage: string = '';

// function to escape HTML in questions to ensure displayed as a string in dom
const escapeHTML = (str: string): string =>
    str.replace(/</g, '&lt;').replace(/>/g, '&gt;');

// WIP
const pickRandomQuestions = (arr: Question[], count: number): Question[] => {
    const selectedQuestions: Question[] = [];
    const usedQuestions: number[] = [];

    while (selectedQuestions.length < count) {
        const randomIndex = Math.floor(Math.random() * arr.length);
        if (!usedQuestions.includes(randomIndex)) {
            usedQuestions.push(randomIndex);
            selectedQuestions.push(arr[randomIndex]);
        }
    }

    return selectedQuestions;
};

const loadQuestions = async (language: string) => {
    try {
        const response = await fetch(`../${language}.json`);
        const data = await response.json();
        questions = data[language] as Question[];
        questions = pickRandomQuestions(questions, 10); // If want to change number of questions need to update here
    } catch (error) {
        console.log('Error: Failed to load questions:', error);
    }
};

const resetGame = () => {
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
    }
};

// sort class start-screen styling
const renderStartScreen = () => {
    resetGame();
    correctAnswers = 0;
    incorrectAnswers = 0;

    app.innerHTML = `
        <div class="start-screen">
            <h2>Welcome to Code Countdown!</h2>
            <p>Test your coding knowledge and race against the clock.</p>
            <div class="language-buttons">
                <button id="html-btn">HTML</button>
                <button id="css-btn">CSS</button>
                <button id="js-btn">JavaScript</button>
                <button id="ts-btn">TypeScript</button>
                <button id="sql-btn">SQL</button>
            </div>
        </div>
    `;

    document
        .querySelector<HTMLButtonElement>('#html-btn')
        ?.addEventListener('click', () => {
            selectedLanguage = 'html';
            startGame();
        });

    document
        .querySelector<HTMLButtonElement>('#css-btn')
        ?.addEventListener('click', () => {
            selectedLanguage = 'css';
            startGame();
        });

    document
        .querySelector<HTMLButtonElement>('#js-btn')
        ?.addEventListener('click', () => {
            selectedLanguage = 'javascript';
            startGame();
        });

    document
        .querySelector<HTMLButtonElement>('#ts-btn')
        ?.addEventListener('click', () => {
            selectedLanguage = 'typescript';
            startGame();
        });

    document
        .querySelector<HTMLButtonElement>('#sql-btn')
        ?.addEventListener('click', () => {
            selectedLanguage = 'sql';
            startGame();
        });
};

const renderSettingsScreen = () => {
    app.innerHTML = `
        <div class="settings-screen">
            <h2>Settings</h2>
            <label for="time-select">Question Countdown Timer:</label>
            <select id="time-select">
                <option value="10" ${
                    questionTime === 10 ? 'selected' : ''
                }>10 seconds</option>
                <option value="20" ${
                    questionTime === 20 ? 'selected' : ''
                }>20 seconds</option>
                <option value="30" ${
                    questionTime === 30 ? 'selected' : ''
                }>30 seconds</option>
            </select>
            <button id="save-settings-btn">Save</button>
        </div>
    `;

    const saveSettingsButton =
        document.querySelector<HTMLButtonElement>('#save-settings-btn');
    const timeSelect =
        document.querySelector<HTMLSelectElement>('#time-select');
    saveSettingsButton?.addEventListener('click', () => {
        if (timeSelect) {
            questionTime = parseInt(timeSelect.value);
        }
        renderStartScreen(); // maybe change this to not auto go to start WIP
    });
};

const renderQuestion = (index: number) => {
    const questionData = questions[index];
    let timeRemaining = questionTime;

    app.innerHTML = `
      <div class="question-screen">
          <h2>${escapeHTML(questionData.question)}</h2>
          <ul>
              ${questionData.options
                  .map(
                      (option, index) =>
                          `<li>
                              <button class="option-btn" data-index="${index}">
                                  ${escapeHTML(option)}
                              </button>
                          </li>`
                  )
                  .join('')}
          </ul>
          <div id="timer">Time Remaining: <span>${timeRemaining}</span> seconds</div>
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
                incorrectAnswers++;
                clearInterval(timerId!); // NEED TO FIX THIS WIP
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
                const target = e.target as HTMLButtonElement;
                const indexValue = target.dataset.index ?? '';
                const selectedIndex = parseInt(indexValue);
                if (timerId) {
                    clearInterval(timerId);
                    timerId = null;
                }
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

    if (selectedIndex === correctIndex) {
        correctAnswers++;
    } else {
        incorrectAnswers++;
    }

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
    }, 1250);
};

// sort class end-screen styling
const renderEndScreen = () => {
    resetGame();
    const totalQuestions = correctAnswers + incorrectAnswers;
    app.innerHTML = `
      <div class="end-screen">
          <h2>Game Over!</h2>
          <p>You scored ${correctAnswers}/${totalQuestions}. Well done!</p>
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
    await loadQuestions(selectedLanguage);
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

    const settingsButton =
        document.querySelector<HTMLButtonElement>('#settings-btn');
    settingsButton?.addEventListener('click', () => {
        resetGame();
        renderSettingsScreen();
    });
});
