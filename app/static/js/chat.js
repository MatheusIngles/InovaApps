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

  let recognition = null
  let isListening = false

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
      setTimeout(() => {
        hideTypingIndicator()
        if (Response.enunciado) {
          addMessage(Response.text, "bot")
        }
        else{
          addMessage(Response.text, "bot")
          // Aqui bassul
        }
        sendButton.disabled = false
      }, 1500 + Math.random() * 2000)
    })
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
