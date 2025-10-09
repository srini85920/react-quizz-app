So this is a react based quiz-ffedback web project 

This whole system follows the concept of Low Level System Designs with following all the necessary SOLID principles ,there will be cases discussed

The Project layout is simple, there is a src folder where my react files along with javascripts files are there

The layout

react-quizz-app/
├── node_modules/
├── public/
│   └── index.html
├── src/
│   ├── assets/               
│   │   └── ...
│   │
│   ├── components/
│   │   ├── Button.jsx
│   │   ├── FeedbackGenerator.jsx   
│   │   ├── Loader.jsx              
│   │   ├── NavBar.jsx              
│   │   ├── QuizUI.jsx            
│   │   ├── ThemeToggle.jsx         
│   │   ├── QuestionCard.jsx 
│   │   ├── ProgressBar.jsx 
│   │   ├── ResultGraph.jsx 
│   │   ├── ScoreSummaryModal.jsx 
│   │   └── Timer.jsx 
│   │
│   ├── context/
│   │   ├── ThemeContext.jsx      
│   │   └── QuizContext.jsx 
│   │
│   ├── data/ 
│   │   └── quizData.json 
│   │
│   ├── hooks/
│   │   └── useQuizLogic.js       
│   │
│   ├── pages/
│   │   ├── quizzes/
│   │   │   ├── ArtQuizPage.jsx         
│   │   │   ├── ComputersQuizPage.jsx
│   │   │   ├── HistoryQuizPage.jsx
│   │   │   ├── QuizPage.jsx 
│   │   │   └── SportsQuizPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── HomePage.jsx
│   │   └── MainLayout.jsx
│   │
│   ├── screens/
│   │   ├── QuizListPage.jsx      
│   │   └── ResultsPage.jsx       
│   │
│   ├── services/
│   │   ├── aiService.js          
│   │   └── geminiService.js      
│   │
│   ├── App.jsx                   
│   ├── App.css
│   ├── global.css
│   ├── index.css
│   └── main.jsx                  
│
├── .env                          
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js


Solid principle ,taking about is 

S-Single Responsiblity is followed by all the file as there only single responsibility for each files

O-Open CLosed Principles ,so every files is closed for modification and seperate files can be added without any inference

L-Liskov Subsitution Principle ,here no file neccesaryily need to extend the functionalites of the parent they are free to use and can subsitute the parent class

I-Interface segration Principle no class is bulk they have only one responsiblity

D-The Dependency Inversion Principle (DIP) , the high-level modules should depend on abstractions (like interfaces), not on low-level modules, and vice-versa, here it is properly followed 

Here i have API from https://opentdb.com/api_category.php  Open DB a free source for questions on different topics  and i have predifend API for question feedback as well as question wise feedback 

