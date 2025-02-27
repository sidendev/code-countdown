import './styles/styles.scss';

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
let timerId: ReturnType<typeof setInterval> | null = null;
let correctAnswers: number = 0;
let incorrectAnswers: number = 0;
let questionTime: number = 10; // Default time for questions
let questionsPerGame: number = 10; // Default number of questions per game
let selectedLanguage: string = '';

// Function to escape HTML in answers to ensure displayed as a string, some answers are HTML tags
const escapeHTML = (str: string): string =>
    str.replace(/</g, '&lt;').replace(/>/g, '&gt;');

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
        const response = await fetch(`./${language}.json`);
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

// Using SVG file for typescript icon as none on fontawesome
const renderStartScreen = () => {
    resetGame();
    correctAnswers = 0;
    incorrectAnswers = 0;

    app.innerHTML = `
        <div class="start-screen">
            <div>

                <h2>Welcome to Code Countdown</h2>

                <p>Choose a programming language and test your knowledge against the clock.</p>

                <p>In settings you can change the timer length or the number of questions per game.</p>

                <p>Ready? 3, 2, 1, Lets Go!</>

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
                    <img src="./typescript-icon.svg" alt="TypeScript Icon" width="24" height="24" />
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
                <label for="time-select" class="form-label">Question Countdown Timer:</label>
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
                <label for="count-select" class="form-label">Number of Questions Per Game:</label>
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

        renderStartScreen();
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

                if (timerId !== null) {
                    clearInterval(timerId);
                    timerId = null;
                }

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
        console.log('No questions available');
    }
};

// Using Bootstrap classes for styling and accordion on the About screen
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
        document.querySelectorAll<HTMLButtonElement>('#newGameBtn');
    newGameButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            resetGame();
            renderStartScreen();
        });
    });

    const settingsButtons =
        document.querySelectorAll<HTMLButtonElement>('#settingsBtn');
    settingsButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            resetGame();
            renderSettingsScreen();
        });
    });

    const aboutButtons =
        document.querySelectorAll<HTMLButtonElement>('#aboutBtn');
    aboutButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            resetGame();
            renderAboutScreen();
        });
    });
});
