// Kanban JavaScript
let draggedElement = null;
let selectedTicket = null;
let isMobile = window.innerWidth <= 768;

// Inicializar o Kanban
function initializeKanban() {
    if (typeof ticketsData === 'undefined') {
        console.error('Dados dos tickets não encontrados');
        return;
    }

    // Limpar todas as colunas
    clearAllColumns();
    
    // Organizar tickets por status
    const ticketsByStatus = organizeTicketsByStatus(ticketsData);
    
    // Renderizar tickets em cada coluna
    renderTicketsInColumns(ticketsByStatus);
    
    // Atualizar contadores
    updateTicketCounts(ticketsByStatus);
    
    // Configurar interação (drag and drop para desktop, clique para mobile)
    if (isMobile) {
        setupMobileInteraction();
    } else {
        setupDragAndDrop();
    }
}

// Organizar tickets por status
function organizeTicketsByStatus(tickets) {
    const organized = {
        'aberto': [],
        'em-andamento': [],
        'finalizado': []
    };

    tickets.forEach(ticket => {
        let status = ticket.status;
        
        // Mapear status do banco para status do Kanban
        if (status === 'resolvido' || status === 'fechado') {
            status = 'finalizado';
        }
        
        if (organized[status]) {
            organized[status].push(ticket);
        }
    });

    return organized;
}

// Limpar todas as colunas
function clearAllColumns() {
    const columns = ['aberto', 'em-andamento', 'finalizado'];
    columns.forEach(status => {
        const column = document.getElementById(`column-${status}`);
        if (column) {
            column.innerHTML = '';
        }
    });
}

// Renderizar tickets nas colunas
function renderTicketsInColumns(ticketsByStatus) {
    Object.keys(ticketsByStatus).forEach(status => {
        const column = document.getElementById(`column-${status}`);
        if (!column) return;

        const tickets = ticketsByStatus[status];
        
        if (tickets.length === 0) {
            column.innerHTML = `
                <div class="empty-column">
                    <i class="fas fa-inbox"></i>
                    <p>Nenhum ticket</p>
                </div>
            `;
            return;
        }

        // Ordenar tickets por data de criação (mais recentes primeiro)
        tickets.sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time));

        column.innerHTML = tickets.map(ticket => createTicketCard(ticket)).join('');
    });
}

// Criar card do ticket
function createTicketCard(ticket) {
    const priorityColor = getPriorityColor(ticket.priority);
    const draggableAttr = isMobile ? '' : 'draggable="true"';
    
    return `
        <div class="ticket-card priority-${ticket.priority}" 
             data-ticket-id="${ticket.code}" 
             data-status="${ticket.status}"
             ${draggableAttr}>
            <div class="ticket-header">
                <span class="ticket-id">${ticket.code}</span>
                <span class="ticket-priority priority-${ticket.priority}">${getPriorityText(ticket.priority)}</span>
            </div>
            <h3 class="ticket-title">${ticket.title}</h3>
            <p class="ticket-description">${ticket.description}</p>
            <div class="ticket-meta">
                <span class="ticket-date">
                    <i class="fas fa-calendar"></i>
                    ${ticket.date} às ${ticket.time}
                </span>
            </div>
        </div>
    `;
}

// Atualizar contadores de tickets
function updateTicketCounts(ticketsByStatus) {
    Object.keys(ticketsByStatus).forEach(status => {
        const countElement = document.getElementById(`count-${status}`);
        if (countElement) {
            countElement.textContent = ticketsByStatus[status].length;
        }
    });
}

// Configurar interação mobile (clique)
function setupMobileInteraction() {
    const ticketCards = document.querySelectorAll('.ticket-card');
    const columns = document.querySelectorAll('.kanban-column');

    // Configurar eventos de clique para os tickets
    ticketCards.forEach(card => {
        card.addEventListener('click', handleTicketClick);
    });

    // Configurar eventos de clique para as colunas
    columns.forEach(column => {
        column.addEventListener('click', handleColumnClick);
    });

    // Adicionar instruções visuais
    showMobileInstructions();
}

