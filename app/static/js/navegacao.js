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
      startNewChat()
      closeSidebarMenu()
    })
  }

  function loadSavedChats() {
    const savedChats = JSON.parse(localStorage.getItem("savedChats") || "[]")

    if (savedChats.length === 0) {
      const exampleChats = [
        {
          id: "example_1",
          title: "Problema com Login",
          preview: "Não consigo acessar minha conta...",
          timestamp: Date.now() - 3600000, // 1 hora atrás
          isExample: true,
        },
        {
          id: "example_2",
          title: "Dúvida sobre Faturamento",
          preview: "Gostaria de entender melhor...",
          timestamp: Date.now() - 7200000, // 2 horas atrás
          isExample: true,
        },
        {
          id: "example_3",
          title: "Suporte Técnico",
          preview: "Estou com dificuldades para...",
          timestamp: Date.now() - 10800000, // 3 horas atrás
          isExample: true,
        },
      ]

      chatList.innerHTML = ""

      exampleChats.forEach((chat) => {
        const chatItem = document.createElement("div")
        chatItem.className = "chat-item"
        chatItem.innerHTML = `
          <div class="chat-item-info">
            <div class="chat-item-title">${chat.title}</div>
            <div class="chat-item-preview">${chat.preview}</div>
          </div>
          <div class="chat-item-actions">
            <span class="chat-item-time">${formatTime(chat.timestamp)}</span>
            <button class="delete-chat-btn" onclick="deleteExampleChat('${chat.id}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        `

        chatItem.addEventListener("click", (e) => {
          if (!e.target.closest(".delete-chat-btn")) {
            loadExampleChat(chat.id)
            closeSidebarMenu()
          }
        })

        chatList.appendChild(chatItem)
      })
      return
    }

    chatList.innerHTML = ""

    savedChats.forEach((chat, index) => {
      const chatItem = document.createElement("div")
      chatItem.className = "chat-item"
      chatItem.innerHTML = `
        <div class="chat-item-info">
          <div class="chat-item-title">${chat.title}</div>
          <div class="chat-item-preview">${chat.preview}</div>
        </div>
        <div class="chat-item-time">${formatTime(chat.timestamp)}</div>
      `

      chatItem.addEventListener("click", () => {
        loadChat(chat.id)
        closeSidebarMenu()
      })

      chatList.appendChild(chatItem)
    })
  }

  function loadExampleChat(chatId) {
    const exampleMessages = {
      example_1: [
        { type: "bot", content: "Olá! Sou seu assistente virtual. Como posso ajudá-lo hoje?", time: "3h" },
        { type: "user", content: "Não consigo acessar minha conta, sempre dá erro na senha", time: "3h" },
        {
          type: "bot",
          content:
            "Entendo sua dificuldade. Vamos resolver isso juntos. Você já tentou usar a opção 'Esqueci minha senha'?",
          time: "3h",
        },
      ],
      example_2: [
        { type: "bot", content: "Olá! Sou seu assistente virtual. Como posso ajudá-lo hoje?", time: "2h" },
        { type: "user", content: "Gostaria de entender melhor como funciona a cobrança do meu plano", time: "2h" },
        {
          type: "bot",
          content:
            "Claro! Posso explicar detalhadamente sobre seu plano. Qual informação específica você gostaria de saber?",
          time: "2h",
        },
      ],
      example_3: [
        { type: "bot", content: "Olá! Sou seu assistente virtual. Como posso ajudá-lo hoje?", time: "3h" },
        { type: "user", content: "Estou com dificuldades para configurar o sistema no meu computador", time: "3h" },
        {
          type: "bot",
          content: "Vou te ajudar com a configuração. Primeiro, me diga qual sistema operacional você está usando?",
          time: "3h",
        },
      ],
    }

    const messages = exampleMessages[chatId]
    if (!messages) return

    const messagesContainer = document.getElementById("messagesContainer")
    if (messagesContainer) {
      messagesContainer.innerHTML = ""

      messages.forEach((msg) => {
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
    console.log("[v0] Chat de exemplo carregado:", chatId)
  }

  window.deleteExampleChat = (chatId) => {
    const chatItem = document.querySelector(`[onclick="deleteExampleChat('${chatId}')"]`).closest(".chat-item")
    if (chatItem) {
      chatItem.remove()
    }

    // Se não sobrar nenhum chat, mostrar mensagem vazia
    if (chatList.children.length === 0) {
      chatList.innerHTML = `
        <div class="empty-chats">
          <i class="fas fa-comments"></i>
          <span>Nenhum chat salvo ainda</span>
        </div>
      `
    }
  }

  function startNewChat() {
    // Salvar chat atual se houver mensagens
    const currentMessages = document.querySelectorAll(".message:not(.typing-indicator)")
    if (currentMessages.length > 1) {
      // Mais que a mensagem inicial do bot
      saveCurrentChat()
    }

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

    console.log("[v0] Novo chat iniciado:", newChatId)
  }

  function saveCurrentChat() {
    const messages = Array.from(document.querySelectorAll(".message:not(.typing-indicator):not(.options-message)"))
    if (messages.length <= 1) return // Não salvar se só tem mensagem inicial

    const currentChatId = localStorage.getItem("currentChatId") || "chat_" + Date.now()
    const savedChats = JSON.parse(localStorage.getItem("savedChats") || "[]")

    const firstUserMessage = messages.find((msg) => msg.classList.contains("user-message"))
    const title = firstUserMessage
      ? firstUserMessage.querySelector("p")?.textContent?.substring(0, 30) + "..."
      : "Chat sem título"

    const preview = firstUserMessage
      ? firstUserMessage.querySelector("p")?.textContent?.substring(0, 50) + "..."
      : "Conversa iniciada"

    const chatData = {
      id: currentChatId,
      title: title,
      preview: preview,
      timestamp: Date.now(),
      messages: messages
        .map((msg) => {
          const content =
            msg.querySelector("p")?.textContent || msg.querySelector(".message-content")?.textContent || ""
          return {
            type: msg.classList.contains("user-message") ? "user" : "bot",
            content: content.trim(),
            time: msg.querySelector(".message-time")?.textContent || "",
          }
        })
        .filter((msg) => msg.content.length > 0), // Filtrar mensagens vazias
    }

    if (chatData.messages.length <= 1) {
      console.log("[v0] Chat não salvo - conteúdo insuficiente")
      return
    }

    // Verificar se chat já existe e atualizar, senão adicionar
    const existingIndex = savedChats.findIndex((chat) => chat.id === currentChatId)
    if (existingIndex >= 0) {
      savedChats[existingIndex] = chatData
    } else {
      savedChats.unshift(chatData) // Adicionar no início
    }

    // Manter apenas os 20 chats mais recentes
    if (savedChats.length > 20) {
      savedChats.splice(20)
    }

    try {
      localStorage.setItem("savedChats", JSON.stringify(savedChats))
      console.log("[v0] Chat salvo com sucesso:", chatData.title)
      console.log("[v0] Total de chats salvos:", savedChats.length)
    } catch (error) {
      console.error("[v0] Erro ao salvar chat no localStorage:", error)
      if (error.name === "QuotaExceededError") {
        try {
          // Manter apenas os 10 chats mais recentes se localStorage estiver cheio
          const reducedChats = savedChats.slice(0, 10)
          localStorage.setItem("savedChats", JSON.stringify(reducedChats))
          console.log("[v0] Chat salvo após limpeza do localStorage")
        } catch (secondError) {
          console.error("[v0] Erro crítico no localStorage:", secondError)
        }
      }
    }
  }

  function loadChat(chatId) {
    const savedChats = JSON.parse(localStorage.getItem("savedChats") || "[]")
    const chat = savedChats.find((c) => c.id === chatId)

    if (!chat) return

    // Salvar chat atual antes de carregar outro
    saveCurrentChat()

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
    console.log("[v0] Chat carregado:", chat.title)
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
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          const addedNode = mutation.addedNodes[0]
          if (
            addedNode.classList &&
            addedNode.classList.contains("message") &&
            !addedNode.classList.contains("typing-indicator") &&
            !addedNode.classList.contains("options-message") // Excluir mensagens de opções do auto-save
          ) {
            setTimeout(saveCurrentChat, 1000)
          }
        }
      })
    })

    const messagesContainer = document.getElementById("messagesContainer")
    if (messagesContainer) {
      observer.observe(messagesContainer, { childList: true })
      console.log("[v0] Auto-save configurado com sucesso")
    } else {
      console.error("[v0] Erro: messagesContainer não encontrado para auto-save")
    }
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

  if (currentPage === "index.html" || currentPage === "") {
    setupAutoSave()

    // Definir ID do chat atual se não existir
    if (!localStorage.getItem("currentChatId")) {
      localStorage.setItem("currentChatId", "chat_" + Date.now())
    }

    console.log("[v0] Sistema de chat inicializado")
    console.log("[v0] Chat ID atual:", localStorage.getItem("currentChatId"))
    console.log("[v0] Chats salvos:", JSON.parse(localStorage.getItem("savedChats") || "[]").length)
  }
})
