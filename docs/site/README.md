# Gerenciamento do Site MSARTS

Este guia explica como gerenciar o conteúdo do site sem mexer na infraestrutura Docker.

## Fluxo de Trabalho:
1.  **Edição Local**: Faça as alterações no HTML, CSS ou JS aqui no seu ambiente local (Windows).
2.  **Sincronização**: Dê um `git push` para subir as alterações para o GitHub.
3.  **Atualização na VM**:
    - Acesse sua VM via SSH.
    - Vá para a pasta onde o site reside: `cd /home/msarts`.
    - Baixe as atualizações: `git pull`.
    - O site será atualizado instantaneamente, pois o motor Node.js já está configurado para ler esta pasta.

## Estrutura de Arquivos:
- `/public`: Pasta principal do site (página inicial, imagens, css).
- `server.js`: Arquivo central do servidor Node.js.
- `package.json`: Lista de dependências do servidor.
