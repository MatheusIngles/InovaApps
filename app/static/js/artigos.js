// JavaScript para página de artigos
let currentArticleId = null;
let currentPermissionId = null;

// Inicializar a página
document.addEventListener('DOMContentLoaded', function() {
    initializeArtigos();
    setupEventListeners();
});

function initializeArtigos() {
    // Carregar artigos
    loadArticles();
    
    // Carregar permissões
    loadPermissions();
}

function setupEventListeners() {
    // Botão de novo artigo
    const addArticleBtn = document.getElementById('addArticleBtn');
    if (addArticleBtn) {
        addArticleBtn.addEventListener('click', showAddArticleModal);
    }

    // Botão do visualizador JSON
    const toggleJsonBtn = document.getElementById('toggleJsonBtn');
    if (toggleJsonBtn) {
        toggleJsonBtn.addEventListener('click', toggleJsonViewer);
    }

    // Botões do modal de artigo
    const saveArticleBtn = document.getElementById('saveArticleBtn');
    const deleteArticleBtn = document.getElementById('deleteArticleBtn');
    
    if (saveArticleBtn) {
        saveArticleBtn.addEventListener('click', saveArticle);
    }
    
    if (deleteArticleBtn) {
        deleteArticleBtn.addEventListener('click', deleteArticle);
    }

    // Botões do modal de permissão
    const approvePermissionBtn = document.getElementById('approvePermissionBtn');
    const rejectPermissionBtn = document.getElementById('rejectPermissionBtn');
    
    if (approvePermissionBtn) {
        approvePermissionBtn.addEventListener('click', approvePermission);
    }
    
    if (rejectPermissionBtn) {
        rejectPermissionBtn.addEventListener('click', rejectPermission);
    }
}

// ========== FUNÇÕES DE ARTIGOS ==========

