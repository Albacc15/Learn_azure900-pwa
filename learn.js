const blocks = [
    {
        title: "1. ¿Qué es Azure?",
        content: `
        Microsoft Azure es una plataforma en la nube que ofrece más de 200 productos y servicios, desde almacenamiento hasta inteligencia artificial.
        Permite a las empresas ejecutar sus aplicaciones y servicios sin necesidad de tener servidores físicos.
        `
    },
    {
        title: "2. Tipos de servicios en la nube",
        content: `
        Azure ofrece tres modelos principales:
        - **IaaS (Infraestructura como servicio)**: Proporciona servidores virtuales, redes y almacenamiento (por ejemplo, Azure Virtual Machines).
        - **PaaS (Plataforma como servicio)**: Proporciona entornos completos de desarrollo y despliegue (por ejemplo, Azure App Service).
        - **SaaS (Software como servicio)**: Aplicaciones completas listas para usar (por ejemplo, Microsoft 365).
        `
    },
    {
        title: "3. Beneficios de Azure",
        content: `
        - **Escalabilidad**: Puedes aumentar o reducir recursos según la demanda.
        - **Pago por uso**: Solo pagas por lo que consumes.
        - **Alta disponibilidad**: Servicios distribuidos globalmente con respaldo automático.
        - **Cumplimiento**: Cumple con normas como GDPR, ISO 27001, HIPAA.
        `
    },
    {
        title: "4. Seguridad en Azure",
        content: `
        - **Azure Active Directory**: Gestión de identidades.
        - **Azure Defender**: Protección contra amenazas.
        - **Seguridad en capas**: Redes, identidad, datos, aplicaciones.
        `
    },
    {
        title: "5. Servicios de IA y análisis",
        content: `
        Azure incluye servicios de IA accesibles sin saber programar:
        - **Cognitive Services**: Visión, voz, lenguaje natural, traducción.
        - **Azure Machine Learning**: Entrenamiento y despliegue de modelos.
        - **Power BI**: Visualización de datos.
        `
    },
    {
        title: "6. Herramientas de gestión y despliegue",
        content: `
        - **Azure Portal**: Interfaz web.
        - **Azure CLI**: Línea de comandos.
        - **Plantillas ARM**: Automatización de infraestructura.
        `
    },
    {
        title: "7. Facturación y precios",
        content: `
        - **Calculadora de precios**: Para estimar costes.
        - **Azure Cost Management**: Seguimiento y control de gastos.
        `
    },
    {
        title: "8. Cumplimiento y confianza",
        content: `
        Azure ofrece más de 90 certificaciones globales.
        Garantiza soberanía de datos, privacidad y transparencia.
        `
    }
];

const contentDiv = document.getElementById("content");
const progressText = document.getElementById("progressText");

function renderContent() {
    const completed = JSON.parse(localStorage.getItem("learnProgress") || "[]");

    blocks.forEach((block, index) => {
        const section = document.createElement("section");
        section.className = "bg-white p-4 rounded shadow";

        const title = document.createElement("h2");
        title.className = "text-xl font-semibold mb-2";
        title.innerText = block.title;

        const paragraph = document.createElement("p");
        paragraph.className = "text-sm";
        paragraph.innerHTML = block.content;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "mt-4";
        checkbox.checked = completed.includes(index);
        checkbox.addEventListener("change", () => {
            if (checkbox.checked) completed.push(index);
            else completed.splice(completed.indexOf(index), 1);
            localStorage.setItem("learnProgress", JSON.stringify(completed));
            updateProgress();
        });

        const label = document.createElement("label");
        label.className = "ml-2 text-sm";
        label.innerText = "Marcar como leído";

        const checkboxContainer = document.createElement("div");
        checkboxContainer.className = "mt-4 flex items-center";
        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(label);

        section.appendChild(title);
        section.appendChild(paragraph);
        section.appendChild(checkboxContainer);
        contentDiv.appendChild(section);
    });

    updateProgress();
}

function updateProgress() {
    const completed = JSON.parse(localStorage.getItem("learnProgress") || "[]");
    const percent = Math.round((completed.length / blocks.length) * 100);
    progressText.innerText = `Progreso: ${percent}% completado`;
}

renderContent();
