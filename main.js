let questions = [];
let fetchQuestions = async (apiLink) => {
  let response = await fetch(apiLink);
  let data = await response.json();
  questions = shuffle(data.questions);
  if (questions) {
    renderQuiz();
  }
};

function renderQuiz() {
  let intro = document.querySelector(".intro");
  let start = document.querySelector(".start");
  let quiz = document.querySelector(".quiz");
  let result = document.querySelector(".result");
  let openQuiz = false;

  let timer = document.querySelector(".timer span");
  let interval;
  let duration = 6000;

  sessionStorage.setItem("openQuiz", openQuiz);

  if (intro) {
    start.addEventListener("click", () => {
      intro.remove();
      quiz.classList.add("active");

      let currentQuestion = 1;
      let numOfTrue = 0;

      let question = document.querySelector(".question");
      let answers = document.querySelectorAll(".answer");
      let current = document.querySelector(".current");
      let score = document.querySelector(".score span");
      let progress = document.querySelector(".progress .bar");

      timer.innerText = duration / 1000 + "s";

      createQuestionContent(currentQuestion);

      duration = 6000;
      clearInterval(interval);
      startInterval();

      answers.forEach((answer) => {
        answer.addEventListener("click", () => {
          let correctAnswer =
            questions[currentQuestion - 1][
              questions[currentQuestion - 1].correct_answer
            ];
          checkAnswer(answer, correctAnswer);
        });
      });

      function createQuestionContent(currentQuestion) {
        duration;
        current.innerText = `${currentQuestion} of ${questions.length}`;
        score.innerText = numOfTrue;

        question.innerText = questions[currentQuestion - 1].question;
        for (let i = 0; i < answers.length; i++) {
          answers[i].innerText =
            questions[currentQuestion - 1][`answer-${i + 1}`];
          answers[i].classList.remove("true", "false");
        }
      }

      function checkAnswer(answer, correctAnswer) {
        answers.forEach((btn) => (btn.style.pointerEvents = "none"));

        if (answer.textContent == correctAnswer) {
          numOfTrue++;
          score.innerText = numOfTrue;
          answer.classList.add("true");
        } else if (answer.textContent != correctAnswer) {
          answer.classList.add("false");
          answers.forEach((answer) => {
            if (answer.textContent == correctAnswer) {
              answer.classList.add("true");
            }
          });
        }

        progress.style.width = `${(currentQuestion / questions.length) * 100}%`;

        setTimeout(() => {
          currentQuestion++;

          if (currentQuestion <= questions.length) {
            createQuestionContent(currentQuestion);
            answers.forEach((answer) => {
              answer.style.pointerEvents = "all";
            });
            duration = 6000;
            clearInterval(interval);
            startInterval();
          } else {
            quiz.remove();
            result.classList.add("active");
            result.querySelector("p").innerText =
              `You scored ${numOfTrue} out of ${questions.length}`;
            document
              .querySelector(".result .start")
              .addEventListener("click", () => {
                location.reload();
              });
          }
        }, 1000);
      }

      function startInterval() {
        interval = setInterval(() => {
          duration -= 1000;
          timer.innerText = duration / 1000 + "s";
          if (duration == 0) {
            clearInterval(interval);
            if (currentQuestion <= questions.length) {
              let correctAnswer =
                questions[currentQuestion - 1][
                  questions[currentQuestion - 1].correct_answer
                ];

              answers.forEach((answer) => {
                if (answer.textContent == correctAnswer) {
                  answer.classList.add("true");
                }
                progress.style.width = `${(currentQuestion / questions.length) * 100}%`;
              });
            }

            setTimeout(() => {
              currentQuestion++;
              if (currentQuestion <= questions.length) {
                createQuestionContent(currentQuestion);
                answers.forEach((answer) => {
                  answer.style.pointerEvents = "all";
                });
                duration = 6000;
                clearInterval(interval);
                startInterval();
              } else {
                clearInterval(interval);
                quiz.remove();
                result.classList.add("active");
                result.querySelector("p").innerText =
                  `You scored ${numOfTrue} out of ${questions.length}`;

                document
                  .querySelector(".result .start")
                  .addEventListener("click", () => {
                    location.reload();
                  });
              }
            }, 1000);
          }
        }, 1000);
      }
    });
  }
}

fetchQuestions("./quiz.json");

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
