# COMANDOS RÁPIDOS

## Desenvolvimento
cd blog-mern
npm run install-deps
cd server
cp .env.example .env
# Edite o .env com suas configurações
cd ..
npm run dev

## Deploy no Render
1. Push para GitHub
2. Conectar repositório no Render
3. Configurar variáveis de ambiente
4. Deploy automático

## Variáveis obrigatórias no Render
MONGODB_URI=mongodb+srv://...
JWT_SECRET=chave-super-secreta
NODE_ENV=production
PORT=10000

## URLs importantes
- MongoDB Atlas: https://cloud.mongodb.com
- Render: https://render.com
- Projeto local: http://localhost:3000
- API local: http://localhost:10000
