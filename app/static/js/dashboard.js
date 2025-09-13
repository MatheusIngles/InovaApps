// Funcionalidade do dashboard
document.addEventListener("DOMContentLoaded", () => {
  // Elementos do DOM
  const totalTicketsEl = document.getElementById("totalTickets")
  const pendingTicketsEl = document.getElementById("pendingTickets")
  const resolvedTicketsEl = document.getElementById("resolvedTickets")
  const avgResponseTimeEl = document.getElementById("avgResponseTime")
  const activityListEl = document.getElementById("activityList")

  // Dados de exemplo
  const dashboardData = {
    totalTickets: 156,
    pendingTickets: 23,
    resolvedTickets: 133,
    avgResponseTime: "2.5h",
    activities: [
      {
        type: "new",
        title: "Novo chamado criado",
        description: "TK-156: Problema com integração de API",
        time: "5 min atrás",
      },
      {
        type: "update",
        title: "Chamado atualizado",
        description: 'TK-155: Status alterado para "Em Andamento"',
        time: "15 min atrás",
      },
      {
        type: "close",
        title: "Chamado resolvido",
        description: "TK-154: Problema de login solucionado",
        time: "1h atrás",
      },
      {
        type: "new",
        title: "Novo chamado criado",
        description: "TK-153: Solicitação de nova funcionalidade",
        time: "2h atrás",
      },
      {
        type: "update",
        title: "Chamado atualizado",
        description: 'TK-152: Prioridade alterada para "Alta"',
        time: "3h atrás",
      },
    ],
  }

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

  // Criar gráfico de status
  function createStatusChart() {
    const ctx = document.getElementById("statusChart")
    if (!ctx) return

    new window.Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Abertos", "Em Andamento", "Resolvidos", "Fechados"],
        datasets: [
          {
            data: [23, 15, 85, 33],
            backgroundColor: ["#007bff", "#ffc107", "#28a745", "#6c757d"],
            borderWidth: 2,
            borderColor: "#fff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              padding: 20,
              usePointStyle: true,
            },
          },
        },
      },
    })
  }

  // Criar gráfico mensal
  function createMonthlyChart() {
    const ctx = document.getElementById("monthlyChart")
    if (!ctx) return

    new window.Chart(ctx, {
      type: "line",
      data: {
        labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
        datasets: [
          {
            label: "Chamados Criados",
            data: [12, 19, 15, 25, 22, 18],
            borderColor: "#007bff",
            backgroundColor: "rgba(0, 123, 255, 0.1)",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
          },
          {
            label: "Chamados Resolvidos",
            data: [8, 15, 18, 20, 25, 22],
            borderColor: "#28a745",
            backgroundColor: "rgba(40, 167, 69, 0.1)",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              padding: 20,
              usePointStyle: true,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.1)",
            },
          },
          x: {
            grid: {
              color: "rgba(0, 0, 0, 0.1)",
            },
          },
        },
      },
    })
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
