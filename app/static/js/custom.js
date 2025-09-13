// Funcionalidade da página de customização
document.addEventListener("DOMContentLoaded", () => {
  // Elementos do DOM
  const primaryColorInput = document.getElementById("primaryColor")
  const secondaryColorInput = document.getElementById("secondaryColor")
  const backgroundColorInput = document.getElementById("backgroundColor")
  const textColorInput = document.getElementById("textColor")
  const fontFamilySelect = document.getElementById("fontFamily")
  const fontSizeRange = document.getElementById("fontSize")
  const fontSizeValue = document.getElementById("fontSizeValue")
  const borderRadiusRange = document.getElementById("borderRadius")
  const borderRadiusValue = document.getElementById("borderRadiusValue")
  const spacingRange = document.getElementById("spacing")
  const spacingValue = document.getElementById("spacingValue")
  const customCSSTextarea = document.getElementById("customCSS")
  const previewBtn = document.getElementById("previewBtn")
  const saveBtn = document.getElementById("saveBtn")
  const resetBtn = document.getElementById("resetBtn")
  const previewSection = document.getElementById("previewSection")
  const previewContainer = document.getElementById("previewContainer")

  // Configurações padrão
  const defaultSettings = {
    primaryColor: "#007bff",
    secondaryColor: "#6c757d",
    backgroundColor: "#ffffff",
    textColor: "#333333",
    fontFamily: "Arial, sans-serif",
    fontSize: 14,
    borderRadius: 8,
    spacing: 16,
    customCSS: "",
  }

  // Carregar configurações salvas
  function loadSettings() {
    const savedSettings = localStorage.getItem("customizationSettings")
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      applySettings(settings)
      updateInputs(settings)
    } else {
      updateInputs(defaultSettings)
    }
  }

  // Atualizar inputs com as configurações
  function updateInputs(settings) {
    if (primaryColorInput) primaryColorInput.value = settings.primaryColor
    if (secondaryColorInput) secondaryColorInput.value = settings.secondaryColor
    if (backgroundColorInput) backgroundColorInput.value = settings.backgroundColor
    if (textColorInput) textColorInput.value = settings.textColor
    if (fontFamilySelect) fontFamilySelect.value = settings.fontFamily
    if (fontSizeRange) {
      fontSizeRange.value = settings.fontSize
      if (fontSizeValue) fontSizeValue.textContent = settings.fontSize + "px"
    }
    if (borderRadiusRange) {
      borderRadiusRange.value = settings.borderRadius
      if (borderRadiusValue) borderRadiusValue.textContent = settings.borderRadius + "px"
    }
    if (spacingRange) {
      spacingRange.value = settings.spacing
      if (spacingValue) spacingValue.textContent = settings.spacing + "px"
    }
    if (customCSSTextarea) customCSSTextarea.value = settings.customCSS
  }

  // Obter configurações atuais dos inputs
  function getCurrentSettings() {
    return {
      primaryColor: primaryColorInput?.value || defaultSettings.primaryColor,
      secondaryColor: secondaryColorInput?.value || defaultSettings.secondaryColor,
      backgroundColor: backgroundColorInput?.value || defaultSettings.backgroundColor,
      textColor: textColorInput?.value || defaultSettings.textColor,
      fontFamily: fontFamilySelect?.value || defaultSettings.fontFamily,
      fontSize: Number.parseInt(fontSizeRange?.value) || defaultSettings.fontSize,
      borderRadius: Number.parseInt(borderRadiusRange?.value) || defaultSettings.borderRadius,
      spacing: Number.parseInt(spacingRange?.value) || defaultSettings.spacing,
      customCSS: customCSSTextarea?.value || defaultSettings.customCSS,
    }
  }

  // Aplicar configurações
  function applySettings(settings) {
    const root = document.documentElement

    // Aplicar variáveis CSS
    root.style.setProperty("--primary-color", settings.primaryColor)
    root.style.setProperty("--secondary-color", settings.secondaryColor)
    root.style.setProperty("--white", settings.backgroundColor)
    root.style.setProperty("--gray-800", settings.textColor)
    root.style.setProperty("--border-radius", settings.borderRadius + "px")

    // Aplicar fonte
    document.body.style.fontFamily = settings.fontFamily
    document.body.style.fontSize = settings.fontSize + "px"

    // Aplicar espaçamento (exemplo nos cards)
    const cards = document.querySelectorAll(".customization-section")
    cards.forEach((card) => {
      card.style.padding = settings.spacing + "px"
    })

    // Aplicar CSS personalizado
    let customStyleElement = document.getElementById("customStyles")
    if (!customStyleElement) {
      customStyleElement = document.createElement("style")
      customStyleElement.id = "customStyles"
      document.head.appendChild(customStyleElement)
    }
    customStyleElement.textContent = settings.customCSS
  }

  // Atualizar preview
  function updatePreview() {
    const settings = getCurrentSettings()

    if (previewContainer) {
      previewContainer.style.fontFamily = settings.fontFamily
      previewContainer.style.fontSize = settings.fontSize + "px"
      previewContainer.style.borderRadius = settings.borderRadius + "px"
      previewContainer.style.padding = settings.spacing + "px"

      const header = previewContainer.querySelector(".preview-header")
      if (header) {
        header.style.backgroundColor = settings.primaryColor
        header.style.borderRadius = settings.borderRadius + "px"
      }

      const userMessage = previewContainer.querySelector(".user-message p")
      if (userMessage) {
        userMessage.style.backgroundColor = settings.primaryColor
      }

      const botMessage = previewContainer.querySelector(".bot-message p")
      if (botMessage) {
        botMessage.style.backgroundColor = settings.backgroundColor
        botMessage.style.color = settings.textColor
      }
    }
  }

  // Mostrar/esconder preview
  function togglePreview() {
    if (previewSection) {
      const isVisible = previewSection.classList.contains("active")
      if (isVisible) {
        previewSection.classList.remove("active")
        previewBtn.innerHTML = '<i class="fas fa-eye"></i> Visualizar'
      } else {
        previewSection.classList.add("active")
        previewBtn.innerHTML = '<i class="fas fa-eye-slash"></i> Ocultar Preview'
        updatePreview()
      }
    }
  }

  // Salvar configurações
  function saveSettings() {
    const settings = getCurrentSettings()
    localStorage.setItem("customizationSettings", JSON.stringify(settings))
    applySettings(settings)
    showNotification("Configurações salvas com sucesso!", "success")
  }

  // Restaurar configurações padrão
  function resetSettings() {
    if (confirm("Tem certeza que deseja restaurar as configurações padrão? Esta ação não pode ser desfeita.")) {
      localStorage.removeItem("customizationSettings")
      updateInputs(defaultSettings)
      applySettings(defaultSettings)
      showNotification("Configurações restauradas para o padrão!", "info")
    }
  }

  // Mostrar notificação
  function showNotification(message, type = "success") {
    const notification = document.createElement("div")
    const colors = {
      success: "#28a745",
      error: "#dc3545",
      info: "#17a2b8",
      warning: "#ffc107",
    }

    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
        `
    notification.textContent = message
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.3s ease"
      setTimeout(() => notification.remove(), 300)
    }, 3000)
  }

  // Event listeners
  if (primaryColorInput) {
    primaryColorInput.addEventListener("change", () => {
      if (previewSection.classList.contains("active")) updatePreview()
    })
  }

  if (secondaryColorInput) {
    secondaryColorInput.addEventListener("change", () => {
      if (previewSection.classList.contains("active")) updatePreview()
    })
  }

  if (backgroundColorInput) {
    backgroundColorInput.addEventListener("change", () => {
      if (previewSection.classList.contains("active")) updatePreview()
    })
  }

  if (textColorInput) {
    textColorInput.addEventListener("change", () => {
      if (previewSection.classList.contains("active")) updatePreview()
    })
  }

  if (fontFamilySelect) {
    fontFamilySelect.addEventListener("change", () => {
      if (previewSection.classList.contains("active")) updatePreview()
    })
  }

  if (fontSizeRange) {
    fontSizeRange.addEventListener("input", () => {
      if (fontSizeValue) fontSizeValue.textContent = fontSizeRange.value + "px"
      if (previewSection.classList.contains("active")) updatePreview()
    })
  }

  if (borderRadiusRange) {
    borderRadiusRange.addEventListener("input", () => {
      if (borderRadiusValue) borderRadiusValue.textContent = borderRadiusRange.value + "px"
      if (previewSection.classList.contains("active")) updatePreview()
    })
  }

  if (spacingRange) {
    spacingRange.addEventListener("input", () => {
      if (spacingValue) spacingValue.textContent = spacingRange.value + "px"
      if (previewSection.classList.contains("active")) updatePreview()
    })
  }

  if (previewBtn) {
    previewBtn.addEventListener("click", togglePreview)
  }

  if (saveBtn) {
    saveBtn.addEventListener("click", saveSettings)
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", resetSettings)
  }

  // Adicionar estilos de animação
  const animationStyles = document.createElement("style")
  animationStyles.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `
  document.head.appendChild(animationStyles)

  // Inicializar
  loadSettings()
})