// Configurar drag and drop
function setupDragAndDrop() {
    const ticketCards = document.querySelectorAll('.ticket-card');
    const columns = document.querySelectorAll('.column-content');

    // Configurar eventos de drag para os tickets
    ticketCards.forEach(card => {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
    });

    // Configurar eventos de drop para as colunas
    columns.forEach(column => {
        column.addEventListener('dragover', handleDragOver);
        column.addEventListener('drop', handleDrop);
        column.addEventListener('dragenter', handleDragEnter);
        column.addEventListener('dragleave', handleDragLeave);
    });
}

// Event handlers para drag and drop
function handleDragStart(e) {
    draggedElement = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    draggedElement = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(e) {
    e.preventDefault();
    e.target.closest('.column-content').classList.add('drag-over');
}

function handleDragLeave(e) {
    const columnContent = e.target.closest('.column-content');
    if (columnContent && !columnContent.contains(e.relatedTarget)) {
        columnContent.classList.remove('drag-over');
    }
}

function handleDrop(e) {
    e.preventDefault();
    const columnContent = e.target.closest('.column-content');
    if (!columnContent || !draggedElement) return;

    columnContent.classList.remove('drag-over');

    // Obter o novo status da coluna
    const newStatus = columnContent.id.replace('column-', '');
    const oldStatus = draggedElement.dataset.status;

    // Se o status não mudou, não fazer nada
    if (newStatus === oldStatus) return;

    // Remover mensagem "Nenhum ticket" se existir
    const emptyMessage = columnContent.querySelector('.empty-column');
    if (emptyMessage) {
        emptyMessage.remove();
    }

    // Atualizar o status do ticket no DOM
    draggedElement.dataset.status = newStatus;
    
    // Mover o elemento para a nova coluna
    columnContent.appendChild(draggedElement);

    // Atualizar contadores
    updateCountersAfterMove(oldStatus, newStatus);

    // Aqui você pode adicionar uma chamada AJAX para atualizar o status no banco de dados
    updateTicketStatusInDatabase(draggedElement.dataset.ticketId, newStatus);
}

// Event handlers para mobile
function handleTicketClick(e) {
    e.stopPropagation();
    
    // Remover seleção anterior
    if (selectedTicket) {
        selectedTicket.classList.remove('selected');
    }
    
    // Selecionar novo ticket
    selectedTicket = e.currentTarget;
    selectedTicket.classList.add('selected');
    
    // Mostrar instruções
    showMoveInstructions();
}

function handleColumnClick(e) {
    if (!selectedTicket) return;
    
    const column = e.currentTarget;
    const newStatus = column.dataset.status;
    const oldStatus = selectedTicket.dataset.status;
    
    // Se o status não mudou, não fazer nada
    if (newStatus === oldStatus) {
        selectedTicket.classList.remove('selected');
        selectedTicket = null;
        hideInstructions();
        return;
    }
    
    // Mover ticket
    moveTicketToColumn(selectedTicket, newStatus, oldStatus);
    
    // Limpar seleção
    selectedTicket.classList.remove('selected');
    selectedTicket = null;
    hideInstructions();
}

function moveTicketToColumn(ticket, newStatus, oldStatus) {
    const newColumn = document.getElementById(`column-${newStatus}`);
    const oldColumn = document.getElementById(`column-${oldStatus}`);
    
    // Remover mensagem "Nenhum ticket" se existir
    const emptyMessage = newColumn.querySelector('.empty-column');
    if (emptyMessage) {
        emptyMessage.remove();
    }
    
    // Atualizar status do ticket no DOM
    ticket.dataset.status = newStatus;
    
    // Mover o elemento para a nova coluna
    newColumn.appendChild(ticket);
    
    // Atualizar contadores
    updateCountersAfterMove(oldStatus, newStatus);
    
    // Atualizar no banco de dados
    updateTicketStatusInDatabase(ticket.dataset.ticketId, newStatus);
}

function showMobileInstructions() {
    // Criar banner de instruções se não existir
    if (!document.getElementById('mobile-instructions')) {
        const instructions = document.createElement('div');
        instructions.id = 'mobile-instructions';
        instructions.className = 'mobile-instructions';
        instructions.innerHTML = `
            <div class="instructions-content">
                <i class="fas fa-hand-pointer"></i>
                <span>Toque em um ticket para selecioná-lo, depois toque na coluna de destino</span>
            </div>
        `;
        
        const mainContent = document.querySelector('.main-content');
        mainContent.insertBefore(instructions, mainContent.firstChild);
    }
}

function showMoveInstructions() {
    const instructions = document.getElementById('mobile-instructions');
    if (instructions) {
        instructions.innerHTML = `
            <div class="instructions-content">
                <i class="fas fa-arrow-right"></i>
                <span>Ticket selecionado! Toque na coluna de destino</span>
            </div>
        `;
        instructions.classList.add('active');
    }
}

function hideInstructions() {
    const instructions = document.getElementById('mobile-instructions');
    if (instructions) {
        instructions.classList.remove('active');
        setTimeout(() => {
            if (instructions) {
                instructions.innerHTML = `
                    <div class="instructions-content">
                        <i class="fas fa-hand-pointer"></i>
                        <span>Toque em um ticket para selecioná-lo, depois toque na coluna de destino</span>
                    </div>
                `;
            }
        }, 300);
    }
}

// Atualizar contadores após mover ticket
function updateCountersAfterMove(oldStatus, newStatus) {
    const oldCount = document.getElementById(`count-${oldStatus}`);
    const newCount = document.getElementById(`count-${newStatus}`);
    const oldColumn = document.getElementById(`column-${oldStatus}`);

    if (oldCount) {
        oldCount.textContent = parseInt(oldCount.textContent) - 1;
    }
    if (newCount) {
        newCount.textContent = parseInt(newCount.textContent) + 1;
    }

    // Se a coluna antiga ficou vazia, adicionar mensagem "Nenhum ticket"
    if (oldColumn && oldColumn.children.length === 0) {
        oldColumn.innerHTML = `
            <div class="empty-column">
                <i class="fas fa-inbox"></i>
                <p>Nenhum ticket</p>
            </div>
        `;
    }
}

// Atualizar status do ticket no banco de dados
function updateTicketStatusInDatabase(ticketCode, newStatus) {
    // Mapear status do Kanban para status do banco
    let dbStatus = newStatus;
    if (newStatus === 'finalizado') {
        dbStatus = 'resolvido';
    }

    fetch('/update_ticket_status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ticket_code: ticketCode,
            status: dbStatus
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Status do ticket atualizado com sucesso');
        } else {
            console.error('Erro ao atualizar status do ticket:', data.error);
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
    });
}