function loadArticles() {
    const articlesList = document.getElementById('articlesList');
    if (!articlesList) return;

    if (typeof articlesData === 'undefined' || articlesData.length === 0) {
        articlesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book"></i>
                <p>Nenhum artigo encontrado</p>
            </div>
        `;
        updateJsonViewer();
        return;
    }

    articlesList.innerHTML = articlesData.map((article, index) => createArticleCard(article, index)).join('');
    updateJsonViewer();
}

function updateJsonViewer() {
    const jsonCode = document.getElementById('jsonCode');
    if (!jsonCode) return;

    const jsonString = JSON.stringify(articlesData || [], null, 2);
    jsonCode.textContent = jsonString;
    
    // Aplicar syntax highlighting
    applyJsonHighlighting(jsonCode);
}

function toggleJsonViewer() {
    const jsonContent = document.getElementById('jsonContent');
    const toggleBtn = document.getElementById('toggleJsonBtn');
    
    if (!jsonContent || !toggleBtn) return;

    const isVisible = jsonContent.style.display !== 'none';
    
    if (isVisible) {
        jsonContent.style.display = 'none';
        toggleBtn.innerHTML = '<i class="fas fa-eye"></i> Mostrar';
    } else {
        jsonContent.style.display = 'block';
        toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i> Ocultar';
        updateJsonViewer();
    }
}

function applyJsonHighlighting(element) {
    let html = element.textContent;
    
    // Syntax highlighting básico para JSON
    html = html.replace(/(".*?")\s*:/g, '<span class="json-key">$1</span>:');
    html = html.replace(/:\s*(".*?")/g, ': <span class="json-string">$1</span>');
    html = html.replace(/:\s*(\d+)/g, ': <span class="json-number">$1</span>');
    html = html.replace(/:\s*(true|false)/g, ': <span class="json-boolean">$1</span>');
    html = html.replace(/:\s*(null)/g, ': <span class="json-null">$1</span>');
    
    element.innerHTML = html;
}

function createArticleCard(article, index) {
    return `
        <div class="article-card" data-article-id="${index}">
            <div class="article-header">
                <span class="article-id">Artigo ${index + 1}</span>
                <div class="article-actions">
                    <button class="article-action-btn" onclick="editArticle(${index})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="article-action-btn" onclick="deleteArticle(${index})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <h3 class="article-topic">${article.topico}</h3>
            <p class="article-answer">${article.resposta}</p>
            <div class="article-meta">
                <span class="article-date">
                    <i class="fas fa-calendar"></i>
                    ${new Date().toLocaleDateString('pt-BR')}
                </span>
            </div>
        </div>
    `;
}

function showAddArticleModal() {
    currentArticleId = null;
    document.getElementById('articleTopic').value = '';
    document.getElementById('articleAnswer').value = '';
    document.getElementById('articleModalLabel').innerHTML = '<i class="fas fa-plus me-2"></i>Novo Artigo';
    
    const modal = new bootstrap.Modal(document.getElementById('articleModal'));
    modal.show();
}

function editArticle(articleIndex) {
    const article = articlesData[articleIndex];
    currentArticleId = articleIndex;
    
    document.getElementById('articleTopic').value = article.topico;
    document.getElementById('articleAnswer').value = article.resposta;
    document.getElementById('articleModalLabel').innerHTML = '<i class="fas fa-edit me-2"></i>Editar Artigo';
    
    const modal = new bootstrap.Modal(document.getElementById('articleModal'));
    modal.show();
}

function saveArticle() {
    const topic = document.getElementById('articleTopic').value.trim();
    const answer = document.getElementById('articleAnswer').value.trim();

    if (!topic || !answer) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    const articleData = {
        topico: topic,
        resposta: answer
    };

    if (currentArticleId === null) {
        // Novo artigo
        addArticle(articleData);
    } else {
        // Editar artigo existente
        updateArticle(currentArticleId, articleData);
    }
}

function addArticle(articleData) {
    fetch('/add_article', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Fechar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('articleModal'));
            modal.hide();
            
            // Mostrar notificação e recarregar página
            showNotification('Artigo adicionado com sucesso!', 'success');
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            showNotification('Erro ao adicionar artigo: ' + data.error, 'error');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        showNotification('Erro ao adicionar artigo', 'error');
    });
}

function updateArticle(articleIndex, articleData) {
    fetch('/update_article', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            index: articleIndex,
            ...articleData
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Fechar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('articleModal'));
            modal.hide();
            
            // Mostrar notificação e recarregar página
            showNotification('Artigo atualizado com sucesso!', 'success');
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            showNotification('Erro ao atualizar artigo: ' + data.error, 'error');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        showNotification('Erro ao atualizar artigo', 'error');
    });
}

function deleteArticle(articleIndex) {
    if (!confirm('Tem certeza que deseja excluir este artigo?')) {
        return;
    }

    fetch('/delete_article', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ index: articleIndex })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Fechar modal se estiver aberto
            const modal = bootstrap.Modal.getInstance(document.getElementById('articleModal'));
            if (modal) {
                modal.hide();
            }
            
            // Mostrar notificação e recarregar página
            showNotification('Artigo excluído com sucesso!', 'success');
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            showNotification('Erro ao excluir artigo: ' + data.error, 'error');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        showNotification('Erro ao excluir artigo', 'error');
    });
}

// ========== FUNÇÕES DE PERMISSÕES ==========

function loadPermissions() {
    const permissionsList = document.getElementById('permissionsList');
    const pendingCount = document.getElementById('pendingCount');
    
    if (!permissionsList) return;

    if (typeof permissionsData === 'undefined' || permissionsData.length === 0) {
        permissionsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>Nenhuma solicitação pendente</p>
            </div>
        `;
        if (pendingCount) pendingCount.textContent = '0';
        return;
    }

    const pendingPermissions = permissionsData.filter(p => p.status === 'pending');
    if (pendingCount) pendingCount.textContent = pendingPermissions.length;

    permissionsList.innerHTML = permissionsData.map((permission, index) => createPermissionCard(permission, index)).join('');
}

function createPermissionCard(permission, index) {
    const statusClass = permission.status || 'pending';
    const statusText = getStatusText(permission.status);
    const type = permission.type || 'chamado';
    const typeIcon = getTypeIcon(type);
    const typeText = getTypeText(type);
    
    return `
        <div class="permission-card ${statusClass}" data-permission-id="${index}" onclick="showPermissionDetails(${index})">
            <div class="permission-header">
                <span class="permission-id">#${index + 1} <i class="${typeIcon}" title="${typeText}"></i></span>
                <span class="permission-status status-${statusClass}">${statusText}</span>
            </div>
            <h3 class="permission-topic">${permission.topic || 'Sem tópico'}</h3>
            <p class="permission-preview">${permission.answer || 'Sem descrição'}</p>
            <div class="permission-meta">
                <span class="permission-date">
                    <i class="fas fa-calendar"></i>
                    ${new Date(permission.created_date || permission.date || Date.now()).toLocaleDateString('pt-BR')}
                </span>
                <span class="permission-type">${typeText}</span>
            </div>
        </div>
    `;
}

