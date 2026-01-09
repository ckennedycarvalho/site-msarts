# MSARTS - Guia de Deploy via Traefik

Como você utiliza o **Traefik** como seu Proxy Reverso, o deploy da MSARTS fica ainda mais automatizado através das labels do Docker.

---

## 1. No Portainer (Subindo a Stack)

1. No Portainer, vá em **Stacks** -> **Add stack**.
2. **Name**: `msarts-stack`
3. **Build method**: Selecione **Repository**.
4. **Repository URL**: `https://github.com/ckennedycarvalho/site-msarts.git`
5. **Compose path**: `docker-compose.yml`
6. Clique em **Deploy the stack**.

---

## 2. Entendendo as Labels (Configuradas no docker-compose.yml)

O projeto já vem configurado com as labels que o Traefik lê automaticamente:

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.msarts.rule=Host(`seu-dominio.com.br`)" # Ajuste para o seu domínio
  - "traefik.http.routers.msarts.entrypoints=websecure"
  - "traefik.http.routers.msarts.tls.certresolver=myresolver" # O nome do seu resolver no Traefik
  - "traefik.http.services.msarts.loadbalancer.server.port=3000" # Porta interna do Node.js
```

> [!IMPORTANT]
> **Ajuste de Domínio**: Lembre-se de editar a label `Host(...)` no `docker-compose.yml` para o domínio real que você vai usar.
> 
> **Rede Docker**: O container está configurado para entrar na rede `traefik-proxy`. Se o nome da rede do seu Traefik for diferente (ex: `proxy`, `traefik_public`), você deve alterar o nome da rede no final do arquivo `docker-compose.yml`.

---

## 3. Fluxo de Trabalho
1. Você faz alterações no código aqui.
2. Eu subo para o GitHub.
3. Você clica em **Update** na Stack no Portainer.
4. O Traefik detecta o novo container, gera o SSL e já coloca o site no ar.
