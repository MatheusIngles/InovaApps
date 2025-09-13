// Funcionalidade do chat
document.addEventListener("DOMContentLoaded", () => {
  const messageInput = document.getElementById("messageInput")
  const sendButton = document.getElementById("sendButton")
  const messagesContainer = document.getElementById("messagesContainer")
  const audioButton = document.getElementById("audioButton")
  const recordingIndicator = document.getElementById("recordingIndicator")
  const stopRecordingBtn = document.getElementById("stopRecording")

  const mediaRecorder = null
  const audioChunks = []
  const isRecording = false

  let recognition = null
  let isListening = false

  // Import Bootstrap
  const bootstrap = window.bootstrap

  // Verificar se o navegador suporta Web Speech API
  if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
    recognition.lang = "pt-BR"
    recognition.interimResults = false
    recognition.continuous = false

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript
      messageInput.value = text
      sendButton.disabled = false

      // Enviar automaticamente a mensagem reconhecida
      setTimeout(() => {
        sendMessage()
      }, 500)
    }

    recognition.onerror = (event) => {
      console.error("Erro de reconhecimento:", event.error)
      stopListening()

      if (event.error === "no-speech") {
        addMessage("Não consegui ouvir nada. Tente novamente.", "bot")
      } else if (event.error === "not-allowed") {
        addMessage("Permissão de microfone negada. Verifique as configurações do navegador.", "bot")
      } else {
        addMessage("Erro no reconhecimento de voz. Tente novamente.", "bot")
      }
    }

    recognition.onend = () => {
      stopListening()
    }
  }

  // Enviar mensagem
  function sendMessage() {
    const message = messageInput.value.trim()
    if (message === "") return

    addMessage(message, "user")
    messageInput.value = ""
    sendButton.disabled = true

    showTypingIndicator()

    sendMessageToBackend(message).then((Response) => {
      setTimeout(
        () => {
          hideTypingIndicator()
          if (Response.enunciado) {
            addMessage(Response.text, "bot")
          } else {
            addMessage(Response.text, "bot")
            showNoResponseOptions(message)
          }
          sendButton.disabled = false
        },
        1500 + Math.random() * 2000,
      )
    })
  }

  function showNoResponseOptions(lastUserMessage) {
    const optionsDiv = document.createElement("div")
    optionsDiv.className = "message bot-message options-message"

    const avatar = document.createElement("div")
    avatar.className = "message-avatar"
    avatar.innerHTML = '<i class="fas fa-robot"></i>'

    const content = document.createElement("div")
    content.className = "message-content"

    const messageText = document.createElement("p")
    messageText.textContent = "Não encontrei uma resposta específica para sua pergunta. O que gostaria de fazer?"

    const optionsContainer = document.createElement("div")
    optionsContainer.className = "chat-options"
    optionsContainer.style.cssText = `
      display: flex;
      gap: 10px;
      margin-top: 10px;
      flex-wrap: wrap;
    `

    const searchButton = document.createElement("button")
    searchButton.className = "btn btn-primary btn-sm"
    searchButton.textContent = "Pesquisar na IA"
    searchButton.style.cssText = `
      background: var(--primary-color);
      border: none;
      padding: 8px 16px;
      border-radius: 20px;
      color: white;
      cursor: pointer;
      font-size: 12px;
    `

    const ticketButton = document.createElement("button")
    ticketButton.className = "btn btn-secondary btn-sm"
    ticketButton.textContent = "Abrir Chamado"
    ticketButton.style.cssText = `
      background: var(--secondary-color);
      border: none;
      padding: 8px 16px;
      border-radius: 20px;
      color: white;
      cursor: pointer;
      font-size: 12px;
    `

    searchButton.addEventListener("click", () => {
      handleAISearch(lastUserMessage)
      optionsDiv.remove()
    })

    ticketButton.addEventListener("click", () => {
      handleOpenTicket()
      optionsDiv.remove()
    })

    optionsContainer.appendChild(searchButton)
    optionsContainer.appendChild(ticketButton)

    content.appendChild(messageText)
    content.appendChild(optionsContainer)

    const time = document.createElement("span")
    time.className = "message-time"
    time.textContent = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })

    content.appendChild(time)
    optionsDiv.appendChild(avatar)
    optionsDiv.appendChild(content)

    messagesContainer.appendChild(optionsDiv)
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }

  function handleAISearch(lastMessage) {
    addMessage("Pesquisando na IA...", "bot")

    fetch("/ai-search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: lastMessage,
        timestamp: new Date().toISOString(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        addMessage(data.text || "Não foi possível encontrar informações sobre sua pergunta.", "bot")
      })
      .catch((error) => {
        console.error("Erro na pesquisa IA:", error)
        addMessage("Erro ao pesquisar. Tente novamente.", "bot")
      })
  }

  function handleOpenTicket() {
    showTicketModal()
  }

  function showTicketModal() {
    // Criar o modal se não existir
    let modal = document.getElementById("ticketModal")
    if (!modal) {
      modal = createTicketModal()
      document.body.appendChild(modal)
    }

    // Mostrar o modal usando Bootstrap
    const bootstrapModal = new bootstrap.Modal(modal)
    bootstrapModal.show()
  }

  function createTicketModal() {
    const modalHTML = `
      <div class="modal fade" id="ticketModal" tabindex="-1" aria-labelledby="ticketModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title" id="ticketModalLabel">
                <i class="fas fa-ticket-alt me-2"></i>Abrir Chamado
              </h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form id="ticketForm" action="" method="post" novalidate>
                <div class="mb-3">
                  <label for="ticketTitle" class="form-label">
                    <i class="fas fa-heading me-1"></i>Título do Chamado
                  </label>
                  <input type="text" class="form-control" id="ticketTitle" placeholder="Descreva brevemente o problema" required>
                </div>
                
                <div class="mb-3">
                  <label for="ticketDescription" class="form-label">
                    <i class="fas fa-align-left me-1"></i>Descrição Detalhada
                  </label>
                  <textarea class="form-control" id="ticketDescription" rows="4" placeholder="Descreva detalhadamente o problema ou solicitação" required></textarea>
                </div>
                
                <div class="mb-3">
                  <label for="ticketPriority" class="form-label">
                    <i class="fas fa-exclamation-triangle me-1"></i>Prioridade
                  </label>
                  <select class="form-select" id="ticketPriority" required>
                    <option value="">Selecione a prioridade</option>
                    <option value="baixa">Baixa - Não é urgente</option>
                    <option value="media">Média - Precisa de atenção</option>
                    <option value="alta">Alta - Problema importante</option>
                    <option value="urgente">Urgente - Requer ação imediata</option>
                  </select>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                    <i class="fas fa-times me-1"></i>Cancelar
                  </button>
                  <a class="btn btn-primary" id="submitTicket" href="/add_ticket_database">
                    <i class="fas fa-paper-plane me-1"></i>Abrir Chamado
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    `

    const modalElement = document.createElement("div")
    modalElement.innerHTML = modalHTML
    const modal = modalElement.firstElementChild

    modal.addEventListener("shown.bs.modal", () => {
      const submitBtn = modal.querySelector("#submitTicket")
      const form = modal.querySelector("#ticketForm")

      submitBtn.addEventListener("click", () => {
        const title = modal.querySelector("#ticketTitle").value
        const description = modal.querySelector("#ticketDescription").value
        const priority = modal.querySelector("#ticketPriority").value

        if (title && description && priority) {
          // Fechar o modal
          const bootstrapModal = bootstrap.Modal.getInstance(modal)
          bootstrapModal.hide()

          // Enviar dados para o backend
          submitTicketToBackend(title, description, priority)

          // Limpar formulário
          form.reset()
        } else {
          alert("Por favor, preencha todos os campos obrigatórios.")
        }
      })
    })

    return modal
  }

  function submitTicketToBackend(title, description, priority) {
    const chatHistory = getChatHistory()

    addMessage("Abrindo chamado...", "bot")

    fetch("/open-ticket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        description: description,
        priority: priority,
        chatHistory: chatHistory,
        timestamp: new Date().toISOString(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        addMessage(data.text || "Chamado aberto com sucesso! Você receberá um retorno em breve.", "bot")
      })
      .catch((error) => {
        console.error("Erro ao abrir chamado:", error)
        addMessage("Erro ao abrir chamado. Tente novamente.", "bot")
      })
  }

  function getChatHistory() {
    const messages = messagesContainer.querySelectorAll(".message:not(.options-message)")
    const history = []

    messages.forEach((message) => {
      const isUser = message.classList.contains("user-message")
      const text = message.querySelector(".message-content p")?.textContent
      const time = message.querySelector(".message-time")?.textContent

      if (text) {
        history.push({
          sender: isUser ? "user" : "bot",
          message: text,
          time: time,
        })
      }
    })

    return history
  }

  // Adicionar mensagem ao chat
  function addMessage(text, sender, isAudio = false, audioBlob = null) {
    const messageDiv = document.createElement("div")
    messageDiv.className = `message ${sender}-message`

    const avatar = document.createElement("div")
    avatar.className = "message-avatar"
    avatar.innerHTML = sender === "bot" ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>'

    const content = document.createElement("div")
    content.className = "message-content"

    if (isAudio && audioBlob) {
      const audioMessage = document.createElement("div")
      audioMessage.className = "audio-message"

      const audioControls = document.createElement("div")
      audioControls.className = "audio-controls"

      const playBtn = document.createElement("button")
      playBtn.className = "play-audio-btn"
      playBtn.innerHTML = '<i class="fas fa-play"></i>'

      const duration = document.createElement("span")
      duration.className = "audio-duration"
      duration.textContent = "0:05"

      const waveform = document.createElement("div")
      waveform.className = "audio-waveform"

      const progress = document.createElement("div")
      progress.className = "waveform-progress"
      waveform.appendChild(progress)

      audioControls.appendChild(playBtn)
      audioControls.appendChild(duration)
      audioMessage.appendChild(audioControls)
      audioMessage.appendChild(waveform)

      // Funcionalidade de reprodução
      const audio = new Audio(URL.createObjectURL(audioBlob))
      let isPlaying = false

      playBtn.addEventListener("click", () => {
        if (isPlaying) {
          audio.pause()
          playBtn.innerHTML = '<i class="fas fa-play"></i>'
          isPlaying = false
        } else {
          audio.play()
          playBtn.innerHTML = '<i class="fas fa-pause"></i>'
          isPlaying = true
        }
      })

      audio.addEventListener("ended", () => {
        playBtn.innerHTML = '<i class="fas fa-play"></i>'
        isPlaying = false
        progress.style.width = "0%"
      })

      audio.addEventListener("timeupdate", () => {
        const progressPercent = (audio.currentTime / audio.duration) * 100
        progress.style.width = progressPercent + "%"
      })

      content.appendChild(audioMessage)
    } else {
      const messageText = document.createElement("p")
      messageText.textContent = text
      content.appendChild(messageText)
    }

    const time = document.createElement("span")
    time.className = "message-time"
    time.textContent = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })

    content.appendChild(time)
    messageDiv.appendChild(avatar)
    messageDiv.appendChild(content)

    messagesContainer.appendChild(messageDiv)
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }

  // Mostrar indicador de digitação
  function showTypingIndicator() {
    const typingDiv = document.createElement("div")
    typingDiv.className = "typing-indicator active"
    typingDiv.id = "typingIndicator"

    const avatar = document.createElement("div")
    avatar.className = "message-avatar"
    avatar.innerHTML = '<i class="fas fa-robot"></i>'
    avatar.style.background = "var(--primary-color)"
    avatar.style.color = "var(--white)"

    const dots = document.createElement("div")
    dots.className = "typing-dots"
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement("div")
      dot.className = "typing-dot"
      dots.appendChild(dot)
    }

    typingDiv.appendChild(avatar)
    typingDiv.appendChild(dots)
    messagesContainer.appendChild(typingDiv)
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }

  // Esconder indicador de digitação
  function hideTypingIndicator() {
    const typingIndicator = document.getElementById("typingIndicator")
    if (typingIndicator) {
      typingIndicator.remove()
    }
  }

  // Inicializar estado do botão
  if (sendButton && messageInput) {
    sendButton.disabled = messageInput.value.trim() === ""
  }

  function startListening() {
    if (!recognition) {
      alert("Seu navegador não suporta reconhecimento de voz.")
      return
    }

    try {
      recognition.start()
      isListening = true
      audioButton.classList.add("recording")
      recordingIndicator.style.display = "flex"
      recordingIndicator.querySelector("span").textContent = "Ouvindo..."
      messageInput.disabled = true
      sendButton.disabled = true
    } catch (error) {
      console.error("Erro ao iniciar reconhecimento:", error)
      addMessage("Erro ao iniciar reconhecimento de voz.", "bot")
    }
  }

  function stopListening() {
    if (recognition && isListening) {
      recognition.stop()
      isListening = false
      audioButton.classList.remove("recording")
      recordingIndicator.style.display = "none"
      messageInput.disabled = false
      sendButton.disabled = messageInput.value.trim() === ""
    }
  }

  function sendMessageToBackend(message) {
    return fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
        timestamp: new Date().toISOString(),
      }),
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error("Erro ao enviar mensagem para o backend:", error)
      })
  }

  // Event listeners
  sendButton.addEventListener("click", sendMessage)
  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  })

  messageInput.addEventListener("input", () => {
    sendButton.disabled = messageInput.value.trim() === ""
  })

  audioButton.addEventListener("click", () => {
    if (!isListening) {
      startListening()
    } else {
      stopListening()
    }
  })

  stopRecordingBtn.addEventListener("click", stopListening)
})
