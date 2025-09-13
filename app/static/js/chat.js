// Funcionalidade do chat
document.addEventListener("DOMContentLoaded", () => {
  const messageInput = document.getElementById("messageInput")
  const sendButton = document.getElementById("sendButton")
  const messagesContainer = document.getElementById("messagesContainer")
  const audioButton = document.getElementById("audioButton")
  const recordingIndicator = document.getElementById("recordingIndicator")
  const stopRecordingBtn = document.getElementById("stopRecording")

  let mediaRecorder = null
  let audioChunks = []
  let isRecording = false

  // Respostas automáticas da IA
  const botResponses = [
    "Entendi sua solicitação. Vou criar um chamado para você.",
    "Obrigado por entrar em contato. Como posso ajudá-lo melhor?",
    "Vou encaminhar sua questão para o setor responsável.",
    "Sua solicitação foi registrada com o número #" + Math.floor(Math.random() * 10000),
    "Posso ajudá-lo com mais alguma coisa?",
    "Vou verificar essa informação para você.",
    "Entendo sua preocupação. Vamos resolver isso juntos.",
    "Sua mensagem foi recebida. Aguarde um momento, por favor.",
  ]

  // Enviar mensagem
  function sendMessage() {
    const message = messageInput.value.trim()
    if (message === "") return

    // Adicionar mensagem do usuário
    addMessage(message, "user")
    messageInput.value = ""
    sendButton.disabled = true

    // Simular digitação do bot
    showTypingIndicator()

    // Resposta automática após delay
    setTimeout(
      () => {
        hideTypingIndicator()
        const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)]
        addMessage(randomResponse, "bot")
        sendButton.disabled = false
      },
      1500 + Math.random() * 2000,
    )
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

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder = new MediaRecorder(stream)
      audioChunks = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" })
        addMessage("", "user", true, audioBlob)

        // Simular resposta do bot
        setTimeout(() => {
          const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)]
          addMessage(randomResponse, "bot")
        }, 1000)

        // Parar todas as tracks do stream
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      isRecording = true
      audioButton.classList.add("recording")
      recordingIndicator.style.display = "flex"
      messageInput.disabled = true
      sendButton.disabled = true
    } catch (error) {
      console.error("Erro ao acessar o microfone:", error)
      alert("Erro ao acessar o microfone. Verifique as permissões.")
    }
  }

  function stopRecording() {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      isRecording = false
      audioButton.classList.remove("recording")
      recordingIndicator.style.display = "none"
      messageInput.disabled = false
      sendButton.disabled = messageInput.value.trim() === ""
    }
  }

  // Event listeners
  if (sendButton) {
    sendButton.addEventListener("click", sendMessage)
  }

  if (audioButton) {
    audioButton.addEventListener("click", () => {
      if (isRecording) {
        stopRecording()
      } else {
        startRecording()
      }
    })
  }

  if (stopRecordingBtn) {
    stopRecordingBtn.addEventListener("click", stopRecording)
  }

  // Inicializar estado do botão
  if (sendButton && messageInput) {
    sendButton.disabled = messageInput.value.trim() === ""
  }
})
