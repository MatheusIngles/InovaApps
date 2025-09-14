# Projeto InovaApps
## Grupo Atum
## Empresa Unita Soluções Digitais
Aqui estão as instruções do projeto do grupo atum para o inovaapps 2025!

**Repositório**: https://github.com/MatheusIngles/InovaApps

**LINK DO VIDEO**: https://youtu.be/y8F1zkP_2Z0

**Integrantes**:
* Lucas Bonato Soares
* Matheus Endlich Silveira
* Rafael Ferreira Bassul

**Envolvidos no desafio**:
* Universidade Vila Velha - Financiadora do evento
* Coordenadora Susiléa Abreu - Organizadora do evento
* Empresa Unita Soluções Digitais - Apresentação da proposta do desafio

# Como instalar

Para executar o projeto, são necessários os seguintes programas externos:

* Python>=3.12 + dependências
* sqlite3

## AVISO: Primeira execução
A primeira execução pode demorar bastante tempo, pois o modelo de linguagem precisa fazer a inicialização de vários parâmetros.

Isso ocorre apenas na primeira execução, e as seguintes vão ter rempo de execução normal.

## Instruções de instalação

<details> 
<summary>
Python
</summary>
É necessário python versão 3.12 para cima instalado para executar o programa.

O python pode ser instalado seguindo o url: https://www.python.org/.

Em sistemas Windows, após a instalação, tenha certeza que o Python foi adicionado ao PATH do seu sistema. Isso pode ser verificando acessando "Váriaveis de Ambiente" > "Path".

Se houver os paths do python ali, está tudo certo, se não, você deve adicionar.
<hr>
</details>

<details> 
<summary>
SQLite
</summary>
Instalar não é estritamente necessário, mas pode evitar problemas ter uma instância do sqlite no seu computador.

O sqlite3 pode ser instalado acessando https://sqlite.org/download.html.

Para usuários windows, deve-se baixar a versão "tools" na seção de "Precompiled Binaries for Windows" dos downloads. Um exemplo de download a ser acessado: "sqlite-tools-win-x64-3500400.zip".

Após fazer o download, deve ser adicionado ao PATH do seu sistema.  Isso pode ser verificando acessando "Váriaveis de Ambiente" > "Path".

Se houver os paths do sqlite ali, está tudo certo, se não, você deve adicionar.
</details>

<details> 
<summary>
Variáveis de Ambiente
</summary>
Se você precisou instalar o python e o sqlite, ao final do processo você deve ter algo assim:

<img width="1141" height="501" alt="Instrucao variaveis" src="https://github.com/user-attachments/assets/9644d990-3d85-4f3c-ba8c-a4d07e1325b5" />

Se você não está vendo os PATHs do Python ou o Path do sqlite, busque o local de instalação dos seus arquivos e adicione aqui.

Por exemplo, meu sqlite está em ``C:\Program Files\sqlite``, então adiciono o Path:

<img width="571" height="501" alt="image" src="https://github.com/user-attachments/assets/f3aefa79-18ee-4a40-96cc-6675b20832f3" />

Após adicionar o PATH, clica "OK" em tudo e o path deve funcionar.

Para verificar se o path funciona, abra seu terminal e execute:
* ``py --version`` Para verificar se python esta instalado e com o path configurado
* ``sqlite3`` Para verificar se o sqlite está instalado e com o path configurado

<img width="814" height="421" alt="image" src="https://github.com/user-attachments/assets/c06f7fdf-1800-40ac-bf91-1cbea675b9e8" />


  

</details>


<details> 
<summary>
Ambiente Virtual
</summary>
Antes de instalar as dependências, é boa prática inicializar um ambiente virtual dentro do projeto. 

Com o projeto aberto no seu VScode, utilize o terminal para executar os seguintes passos:

* ``pip -m venv .venv`` | Você pode trocar ".venv" para o nome que quiser, mas vamos seguir aqui referindo ao ambiente virtual como ".venv".

Após esse comando, deve-se executar, a depender do seu sistema, o script de ativação do venv.

* WINDOWS: ``.venv/Scripts/activate``
* LINUX: ``source .venv/bin/activate``

