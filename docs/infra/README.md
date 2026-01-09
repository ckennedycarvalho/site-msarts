# Configuração da Infraestrutura (Node.js Engine)

Esta pasta contém o necessário para configurar o servidor (motor) na sua VM.

## Arquivos:
- `docker-compose.yml`: Deve ser colado no **Web Editor** do Portainer Stack.

## Fluxo de Configuração na VM:
1. Acesse sua VM via SSH.
2. Crie a pasta de trabalho: `mkdir /home/msarts`.
3. Clone o projeto dentro dela: `git clone https://github.com/ckennedycarvalho/site-msarts.git /home/msarts`.
4. No Portainer, crie uma Stack usando o conteúdo do `docker-compose.yml` desta pasta.

O Docker agora gerencia o Node.js como infraestrutura, mas os arquivos do site residem na pasta `/home/msarts` da VM.
