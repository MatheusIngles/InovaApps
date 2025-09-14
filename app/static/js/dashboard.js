// Funcionalidade do dashboard
document.addEventListener("DOMContentLoaded", () => {
  // Elementos do DOM
  const totalTicketsEl = document.getElementById("totalTickets")
  const pendingTicketsEl = document.getElementById("pendingTickets")
  const resolvedTicketsEl = document.getElementById("resolvedTickets")
  const avgResponseTimeEl = document.getElementById("avgResponseTime")
  const activityListEl = document.getElementById("activityList")

  // Atualizar estatísticas
  function updateStats() {
    if (totalTicketsEl) {
      animateNumber(totalTicketsEl, dashboardData.totalTickets)
    }
    if (pendingTicketsEl) {
      animateNumber(pendingTicketsEl, dashboardData.pendingTickets)
    }
    if (resolvedTicketsEl) {
      animateNumber(resolvedTicketsEl, dashboardData.resolvedTickets)
    }
    if (avgResponseTimeEl) {
      avgResponseTimeEl.textContent = dashboardData.avgResponseTime
    }
  }

  // Animar números
  function animateNumber(element, target) {
    const duration = 1000
    const start = 0
    const increment = target / (duration / 16)
    let current = start

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        current = target
        clearInterval(timer)
      }
      element.textContent = Math.floor(current)
    }, 16)
  }

  // Renderizar atividades
  function renderActivities() {
    if (!activityListEl) return

    activityListEl.innerHTML = ""
    dashboardData.activities.forEach((activity) => {
      const activityItem = document.createElement("div")
      activityItem.className = "activity-item"
      activityItem.innerHTML = `
                <div class="activity-icon ${activity.type}">
                    <i class="fas ${getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-description">${activity.description}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            `
      activityListEl.appendChild(activityItem)
    })
  }

  // Obter ícone da atividade
  function getActivityIcon(type) {
    const icons = {
      new: "fa-plus-circle",
      update: "fa-edit",
      close: "fa-check-circle",
    }
    return icons[type] || "fa-circle"
  }

  // Atualizar dados em tempo real (simulação)
  function simulateRealTimeUpdates() {
    setInterval(() => {
      // Simular mudanças nos dados
      dashboardData.totalTickets += Math.floor(Math.random() * 3)
      dashboardData.pendingTickets += Math.floor(Math.random() * 2) - 1
      dashboardData.resolvedTickets += Math.floor(Math.random() * 2)

      // Garantir que os números façam sentido
      if (dashboardData.pendingTickets < 0) dashboardData.pendingTickets = 0
      if (dashboardData.resolvedTickets > dashboardData.totalTickets) {
        dashboardData.resolvedTickets = dashboardData.totalTickets - dashboardData.pendingTickets
      }

      // Atualizar display
      updateStats()
    }, 30000) // Atualizar a cada 30 segundos
  }

  // Inicializar dashboard
  function initDashboard() {
    updateStats()
    renderActivities()

    // Aguardar um pouco para garantir que o Chart.js foi carregado
    setTimeout(() => {
      createStatusChart()
      createMonthlyChart()
    }, 100)

    // Iniciar atualizações em tempo real
    simulateRealTimeUpdates()
  }

  // Verificar se Chart.js está disponível
  if (typeof window.Chart !== "undefined") {
    initDashboard()
  } else {
    // Aguardar Chart.js carregar
    const checkChart = setInterval(() => {
      if (typeof window.Chart !== "undefined") {
        clearInterval(checkChart)
        initDashboard()
      }
    }, 100)
  }
})