Se houver problemas no Windows para executar o Script, pode ser necessário também executar o seguinte comando, antes de executar o script de ativação do venv:

* ``Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Current``
</details>

<details> 
<summary>
Dependências Python
</summary>
Ao acessar o venv, você pode coletar as dependências usando o requirements.txt por meio do gerenciador de pacotes da sua preferência. 

Vamos seguir nas instruções usando o gerenciador pip, por ser o gerenciador padrão do python.

* ``pip install -r requirements.txt``
</details>

<details> 
<summary>
Configurações Flask
</summary>
Pode ser necessário configurar algumas variáveis do flask.

* Windows: ``set FLASK_APP=app.py``
* Linux: ``export FLASK_APP=app.py``
</details>

<details> 
<summary>
Como executar / Primeira execução
</summary>
Na pasta do projeto, com o terminal acessado no venv e as dependências instaladas, basta executar o comando:

* ``flask run``

**Atenção!** Ao realizar a primeira execução, algumas instalações adicionais vão ser realizadas para as dependências do projeto. 

Isso significa que a primeira execução vai demorar um pouco a mais para processar pois deve instalar esse arquivos auxiliares, mas execuções posteriores vão ocorrer normalmente pois tudo já vai estar instalado.
</details>

# Roteiro de testes

Aqui vou descrever varios casos de uso / fluxo de usuário que podem ser replicados em testes.

Quanto aos 3 usuários: Solicitante, Atendente e Admin, entendemos que todo usuário é solicitante, alguns também atendentes, alguns também ADMIN.

Não implementamos sistema de acesso e separação de usuários, e sim nos focamos em demonstrar os fluxos de cada página e como os usuários interagem com o sistema. 

Ou seja, normalmente, o solicitante não acessaria a página de atendente e admin, e atendente não acessaria a página de admin, mas no projeto estamos mostrando todas a todo momento.

Vale notar que a aplicação é responsiva e funciona em **MOBILE** e **DESKTOP**, então pode ser feito os fluxos/testes em ambos modelos.

<details>
<summary>
Solicitante - Chat - Fluxo de consulta de artigo - RESPOSTA EXATA
</summary>

| **caso** | Usuário solicitante vai ao chat, pergunta algo e a pergunta está de forma exata na base de dados dos artigos |
|----------|----------------------------------------------------------------------------------------------|
| **fluxo** | Abre o chat, pergunta algo, chat responde com resposta padronizada do artigo. |

Nos artigos temos um tópico de "como instalar python". Tente perguntar ao chat exatamente "como instalar python", e ele deve responder:

* ``"Para instalar o Python, acesse o site oficial python.org, baixe o instalador correspondente ao seu sistema operacional (Windows, macOS ou Linux). Durante a instalação, marque a opção 'Add Python to PATH' para facilitar o uso via terminal. Após a instalação, abra o terminal ou prompt de comando e digite 'python --version' para verificar se foi instalado corretamente."``

</details>

<details>
<summary>
Solicitante - Chat - Fluxo de consulta de artigo - RESPOSTA APROXIMADA
</summary>

Se a sua pergunta for **semelhante** a "como instalar python", como por exemplo, "como baixar python no computador", ele vai ainda retornar a mesma resposta que daria em uma pergunta exata, mas vai perguntar: **"Esta resposta atende a sua solicitação?"**.

Se o usuário falar que atende, uma solicitação de atualização dos artigos é enviada para o admin do sistema. 

Se a resposta não atende, o usuário pode abrir chamado pré-preenchido pela IA ou então tentar resolver o problema via chat com a IA (caindo nos casos de testes seguintes a este).

A solicitação de atualização dos artigos é gerenciada por administradores na pagina de Artigos, onde se o admin considerar que a resposta aproximada equivale a resposta exata, ele adiciona aos artigos.

Após adicionar aos artigos, o sistema vai considerar as respostas como equivalentes e de correspondência exata, ou seja, "como instalar python" seria equivalente a "como baixar python no computador".

Essa alteração dos artigos existe para que com o tempo, usuários alimentam a base de artigos com perguntas semelhantes de mesma resposta para melhorar cada vez mais a acurácia da ferramenta.
</details>

