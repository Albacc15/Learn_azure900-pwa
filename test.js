let questions = [];
let currentPage = 1;
const questionsPerPage = 5;
let userAnswers = [];

async function loadQuestions() {
  try {
    const response = await fetch('questions.json');
    questions = await response.json();
    userAnswers = Array(questions.length).fill(null);
    renderPage(currentPage);
    updateProgress();
  } catch (error) {
    document.getElementById("questions-container").innerHTML = "<p class='text-red-600'>Erro ao cargar as preguntas.</p>";
  }
}

function renderPage(page) {
  const container = document.getElementById("questions-container");
  container.innerHTML = "";
  const start = (page - 1) * questionsPerPage;
  const end = Math.min(start + questionsPerPage, questions.length);

  for (let i = start; i < end; i++) {
    const q = questions[i];
    const div = document.createElement("div");
    div.className = "bg-white p-4 rounded shadow";
    div.innerHTML = `
      <p class="font-semibold mb-2">${i + 1}. ${q.question}</p>
      ${q.options.map((opt, idx) => `
        <label class="block">
          <input type="radio" name="q${i}" value="${idx}" ${userAnswers[i] === idx ? 'checked' : ''} onchange="saveAnswer(${i}, ${idx})" />
          ${opt}
        </label>
      `).join("")}
    `;
    container.appendChild(div);
  }
  renderPagination();
  updateProgress();
}

function renderPagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const totalPages = Math.ceil(questions.length / questionsPerPage);
  if (currentPage > 1) {
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Anterior";
    prevBtn.className = "px-4 py-2 bg-blue-600 text-white rounded";
    prevBtn.onclick = () => {
      currentPage--;
      renderPage(currentPage);
    };
    pagination.appendChild(prevBtn);
  }

  if (currentPage < totalPages) {
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Seguinte";
    nextBtn.className = "px-4 py-2 bg-blue-600 text-white rounded";
    nextBtn.onclick = () => {
      currentPage++;
      renderPage(currentPage);
    };
    pagination.appendChild(nextBtn);
  }

  if (currentPage === totalPages) {
    const finishBtn = document.createElement("button");
    finishBtn.textContent = "Finalizar";
    finishBtn.className = "px-4 py-2 bg-green-600 text-white rounded";
    finishBtn.onclick = showResult;
    pagination.appendChild(finishBtn);
  }
}

function saveAnswer(questionIndex, optionIndex) {
  userAnswers[questionIndex] = optionIndex;
  updateProgress();
}

function updateProgress() {
  const answered = userAnswers.filter(a => a !== null).length;
  const percent = Math.round((answered / questions.length) * 100);
  const progress = document.getElementById("progress");
  if (progress) {
    progress.style.width = percent + "%";
    progress.textContent = percent + "%";
  }
}

function showResult() {
  let correct = 0;
  questions.forEach((q, i) => {
    if (userAnswers[i] === q.answer) correct++;
  });

  const result = document.getElementById("result-container");
  result.innerHTML = `
    <div class="p-6 bg-green-100 rounded text-center font-bold text-lg">
      Teste finalizado!<br>
      Respostas correctas: ${correct} de ${questions.length}<br>
      Aciertos: ${Math.round((correct / questions.length) * 100)}%
    </div>
  `;
}

window.onload = loadQuestions;