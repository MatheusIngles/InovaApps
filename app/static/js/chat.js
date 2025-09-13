// Funcionalidade do Chat
document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const messagesArea = document.getElementById('messagesArea');

    // Respostas automáticas da IA (simulação)
    const botResponses = [
        "Entendi sua solicitação. Vou criar um chamado para você. Qual é o tipo do problema?",
        "Obrigado pelas informações. Seu chamado foi registrado com sucesso! Número do chamado: #" + Math.floor(Math.random() * 10000),
        "Posso ajudá-lo com mais alguma coisa?",
        "Para problemas técnicos, selecione a opção 1. Para dúvidas comerciais, selecione a opção 2.",
        "Aguarde um momento enquanto verifico as informações...",
        "Seu chamado está sendo processado. Você receberá uma atualização em breve."
    ];

    // Função para obter horário atual
    function getCurrentTime() {
        const now = new Date();
        return now.getHours().toString().padStart(2, '0') + ':' + 
               now.getMinutes().toString().padStart(2, '0');
    }

    // Função para adicionar mensagem
    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${text}</p>
                <span class="message-time">${getCurrentTime()}</span>
            </div>
        `;
        
        messagesArea.appendChild(messageDiv);
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }

    // Função para simular resposta do bot
    function simulateBotResponse() {
        setTimeout(() => {
            const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
            addMessage(randomResponse);
        }, 1000 + Math.random() * 2000); // Delay entre 1-3 segundos
    }

    // Função para enviar mensagem
    function sendMessage() {
        const text = messageInput.value.trim();
        if (text === '') return;

        // Adicionar mensagem do usuário
        addMessage(text, true);
        messageInput.value = '';

        // Simular resposta do bot
        simulateBotResponse();
    }

    // Event listeners
    sendBtn.addEventListener('click', sendMessage);
    
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Auto-resize do input
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });

    // Mensagem de boas-vindas adicional após 2 segundos
    setTimeout(() => {
        addMessage("Você pode descrever seu problema ou escolher uma das opções do menu para começar.");
    }, 2000);
});