function getTypeIcon(type) {
    const iconMap = {
        'chamado': 'fas fa-ticket-alt',
        'satisfaction': 'fas fa-thumbs-up',
        'feedback': 'fas fa-comment'
    };
    return iconMap[type] || 'fas fa-question';
}

function getTypeText(type) {
    const textMap = {
        'chamado': 'Chamado',
        'satisfaction': 'Satisfação',
        'feedback': 'Feedback'
    };
    return textMap[type] || 'Outro';
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'Pendente',
        'approved': 'Aprovado',
        'rejected': 'Rejeitado'
    };
    return statusMap[status] || 'Pendente';
}

function showPermissionDetails(permissionIndex) {
    const permission = permissionsData[permissionIndex];
    currentPermissionId = permissionIndex;
    
    // Preencher modal com dados da permissão
    document.getElementById('permissionDate').textContent = new Date(permission.date || Date.now()).toLocaleString('pt-BR');
    document.getElementById('permissionStatus').textContent = getStatusText(permission.status);
    document.getElementById('permissionStatus').className = `badge status-${permission.status}`;
    document.getElementById('permissionTopic').textContent = permission.topic || 'Sem tópico';
    document.getElementById('permissionAnswer').textContent = permission.answer || 'Sem descrição';
    
    // Carregar histórico
    loadPermissionHistory(permissionIndex);
    
    const modal = new bootstrap.Modal(document.getElementById('permissionModal'));
    modal.show();
}

function loadPermissionHistory(permissionIndex) {
    const historyList = document.getElementById('permissionHistory');
    if (!historyList) return;

    // Simular histórico (em produção, viria do backend)
    const history = [
        {
            action: 'Solicitação criada',
            date: new Date().toLocaleString('pt-BR'),
            content: 'Nova solicitação de alteração no artigo'
        },
        {
            action: 'Revisão pendente',
            date: new Date().toLocaleString('pt-BR'),
            content: 'Aguardando aprovação do administrador'
        }
    ];

    historyList.innerHTML = history.map(item => `
        <div class="history-item">
            <div class="history-item-header">
                <span class="history-action">${item.action}</span>
                <span class="history-date">${item.date}</span>
            </div>
            <div class="history-content">${item.content}</div>
        </div>
    `).join('');
}

function approvePermission() {
    if (currentPermissionId === null) return;

    fetch('/approve_permission', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            permissionId: currentPermissionId 
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Fechar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('permissionModal'));
            modal.hide();
            
            // Mostrar notificação e recarregar página
            showNotification('Solicitação aprovada com sucesso!', 'success');
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            showNotification('Erro ao aprovar solicitação: ' + data.error, 'error');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        showNotification('Erro ao aprovar solicitação', 'error');
    });
}

function rejectPermission() {
    if (currentPermissionId === null) return;

    if (!confirm('Tem certeza que deseja rejeitar esta solicitação?')) {
        return;
    }

    fetch('/reject_permission', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            permissionId: currentPermissionId 
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Fechar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('permissionModal'));
            modal.hide();
            
            // Mostrar notificação e recarregar página
            showNotification('Solicitação rejeitada', 'info');
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            showNotification('Erro ao rejeitar solicitação: ' + data.error, 'error');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        showNotification('Erro ao rejeitar solicitação', 'error');
    });
}

// ========== FUNÇÕES AUXILIARES ==========

function showNotification(message, type = 'info') {
    // Criar notificação simples
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show`;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Remover após 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

// Função para recarregar dados
function refreshData() {
    loadArticles();
    loadPermissions();
}

// Event listeners para atualizações em tempo real (opcional)
setInterval(refreshData, 30000); // Atualizar a cada 30 segundos
