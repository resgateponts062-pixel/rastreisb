# Rota Express · Servidor de Rastreamento (Compatível com Render)

## Como subir no Render (100% gratuito)
1. Suba esta pasta (`rota-express-server`) para um repositório no **GitHub**.
2. Acesse o **Render** (`render.com`), clique em **New +** > **Web Service** e conecte seu repositório.
3. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. (Opcional) Em **Environment Variables**, adicione:
   - `ADMIN_PASS` = sua senha secreta para acessar o painel (se não colocar, a senha padrão será `rota2026`).

## URLs do Sistema
- **Tela do Cliente / WebView do APK:** `https://seu-app.onrender.com/`
- **Painel Administrativo (para mudar data, horário, código e etapas):** `https://seu-app.onrender.com/admin`
