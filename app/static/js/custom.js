// JavaScript completamente redesenhado para a nova interface de customização
document.addEventListener("DOMContentLoaded", () => {
  const primaryColorInput = document.getElementById("primaryColor")
  const secondaryColorInput = document.getElementById("secondaryColor")
  const backgroundColorInput = document.getElementById("backgroundColor")
  const textColorInput = document.getElementById("textColor")
  const headingFontSelect = document.getElementById("headingFont")
  const bodyFontSelect = document.getElementById("bodyFont")
  const fontSizeRange = document.getElementById("fontSize")
  const fontSizeValue = document.getElementById("fontSizeValue")
  const borderRadiusRange = document.getElementById("borderRadius")
  const borderRadiusValue = document.getElementById("borderRadiusValue")
  const spacingRange = document.getElementById("spacing")
  const spacingValue = document.getElementById("spacingValue")
  const saveBtn = document.getElementById("saveBtn")
  const resetBtn = document.getElementById("resetBtn")
  const fullscreenPreview = document.getElementById("fullscreenPreview")
  const notificationBanner = document.getElementById("notificationBanner")
  const notificationText = document.getElementById("notificationText")

  const tabButtons = document.querySelectorAll(".tab-btn")
  const previewContents = document.querySelectorAll(".preview-content")
  const iframes = document.querySelectorAll(".preview-iframe")

  // Configurações padrão baseadas no design brief
  const defaultSettings = {
    primaryColor: "#15803d",
    secondaryColor: "#84cc16",
    backgroundColor: "#f0fdf4",
    textColor: "#374151",
    headingFont: "'Playfair Display', serif",
    bodyFont: "'Source Sans Pro', sans-serif",
    fontSize: 14,
    borderRadius: 8,
    spacing: 16,
  }

  const pageSpecificSettings = {
    chat: {
      primaryColor: "#15803d",
      secondaryColor: "#84cc16",
      backgroundColor: "#f0fdf4",
      textColor: "#374151",
      headingFont: "'Playfair Display', serif",
      bodyFont: "'Source Sans Pro', sans-serif",
      fontSize: 14,
      borderRadius: 8,
      spacing: 16,
    },
    tickets: {
      primaryColor: "#1e40af",
      secondaryColor: "#3b82f6",
      backgroundColor: "#eff6ff",
      textColor: "#1f2937",
      headingFont: "'Playfair Display', serif",
      bodyFont: "'Source Sans Pro', sans-serif",
      fontSize: 14,
      borderRadius: 6,
      spacing: 18,
    },
    dashboard: {
      primaryColor: "#7c3aed",
      secondaryColor: "#a855f7",
      backgroundColor: "#faf5ff",
      textColor: "#374151",
      headingFont: "'Playfair Display', serif",
      bodyFont: "'Source Sans Pro', sans-serif",
      fontSize: 15,
      borderRadius: 10,
      spacing: 20,
    },
  }

  let currentPage = "chat"

  function initializeTabs() {
    tabButtons.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        // Remove active de todas as abas
        tabButtons.forEach((tab) => tab.classList.remove("active"))
        previewContents.forEach((content) => content.classList.remove("active"))

        // Ativa a aba clicada
        btn.classList.add("active")
        previewContents[index].classList.add("active")

        // Carrega configurações específicas da página
        const pageName = btn.getAttribute("data-tab")
        loadPageSettings(pageName)

        // Aplica customizações ao iframe ativo após um delay
        setTimeout(() => {
          applyCustomizationsToIframe(iframes[index])
        }, 200)
      })
    })
  }

  function applyCustomizationsToIframe(iframe) {
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
      const settings = getCurrentSettings()

      // Criar ou atualizar estilo customizado no iframe
      let customStyle = iframeDoc.getElementById("customizationStyles")
      if (!customStyle) {
        customStyle = iframeDoc.createElement("style")
        customStyle.id = "customizationStyles"
        iframeDoc.head.appendChild(customStyle)
      }

      // CSS personalizado para aplicar no iframe
      customStyle.textContent = `
        :root {
          --primary-color: ${settings.primaryColor} !important;
          --secondary-color: ${settings.secondaryColor} !important;
          --background-light: ${settings.backgroundColor} !important;
          --text-primary: ${settings.textColor} !important;
          --border-radius: ${settings.borderRadius}px !important;
        }
        
        body {
          font-family: ${settings.bodyFont} !important;
          font-size: ${settings.fontSize}px !important;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: ${settings.headingFont} !important;
        }
        
        .chat-header, .btn-primary, .send-btn {
          background-color: ${settings.primaryColor} !important;
        }
        
        .btn-secondary, .audio-btn {
          background-color: ${settings.secondaryColor} !important;
        }
        
        .user-message .message-content {
          background-color: ${settings.primaryColor} !important;
          border-radius: ${settings.borderRadius}px !important;
        }
        
        .bot-message .message-content {
          background-color: white !important;
          color: ${settings.textColor} !important;
          border-radius: ${settings.borderRadius}px !important;
          border: 1px solid ${settings.secondaryColor}40 !important;
        }
        
        .customization-section, .ticket-card, .dashboard-card {
          padding: ${settings.spacing}px !important;
          border-radius: ${settings.borderRadius}px !important;
        }
        
        input, select, textarea {
          border-radius: ${settings.borderRadius}px !important;
        }
      `
    } catch (error) {
      console.log("Não foi possível aplicar customizações ao iframe:", error)
    }
  }

  function updateColorValues() {
    const colorInputs = document.querySelectorAll('input[type="color"]')
    colorInputs.forEach((input) => {
      const valueSpan = input.parentElement.querySelector(".color-value")
      if (valueSpan) {
        valueSpan.textContent = input.value.toUpperCase()
        input.addEventListener("input", () => {
          valueSpan.textContent = input.value.toUpperCase()
          updateAllPreviews()
        })
      }
    })
  }

  // Carregar configurações salvas
  function loadPageSettings(pageName) {
    currentPage = pageName
    const savedSettings = localStorage.getItem(`customizationSettings_${pageName}`)
    let settings

    if (savedSettings) {
      settings = JSON.parse(savedSettings)
    } else {
      settings = pageSpecificSettings[pageName] || defaultSettings
    }

    updateInputs(settings)
    updateAllPreviews()

    // Feedback visual da mudança de página
    showNotification(`Carregadas configurações da página: ${getPageDisplayName(pageName)}`, "info")
  }

  function getPageDisplayName(pageName) {
    const names = {
      chat: "Chat",
      tickets: "Chamados",
      dashboard: "Dashboard",
    }
    return names[pageName] || pageName
  }

  // Atualizar inputs com as configurações
  function updateInputs(settings) {
    if (primaryColorInput) primaryColorInput.value = settings.primaryColor
    if (secondaryColorInput) secondaryColorInput.value = settings.secondaryColor
    if (backgroundColorInput) backgroundColorInput.value = settings.backgroundColor
    if (textColorInput) textColorInput.value = settings.textColor
    if (headingFontSelect) headingFontSelect.value = settings.headingFont
    if (bodyFontSelect) bodyFontSelect.value = settings.bodyFont
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

    updateColorValues()
  }

  // Obter configurações atuais dos inputs
  function getCurrentSettings() {
    return {
      primaryColor: primaryColorInput?.value || defaultSettings.primaryColor,
      secondaryColor: secondaryColorInput?.value || defaultSettings.secondaryColor,
      backgroundColor: backgroundColorInput?.value || defaultSettings.backgroundColor,
      textColor: textColorInput?.value || defaultSettings.textColor,
      headingFont: headingFontSelect?.value || defaultSettings.headingFont,
      bodyFont: bodyFontSelect?.value || defaultSettings.bodyFont,
      fontSize: Number.parseInt(fontSizeRange?.value) || defaultSettings.fontSize,
      borderRadius: Number.parseInt(borderRadiusRange?.value) || defaultSettings.borderRadius,
      spacing: Number.parseInt(spacingRange?.value) || defaultSettings.spacing,
    }
  }

  function updateAllPreviews() {
    iframes.forEach((iframe) => {
      // Aguarda o iframe carregar antes de aplicar customizações
      if (iframe.contentDocument) {
        applyCustomizationsToIframe(iframe)
      } else {
        iframe.addEventListener("load", () => {
          applyCustomizationsToIframe(iframe)
        })
      }
    })
  }

  // Função para mostrar notificações com diferentes tipos
  function showNotification(message, type = "success") {
    const banner = notificationBanner
    const text = notificationText

    // Remove classes de tipo anteriores
    banner.classList.remove("success", "info", "warning", "error")
    banner.classList.add(type)

    text.textContent = message
    banner.classList.add("show")

    setTimeout(() => {
      hideNotification()
    }, 4000)
  }

  function hideNotification() {
    if (notificationBanner) {
      notificationBanner.classList.remove("show")
    }
  }

  // Salvar configurações
  function saveSettings() {
    const settings = getCurrentSettings()
    localStorage.setItem(`customizationSettings_${currentPage}`, JSON.stringify(settings))
    showNotification(`Configurações da página ${getPageDisplayName(currentPage)} salvas!`, "success")
  }

  // Restaurar configurações padrão
  function resetSettings() {
    const pageName = getPageDisplayName(currentPage)
    if (
      confirm(
        `Tem certeza que deseja restaurar as configurações padrão da página ${pageName}? Esta ação não pode ser desfeita.`,
      )
    ) {
      localStorage.removeItem(`customizationSettings_${currentPage}`)
      const defaultPageSettings = pageSpecificSettings[currentPage] || defaultSettings
      updateInputs(defaultPageSettings)
      updateAllPreviews()
      showNotification(`Configurações da página ${pageName} restauradas!`, "info")
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

  // Event Listeners
  if (primaryColorInput) primaryColorInput.addEventListener("input", updateAllPreviews)
  if (secondaryColorInput) secondaryColorInput.addEventListener("input", updateAllPreviews)
  if (backgroundColorInput) backgroundColorInput.addEventListener("input", updateAllPreviews)
  if (textColorInput) textColorInput.addEventListener("input", updateAllPreviews)
  if (headingFontSelect) headingFontSelect.addEventListener("change", updateAllPreviews)
  if (bodyFontSelect) bodyFontSelect.addEventListener("change", updateAllPreviews)

  if (fontSizeRange) {
    fontSizeRange.addEventListener("input", () => {
      if (fontSizeValue) fontSizeValue.textContent = fontSizeRange.value + "px"
      updateAllPreviews()
    })
  }

  if (borderRadiusRange) {
    borderRadiusRange.addEventListener("input", () => {
      if (borderRadiusValue) borderRadiusValue.textContent = borderRadiusRange.value + "px"
      updateAllPreviews()
    })
  }

  if (spacingRange) {
    spacingRange.addEventListener("input", () => {
      if (spacingValue) spacingValue.textContent = spacingRange.value + "px"
      updateAllPreviews()
    })
  }

  if (saveBtn) saveBtn.addEventListener("click", saveSettings)
  if (resetBtn) resetBtn.addEventListener("click", resetSettings)
  if (fullscreenPreview) fullscreenPreview.addEventListener("click", toggleFullscreenPreview)

  const styles = document.createElement("style")
  styles.textContent = `
    .preview-panel.fullscreen {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      z-index: 9999 !important;
      border-radius: 0 !important;
    }
    
    .preview-panel.fullscreen .preview-container {
      height: calc(100vh - 80px) !important;
    }
    
    .preview-iframe {
      transition: all 0.3s ease;
    }
  `
  document.head.appendChild(styles)

  // Inicializar tudo
  initializeTabs()
  loadPageSettings("chat")

  setTimeout(() => {
    updateAllPreviews()
  }, 1000)
})
