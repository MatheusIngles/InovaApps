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

  const bootstrap = window.bootstrap
  function handleOpenTicket() {
    showTicketModal()

    document.getElementsByClassName("modal-backdrop")[0].remove()
  }

  function showTicketModal() {
    // Criar o modal se não existir
    let modal = document.getElementById("ticketModal")
    if (!modal) {
      modal = createTicketModal()
      console.log(modal)
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
              <form id="ticketForm" action="/add_ticket_database" method="post" novalidate>
                <div class="mb-3">
                  <label for="ticketTitle" class="form-label">
                    <i class="fas fa-heading me-1"></i>Título do Chamado
                  </label>
                  <input name="title" type="text" class="form-control" id="ticketTitle" placeholder="Descreva brevemente o problema" required>
                </div>
                
                <div class="mb-3">
                  <label for="ticketDescription" class="form-label">
                    <i class="fas fa-align-left me-1"></i>Descrição Detalhada
                  </label>
                  <textarea name="description" class="form-control" id="ticketDescription" rows="4" placeholder="Descreva detalhadamente o problema ou solicitação" required></textarea>
                </div>
                
                <div class="mb-3">
                  <label for="ticketPriority" class="form-label">
                    <i class="fas fa-exclamation-triangle me-1"></i>Prioridade
                  </label>
                  <select name="priority" class="form-select" id="ticketPriority" required>
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
                  <button type="submit" class="btn btn-primary" id="submitTicket" href="/add_ticket_database">
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
        setTimeout(() => {
          window.close()
        }, 2000)
      })
      .catch((error) => {
        console.error("Erro ao abrir chamado:", error)
        addMessage("Erro ao abrir chamado. Tente novamente.", "bot")
      })
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
      handleOpenTicket()
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
