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
let questionTime: number = 10; // default time for questions
let questionsPerGame: number = 10; // default number of questions per game
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
        questions = pickRandomQuestions(questions, questionsPerGame);
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
// NEED TO FIX THIS AND FIND SOLUTION FOR TYPESCRIPT ICON
const renderStartScreen = () => {
    resetGame();
    correctAnswers = 0;
    incorrectAnswers = 0;

    app.innerHTML = `
        <div class="start-screen">
            <div class="text-content">
                <h2>Welcome to Code Countdown</h2>
                <p>Choose a programming language and test your knowledge against the clock. Ready to begin?</p>
            </div>
            <div class="language-buttons">
                <button id="html-btn">
                    <i class="fa-brands fa-html5"></i>
                    <span>HTML</span>
                </button>
                <button id="css-btn">
                    <i class="fa-brands fa-css3-alt"></i>
                    <span>CSS</span>
                </button>
                <button id="js-btn">
                    <i class="fa-brands fa-js"></i>
                    <span>JavaScript</span>
                </button>
                <button id="ts-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3,3v18h18V3H3z M13.666,12.451h-2.118V19H9.841v-6.549H7.767V11h5.899V12.451z M13.998,18.626v-1.751 c0,0,0.956,0.721,2.104,0.721c1.148,0,1.103-0.75,1.103-0.853c0-1.089-3.251-1.089-3.251-3.501c0-3.281,4.737-1.986,4.737-1.986 l-0.059,1.559c0,0-0.794-0.53-1.692-0.53c-0.897,0-1.221,0.427-1.221,0.883c0,1.177,3.281,1.059,3.281,3.428 C19,20.244,13.998,18.626,13.998,18.626z"/>
                    </svg>
                    <span>TypeScript</span>
                </button>
                <button id="sql-btn">
                    <i class="fa-solid fa-database"></i>
                    <span>SQL</span>
                </button>
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
            
            <div class="settings-group">
                <label for="time-select" class="form-label">Question Countdown Timer</label>
                <select class="form-select" id="time-select" aria-label="Select question time">
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
            </div>
            
            <div class="settings-group">
                <label for="count-select" class="form-label">Number of Questions Per Game</label>
                <select class="form-select" id="count-select" aria-label="Select number of questions">
                    <option value="10" ${
                        questionsPerGame === 10 ? 'selected' : ''
                    }>10 questions</option>
                    <option value="20" ${
                        questionsPerGame === 20 ? 'selected' : ''
                    }>20 questions</option>
                    <option value="30" ${
                        questionsPerGame === 30 ? 'selected' : ''
                    }>30 questions</option>
                </select>
            </div>

            <button id="save-settings-btn">Save Settings</button>
        </div>
    `;

    const saveSettingsButton =
        document.querySelector<HTMLButtonElement>('#save-settings-btn');
    const timeSelect =
        document.querySelector<HTMLSelectElement>('#time-select');
    const countSelect =
        document.querySelector<HTMLSelectElement>('#count-select');

    saveSettingsButton?.addEventListener('click', () => {
        if (timeSelect) {
            questionTime = parseInt(timeSelect.value);
        }
        if (countSelect) {
            questionsPerGame = parseInt(countSelect.value);
        }

        renderStartScreen(); // maybe change this to not auto go to start WIP
    });
};

const renderQuestion = (index: number) => {
    const questionData = questions[index];
    let timeRemaining = questionTime;

    app.innerHTML = `
      <div class="question__container">
          <div class="question__timer">Time Remaining: <span class="question__timer-count">${timeRemaining}</span></div>
          <div class="question__text">${escapeHTML(questionData.question)}</div>
          <div class="question__options">
              ${questionData.options
                  .map(
                      (option, index) =>
                          `<button class="question__option" data-index="${index}">
                              ${escapeHTML(option)}
                           </button>`
                  )
                  .join('')}
          </div>
      </div>
  `;

    const startTimer = () => {
        timerId = setInterval(() => {
            timeRemaining -= 1;
            const timerDisplay = document.querySelector(
                '.question__timer-count'
            );
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
        .querySelectorAll<HTMLButtonElement>('.question__option')
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
    const buttons =
        document.querySelectorAll<HTMLButtonElement>('.question__option');

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
          <h2>Game Over</h2>
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

// Using Bootstrap classes for styling on this screen
const renderAboutScreen = () => {
    resetGame();
    app.innerHTML = `
        <div class="about-screen">
            <h2>About Code Countdown</h2>
            <p class="mb-4">
                Code Countdown is a quiz game designed to help test and improve your coding knowledge.
                Race against the clock while answering questions about different programming languages and concepts.
            </p>

            <h3 class="mb-3">Frequently Asked Questions:</h3>
            <div class="accordion" id="faqAccordion">

                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                            Can I change how many questions I have per game?
                        </button>
                    </h2>
                    <div id="faq1" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                        <div class="accordion-body">
                            Yes, You can adjust the number of questions per game in the Settings menu.
                        </div>
                    </div>
                </div>

                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                            Can I change the amount of time I have per question?
                        </button>
                    </h2>
                    <div id="faq2" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                        <div class="accordion-body">
                            Yes, You can adjust the time per question in the Settings menu.
                        </div>
                    </div>
                </div>

                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                            What programming languages are available?
                        </button>
                    </h2>
                    <div id="faq3" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                        <div class="accordion-body">
                            Currently, the quizzes available are in HTML, CSS, JavaScript, TypeScript, and SQL.
                        </div>
                    </div>
                </div>

                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">
                            What happens when I run out of time on a question?
                        </button>
                    </h2>
                    <div id="faq4" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                        <div class="accordion-body">
                            That question will be marked as being incorrect.
                        </div>
                    </div>
                </div>

            </div>

            <button id="back-to-start" class="mt-4">Back to Start</button>
        </div>
    `;

    document
        .querySelector<HTMLButtonElement>('#back-to-start')
        ?.addEventListener('click', () => {
            renderStartScreen();
        });
};

document.addEventListener('DOMContentLoaded', () => {
    renderStartScreen();

    const newGameButtons =
        document.querySelectorAll<HTMLButtonElement>('#new-game-btn');
    newGameButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            resetGame();
            renderStartScreen();
        });
    });

    const settingsButtons =
        document.querySelectorAll<HTMLButtonElement>('#settings-btn');
    settingsButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            resetGame();
            renderSettingsScreen();
        });
    });

    const aboutButtons =
        document.querySelectorAll<HTMLButtonElement>('#about-btn');
    aboutButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            resetGame();
            renderAboutScreen();
        });
    });
});