<details>
<summary>
Solicitante - Chat - Fluxo de abrir chamado
</summary>

| **caso** | Usuário solicitante vai ao chat, pergunta algo e a pergunta não está na base de dados dos artigos. Usuário escolhe abrir chamado. |
|----------|----------------------------------------------------------------------------------------------------------------------------------|
| **fluxo** | Abre o chat, pergunta algo, chat não encontra artigo, usuário escolhe abrir chamado |

Tente perguntar algo absurdo, como "como os dinossauros morreram?".

O chat deve informar que não achou a pergunta na base de dados, e vai dar a opção entre:

* Pesquisar na IA
* Abrir o chamado

Clique em Abrir o chamado, aguarde um instante, e um formulário pré-preenchido com os dados do chat vai ser gerado. Basta enviar o formulário e o chamado será registrado.

No exemplo dos dinossauros que dei, o formulário de chamado veio pré-preenchido como:

* **Título do Chamado**: Consulta sobre a extinção dos dinossauros
* **Descrição do Chamado**: O usuário solicitou informações sobre as causas da extinção dos dinossauros. Necessita-se de detalhes sobre teorias e evidências científicas.
* **Prioridade**: Baixa

</details>

<details>
<summary>
Solicitante - Chat - Fluxo de solução chatbot IA
</summary>

| **caso** | Usuário solicitante vai ao chat, pergunta algo e a pergunta não está na base de dados dos artigos. Usuário escolhe resolver problema via IA. |
|----------|-------------------------------------------------------------------------------------------------------------------------------------------|
| **fluxo** | Abre o chat, pergunta algo, chat não encontra artigo, usuário escolhe Pesquisar na IA |

Tente perguntar algo absurdo, como "como os dinossauros morreram?".

O chat deve informar que não achou a pergunta na base de dados, e vai dar a opção entre:

* Pesquisar na IA
* Abrir o chamado

Clique em Pesquisar na IA, e o chatbot deve responder com um texto gerado por LLM. No meu caso, respondeu:

*``"Resposta do bot: Olá! A extinção dos dinossauros, que ocorreu há cerca de 66 milhões de anos, foi causada principalmente por um evento catastrófico: a colisão de um asteroide gigante com a Terra. Esse impacto liberou uma energia colossal, provocando incêndios florestais, tsunamis, terremotos e uma nuvem de poeira que obscureceu o sol por um longo período. Sem luz solar, a fotossíntese foi interrompida, afetando toda a cadeia alimentar e levando à extinção de grande parte da vida no planeta, incluindo os dinossauros não-avianos."``

Após a resposta da IA, o usuário pode:

* Fechar o chat, satisfeito com a solução
* Clicar em ABRIR CHAMADO, para abrir chamado.
    * O botão de abrir chamado surge no topo da tela, a partir da primeira resposta do chatbot.

Clicando em Abrir Chamado após a resposta do chatbot IA, o formulário de chamado veio pré-preenchido da seguinte forma:

* **Título do Chamado**: Dúvida sobre extinção dos dinossauros
* **Descrição do Chamado**: O usuário questiona a causa da extinção dos dinossauros. Necessita de informações sobre os eventos que levaram à sua extinção.
* **Prioridade**: Baixa


</details>

<details>
<summary>
Solicitante - Chats Salvos - Fluxo de abrir chat antigo
</summary>

| **caso** | Usuário solicitante quer abrir um chat antigo |
|----------|-------------------------------------------------------------|
| **fluxo** | Abre o menu, clica em Chats Salvos, acessa o chat antigo. |

Usuário pode acessar os chats antigos dele abrindo a opção no menu, carregando chats antigos e permitindo interação para que usuário possa consultar respostas antigas ou continuar uma conversa que estava tendo.

</details>

<details>
<summary>
Solicitante - Meus Chamados - Fluxo de consulta de chamados registrados
</summary>

| **caso** | Usuário solicitante quer ver seus chamados registrados |
|----------|-------------------------------------------------------|
| **fluxo** | Abre o menu, clica em Meus Chamados |

Acessando a página de "Meus Chamados", temos uma lista de chamados criados de acordo com o banco de dados. Ou seja, se criar um chamado nos fluxos anteriores, vai surgir aqui.

