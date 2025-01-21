import './styles/styles.scss';
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

// register the index on click
const renderQuestion = (question: string, options: string[]) => {
    app.innerHTML = `
        <div class="question-screen">
            <h2>${question}</h2>
            <ul>
                ${options
                    .map(
                        (option) =>
                            `<li><button class="option-btn">${option}</button></li>`
                    )
                    .join('')}
            </ul>
            <div id="timer">Time Remaining: <span>10</span> seconds</div>
        </div>
    `;

    // timer function starts
};

function startGame() {
    const questions = [
        {
            question: 'What does HTML stand for?',
            options: [
                'Hypertext Markup Language',
                'Hyperlink and Text Markup Language',
                'Home Tool Markup Language',
                'Hyper Tool Markup Language',
            ],
        },
    ];
    renderQuestion(questions[0].question, questions[0].options);
}

document.addEventListener('DOMContentLoaded', () => {
    renderStartScreen();
});
