// Sistema de Customização
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const primaryColorInput = document.getElementById('primaryColor');
    const primaryColorText = document.getElementById('primaryColorText');
    const secondaryColorInput = document.getElementById('secondaryColor');
    const secondaryColorText = document.getElementById('secondaryColorText');
    const backgroundColorInput = document.getElementById('backgroundColor');
    const backgroundColorText = document.getElementById('backgroundColorText');
    const chatBackgroundInput = document.getElementById('chatBackground');
    const chatBackgroundText = document.getElementById('chatBackgroundText');
    
    const fontFamilySelect = document.getElementById('fontFamily');
    const fontSizeRange = document.getElementById('fontSize');
    const fontSizeValue = document.getElementById('fontSizeValue');
    const lineHeightRange = document.getElementById('lineHeight');
    const lineHeightValue = document.getElementById('lineHeightValue');
    
    const borderRadiusRange = document.getElementById('borderRadius');
    const borderRadiusValue = document.getElementById('borderRadiusValue');
    const shadowIntensityRange = document.getElementById('shadowIntensity');
    const shadowIntensityValue = document.getElementById('shadowIntensityValue');
    const spacingRange = document.getElementById('spacing');
    const spacingValue = document.getElementById('spacingValue');
    
    const themeModeSelect = document.getElementById('themeMode');
    const customCSSTextarea = document.getElementById('customCSS');
    const presetButtons = document.querySelectorAll('.preset-btn');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const previewFrame = document.getElementById('previewFrame');
    
    const applyBtn = document.getElementById('applyBtn');
    const exportBtn = document.getElementById('exportBtn');
    const importBtn = document.getElementById('importBtn');
    const importFile = document.getElementById('importFile');
    const resetBtn = document.getElementById('resetBtn');

    // Configurações padrão
    const defaultSettings = {
        primaryColor: '#25D366',
        secondaryColor: '#128C7E',
        backgroundColor: '#f0f2f5',
        chatBackground: '#e5ddd5',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        fontSize: 16,
        lineHeight: 1.5,
        borderRadius: 12,
        shadowIntensity: 0.1,
        spacing: 1,
        themeMode: 'light',
        customCSS: ''
    };

    // Temas predefinidos
    const presetThemes = {
        default: {
            primaryColor: '#25D366',
            secondaryColor: '#128C7E',
            backgroundColor: '#f0f2f5',
            chatBackground: '#e5ddd5'
        },
        blue: {
            primaryColor: '#2196F3',
            secondaryColor: '#1976D2',
            backgroundColor: '#f5f7fa',
            chatBackground: '#e3f2fd'
        },
        purple: {
            primaryColor: '#9C27B0',
            secondaryColor: '#7B1FA2',
            backgroundColor: '#faf5ff',
            chatBackground: '#f3e5f5'
        },
        green: {
            primaryColor: '#4CAF50',
            secondaryColor: '#388E3C',
            backgroundColor: '#f1f8e9',
            chatBackground: '#e8f5e8'
        },
        orange: {
            primaryColor: '#FF9800',
            secondaryColor: '#F57C00',
            backgroundColor: '#fff8e1',
            chatBackground: '#fff3e0'
        }
    };

    // Carregar configurações salvas
    function loadSettings() {
        const saved = localStorage.getItem('customizationSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            applySettingsToInputs(settings);
        }
    }

    // Aplicar configurações aos inputs
    function applySettingsToInputs(settings) {
        primaryColorInput.value = settings.primaryColor || defaultSettings.primaryColor;
        primaryColorText.value = settings.primaryColor || defaultSettings.primaryColor;
        secondaryColorInput.value = settings.secondaryColor || defaultSettings.secondaryColor;
        secondaryColorText.value = settings.secondaryColor || defaultSettings.secondaryColor;
        backgroundColorInput.value = settings.backgroundColor || defaultSettings.backgroundColor;
        backgroundColorText.value = settings.backgroundColor || defaultSettings.backgroundColor;
        chatBackgroundInput.value = settings.chatBackground || defaultSettings.chatBackground;
        chatBackgroundText.value = settings.chatBackground || defaultSettings.chatBackground;
        
        fontFamilySelect.value = settings.fontFamily || defaultSettings.fontFamily;
        fontSizeRange.value = settings.fontSize || defaultSettings.fontSize;
        fontSizeValue.textContent = (settings.fontSize || defaultSettings.fontSize) + 'px';
        lineHeightRange.value = settings.lineHeight || defaultSettings.lineHeight;
        lineHeightValue.textContent = settings.lineHeight || defaultSettings.lineHeight;
        
        borderRadiusRange.value = settings.borderRadius || defaultSettings.borderRadius;
        borderRadiusValue.textContent = (settings.borderRadius || defaultSettings.borderRadius) + 'px';
        shadowIntensityRange.value = settings.shadowIntensity || defaultSettings.shadowIntensity;
        shadowIntensityValue.textContent = settings.shadowIntensity || defaultSettings.shadowIntensity;
        spacingRange.value = settings.spacing || defaultSettings.spacing;
        spacingValue.textContent = (settings.spacing || defaultSettings.spacing) + 'x';
        
        themeModeSelect.value = settings.themeMode || defaultSettings.themeMode;
        customCSSTextarea.value = settings.customCSS || defaultSettings.customCSS;
    }

    // Obter configurações atuais
    function getCurrentSettings() {
        return {
            primaryColor: primaryColorInput.value,
            secondaryColor: secondaryColorInput.value,
            backgroundColor: backgroundColorInput.value,
            chatBackground: chatBackgroundInput.value,
            fontFamily: fontFamilySelect.value,
            fontSize: parseInt(fontSizeRange.value),
            lineHeight: parseFloat(lineHeightRange.value),
            borderRadius: parseInt(borderRadiusRange.value),
            shadowIntensity: parseFloat(shadowIntensityRange.value),
            spacing: parseFloat(spacingRange.value),
            themeMode: themeModeSelect.value,
            customCSS: customCSSTextarea.value
        };
    }

    // Gerar CSS personalizado
    function generateCustomCSS(settings) {
        return `
:root {
    --primary-color: ${settings.primaryColor};
    --secondary-color: ${settings.secondaryColor};
    --background-color: ${settings.backgroundColor};
    --chat-background: ${settings.chatBackground};
    --shadow: 0 2px 10px rgba(0, 0, 0, ${settings.shadowIntensity});
}

body {
    font-family: ${settings.fontFamily};
    font-size: ${settings.fontSize}px;
    line-height: ${settings.lineHeight};
}

.chat-container,
.page-container,
.stat-card,
.chart-container,
.ticket-card,
.modal-content {
    border-radius: ${settings.borderRadius}px;
}

.input-container,
.filter-group select,
.control-group input,
.control-group select,
.control-group textarea {
    border-radius: ${Math.max(4, settings.borderRadius - 4)}px;
}

* {
    --spacing-multiplier: ${settings.spacing};
}

.main-content {
    padding: ${20 * settings.spacing}px;
}

.stats-grid {
    gap: ${20 * settings.spacing}px;
}

.stat-card {
    padding: ${25 * settings.spacing}px;
}

${settings.customCSS}
        `.trim();
    }

    // Aplicar mudanças
    function applyChanges() {
        const settings = getCurrentSettings();
        const customCSS = generateCustomCSS(settings);
        
        // Salvar no localStorage
        localStorage.setItem('customizationSettings', JSON.stringify(settings));
        localStorage.setItem('customCSS', customCSS);
        
        // Aplicar CSS na página atual
        let styleElement = document.getElementById('customStyles');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'customStyles';
            document.head.appendChild(styleElement);
        }
        styleElement.textContent = customCSS;
        
        // Atualizar preview
        updatePreview();
        
        // Feedback visual
        applyBtn.textContent = 'Aplicado!';
        applyBtn.style.background = '#4CAF50';
        setTimeout(() => {
            applyBtn.textContent = 'Aplicar Mudanças';
            applyBtn.style.background = '';
        }, 2000);
    }

    // Atualizar preview
    function updatePreview() {
        try {
            const previewDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
            const customCSS = localStorage.getItem('customCSS');
            
            if (customCSS && previewDoc) {
                let styleElement = previewDoc.getElementById('customStyles');
                if (!styleElement) {
                    styleElement = previewDoc.createElement('style');
                    styleElement.id = 'customStyles';
                    previewDoc.head.appendChild(styleElement);
                }
                styleElement.textContent = customCSS;
            }
        } catch (e) {
            console.log('Não foi possível atualizar o preview:', e);
        }
    }

    // Exportar CSS
    function exportCSS() {
        const settings = getCurrentSettings();
        const customCSS = generateCustomCSS(settings);
        
        const blob = new Blob([customCSS], { type: 'text/css' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'custom-styles.css';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Importar CSS
    function importCSS(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            customCSSTextarea.value = e.target.result;
        };
        reader.readAsText(file);
    }

    // Resetar para padrão
    function resetToDefault() {
        if (confirm('Tem certeza que deseja restaurar todas as configurações para o padrão?')) {
            applySettingsToInputs(defaultSettings);
            localStorage.removeItem('customizationSettings');
            localStorage.removeItem('customCSS');
            
            // Remover estilos customizados
            const styleElement = document.getElementById('customStyles');
            if (styleElement) {
                styleElement.remove();
            }
            
            updatePreview();
        }
    }

    // Event Listeners para cores
    function setupColorInputs(colorInput, textInput) {
        colorInput.addEventListener('input', function() {
            textInput.value = this.value.toUpperCase();
        });
        
        textInput.addEventListener('input', function() {
            if (/^#[0-9A-F]{6}$/i.test(this.value)) {
                colorInput.value = this.value;
            }
        });
    }

    setupColorInputs(primaryColorInput, primaryColorText);
    setupColorInputs(secondaryColorInput, secondaryColorText);
    setupColorInputs(backgroundColorInput, backgroundColorText);
    setupColorInputs(chatBackgroundInput, chatBackgroundText);

    // Event Listeners para ranges
    fontSizeRange.addEventListener('input', function() {
        fontSizeValue.textContent = this.value + 'px';
    });

    lineHeightRange.addEventListener('input', function() {
        lineHeightValue.textContent = this.value;
    });

    borderRadiusRange.addEventListener('input', function() {
        borderRadiusValue.textContent = this.value + 'px';
    });

    shadowIntensityRange.addEventListener('input', function() {
        shadowIntensityValue.textContent = this.value;
    });

    spacingRange.addEventListener('input', function() {
        spacingValue.textContent = this.value + 'x';
    });

    // Event Listeners para temas predefinidos
    presetButtons.forEach(button => {
        button.addEventListener('click', function() {
            const theme = this.dataset.theme;
            if (presetThemes[theme]) {
                const themeSettings = presetThemes[theme];
                primaryColorInput.value = themeSettings.primaryColor;
                primaryColorText.value = themeSettings.primaryColor;
                secondaryColorInput.value = themeSettings.secondaryColor;
                secondaryColorText.value = themeSettings.secondaryColor;
                backgroundColorInput.value = themeSettings.backgroundColor;
                backgroundColorText.value = themeSettings.backgroundColor;
                chatBackgroundInput.value = themeSettings.chatBackground;
                chatBackgroundText.value = themeSettings.chatBackground;
                
                // Atualizar botão ativo
                presetButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Event Listeners para tabs do preview
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const previewType = this.dataset.preview;
            const urls = {
                chat: 'index.html',
                dashboard: 'dashboard.html',
                tickets: 'meus-chamados.html'
            };
            
            previewFrame.src = urls[previewType];
            
            // Atualizar tab ativo
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Aguardar carregamento e aplicar estilos
            previewFrame.onload = function() {
                setTimeout(updatePreview, 100);
            };
        });
    });

    // Event Listeners principais
    applyBtn.addEventListener('click', applyChanges);
    exportBtn.addEventListener('click', exportCSS);
    importBtn.addEventListener('click', () => importFile.click());
    importFile.addEventListener('change', function() {
        if (this.files[0]) {
            importCSS(this.files[0]);
        }
    });
    resetBtn.addEventListener('click', resetToDefault);

    // Inicialização
    loadSettings();
    
    // Aplicar estilos salvos na inicialização
    const savedCSS = localStorage.getItem('customCSS');
    if (savedCSS) {
        let styleElement = document.getElementById('customStyles');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'customStyles';
            document.head.appendChild(styleElement);
        }
        styleElement.textContent = savedCSS;
    }
    
    // Aguardar carregamento do preview e aplicar estilos
    previewFrame.onload = function() {
        setTimeout(updatePreview, 100);
    };
});