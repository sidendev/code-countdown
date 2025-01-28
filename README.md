# Code Countdown Quiz

**Code Countdown**, an interactive game to help you learn your coding language. built using **Vite**, **TypeScript**, **SCSS**, and **HTML**. The project is deployed on GitHub Pages and can be accessed via the live link below. 

## Overview

- **Game Description**  
  Code Countdown is designed to test your coding logic and problem-solving skills. Players race against the clock to complete the questions.

- **Tech Stack**  
  - **Vite**: Fast build tool for web apps.
  - **TypeScript**: For type safety and clean, maintainable code.
  - **SCSS**: Modular and reusable styles for better maintainability.
  - **HTML**: Semantic markup for accessibility and structure.

- **Key Features**  
  - Responsive design optimised for desktop, tablet, and mobile.
  - Library of questions and answers in various code languages.
  - Deployed to GitHub Pages for easy access.
  - Settings section for changing question time and amount of questions per game.
  - Includes Bootstrap components for settings, mobile navigation, and FAQ section.

## Live Demo

View the live site here:  
[**https://sidendev.github.io/code-countdown/**](https://sidendev.github.io/code-countdown/)

## Repository Link

Check out the repository on GitHub:  
[**https://github.com/sidendev/code-countdown**](https://github.com/sidendev/code-countdown)

## How to Clone & Run Locally

Follow the steps below to clone and run the project locally:

1. **Clone the Repo:**  
   Open your terminal and run:  
   `git clone https://github.com/sidendev/code-countdown.git`

2. **Navigate to the Project Folder:**  
   `cd code-countdown`

3. **Install Dependencies:**  
   Make sure you have Node.js installed, then run:  
   `npm install`

4. **Run the Development Server:**  
   Start the project locally with:  
   `npm run dev`

5. **View in Your Browser:**  
   Open the URL provided by Vite (example: `http://localhost:5173`) to see the game.

## Known Bugs

- The dropdown for the Bootstrap dropdown menu on the **Settings** screen doesn't currently work on mobile view. It functions correctly on tablet and desktop, but on mobile, the dropdown floats off to the left.
- Issues were encountered when implementing certain Bootstrap components, including:
  - **Settings Screen Dropdown**: As mentioned, mobile view is problematic.
  - **Navbar Offcanvas**: Used for navigation on mobile and tablet views.
  - **Accordion**: Implemented in the FAQ section on the About screen. 

## Future Improvements

If more time were available, the following improvements would be made:

1. **Code Organisation**  
   - Separate the functions into individual files for better modularity. Currently, the main functionality is all in `main.ts`.
   
2. **Naming Conventions**  
   - Refactor class and ID names to follow best practices.
   
3. **SCSS Refinements**  
   - Make styles more modular and reusable using more mixins and variables.
   - Reduce the amount of code in `styles.scss`.

4. **Styling Enhancements**  
   - Spend additional time refining the overall look and feel of the game.
   - Implement what I had planned for the styling in the planning README.

5. **Additional Features**  
   - Complete features listed in the planning README, can be found at: `/planning/README`.

## Roadmap

1. Fix the Bootstrap dropdown bug on the **Settings** screen for mobile view.
2. Refactor the main codebase into smaller, modular files.
3. Improve SCSS for better reusability and maintainability.
4. Add more styling and features as outlined in the planning README.

Thank you for checking out Code Countdown.
