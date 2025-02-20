let currentCategory = "";
let currentQuestionIndex = 0;
let timer;
let gameTime;
let players = [];
let currentPlayerIndex = 0;
let scores = {};
let role = "";
let correctAnswersCount = 0;

function handleAnswer(isCorrect) {
    if (isCorrect) {
        scores[players[currentPlayerIndex]]++;
        correctAnswersCount++;
        confetti();
    }

    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    currentQuestionIndex = (currentQuestionIndex + 1);

    if (currentQuestionIndex >= questions[currentCategory].length) {
        endGame();
    } else {
        displayQuestion();
    }
}

function endGame() {
    let winner = players.reduce((prev, current) => scores[prev] > scores[current] ? prev : current);
    let scoreMessage = "המשחק נגמר! הציונים:\n";
    players.forEach(player => {
        scoreMessage += player + ": " + scores[player] + " נקודות\n";
    });
    scoreMessage += "המנצח הוא: " + winner;
    scoreMessage += "\nתשובות נכונות: " + correctAnswersCount;

    alert(scoreMessage);
    document.getElementById("victory-sound").play();  // הפעלת מנגינת הניצחון
    location.reload();
}

const questions = {
    sport: [
        { question: "מהו הענף הספורטיבי עם הכי הרבה צופים בעולם?", answer: "כדורגל", incorrectAnswers: ["כדורסל", "טניס", "קריקט"] },
        { question: "באיזו שנה התקיימו המשחקים האולימפיים הראשונים?", answer: "1896", incorrectAnswers: ["1900", "1924", "1936"] },
        { question: "איזו מדינה זכתה במונדיאל 2018?", answer: "צרפת", incorrectAnswers: ["גרמניה", "ברזיל", "ארגנטינה"] },
        // הוסף כאן שאלות נוספות עד ל-10
    ],
    history: [
        { question: "מי היה ראש ממשלת ישראל הראשון?", answer: "דוד בן גוריון", incorrectAnswers: ["גולדה מאיר", "יצחק רבין", "מנחם בגין"] },
        { question: "באיזו שנה נוסדה מדינת ישראל?", answer: "1948", incorrectAnswers: ["1917", "1945", "1956"] },
        { question: "מי היה נשיא ארה\"ב בתקופת מלחמת העולם השנייה?", answer: "פרנקלין דלאנו רוזוולט", incorrectAnswers: ["הארי טרומן", "תומס ג'פרסון", "אברהם לינקולן"] },
        // הוסף כאן שאלות נוספות עד ל-10
    ],
    bible: [
        { question: "מי הוביל את יציאת מצרים?", answer: "משה רבנו", incorrectAnswers: ["יוסף הצדיק", "אברהם אבינו", "יצחק אבינו"] },
        { question: "בכמה ימי בריאה ברא ה' את העולם?", answer: "שישה", incorrectAnswers: ["שבעה", "חמישה", "ארבעה"] },
        { question: "מיהו המלך שהקים את המקדש הראשון?", answer: "שלמה המלך", incorrectAnswers: ["דוד המלך", "שאול המלך", "רחבעם המלך"] },
        // הוסף כאן שאלות נוספות עד ל-10
    ],
    science: [
        { question: "מהו הכוכב הקרוב ביותר לשמש?", answer: "כוכב חמה", incorrectAnswers: ["נוגה", "מאדים", "צדק"] },
        { question: "באיזו שנה נחתה אפולו 11 על הירח?", answer: "1969", incorrectAnswers: ["1965", "1970", "1975"] },
        { question: "מהי היחידה למדידת זרם חשמלי?", answer: "אמפר", incorrectAnswers: ["ואט", "וולט", "אוהם"] },
        // הוסף כאן שאלות נוספות עד ל-10
    ],
    culture: [
        { question: "מיהו המלחין הידוע ביצירותיו 'הסימפוניה התשיעית' ו'הפידליו'?", answer: "לודוויג ואן בטהובן", incorrectAnswers: ["יוהאן סבסטיאן באך", "וולפגנג אמדאוס מוצרט", "פיוטר איליץ' צ'ייקובסקי"] },
        { question: "איזה ספר נכתב על ידי לואיס קרול?", answer: "אליס בארץ הפלאות", incorrectAnswers: ["הארי פוטר", "הנסיך הקטן", "שר הטבעות"] },
        { question: "באיזה סרט אמר הארי דווייט את המשפט 'יודע אתה, איזו התחלה זו היא'?", answer: "מלך האריות", incorrectAnswers: ["היפה והחיה", "אלאדין", "מרי פופינס"] },
        // הוסף כאן שאלות נוספות עד ל-10
    ]
};

