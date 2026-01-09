# Guia de Hospedagem: MSARTS na OCI (Oracle Cloud Infrastructure)

Para este site em HTML/CSS/JS Estático, a melhor maneira de hospedar na OCI usando uma VM Always Free é através do **Nginx**.

## 1. Criar a Instância na OCI
1. No console da OCI, vá em **Compute** -> **Instances** -> **Create Instance**.
2. **Nome**: `msarts-web`
3. **Placing**: Deixe o padrão.
4. **Image and Shape**:
   - Clique em **Edit**.
   - **Shape**: Selecione **Ampere (ARM)** e configure para **4 OCPUs** e **24 GB de RAM** (Always Free).
   - **Image**: **Oracle Linux 8** ou **Ubuntu 22.04**.
5. **Networking**: Certifique-se de que "Assign a public IPv4 address" esteja marcado como **Yes**.
6. **SSH Keys**: Gere um par de chaves ou envie sua chave pública `.pub`.
7. Clique em **Create**.

## 2. Configurar o Firewall (Virtual Cloud Network)
Antes de acessar o site, você precisa abrir a porta 80 (HTTP) e 443 (HTTPS):
1. Na página da instância, clique na **Subnet** em que ela está.
2. Clique na **Default Security List**.
3. Clique em **Add Ingress Rules**.
   - **Source CIDR**: `0.0.0.0/0`
   - **IP Protocol**: `TCP`
   - **Destination Port Range**: `80, 443`
   - Clique em **Add Ingress Rules**.

## 3. Configurar o Servidor (Via SSH)
Acesse sua VM via terminal:
```bash
ssh -i sua_chave opc@ip-da-instancia
```

### Instalar o Nginx
```bash
sudo dnf install nginx -y   # Se for Oracle Linux
# ou sudo apt install nginx -y # Se for Ubuntu

sudo systemctl enable --now nginx
```

### Abrir o Firewall interno da VM
```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## 4. Subir os Arquivos do Site
Você pode usar o comando `scp` do seu computador local para enviar a pasta do site para a VM:
```bash
scp -r C:\PROJETO\MSARTS\* opc@ip-da-instancia:/usr/share/nginx/html/
```
*Certifique-se de que as permissões estejam corretas:*
```bash
sudo chown -R nginx:nginx /usr/share/nginx/html/*
```

## 5. Configurar SSL (Certificado Gratuito)
Use o Certbot para ter o site com HTTPS (Cadeado de segurança):
```bash
sudo dnf install certbot python3-certbot-nginx -y
sudo certbot --nginx -d seu-dominio.com.br
```

## Dica sobre Upload de Imagens
Sobre o seu questionamento de permitir que o dono suba imagens:
Como o site é estático, a forma mais fácil de fazer isso é:
1. Usar o **Supabase Storage** (já incluído na minha ideia de stack).
2. Criar uma página `admin.html` oculta com um formulário de upload.
3. Esse form envia a imagem para o Supabase.
4. O `index.html` busca as URLs das imagens do Supabase dinamicamente.
