const temas = [
  {
    titulo: "Conceptos de nube",
    contenido: "La computación en la nube permite el acceso a recursos informáticos a través de internet. Hay modelos como IaaS, PaaS y SaaS."
  },
  {
    titulo: "Regiones y zonas",
    contenido: "Azure divide su infraestructura global en regiones y zonas de disponibilidad para ofrecer alta disponibilidad."
  },
  {
    titulo: "Modelo de responsabilidad compartida",
    contenido: "Microsoft y el cliente comparten la responsabilidad de la seguridad en la nube según el modelo de servicio utilizado."
  },
  {
    titulo: "Azure Portal y CLI",
    contenido: "Puedes gestionar recursos de Azure mediante el portal gráfico o la línea de comandos (CLI o PowerShell)."
  }
];

let current = 0;
const content = document.getElementById("content");
const btn = document.getElementById("nextBtn");

function mostrarTema() {
  const tema = temas[current];
  content.innerHTML = `
    <h2 class="text-xl font-semibold">${tema.titulo}</h2>
    <p>${tema.contenido}</p>
    <p class="text-sm text-gray-500 mt-2">Progreso: ${current + 1} de ${temas.length}</p>
  `;
  btn.textContent = current < temas.length - 1 ? "Siguiente" : "Reiniciar";
}

btn.addEventListener("click", () => {
  if (current < temas.length - 1) {
    current++;
  } else {
    current = 0;
  }
  mostrarTema();
});

mostrarTema();