function setRole(selectedRole) {
    role = selectedRole;
    document.getElementById("role-selection").style.display = "none";

    if (role === "examiner") {
        document.getElementById("player-names-form").style.display = "block";
    } else if (role === "student") {
        players = ["שחקן 1", "שחקן 2"];
        players.forEach(player => scores[player] = 0);
        document.getElementById("category-screen").style.display = "block";
        document.getElementById("role-selection").style.display = "none";
    }
}

function submitPlayerNames() {
    let playerNamesInput = document.getElementById("player-names-input").value;
    players = playerNamesInput.split(",").map(name => name.trim());

    if (players.length < 2) {
        alert("צריך לפחות שני שחקנים!");
        return;
    }

    players.forEach(player => scores[player] = 0);
    document.getElementById("player-names-form").style.display = "none";
    document.getElementById("category-screen").style.display = "none";
    document.getElementById("game-screen").style.display = "block";
    displayQuestion();
}

function showTimedGameForm() {
    document.getElementById("timed-game-form").style.display = "block";
    document.getElementById("category-screen").style.display = "none";
}

function submitTimedGame() {
    let questionCount = document.querySelector('input[name="question-count"]:checked').value;
    let questionTime = 5; // 5 שניות לכל שאלה
    gameTime = questionCount * questionTime;

    let playerNames = prompt("הכנס שמות שחקנים, מופרדים בפסיקים (לדוגמה: שחקן 1, שחקן 2):");
    players = playerNames.split(",").map(name => name.trim());
    
    if (players.length < 2) {
        alert("צריך לפחות שני שחקנים!");
        return;
    }

    players.forEach(player => scores[player] = 0);

    document.getElementById("timed-game-form").style.display = "none";
    document.getElementById("game-screen").style.display = "block";
    document.getElementById("scoreboard").style.display = "block";
    document.getElementById("timer").style.display = "block";
    
    updateScoreboard();
    startCountdown();
    displayQuestion();
}

function startGame(category) {
    currentCategory = category;
    currentQuestionIndex = 0;
    document.getElementById("category-screen").style.display = "none";
    document.getElementById("game-screen").style.display = "block";
    displayQuestion();
}

function startCountdown() {
    let timeLeft = gameTime;
    document.getElementById("timer").innerText = "זמן נותר: " + timeLeft + " שניות";

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = "זמן נותר: " + timeLeft + " שניות";

        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}
function displayQuestion() {
    let questionData = questions[currentCategory][currentQuestionIndex];
    document.getElementById("question").innerText = questionData.question;
    
    let answersDiv = document.getElementById("answers");
    answersDiv.innerHTML = "";

    if (role === "examiner") {
        let correctAnswerDiv = document.createElement("div");
        correctAnswerDiv.innerText = "תשובה נכונה: " + questionData.answer;
        answersDiv.appendChild(correctAnswerDiv);
    }

    let allAnswers = [...questionData.incorrectAnswers];
    if (role === "student") {
        allAnswers.push(questionData.answer);
        shuffleArray(allAnswers);
    }

    allAnswers.forEach(answer => {
        let answerBtn = document.createElement("button");
        answerBtn.innerText = answer;
        answerBtn.classList.add("answer-option");
        answerBtn.onclick = function() { handleAnswer(answer === questionData.answer); };
        answersDiv.appendChild(answerBtn);
    });
}

function handleAnswer(isCorrect) {
    if (isCorrect) {
        scores[players[currentPlayerIndex]]++;
        confetti();
    }

    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    currentQuestionIndex = (currentQuestionIndex + 1) % questions[currentCategory].length;

    updateScoreboard();
    displayQuestion();
}

function updateScoreboard() {
    let scoreList = document.getElementById("score-list");
    scoreList.innerHTML = "";

    players.forEach(player => {
        let listItem = document.createElement("li");
        listItem.innerText = player + ": " + scores[player] + " נקודות";
        scoreList.appendChild(listItem);
    });
}

function confetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}


function endGame() {
    let winner = players.reduce((prev, current) => scores[prev] > scores[current] ? prev : current);
    alert("המשחק נגמר! הציון של " + players[0] + ": " + scores[players[0]] + ". הציון של " + players[1] + ": " + scores[players[1]] + ". המנצח הוא: " + winner);
    document.getElementById("victory-sound").play();  // הפעלת מנגינת הניצחון
    location.reload();
}

function goToMainMenu() {
    window.location.href = 'index.html'; // החלף בנתיב לתפריט הראשי שלך
}

function toggleMusic() {
    let music = document.getElementById("background-music");
    if (music.paused) {
        music.play();
    } else {
        music.pause();
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}