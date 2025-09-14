// Navegação e controle do menu
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle")
  const sidebar = document.getElementById("sidebar")
  const closeSidebar = document.getElementById("closeSidebar")
  const overlay = document.getElementById("overlay")

  const chatDropdownToggle = document.getElementById("chatDropdownToggle")
  const chatDropdownMenu = document.getElementById("chatDropdownMenu")
  const chatList = document.getElementById("chatList")
  const newChatBtn = document.getElementById("newChatBtn")

  // Abrir menu
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      sidebar.classList.add("active")
      overlay.classList.add("active")
      document.body.style.overflow = "hidden"
    })
  }

  // Fechar menu
  function closeSidebarMenu() {
    sidebar.classList.remove("active")
    overlay.classList.remove("active")
    document.body.style.overflow = ""
    if (chatDropdownMenu) {
      chatDropdownMenu.classList.remove("active")
      chatDropdownToggle.classList.remove("active")
    }
  }

  if (closeSidebar) {
    closeSidebar.addEventListener("click", closeSidebarMenu)
  }

  if (overlay) {
    overlay.addEventListener("click", closeSidebarMenu)
  }

  // Fechar menu com ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar.classList.contains("active")) {
      closeSidebarMenu()
    }
  })

  if (chatDropdownToggle && chatDropdownMenu) {

    chatDropdownToggle.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()


      const isActive = chatDropdownMenu.classList.contains("active")


      if (isActive) {
        chatDropdownMenu.classList.remove("active")
        chatDropdownToggle.classList.remove("active")

      } else {
        chatDropdownMenu.classList.add("active")
        chatDropdownToggle.classList.add("active")

        loadSavedChats()
      }
    })

    // Fechar dropdown ao clicar fora
    document.addEventListener("click", (e) => {
      if (!chatDropdownToggle.contains(e.target) && !chatDropdownMenu.contains(e.target)) {
        chatDropdownMenu.classList.remove("active")
        chatDropdownToggle.classList.remove("active")
      }
    })
  }

  if (newChatBtn) {
    newChatBtn.addEventListener("click", (e) => {
      e.preventDefault()
      if (window.location.pathname !== "/chat" && window.location.pathname !== "/") {
        window.location.href = "/chat"
        return
      }
      startNewChat()
      closeSidebarMenu()
    })
  }

  function saveChat() {


    const messagesContainer = document.getElementById("messagesContainer")
    if (!messagesContainer) {

      return
    }

    const messages = Array.from(
      messagesContainer.querySelectorAll(".message:not(.typing-indicator):not(.options-message)"),
    )

    // Filtrar apenas mensagens válidas (deve ter pelo menos uma mensagem do usuário)
    const userMessages = messages.filter((msg) => msg.classList.contains("user-message"))
    if (userMessages.length === 0) {

      return
    }

    const currentChatId = localStorage.getItem("currentChatId") || "chat_" + Date.now()

    // Extrair dados das mensagens
    const chatMessages = messages
      .map((msg) => {
        const contentElement = msg.querySelector(".message-content p")
        const timeElement = msg.querySelector(".message-time")

        return {
          type: msg.classList.contains("user-message") ? "user" : "bot",
          content: contentElement ? contentElement.textContent.trim() : "",
          time: timeElement ? timeElement.textContent : "",
        }
      })
      .filter((msg) => msg.content.length > 0)

    if (chatMessages.length < 2) {

      return
    }

    // Criar título baseado na primeira mensagem do usuário
    const firstUserMsg = chatMessages.find((msg) => msg.type === "user")
    const title = firstUserMsg
      ? firstUserMsg.content.length > 30
        ? firstUserMsg.content.substring(0, 30) + "..."
        : firstUserMsg.content
      : "Chat sem título"

    const preview = firstUserMsg
      ? firstUserMsg.content.length > 50
        ? firstUserMsg.content.substring(0, 50) + "..."
        : firstUserMsg.content
      : "Conversa iniciada"

    const chatData = {
      id: currentChatId,
      title: title,
      preview: preview,
      timestamp: Date.now(),
      messages: chatMessages,
    }

    try {
      // Recuperar chats salvos
      let savedChats = []
      try {
        savedChats = JSON.parse(localStorage.getItem("savedChats") || "[]")
      } catch (e) {

        savedChats = []
      }

      // Verificar se chat já existe e atualizar
      const existingIndex = savedChats.findIndex((chat) => chat.id === currentChatId)
      if (existingIndex >= 0) {
        savedChats[existingIndex] = chatData

      } else {
        savedChats.unshift(chatData)

      }

      // Manter apenas 20 chats mais recentes
      if (savedChats.length > 20) {
        savedChats = savedChats.slice(0, 20)
      }

      // Salvar no localStorage
      localStorage.setItem("savedChats", JSON.stringify(savedChats))
      localStorage.setItem("currentChatId", currentChatId)


    } catch (error) {
      console.error("[v0] Erro ao salvar chat:", error)

      // Se localStorage estiver cheio, tentar limpar e salvar novamente
      if (error.name === "QuotaExceededError") {
        try {
          const savedChats = JSON.parse(localStorage.getItem("savedChats") || "[]")
          const reducedChats = savedChats.slice(0, 10)
          localStorage.setItem("savedChats", JSON.stringify(reducedChats))

        } catch (secondError) {
          console.error("[v0] Erro crítico no localStorage:", secondError)
        }
      }
    }
  }

  function loadSavedChats() {


    let savedChats = []
    try {
      savedChats = JSON.parse(localStorage.getItem("savedChats") || "[]")
    } catch (e) {

      savedChats = []
    }

    if (savedChats.length === 0) {
      chatList.innerHTML = `
        <div class="empty-chats">
          <i class="fas fa-comments"></i>
          <span>Nenhum chat salvo ainda</span>
        </div>
      `
      return
    }

    chatList.innerHTML = ""

    savedChats.forEach((chat) => {
      const chatItem = document.createElement("div")
      chatItem.className = "chat-item"
      chatItem.innerHTML = `
        <div class="chat-item-info">
          <div class="chat-item-title">${chat.title}</div>
          <div class="chat-item-preview">${chat.preview}</div>
        </div>
        <div class="chat-item-actions">
          <span class="chat-item-time">${formatTime(chat.timestamp)}</span>
          <button class="delete-chat-btn" onclick="deleteChat('${chat.id}')">
            <i class="far fa-trash-can"></i>
          </button>
        </div>
      `

      chatItem.addEventListener("click", (e) => {
        if (!e.target.closest(".delete-chat-btn")) {
          loadChat(chat.id)
          closeSidebarMenu()
        }
      })

      chatList.appendChild(chatItem)
    })
  }

  function loadChat(chatId) {


    if (window.location.pathname !== "/chat" && window.location.pathname !== "/") {
      localStorage.setItem("loadChatId", chatId)
      window.location.href = "/chat"
      return
    }

    const savedChats = JSON.parse(localStorage.getItem("savedChats") || "[]")
    const chat = savedChats.find((c) => c.id === chatId)

    if (!chat) {

      return
    }

    // Salvar chat atual antes de carregar outro
    saveChat()

    // Carregar mensagens do chat selecionado
    const messagesContainer = document.getElementById("messagesContainer")
    if (messagesContainer) {
      messagesContainer.innerHTML = ""

      chat.messages.forEach((msg) => {
        const messageDiv = document.createElement("div")
        messageDiv.className = `message ${msg.type}-message`

        messageDiv.innerHTML = `
          <div class="message-avatar">
            <i class="fas fa-${msg.type === "bot" ? "robot" : "user"}"></i>
          </div>
          <div class="message-content">
            <p>${msg.content}</p>
            <span class="message-time">${msg.time}</span>
          </div>
        `

        messagesContainer.appendChild(messageDiv)
      })

      messagesContainer.scrollTop = messagesContainer.scrollHeight
    }

    localStorage.setItem("currentChatId", chatId)

  }

  function startNewChat() {


    // Salvar chat atual se houver mensagens
    saveChat()

    // Limpar chat atual
    const messagesContainer = document.getElementById("messagesContainer")
    if (messagesContainer) {
      messagesContainer.innerHTML = `
        <div class="message bot-message">
          <div class="message-avatar">
            <i class="fas fa-robot"></i>
          </div>
          <div class="message-content">
            <p>Olá! Sou seu assistente virtual. Como posso ajudá-lo hoje?</p>
            <span class="message-time">Agora</span>
          </div>
        </div>
      `
    }

    // Gerar novo ID de chat
    const newChatId = "chat_" + Date.now()
    localStorage.setItem("currentChatId", newChatId)
    localStorage.removeItem("loadChatId")


  }

  window.deleteChat = (chatId) => {


    let savedChats = JSON.parse(localStorage.getItem("savedChats") || "[]")
    savedChats = savedChats.filter((chat) => chat.id !== chatId)
    localStorage.setItem("savedChats", JSON.stringify(savedChats))

    // Recarregar lista
    loadSavedChats()


  }

  function formatTime(timestamp) {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Agora"
    if (minutes < 60) return `${minutes}min`
    if (hours < 24) return `${hours}h`
    if (days < 7) return `${days}d`

    return new Date(timestamp).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    })
  }

  function setupAutoSave() {
    const messagesContainer = document.getElementById("messagesContainer")
    if (!messagesContainer) return

    const observer = new MutationObserver((mutations) => {
      let shouldSave = false

      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          const addedNode = mutation.addedNodes[0]
          if (
            addedNode.classList &&
            addedNode.classList.contains("message") &&
            !addedNode.classList.contains("typing-indicator") &&
            !addedNode.classList.contains("options-message")
          ) {
            shouldSave = true
          }
        }
      })

      if (shouldSave) {
        setTimeout(() => {
          saveChat()
        }, 2000) // Aguardar 2 segundos antes de salvar
      }
    })

    observer.observe(messagesContainer, { childList: true })

  }

  // Marcar item ativo no menu
  const currentPage = window.location.pathname.split("/").pop() || "index.html"
  const navItems = document.querySelectorAll(".nav-item")

  navItems.forEach((item) => {
    const href = item.getAttribute("href")
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      item.classList.add("active")
    } else {
      item.classList.remove("active")
    }
  })

  const isOnChatPage =
    window.location.pathname === "/chat" ||
    window.location.pathname === "/" ||
    currentPage === "index.html" ||
    currentPage === "chat.html" ||
    currentPage === ""

  if (isOnChatPage) {
    setupAutoSave()

    // Definir ID do chat atual se não existir
    if (!localStorage.getItem("currentChatId")) {
      localStorage.setItem("currentChatId", "chat_" + Date.now())
    }

    const loadChatId = localStorage.getItem("loadChatId")
    if (loadChatId) {
      localStorage.removeItem("loadChatId")
      setTimeout(() => {
        loadChat(loadChatId)
      }, 500)
    }


    const savedChatsCount = JSON.parse(localStorage.getItem("savedChats") || "[]").length

  }
})
