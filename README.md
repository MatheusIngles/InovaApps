# Projeto InovaApps
## Grupo Atum
## Empresa Unita Soluções Digitais
Aqui estão as instruções do projeto do grupo atum para o inovaapps 2025!

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

<details> 
<summary>
Python
</summary>
É necessário python versão 3.12 para cima instalado para executar o programa.

O python pode ser instalado seguindo o url: https://www.python.org/.

Em sistemas Windows, após a instalação, tenha certeza que o Python foi adicionado ao PATH do seu sistema. Isso pode ser verificando acessando "Váriaveis de Ambiente" > "Path".

Se houver os paths do python ali, está tudo certo, se não, você deve adicionar.
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

