const questionsPerPage = 5;
let currentPage = 0;
let userAnswers = [];
let correctAnswers = [];
let explanations = [];
let score = 0;

// Simulación de 40 preguntas del examen con 4 opciones cada una
const questions = [
  {
    question: "¿Qué es Microsoft Azure?",
    options: [
      "Un sistema operativo",
      "Un servicio de correo electrónico",
      "Una plataforma en la nube",
      "Una base de datos"
    ],
    answer: 2,
    explanation: "Azure es una plataforma en la nube que proporciona servicios como máquinas virtuales, almacenamiento, redes, etc."
  },
  {
    question: "¿Qué modelo de servicio permite al cliente gestionar solo las aplicaciones y los datos?",
    options: [
      "IaaS",
      "PaaS",
      "SaaS",
      "On-Premise"
    ],
    answer: 1,
    explanation: "PaaS permite centrarse en las aplicaciones y datos; la infraestructura y sistema operativo los gestiona el proveedor."
  },
  // Añade más preguntas aquí (hasta completar las 40)
];

// Inicializa las respuestas y explicaciones
for (let i = 0; i < questions.length; i++) {
  userAnswers.push(null);
  correctAnswers.push(questions[i].answer);
  explanations.push(questions[i].explanation);
}

function renderQuestions() {
  const container = document.getElementById("question-container");
  container.innerHTML = "";
  const start = currentPage * questionsPerPage;
  const end = start + questionsPerPage;

  for (let i = start; i < end && i < questions.length; i++) {
    const q = questions[i];
    const div = document.createElement("div");
    div.className = "mb-6 p-4 bg-white shadow rounded";

    const title = document.createElement("h3");
    title.className = "font-semibold text-lg mb-2";
    title.textContent = `Pregunta ${i + 1}: ${q.question}`;
    div.appendChild(title);

    q.options.forEach((opt, idx) => {
      const label = document.createElement("label");
      label.className = "block mb-1";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = `q${i}`;
      input.value = idx;
      input.className = "mr-2";
      input.checked = userAnswers[i] === idx;
      input.onclick = () => userAnswers[i] = idx;

      label.appendChild(input);
      label.appendChild(document.createTextNode(opt));
      div.appendChild(label);
    });

    container.appendChild(div);
  }

  document.getElementById("page-indicator").textContent = `Página ${currentPage + 1} de ${Math.ceil(questions.length / questionsPerPage)}`;
}

function nextPage() {
  if ((currentPage + 1) * questionsPerPage < questions.length) {
    currentPage++;
    renderQuestions();
  }
}

function prevPage() {
  if (currentPage > 0) {
    currentPage--;
    renderQuestions();
  }
}

function submitTest() {
  let resultContainer = document.getElementById("result-container");
  resultContainer.innerHTML = "";
  score = 0;

  questions.forEach((q, idx) => {
    const user = userAnswers[idx];
    const correct = correctAnswers[idx];

    const div = document.createElement("div");
    div.className = "mb-4 p-4 rounded " + (user === correct ? "bg-green-100" : "bg-red-100");

    const question = document.createElement("p");
    question.className = "font-semibold";
    question.textContent = `Pregunta ${idx + 1}: ${q.question}`;
    div.appendChild(question);

    const result = document.createElement("p");
    result.textContent = user === correct
      ? "✅ Correcta"
      : `❌ Incorrecta. Respuesta correcta: ${q.options[correct]}`;
    div.appendChild(result);

    const expl = document.createElement("p");
    expl.className = "text-sm mt-1";
    expl.textContent = `📘 Explicación: ${explanations[idx]}`;
    div.appendChild(expl);

    resultContainer.appendChild(div);

    if (user === correct) score++;
  });

  localStorage.setItem("lastScore", score);
  localStorage.setItem("totalQuestions", questions.length);
  alert(`Test finalizado. Has acertado ${score} de ${questions.length} preguntas.`);
  document.getElementById("question-container").style.display = "none";
  document.getElementById("navigation").style.display = "none";
  document.getElementById("submit-btn").style.display = "none";
  document.getElementById("result-container").style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => {
  renderQuestions();
});
