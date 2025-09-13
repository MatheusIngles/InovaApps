// Funcionalidade da página de chamados
document.addEventListener("DOMContentLoaded", () => {
  const ticketsContainer = document.getElementById("ticketsContainer")
  const statusFilter = document.getElementById("statusFilter")
  const prioridadeFilter = document.getElementById("prioridadeFilter")
  const newTicketBtn = document.getElementById("newTicketBtn")
  const ticketModal = document.getElementById("ticketModal")
  const closeModal = document.getElementById("closeModal")
  const modalTitle = document.getElementById("modalTitle")
  const modalBody = document.getElementById("modalBody")
  const overlay = document.getElementById("overlay")

  // Renderizar tickets
  function renderTickets(ticketsToRender) {
    ticketsContainer.innerHTML = ""

    if (ticketsToRender.length === 0) {
      ticketsContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--gray-500);">
                    <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <p>Nenhum chamado encontrado</p>
                </div>
            `
      return
    }

    ticketsToRender.forEach((ticket) => {
      const ticketCard = document.createElement("div")
      ticketCard.className = `ticket-card priority-${ticket.priority}`
      ticketCard.innerHTML = `
                <div class="ticket-header">
                    <span class="ticket-id">${ticket.id}</span>
                    <span class="ticket-status status-${ticket.status}">${getStatusText(ticket.status)}</span>
                </div>
                <h3 class="ticket-title">${ticket.title}</h3>
                <p class="ticket-description">${ticket.description}</p>
                <div class="ticket-meta">
                    <span class="ticket-priority priority-${ticket.priority}">${getPriorityText(ticket.priority)}</span>
                    <span class="ticket-date">${formatDate(ticket.date)} às ${ticket.time}</span>
                </div>
            `

      ticketCard.addEventListener("click", () => openTicketModal(ticket))
      ticketsContainer.appendChild(ticketCard)
    })
  }

  // Filtrar tickets
  function filterTickets() {
    const statusValue = statusFilter.value
    const priorityValue = prioridadeFilter.value

    const filteredTickets = tickets.filter((ticket) => {
      const statusMatch = !statusValue || ticket.status === statusValue
      const priorityMatch = !priorityValue || ticket.priority === priorityValue
      return statusMatch && priorityMatch
    })

    renderTickets(filteredTickets)
  }

  // Abrir modal do ticket
  function openTicketModal(ticket) {
    modalTitle.textContent = `Chamado ${ticket.id}`
    modalBody.innerHTML = `
            <div style="margin-bottom: 1rem;">
                <strong>Status:</strong> 
                <span class="ticket-status status-${ticket.status}">${getStatusText(ticket.status)}</span>
            </div>
            <div style="margin-bottom: 1rem;">
                <strong>Prioridade:</strong> 
                <span class="ticket-priority priority-${ticket.priority}">${getPriorityText(ticket.priority)}</span>
            </div>
            <div style="margin-bottom: 1rem;">
                <strong>Data:</strong> ${formatDate(ticket.date)} às ${ticket.time}
            </div>
            <div style="margin-bottom: 1rem;">
                <strong>Título:</strong> ${ticket.title}
            </div>
            <div style="margin-bottom: 1rem;">
                <strong>Descrição:</strong>
                <p style="margin-top: 0.5rem; padding: 1rem; background: var(--gray-100); border-radius: var(--border-radius);">
                    ${ticket.description}
                </p>
            </div>
            <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem;">
                <button class="btn btn-secondary" onclick="window.closeTicketModal()">Fechar</button>
                <button class="btn btn-primary" onclick="window.updateTicketStatus('${ticket.id}')">Atualizar Status</button>
            </div>
        `

    ticketModal.classList.add("active")
    overlay.classList.add("active")
    document.body.style.overflow = "hidden"
  }

  // Fechar modal
  window.closeTicketModal = () => {
    ticketModal.classList.remove("active")
    overlay.classList.remove("active")
    document.body.style.overflow = ""
  }

  // Atualizar status do ticket
  window.updateTicketStatus = (ticketId) => {
    const ticket = tickets.find((t) => t.id === ticketId)
    if (ticket) {
      // Simular atualização de status
      const statuses = ["aberto", "em-andamento", "resolvido", "fechado"]
      const currentIndex = statuses.indexOf(ticket.status)
      const nextIndex = (currentIndex + 1) % statuses.length
      ticket.status = statuses[nextIndex]

      window.closeTicketModal()

      // Mostrar notificação
      showNotification(`Status do chamado ${ticketId} atualizado para: ${getStatusText(ticket.status)}`)
    }
  }

  // Mostrar notificação
  function showNotification(message) {
    const notification = document.createElement("div")
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `
    notification.textContent = message
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.3s ease"
      setTimeout(() => notification.remove(), 300)
    }, 3000)
  }

  // Funções auxiliares
  function getStatusText(status) {
    const statusMap = {
      aberto: "Aberto",
      "em-andamento": "Em Andamento",
      resolvido: "Resolvido",
      fechado: "Fechado",
    }
    return statusMap[status] || status
  }

  function getPriorityText(priority) {
    const priorityMap = {
      baixa: "Baixa",
      media: "Média",
      alta: "Alta",
      urgente: "Urgente",
    }
    return priorityMap[priority] || priority
  }

  function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR")
  }

  // Event listeners
  if (statusFilter) {
    statusFilter.addEventListener("change", filterTickets)
  }

  if (prioridadeFilter) {
    prioridadeFilter.addEventListener("change", filterTickets)
  }

  if (newTicketBtn) {
    newTicketBtn.addEventListener("click", () => {
      // Simular criação de novo ticket
      const newTicket = {
        id: `TK-${String(tickets.length + 1).padStart(3, "0")}`,
        title: "Novo chamado criado",
        description: "Descrição do novo chamado criado via interface.",
        status: "aberto",
        priority: "media",
        date: new Date().toISOString().split("T")[0],
        time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      }

      tickets.unshift(newTicket)
      showNotification(`Novo chamado ${newTicket.id} criado com sucesso!`)
    })
  }

  if (closeModal) {
    closeModal.addEventListener("click", window.closeTicketModal)
  }

  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        window.closeTicketModal()
      }
    })
  }

  // Fechar modal com ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && ticketModal.classList.contains("active")) {
      window.closeTicketModal()
    }
  })
})
