// JavaScript moderno para a nova interface de customização
document.addEventListener("DOMContentLoaded", () => {
  // Elementos do DOM
  const colorInputs = {
    primary: document.getElementById("primaryColor"),
    secondary: document.getElementById("secondaryColor"),
    background: document.getElementById("backgroundColor"),
    text: document.getElementById("textColor"),
  }

  const fontSelects = {
    heading: document.getElementById("headingFont"),
    body: document.getElementById("bodyFont"),
  }

  const rangeInputs = {
    fontSize: document.getElementById("fontSize"),
    borderRadius: document.getElementById("borderRadius"),
    spacing: document.getElementById("spacing"),
  }

  const valueDisplays = {
    primaryColor: document.getElementById("primaryColorValue"),
    secondaryColor: document.getElementById("secondaryColorValue"),
    backgroundColor: document.getElementById("backgroundColorValue"),
    textColor: document.getElementById("textColorValue"),
    fontSize: document.getElementById("fontSizeValue"),
    borderRadius: document.getElementById("borderRadiusValue"),
    spacing: document.getElementById("spacingValue"),
  }

  const buttons = {
    save: document.getElementById("saveBtn"),
    reset: document.getElementById("resetBtn"),
    export: document.getElementById("exportBtn"),
    fullscreen: document.getElementById("fullscreenBtn"),
    copyCSS: document.getElementById("copyCSS"),
  }

  const previewTabs = document.querySelectorAll('input[name="previewTab"]')
  const previewContents = document.querySelectorAll(".preview-content")
  const iframes = document.querySelectorAll("iframe")
  const themePresets = document.querySelectorAll(".theme-preset")

  // Import Bootstrap
  const bootstrap = window.bootstrap

  // Configurações padrão
  const defaultSettings = {
    primaryColor: "#6366f1",
    secondaryColor: "#8b5cf6",
    backgroundColor: "#f8fafc",
    textColor: "#1e293b",
    headingFont: "'Poppins', sans-serif",
    bodyFont: "'Inter', sans-serif",
    fontSize: 14,
    borderRadius: 8,
    spacing: 16,
  }

  // Temas predefinidos
  const themes = {
    modern: {
      primaryColor: "#6366f1",
      secondaryColor: "#8b5cf6",
      backgroundColor: "#f8fafc",
      textColor: "#1e293b",
      headingFont: "'Poppins', sans-serif",
      bodyFont: "'Inter', sans-serif",
      fontSize: 14,
      borderRadius: 8,
      spacing: 16,
    },
    nature: {
      primaryColor: "#10b981",
      secondaryColor: "#34d399",
      backgroundColor: "#f0fdf4",
      textColor: "#064e3b",
      headingFont: "'Poppins', sans-serif",
      bodyFont: "'Inter', sans-serif",
      fontSize: 14,
      borderRadius: 12,
      spacing: 18,
    },
    warm: {
      primaryColor: "#f59e0b",
      secondaryColor: "#fbbf24",
      backgroundColor: "#fffbeb",
      textColor: "#92400e",
      headingFont: "'Poppins', sans-serif",
      bodyFont: "'Inter', sans-serif",
      fontSize: 15,
      borderRadius: 10,
      spacing: 20,
    },
    dark: {
      primaryColor: "#6b7280",
      secondaryColor: "#9ca3af",
      backgroundColor: "#111827",
      textColor: "#f9fafb",
      headingFont: "'Poppins', sans-serif",
      bodyFont: "'Inter', sans-serif",
      fontSize: 14,
      borderRadius: 6,
      spacing: 14,
    },
  }

  // Inicialização
  function init() {
    loadSettings()
    setupEventListeners()
    updateAllPreviews()
    hideLoadingSpinner()
  }

  // Configurar event listeners
  function setupEventListeners() {
    // Color inputs
    Object.entries(colorInputs).forEach(([key, input]) => {
      if (input) {
        input.addEventListener("input", () => {
          updateColorValue(key, input.value)
          updateAllPreviews()
        })
      }
    })

    // Font selects
    Object.values(fontSelects).forEach((select) => {
      if (select) {
        select.addEventListener("change", updateAllPreviews)
      }
    })

    // Range inputs
    Object.entries(rangeInputs).forEach(([key, input]) => {
      if (input) {
        input.addEventListener("input", () => {
          updateRangeValue(key, input.value)
          updateAllPreviews()
        })
      }
    })

    // Buttons
    if (buttons.save) buttons.save.addEventListener("click", saveSettings)
    if (buttons.reset) buttons.reset.addEventListener("click", resetSettings)
    if (buttons.export) buttons.export.addEventListener("click", exportTheme)
    if (buttons.fullscreen) buttons.fullscreen.addEventListener("click", toggleFullscreen)
    if (buttons.copyCSS) buttons.copyCSS.addEventListener("click", copyCSS)

    // Preview tabs
    previewTabs.forEach((tab) => {
      tab.addEventListener("change", switchPreviewTab)
      document.querySelectorAll("#previewMenu + .dropdown-menu label").forEach((item) => {
        item.addEventListener("click", (e) => {
          const targetFor = item.getAttribute("for")
          if (targetFor) {
            const input = document.getElementById(targetFor)
            if (input) {
              input.checked = true
              input.dispatchEvent(new Event("change")) // força o switchPreviewTab rodar
            }
          }
        })
      })
    })

    // Theme presets
    themePresets.forEach((preset) => {
      preset.addEventListener("click", () => {
        const theme = preset.getAttribute("data-theme")
        applyTheme(theme)
      })
    })
  }

  // Atualizar valor da cor
  function updateColorValue(key, value) {
    const display = valueDisplays[key + "Color"]
    if (display) {
      display.textContent = value.toUpperCase()
    }
  }

  // Atualizar valor do range
  function updateRangeValue(key, value) {
    const display = valueDisplays[key]
    if (display) {
      display.textContent = value + "px"
    }
  }

  // Obter configurações atuais
  function getCurrentSettings() {
    return {
      primaryColor: colorInputs.primary?.value || defaultSettings.primaryColor,
      secondaryColor: colorInputs.secondary?.value || defaultSettings.secondaryColor,
      backgroundColor: colorInputs.background?.value || defaultSettings.backgroundColor,
      textColor: colorInputs.text?.value || defaultSettings.textColor,
      headingFont: fontSelects.heading?.value || defaultSettings.headingFont,
      bodyFont: fontSelects.body?.value || defaultSettings.bodyFont,
      fontSize: Number.parseInt(rangeInputs.fontSize?.value) || defaultSettings.fontSize,
      borderRadius: Number.parseInt(rangeInputs.borderRadius?.value) || defaultSettings.borderRadius,
      spacing: Number.parseInt(rangeInputs.spacing?.value) || defaultSettings.spacing,
    }
  }

  // Aplicar configurações aos inputs
  function applySettingsToInputs(settings) {
    if (colorInputs.primary) colorInputs.primary.value = settings.primaryColor
    if (colorInputs.secondary) colorInputs.secondary.value = settings.secondaryColor
    if (colorInputs.background) colorInputs.background.value = settings.backgroundColor
    if (colorInputs.text) colorInputs.text.value = settings.textColor

    if (fontSelects.heading) fontSelects.heading.value = settings.headingFont
    if (fontSelects.body) fontSelects.body.value = settings.bodyFont

    if (rangeInputs.fontSize) rangeInputs.fontSize.value = settings.fontSize
    if (rangeInputs.borderRadius) rangeInputs.borderRadius.value = settings.borderRadius
    if (rangeInputs.spacing) rangeInputs.spacing.value = settings.spacing

    // Atualizar displays
    updateColorValue("primary", settings.primaryColor)
    updateColorValue("secondary", settings.secondaryColor)
    updateColorValue("background", settings.backgroundColor)
    updateColorValue("text", settings.textColor)
    updateRangeValue("fontSize", settings.fontSize)
    updateRangeValue("borderRadius", settings.borderRadius)
    updateRangeValue("spacing", settings.spacing)
  }

  // Aplicar tema predefinido
  function applyTheme(themeName) {
    const theme = themes[themeName]
    if (theme) {
      applySettingsToInputs(theme)
      updateAllPreviews()
      showToast(`Tema "${themeName}" aplicado com sucesso!`, "success")
    }
  }

  // Atualizar todos os previews
  function updateAllPreviews() {
    const settings = getCurrentSettings()

    // Aplicar ao documento atual
    applySettingsToDocument(document, settings)

    // Aplicar aos iframes
    iframes.forEach((iframe) => {
      try {
        if (iframe.contentDocument) {
          applySettingsToDocument(iframe.contentDocument, settings)
        }
      } catch (error) {
        console.log("Não foi possível aplicar ao iframe:", error)
      }
    })
  }

  // Aplicar configurações a um documento
  function applySettingsToDocument(doc, settings) {
    const root = doc.documentElement

    // Aplicar variáveis CSS
    root.style.setProperty("--primary-color", settings.primaryColor)
    root.style.setProperty("--secondary-color", settings.secondaryColor)
    root.style.setProperty("--background-color", settings.backgroundColor)
    root.style.setProperty("--text-color", settings.textColor)
    root.style.setProperty("--font-heading", settings.headingFont)
    root.style.setProperty("--font-body", settings.bodyFont)
    root.style.setProperty("--font-size", settings.fontSize + "px")
    root.style.setProperty("--border-radius", settings.borderRadius + "px")
    root.style.setProperty("--spacing", settings.spacing + "px")

    // Aplicar estilos específicos
    let customStyle = doc.getElementById("customThemeStyles")
    if (!customStyle) {
      customStyle = doc.createElement("style")
      customStyle.id = "customThemeStyles"
      doc.head.appendChild(customStyle)
    }

    customStyle.textContent = `
            body {
                font-family: ${settings.bodyFont} !important;
                font-size: ${settings.fontSize}px !important;
                color: ${settings.textColor} !important;
                background-color: ${settings.backgroundColor} !important;
            }
            
            h1, h2, h3, h4, h5, h6 {
                font-family: ${settings.headingFont} !important;
            }
            
            .btn-primary, .bg-primary {
                background-color: ${settings.primaryColor} !important;
                border-color: ${settings.primaryColor} !important;
            }
            
            .btn-secondary {
                background-color: ${settings.secondaryColor} !important;
                border-color: ${settings.secondaryColor} !important;
            }
            
            .text-primary {
                color: ${settings.primaryColor} !important;
            }
            
            .border-radius {
                border-radius: ${settings.borderRadius}px !important;
            }
            
            .custom-spacing {
                padding: ${settings.spacing}px !important;
            }
        `
  }

  // Trocar aba de preview
  function switchPreviewTab(event) {
    const tabId = event.target.id

    previewContents.forEach((content) => {
      content.classList.add("d-none")
    })

    if (tabId === "chatTab") {
      document.getElementById("chatPreview").classList.remove("d-none")
    } else if (tabId === "ticketsTab") {
      document.getElementById("ticketsPreview").classList.remove("d-none")
    } else if (tabId === "dashboardTab") {
      document.getElementById("dashboardPreview").classList.remove("d-none")
    }

    // Reaplica as configurações após trocar de aba
    setTimeout(() => {
      updateAllPreviews()
    }, 100)
  }

  // Salvar configurações
  function saveSettings() {
    const settings = getCurrentSettings()
    localStorage.setItem("customizationSettings", JSON.stringify(settings))
    showToast("Configurações salvas com sucesso!", "success")
  }

  // Carregar configurações
  function loadSettings() {
    const saved = localStorage.getItem("customizationSettings")
    const settings = saved ? JSON.parse(saved) : defaultSettings
    applySettingsToInputs(settings)
  }

  // Resetar configurações
  function resetSettings() {
    if (confirm("Tem certeza que deseja restaurar as configurações padrão?")) {
      localStorage.removeItem("customizationSettings")
      applySettingsToInputs(defaultSettings)
      updateAllPreviews()
      showToast("Configurações restauradas!", "info")
    }
  }

  // Exportar tema
  function exportTheme() {
    const settings = getCurrentSettings()
    const css = generateCSS(settings)
    document.getElementById("exportedCSS").value = css

    const modal = new bootstrap.Modal(document.getElementById("exportModal"))
    modal.show()
  }

  // Gerar CSS do tema
  function generateCSS(settings) {
    return `/* Tema customizado gerado pela Central de Atendimento */
:root {
  --primary-color: ${settings.primaryColor};
  --secondary-color: ${settings.secondaryColor};
  --background-color: ${settings.backgroundColor};
  --text-color: ${settings.textColor};
  --font-heading: ${settings.headingFont};
  --font-body: ${settings.bodyFont};
  --font-size: ${settings.fontSize}px;
  --border-radius: ${settings.borderRadius}px;
  --spacing: ${settings.spacing}px;
}

body {
  font-family: var(--font-body);
  font-size: var(--font-size);
  color: var(--text-color);
  background-color: var(--background-color);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
}

.btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.btn-secondary {
  background-color: var(--secondary-color);
  border-color: var(--secondary-color);
}

.text-primary {
  color: var(--primary-color);
}

.bg-primary {
  background-color: var(--primary-color);
}`
  }

  // Copiar CSS
  function copyCSS() {
    const textarea = document.getElementById("exportedCSS")
    textarea.select()
    document.execCommand("copy")
    showToast("CSS copiado para a área de transferência!", "success")
  }

  // Toggle fullscreen
  function toggleFullscreen() {
    const previewPanel = document.querySelector(".col-lg-8")
    const icon = buttons.fullscreen.querySelector("i")

    if (previewPanel.classList.contains("preview-fullscreen")) {
      previewPanel.classList.remove("preview-fullscreen")
      icon.className = "fas fa-expand"
    } else {
      previewPanel.classList.add("preview-fullscreen")
      icon.className = "fas fa-compress"
    }
  }

  // Mostrar toast
  function showToast(message, type = "success") {
    const toast = document.getElementById("customToast")
    const toastMessage = document.getElementById("toastMessage")

    toastMessage.textContent = message

    // Remover classes de tipo anteriores
    toast.classList.remove("bg-success", "bg-info", "bg-warning", "bg-danger")

    // Adicionar classe do tipo
    switch (type) {
      case "success":
        toast.classList.add("bg-success")
        break
      case "info":
        toast.classList.add("bg-info")
        break
      case "warning":
        toast.classList.add("bg-warning")
        break
      case "error":
        toast.classList.add("bg-danger")
        break
    }

    const bsToast = new bootstrap.Toast(toast)
    bsToast.show()
  }

  // Esconder loading spinner
  function hideLoadingSpinner() {
    setTimeout(() => {
      const spinner = document.getElementById("loadingSpinner")
      if (spinner) {
        spinner.style.display = "none"
      }
    }, 1000)
  }

  // Aguardar iframes carregarem
  iframes.forEach((iframe) => {
    iframe.addEventListener("load", () => {
      setTimeout(() => {
        updateAllPreviews()
      }, 500)
    })
  })

  // Inicializar
  init()
})