Além disso, usuário pode criar um chamado nessa tela também, pelo botão "Novo Chamado".

Filtros permitem selecionar chamados específicos, filtrando por status e prioridade.

O status de cada chamado também é puxado do banco de dados, e o atendente pode mudar o estado desses chamados e isso é refletido nessa tela.

</details>

<details>
<summary>
Atendente - kanban - Fluxo de atendimento de chamados registrados
</summary>

| **caso** | Usuário atendente quer gerenciar seus chamados |
|----------|-----------------------------------------------|
| **fluxo** | Abre o menu, clica em Kanban |

Aqui o atendente acessa os chamados abertos.

Ele pode arrastar os cards entre as arraias, e isso reflete na tela de Meus Chamados do solicitante. Nota: Em responsividade Mobile, o atendente não arrasta os cards, e sim clica no card e depois na arraia de destino.

Atualmente, usamos o mesmo banco de dados, o que pode dar a impressão que o atendente está gerenciando os seus próprios chamados nessa tela. Na aplicação real, o atendente gerenciaria os chamados de outros solicitantes. 

Deixamos tudo junto para poupar tempo de desenvolvimento e apenas demonstrar a ideia de como seria a interação dos usuários com a aplicação.

</details>

<details>
<summary>
Admin - Dashboard - Fluxo de consulta de dados da aplicação
</summary>

| **caso** | Usuário admin quer ver os dados da aplicação |
|----------|---------------------------------------------|
| **fluxo** | Abre o menu, clica em Dashboard |

Novamente, apenas o ADMIN teria acesso a essa pagina, mas deixamos solto sem essa separação para poupar tempo.

Aqui os dados são novamente puxados do banco de dados, então pode arrastar chamados nas arraias e criar novos chamados para testar a alteração em tempo real dos dados do dashboad.

Os unicos dados falsos, que não representam o sistema, são Tempo médio de resposta e Chamados por mês, pois não seria possível coletar dados suficientes para alimentar esses campos no tempo do desafio.

Além disso, no final da pagina, existe a "Atividade Recente", onde pode ser visto as ultimas 3 alterações feitas. Na aplicação real, daria para ver a auditoria de todos os chamados, não só os ultimos 3.

</details>

<details>
<summary>
Admin - Customização - Fluxo de estilo de visual da aplicação
</summary>

| **caso** | Usuário admin quer editar a aparência da aplicação |
|----------|---------------------------------------------------|
| **fluxo** | Abre o menu, clica em Customização |

Novamente, apenas o ADMIN teria acesso a essa pagina, mas deixamos solto sem essa separação para poupar tempo.

Aqui é possivel editar o estilo da aplicação, para que cada empresa possa ter controle da identidade visual da solução para se adequar ao seu desejo.

Por meio dos temas predefinidos, seria possivel a equipe entregar a solução já no formado que a empresa quer, e a empresa não precisa fazer isso manualmente.

O que essa pagina faz não é delegar a responsabilidade de identidade visual a empresa, e sim permitir que, após a entrega, a empresa possa alterar e gerenciar isso de forma facil.

Alterações seriam facilmente reversíveis apenas clicando de volta no tema predefinido.

Ao terminar de modificar tudo, usuário pode clicar em salvar configurações para aplicar as alterações.

</details>

<details>
<summary>
Admin - Artigos - Fluxo de gerenciamento de artigos
</summary>

| **caso** | Usuário admin quer gerenciar os artigos do chat |
|----------|------------------------------------------------|
| **fluxo** | Abre o menu, clica em Artigos |

Novamente, apenas o ADMIN teria acesso a essa pagina, mas deixamos solto sem essa separação para poupar tempo.

Nessa pagina o admin pode ver os artigos registrados no sistema, e também as solicitações de artigo novo gerado nos fluxo de chatbot IA no chat.

Ao aceitar uma solicitação, ela é adicionada aos artigos, o que iria permitir o chat de ter maior acurácia ao responder perguntas de tópico semelhante no futuro.

Admin pode clicar em uma solicitação e em APROVAR para adicionar aos artigos registrados.

</details>
