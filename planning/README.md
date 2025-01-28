# Code Countdown
## Software Development Quiz App with Countdown Timer

## Project Breakdown

  'Code Countdown' is a quiz application aimed at fullstack web application developers. With different code languages to choose. 
  The game has an added twist of having a countdown timer for each question so you have to race against the clock. 
  As the game progresses the questions will get harder and the time for each question gets shorter. 
  Can you beat your previous highest score? 

## Initial planning and design

-   [ ] Create a basic wireframe of the layout/screens for the application in Figma.
-   [ ] Choose fonts and colours to be used on the app.
-   [ ] Confirm layout for questions and answers in JSON format for testing, create some test questions during buildout.
  
## Tech-Stack

-   [ ] HTML, SCSS, TS, VITE.
-   [ ] If using draggable elements for answers confirm what library can be used if needed. Possibly using draggable.js or swapy. Non-MVP feature for now.
-   [ ] Set up project with Vite and SCSS set up and connected to Github

## HTML / SCSS

-   [ ] Set upp SCSS partials for responsive layouts, colours and typography.
-   [ ] Layout and skeleton for a question to be displayed with four possible answers.
-   [ ] The answers need to be clickable and register a click event, set up ID's and classes.
-   [ ] Confirm BEM structure, what keywords to use for containers and elements.
-   [ ] Create a responsive header with the game title and a start button.
-   [ ] Add icons or any other media needed for design.
-   [ ] Create a timer element to display the countdown for each question.
-   [ ] Design a progress bar to show how far the user is through the quiz.
-   [ ] Create a results screen layout to display the user's score after completing the quiz.
-   [ ] Create a new game button that restarts a new game, keeping the previous score in 
-   [ ] Code selection button at start screen to choose questions based on code language. 
-   [ ] Style the buttons and layout:
    -   [ ] Add fonts / font sizing.
    -   [ ] Add colours to fonts and backgrounds.
    -   [ ] Design border radius and any shadows.
    -   [ ] Add hover effects and animations on button presses.
    -   [ ] Add any animations for correct / incorrect selection.
    -   [ ] Add animations / effects for final score section
    -   [ ] Add countdown timer animation - clock countdown effect.

## TypeScript Logic

-   [ ] **General Game Logic**:
    -   [ ] Display a question and its four possible answers.
    -   [ ] Shuffle the answers so they appear in random order each time game is played.
    -   [ ] Check the user's selected answer against the correct answer - use json file for now for db of questions.
    -   [ ] Track the user's progress through the quiz.
    -   [ ] Reduce time for each subsequent question, maybe start at 60sec. Will have to test and come up with a minimal time per question, maybe 8 seconds?
    -   [ ] End the question if the timer runs out, automatically goes to next question.
    -   [ ] Maintain and keep track of score, question index and time remaining. As time will reduce through the game this will need to be kept track of.
-   [ ] **Events**:
    -   [ ] Set up buttons with ID's and/or classes.
    -   [ ] Trigger the next question once an answer is selected or time runs out.
    -   [ ] Listen for click on start game to start the game.
    -   [ ] Listen for click on answer selection and register selection.
    -   [ ] Record answer selection and move to the next question.
-   [ ] **Timer**:
    -   [ ] Start a countdown timer when a question is displayed.
    -   [ ] Reset the timer for the next question.
    -   [ ] End that particular question if the timer reaches zero and register as an incorrect answer.

## Question Database structure

-   [ ] For the MVP have the questions and answers in json format and stored locally or     directory as application.
-   [ ] confirm layout for questions, text string for question. Boolean for the answers, true being the correct answer. Will need to group them in languages and/or skill level.

## Non-MVP future features

-   [ ] Add skill levels to the game: Junior, Mid-Level, Senior. Users can choose a set of questions based on their skill level.
-   [ ] For some questions, have draggable elements to answer questions (example: drag and drop the correct code block into a blank).
-   [ ] Enable sharing the highest score via social network links.
-   [ ] Add user accounts to store scores and track progress.
-   [ ] Allow users to add their own questions and answers, similar to an ANKI deck.
-   [ ] Connect to an API for a wider selection of questions.
-   [ ] Integrate with AI (example: ChatGPT) to generate questions for specific libraries or tools the user specifies. Maybe the user can give a link to a docs website and teh AI can generate some questions based on it. (useful for interview preparation).