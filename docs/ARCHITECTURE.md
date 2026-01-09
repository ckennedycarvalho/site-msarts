# Arquitetura do Projeto MSARTS

Este documento explica como o projeto está organizado e a função de cada arquivo e diretório importante.

## 📂 Estrutura de Pastas

```text
MSARTS/
├── docs/                # Documentação do projeto
│   ├── infra/           # Arquivos de infraestrutura (Docker)
│   └── site/            # Manuais de manutenção do site
├── public/              # Tudo o que é visível na internet (Pasta Pública)
│   ├── assets/          # Arquivos estáticos (CSS, JS, Imagens)
│   │   ├── css/         # Estilização visual (style.css)
│   │   ├── js/          # Lógica do navegador (script.js)
│   │   └── img/         # Imagens e ícones
│   ├── index.html       # Página principal do site
│   └── politica...html  # Página legal da LGPD
├── .env.example         # Exemplo de configurações secretas (e-mail, etc)
├── package.json         # Lista de bibliotecas e scripts do Node.js
├── server.js            # O "Cérebro" do site (Servidor Backend)
└── docker-compose.yml   # Configuração para rodar o site em Docker
```

---

## 🛠️ O que cada arquivo faz?

### 1. `server.js` (O Servidor)
É o ponto central. Ele recebe os acessos dos usuários, protege o site contra ataques e envia os e-mails de orçamento. 
*   **Segurança (Helmet/OWASP)**: Protege contra hackers.
*   **Anti-Spam (Rate Limit/Honeypot)**: Bloqueia robôs e inundação de spam.
*   **Rotas**: Decide o que mostrar quando alguém acessa `/` ou `/api/orcamento`.

### 2. Pasta `public/`
Contém os arquivos que o navegador do seu cliente baixa para "desenhar" o site na tela.
*   **`index.html`**: Contém os textos e a estrutura de seções (Hero, Sobre, Portfólio, Contato).
*   **`assets/css/style.css`**: Define as cores, fontes, tamanhos e a responsividade (como o site se comporta em celulares ou com zoom).
*   **`assets/js/script.js`**: Controla efeitos visuais (menu que muda de cor ao rolar) e o envio real do formulário de contato para o servidor.

### 3. `package.json`
É o manifesto do projeto. Ele lista todas as ferramentas que o site usa, como:
*   `express`: Para criar o servidor.
*   `nodemailer`: Para enviar e-mails.
*   `helmet`: No reforço de segurança.

### 4. `docker-compose.yml`
Diz ao Docker (no Portainer) como subir o servidor, mapeando a pasta da sua VM para dentro do container e conectando com o Traefik para garantir o acesso via domínio e SSL (HTTPS).

### 5. Arquivo `.env` (Oculto)
Este arquivo é o único que nunca deve ir para o GitHub. Ele guarda suas senhas. É onde você configura o usuário e senha do e-mail que envia os orçamentos.

---

## 🚀 Fluxo de um Orçamento
1. O cliente preenche o formulário no `index.html`.
2. O `script.js` envia os dados para o `server.js`.
3. O `server.js` verifica se não é um robô (Anti-spam).
4. O `server.js` limpa o texto contra scripts maliciosos (Sanitização).
5. O `server.js` usa as credenciais do `.env` para disparar um e-mail para você.

---

### Dúvidas Frequentes:
*   **Como mudo um texto do site?** Edite o `public/index.html`.
*   **Como mudo uma cor ou tamanho?** Edite o `public/assets/css/style.css`.
*   **O site parou, o que eu faço?** Verifique os logs do container no Portainer para ver se o `server.js` encontrou algum erro.
