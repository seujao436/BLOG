# MERN Blog

Um blog moderno e responsivo desenvolvido com MERN stack (MongoDB, Express.js, React, Node.js).

## 🚀 Funcionalidades

- ✅ Sistema de autenticação com JWT
- ✅ Interface responsiva (mobile-first)
- ✅ CRUD completo de posts
- ✅ Painel administrativo
- ✅ Visualização de posts com curtidas e views
- ✅ Sistema de tags
- ✅ Design moderno e limpo

## 🛠️ Tecnologias

**Frontend:**
- React 18
- React Router DOM
- Axios
- CSS3 (Mobile-first)

**Backend:**
- Node.js
- Express.js
- MongoDB/Mongoose
- JWT Authentication
- bcryptjs

## 📦 Instalação

### Método 1: Instalação automática
```bash
npm run install-deps
```

### Método 2: Instalação manual
```bash
# Instalar dependências do servidor
cd server
npm install

# Instalar dependências do cliente
cd ../client
npm install
```

## ⚙️ Configuração

1. Crie um arquivo `.env` na pasta `server/` baseado no `.env.example`:

```env
MONGODB_URI=sua_string_de_conexao_mongodb
JWT_SECRET=sua_chave_secreta_jwt
NODE_ENV=production
PORT=10000
```

### 🗄️ Configuração do MongoDB

Você pode usar:
- **MongoDB Atlas (recomendado para produção)**: https://cloud.mongodb.com
- **MongoDB local**: `mongodb://localhost:27017/blog`

## 🎯 Como rodar

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

## 🌐 Deploy no Render.com

### 1. Preparação
- Faça upload do código para GitHub
- Configure as variáveis de ambiente no Render

### 2. Configuração no Render
1. Conecte seu repositório GitHub
2. Configure:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Environment**: `Node`

### 3. Variáveis de ambiente necessárias:
- `MONGODB_URI`: String de conexão do MongoDB Atlas
- `JWT_SECRET`: Chave secreta para JWT (gere uma segura)
- `NODE_ENV`: `production`

## 👤 Primeiro usuário admin

O primeiro usuário que se registrar com o email `admin@blog.com` será automaticamente definido como administrador.

## 📱 Recursos responsivos

- Design mobile-first
- Layout adaptável para tablet e desktop
- Navegação otimizada para touch
- Performance otimizada para dispositivos móveis

## 🔐 Segurança

- Senhas hasheadas com bcryptjs
- Tokens JWT com expiração
- Validação de dados no frontend e backend
- Proteção contra ataques comuns

## 📝 Estrutura de pastas

```
mern-blog/
├── server/                 # Backend Node.js
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── services/
│   └── public/
└── package.json
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.