// Função para recarregar o Kanban (útil para atualizações)
function reloadKanban() {
    // Recarregar a página ou fazer uma nova requisição AJAX
    window.location.reload();
}

// Event listeners globais
document.addEventListener('DOMContentLoaded', function() {
    // Reconfigurar eventos quando novos tickets são adicionados
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                if (isMobile) {
                    setupMobileInteraction();
                } else {
                    setupDragAndDrop();
                }
            }
        });
    });

    const kanbanBoard = document.getElementById('kanbanBoard');
    if (kanbanBoard) {
        observer.observe(kanbanBoard, {
            childList: true,
            subtree: true
        });
    }

    // Detectar mudanças de tamanho de tela
    window.addEventListener('resize', function() {
        const newIsMobile = window.innerWidth <= 768;
        if (newIsMobile !== isMobile) {
            isMobile = newIsMobile;
            
            // Limpar seleção se existir
            if (selectedTicket) {
                selectedTicket.classList.remove('selected');
                selectedTicket = null;
            }
            
            // Remover instruções mobile se não for mobile
            if (!isMobile) {
                const instructions = document.getElementById('mobile-instructions');
                if (instructions) {
                    instructions.remove();
                }
            }
            
            // Reconfigurar eventos
            if (isMobile) {
                setupMobileInteraction();
            } else {
                setupDragAndDrop();
            }
        }
    });
});

// Funções auxiliares (já definidas no HTML, mas aqui para referência)
function getPriorityText(priority) {
    const priorityMap = {
        'baixa': 'Baixa',
        'media': 'Média',
        'alta': 'Alta',
        'urgente': 'Urgente'
    };
    return priorityMap[priority] || priority;
}

function getPriorityColor(priority) {
    const colorMap = {
        'baixa': '#28a745',
        'media': '#ffc107',
        'alta': '#fd7e14',
        'urgente': '#dc3545'
    };
    return colorMap[priority] || '#6c757d';
}
