# MSARTS - Guia de Deploy via Portainer & NPM

Este guia explica como subir o site usando o seu **Portainer** e o **Nginx Proxy Manager (NPM)** que já estão na sua VM.

---

## 1. No Portainer (Subindo o Container)

Como já subi o `Dockerfile` e o `docker-compose.yml` para o seu GitHub, você tem duas opções:

### Opção A: Via Git (Recomendo)
1. No Portainer, vá em **Stacks** -> **Add stack**.
2. **Name**: `msarts-stack`
3. **Build method**: Selecione **Repository**.
4. **Repository URL**: `https://github.com/ckennedycarvalho/site-msarts.git`
5. **Compose path**: `docker-compose.yml`
6. Em **Environment variables**, clique em **Add environment variable** para as chaves do Supabase (quando as tivermos):
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
7. Clique em **Deploy the stack**.

---

## 2. No Nginx Proxy Manager (Expondo o Site)

Agora que o container está rodando, vamos apontar o domínio no NPM:

1. Acesse o painel do seu **Nginx Proxy Manager**.
2. Vá em **Proxy Hosts** -> **Add Proxy Host**.
3. **Domain Names**: Seu domínio (ex: `msarts.com.br`).
4. **Scheme**: `http`
5. **Forward Name/IP**: `msarts-app` (Se o NPM e o App estiverem na mesma rede Docker) ou o `IP Interno` da VM.
6. **Forward Port**: `3000`
7. Marque **Block Common Exploits**.
8. Na aba **SSL**:
   - Selecione **Request a new SSL Certificate**.
   - Marque **Force SSL** e **HTTP/2 Support**.
   - Aceite os termos do Let's Encrypt.
9. Clique em **Save**.

---

## 3. Vantagens do Node.js + Docker na sua VM
- **Isolamento**: O site roda dentro do container sem sujar as dependências da sua VM.
- **Portainer**: Você pode ver logs, reiniciar o app e atualizar o código direto pela interface web.
- **NPM**: Gerencia o certificado de segurança (cadeado) automaticamente sem você precisar abrir o terminal.

---

**Pronto!** O site estará no ar com segurança e facilidade de gerenciamento. Se precisar fazer uma alteração no código, basta dar um "Update" na Stack no Portainer.
