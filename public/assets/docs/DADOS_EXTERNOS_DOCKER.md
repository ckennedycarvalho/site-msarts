# MSARTS - Infra Docker + Dados Externos (Portainer & Traefik)

Conforme sua preferência, configuramos o projeto para que a **Infraestrutura** rode em Docker, mas os **Arquivos do Site** (HTML, CSS, JS) fiquem em uma pasta na sua VM para facilitar a edição.

---

## 1. Como funciona a estrutura
No arquivo `docker-compose.yml`, adicionei um **Volume**:
`./public:/app/public`

Isso significa que:
1.  O container roda o motor (Node.js/Express).
2.  Ele "olha" para a pasta `public/` que está na sua VM.
3.  Qualquer arquivo que você subir ou editar na pasta `public/` da VM aparecerá no site **instantaneamente**, sem precisar reiniciar o Docker ou fazer novo deploy.

---

## 2. Passo a Passo para subir

### A. Suba apenas a Infraestrutura (Uma única vez)
No Portainer, use o **Web Editor** com o código do `docker-compose.yml` que atualizei. Isso vai criar o container "vaso vazio" que rodará o Node.js.

### B. Suba os Dados (Sempre que quiser atualizar o site)
Basta colocar os seus arquivos dentro da pasta `public/` no diretório onde a Stack foi criada na sua VM.
- `public/index.html`
- `public/assets/...`
- `public/admin.html`

---

## 3. Vantagem para você
- **Total Liberdade**: Você pode usar FTP, SCP ou editar via terminal os arquivos do site na VM.
- **Segurança**: O servidor Node.js (que lida com orçamentos e fotos) fica protegido dentro do Docker e controlado pelo Portainer.
- **Traefik**: Continua gerenciando seu SSL e domínio automaticamente via labels.

---

**Dica**: Se você mudar o código do `server.js` (a lógica do backend), aí sim você precisará dar um "Update" na Stack. Mas para mudar o visual, cores ou textos do site, basta mexer na pasta `public/`.
