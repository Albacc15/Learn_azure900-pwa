let questions = [];
let currentPage = 0;
const questionsPerPage = 5;
let correctAnswers = 0;
let answeredCount = 0;

function getRandomQuestions(arr, num) {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
}

async function loadQuestions() {
  try {
    const response = await fetch('questions.json');
    const allQuestions = await response.json();
    questions = getRandomQuestions(allQuestions, 20); // selecciona 20 al azar
    renderPage(currentPage);
  } catch (error) {
    console.error('Error cargando questions.json:', error);
    document.getElementById('questions-container').innerHTML = "<p>Erro ao cargar as preguntas.</p>";
  }
}

function renderPage(page) {
  const container = document.getElementById("questions-container");
  container.innerHTML = "";

  const start = page * questionsPerPage;
  const end = start + questionsPerPage;
  const pageQuestions = questions.slice(start, end);

  pageQuestions.forEach((q, i) => {
    const questionIndex = start + i;
    const div = document.createElement("div");
    div.className = "question mb-6 p-4 bg-white rounded shadow";

    div.innerHTML = `<p class="font-semibold">${questionIndex + 1}. ${q.question}</p>`;

    const ul = document.createElement("ul");
    ul.className = "options list-none pl-0";

    q.options.forEach((opt, j) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <label class="block my-2">
          <input type="radio" name="q${questionIndex}" value="${j}" class="mr-2"> ${opt}
        </label>`;
      ul.appendChild(li);
    });

    div.appendChild(ul);

    const button = document.createElement("button");
    button.className = "mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700";
    button.textContent = "Comprobar";
    button.onclick = () => checkAnswer(questionIndex, q.answer, q.explanation);
    div.appendChild(button);

    const feedback = document.createElement("p");
    feedback.id = `f${questionIndex}`;
    feedback.className = "feedback mt-2 font-bold";
    div.appendChild(feedback);

    container.appendChild(div);
  });

  renderNavigation();
  updateProgressBar();
}

function checkAnswer(index, correctIndex, explanation) {
  const radios = document.getElementsByName("q" + index);
  const feedback = document.getElementById("f" + index);
  let selected = -1;

  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      selected = parseInt(radios[i].value);
      break;
    }
  }

  if (selected === -1) {
    feedback.innerText = "Selecciona unha opción.";
    feedback.style.color = "orange";
    return;
  }

  if (!feedback.dataset.answered) {
    answeredCount++;
    if (selected === correctIndex) correctAnswers++;
    feedback.dataset.answered = "true";
  }

  if (selected === correctIndex) {
    feedback.innerText = "✔ Correcto. " + explanation;
    feedback.style.color = "green";
  } else {
    feedback.innerText = "✘ Incorrecto. " + explanation;
    feedback.style.color = "red";
  }

  updateProgressBar();
}

function renderNavigation() {
  const nav = document.getElementById("pagination");
  nav.innerHTML = "";

  if (currentPage > 0) {
    const prev = document.createElement("button");
    prev.textContent = "← Anterior";
    prev.className = "mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400";
    prev.onclick = () => {
      currentPage--;
      renderPage(currentPage);
    };
    nav.appendChild(prev);
  }

  if ((currentPage + 1) * questionsPerPage < questions.length) {
    const next = d
