# Knowledge Station - NASA Space Apps Challenge 2025
Project for the NASA Space Apps Challenge hackathon 2025. For this year, our team chose to work on the "Build a Space Biology Knowledge Engine" challenge.

##  Project Overview
NASA has conducted hundreds of bioscience studies from space missions, making research difficult to understand. Our solution? **Knowledge Station**, an AI-based application to help users explore NASA’s bioscience publications easily and interactively. The platform summarizes, structures, and visualizes decades of space biology research in a single click, enabling scientists, students, and mission planners to discover insights more quickly.



##  Main Goal
Build a website that uses **AI** to summarize and organize NASA’s bioscience studies, allowing users to:
-  Search for specific research or keywords  
-  Filter studies by tags (e.g., *plants*, *muscles*, *space radiation*)  
-  Chat with an **Astronaut AI assistant** to get explanationsand recommendations  



##  Key Features

###  Home Page – Smart Search for NASA Knowledge
- **Search Bar:** Quickly find any article or keyword  
- **Tags:** Filter by topic for faster navigation  
- **AI Assistant:** Click the astronaut icon to start chatting  

###  Article View – Explore by Tags
- Displays all articles related to a selected tag  
- Each article card includes a title and a short abstract  
- Click any card to open detailed information  

###  Astronaut AI – Your Space Research Buddy
- Activated after clicking the astronaut icon  
- Users can chat directly with the AI assistant  
- The AI summarizes papers, answers questions, and suggests related studies  

## How to Run the Project
### 1. Clone the repository
```sh
  git clone ...
```
### 2. Install dependencies

```sh
  cd ./server
  npm install
  cd ./my-app
  npm install
```

### 3. Start the website
In a new terminal run
```sh
  cd my-app
  npm run dev
```

### 4. Start the server
In a new terminal run
```sh
  cd server
  node app.js
```


Open your browser and go to the local address shown in the first terminal (usually http://localhost:5173).

## Supporting Articles

**Active learning**: https://pubmed.ncbi.nlm.nih.gov/24821756/

**Cognitive Load Reduction**: https://www.sciencedirect.com/science/article/abs/pii/0959475294900035

**Multimodal Learning**: https://www.mdpi.com/2227-7102/9/3/210

**Personalized Learning**: https://scholarworks.uttyler.edu/cgi/viewcontent.cgi?params=/context/education_grad/article/1007&path_info=reviewed.Jorly_Thomas___Final_Dissertation_with_completed_signage_page_and_signature___UT_Tyler__EVALUATION_OF_PERSONALIZED_LEARNING_7_21_23__1_.pdf



##  Impact
- Makes NASA’s bioscience data **accessible** and **interactive**  
- Encourages **scientists, students, and enthusiasts** to explore complex research easily  
- Promotes **open science** by transforming static data into a dynamic knowledge experience 



##  Technology Stack
- **Frontend:** React + Vite  
- **Styling:** Tailwind CSS  
- **AI Integration:** Gemini AI
- **Data:** NASA Bioscience Publications Dataset  



## Team Members:
* Nika Balouchzadeh
* Claudia Sevilla Eslava
* Rene Ignacio Gonzalez Perez
* Omar Moussa
* Leo Blomdahl
* Georgi Hristov Penchev

## License 
The project is free to use and licensed under the [MIT License](Nasa-Space-Apps-2025/License)
