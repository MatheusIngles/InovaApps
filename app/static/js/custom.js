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
  const previewContainer = document.getElementById("previewContainer")
  const fullscreenPreview = document.getElementById("fullscreenPreview")

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
    updatePreview()
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

  function updatePreview() {
    const settings = getCurrentSettings()

    if (previewContainer) {
      // Aplicar configurações gerais ao preview
      previewContainer.style.fontFamily = settings.fontFamily
      previewContainer.style.fontSize = settings.fontSize + "px"

      // Atualizar header do chat
      const chatHeader = previewContainer.querySelector(".preview-chat-header")
      if (chatHeader) {
        chatHeader.style.backgroundColor = settings.primaryColor
        chatHeader.style.color = settings.backgroundColor
      }

      // Atualizar avatar do usuário
      const userAvatar = previewContainer.querySelector(".user-avatar")
      if (userAvatar) {
        userAvatar.style.backgroundColor = settings.primaryColor
      }

      // Atualizar mensagens do usuário
      const userMessages = previewContainer.querySelectorAll(".user-message .message-content")
      userMessages.forEach((msg) => {
        msg.style.backgroundColor = settings.primaryColor
        msg.style.color = settings.backgroundColor
        msg.style.borderRadius = settings.borderRadius + "px"
      })

      // Atualizar mensagens do bot
      const botMessages = previewContainer.querySelectorAll(".bot-message .message-content")
      botMessages.forEach((msg) => {
        msg.style.backgroundColor = settings.backgroundColor
        msg.style.color = settings.textColor
        msg.style.borderRadius = settings.borderRadius + "px"
        msg.style.border = `1px solid ${settings.secondaryColor}40`
      })

      // Atualizar botões de exemplo
      const primaryButtons = previewContainer.querySelectorAll(".btn-primary")
      primaryButtons.forEach((btn) => {
        btn.style.backgroundColor = settings.primaryColor
        btn.style.borderColor = settings.primaryColor
        btn.style.borderRadius = settings.borderRadius + "px"
        btn.style.padding = settings.spacing / 2 + "px " + settings.spacing + "px"
      })

      const secondaryButtons = previewContainer.querySelectorAll(".btn-secondary")
      secondaryButtons.forEach((btn) => {
        btn.style.backgroundColor = settings.secondaryColor
        btn.style.borderColor = settings.secondaryColor
        btn.style.borderRadius = settings.borderRadius + "px"
        btn.style.padding = settings.spacing / 2 + "px " + settings.spacing + "px"
      })

      // Atualizar card de exemplo
      const previewCard = previewContainer.querySelector(".preview-card")
      if (previewCard) {
        previewCard.style.borderRadius = settings.borderRadius + "px"
        previewCard.style.padding = settings.spacing + "px"
        previewCard.style.borderColor = settings.secondaryColor + "40"
      }

      // Atualizar input de exemplo
      const previewInput = previewContainer.querySelector(".preview-input-area input")
      if (previewInput) {
        previewInput.style.borderRadius = settings.borderRadius * 2 + "px"
        previewInput.style.borderColor = settings.secondaryColor + "60"
      }

      // Atualizar botões de áudio e envio
      const sendBtn = previewContainer.querySelector(".send-btn")
      if (sendBtn) {
        sendBtn.style.backgroundColor = settings.primaryColor
      }

      const audioBtn = previewContainer.querySelector(".audio-btn")
      if (audioBtn) {
        audioBtn.style.backgroundColor = settings.secondaryColor
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
      updatePreview()
      showNotification("Configurações restauradas para o padrão!", "info")
    }
  }

  function toggleFullscreenPreview() {
    const previewPanel = document.querySelector(".preview-panel")
    if (previewPanel.classList.contains("fullscreen")) {
      previewPanel.classList.remove("fullscreen")
      fullscreenPreview.innerHTML = '<i class="fas fa-expand"></i>'
    } else {
      previewPanel.classList.add("fullscreen")
      fullscreenPreview.innerHTML = '<i class="fas fa-compress"></i>'
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

  if (primaryColorInput) {
    primaryColorInput.addEventListener("input", updatePreview)
  }

  if (secondaryColorInput) {
    secondaryColorInput.addEventListener("input", updatePreview)
  }

  if (backgroundColorInput) {
    backgroundColorInput.addEventListener("input", updatePreview)
  }

  if (textColorInput) {
    textColorInput.addEventListener("input", updatePreview)
  }

  if (fontFamilySelect) {
    fontFamilySelect.addEventListener("change", updatePreview)
  }

  if (fontSizeRange) {
    fontSizeRange.addEventListener("input", () => {
      if (fontSizeValue) fontSizeValue.textContent = fontSizeRange.value + "px"
      updatePreview()
    })
  }

  if (borderRadiusRange) {
    borderRadiusRange.addEventListener("input", () => {
      if (borderRadiusValue) borderRadiusValue.textContent = borderRadiusRange.value + "px"
      updatePreview()
    })
  }

  if (spacingRange) {
    spacingRange.addEventListener("input", () => {
      if (spacingValue) spacingValue.textContent = spacingRange.value + "px"
      updatePreview()
    })
  }

  if (customCSSTextarea) {
    customCSSTextarea.addEventListener("input", updatePreview)
  }

  if (previewBtn) {
    previewBtn.addEventListener("click", () => {
      const settings = getCurrentSettings()
      applySettings(settings)
      showNotification("Alterações aplicadas ao site!", "info")
    })
  }

  if (saveBtn) {
    saveBtn.addEventListener("click", saveSettings)
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", resetSettings)
  }

  if (fullscreenPreview) {
    fullscreenPreview.addEventListener("click", toggleFullscreenPreview)
  }

  // Adicionar estilos de animação e fullscreen
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
        
        .preview-panel.fullscreen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 9999;
            background: white;
            border-radius: 0;
        }
        
        .preview-panel.fullscreen .preview-container {
            height: calc(100vh - 80px);
        }
    `
  document.head.appendChild(animationStyles)

  // Inicializar
  loadSettings()
})
