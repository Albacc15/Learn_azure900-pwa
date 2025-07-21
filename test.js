// Variables globales
let questions = [];
let currentPage = 0;
const questionsPerPage = 5;
let correctAnswers = 0;
let answeredCount = 0;

// Función para mezclar aleatoriamente un array (Fisher-Yates shuffle)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Selecciona preguntas aleatorias sin repetir
function getRandomQuestions(allQuestions, num = 20) {
  const shuffled = shuffleArray([...allQuestions]); // hacer copia y mezclar
  return shuffled.slice(0, num);
}

// Carga las preguntas desde el JSON y renderiza la primera página
async function loadQuestions() {
  try {
    const response = await fetch('questions.json');
    const allQuestions = await response.json();

    questions = getRandomQuestions(allQuestions, 20); // selecciona 20 al azar

    currentPage = 0;       // empezar desde la página 0
    correctAnswers = 0;    // reset contador aciertos
    answeredCount = 0;     // reset contador respondidas

    document.getElementById("result-container").innerHTML = "";
    document.getElementById("questions-container").style.display = "";
    document.getElementById("pagination").style.display = "";

    renderPage(currentPage);
  } catch (error) {
    console.error('Error cargando questions.json:', error);
    document.getElementById('questions-container').innerHTML = "<p>Erro ao cargar as preguntas.</p>";
  }
}

// Muestra una página del test (5 preguntas)
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
        <label class="block my-2 cursor-pointer">
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

// Comprobación de respuestas
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

  // Mostrar resultado final solo si todas las preguntas han sido respondidas
  if (answeredCount === questions.length) {
    showFinalResult();
  }
}

// Navegación entre páginas
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
    const next = document.createElement("button");
    next.textContent = "Seguinte →";
    next.className = "px-4 py-2 bg-blue-300 rounded hover:bg-blue-400";
    next.onclick = () => {
      currentPage++;
      renderPage(currentPage);
    };
    nav.appendChild(next);
  }
}

// Barra de progreso
function updateProgressBar() {
  const total = questions.length;
  const bar = document.getElementById("progress");
  const percent = total ? Math.round((answeredCount / total) * 100) : 0;
  bar.style.width = percent + "%";
  bar.textContent = `${percent}%`;
}

// Mostrar resultado final y botón reiniciar
function showFinalResult() {
  const container = document.getElementById("questions-container");
  const pagination = document.getElementById("pagination");
  const resultContainer = document.getElementById("result-container");

  container.style.display = "none";
  pagination.style.display = "none";

  const total = questions.length;
  const percent = Math.round((correctAnswers / total) * 100);

  let message = "";
  if (percent >= 90) {
    message = "🎉 Excelente resultado!(>90)";
  } else if (percent >= 70) {
    message = "👍 Buen trabajo, sigue practicando(>70).";
  } else {
    message = "💪 Ánimo, puedes mejorar.";
  }

  resultContainer.innerHTML = `
    <p class="text-xl font-bold mb-4">Fin del test.</p>
    <p class="mb-2">Has contestado correctamente <strong>${correctAnswers}</strong> de <strong>${total}</strong> preguntas.</p>
    <p class="mb-4">Tu puntuación: <strong>${percent}%</strong></p>
    <p class="mb-6">${message}</p>
    <button id="restart-btn" class="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">Reiniciar test</button>
  `;

  document.getElementById("restart-btn").onclick = () => {
    resultContainer.innerHTML = "";
    container.style.display = "";
    pagination.style.display = "";
    loadQuestions();
  };

  // Actualizar barra progreso al 100%
  const bar = document.getElementById("progress");
  bar.style.width = "100%";
  bar.textContent = "100%";
}

// ⬇️ Iniciar la carga al cargar DOM
window.addEventListener("DOMContentLoaded", loadQuestions);
