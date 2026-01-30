# 📱 App Portfólio Customizável

Este é o repositório oficial do **App Portfólio Customizável**, um aplicativo web responsivo desenvolvido com **NextJS**, **React** e **Firebase**, com o objetivo de facilitar o gerenciamento e compartilhamento de portfólios, um projeto pessoal.

---

## 🚀 Tecnologias Utilizadas

- **[NextJS](https://nextjs.org/)**
- **React**
- **TypeScript**
- **Firebase (Authentication, Firestore Database, Storage)**

---

## 🔧 Funcionalidades do App

- Cadastro e gerenciamento de portfólio (CRUD & Estilização)
- Compartilhamento de página de portfólio7
- Autenticação de usuários

---

## 📦 Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)

---

## 🛠️ Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/fllaviacorreia/portfolio.git
cd portfolio
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn add
# ou
bun i
```

### 3. Configure o Firebase

Crie um arquivo `.env` na raiz do projeto com suas credenciais do Firebase:

```
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_PROJECT_ID=...
FIREBASE_STORAGE_BUCKET=...
FIREBASE_MESSAGING_SENDER_ID=...
FIREBASE_APP_ID=...
```

Certifique-se de que o projeto já está configurado no Firebase com:
- Authentication habilitada (Email/Password)
- Firestore Database
- Storage

### 4. Inicie o projeto

```bash
npm run dev
```

---

## 🧪 Prototipação

O design e a prototipação do aplicativo foram feitos no Figma. Você pode visualizar o Design System e os protótipos através do link abaixo:

👉 [Acessar protótipo no Figma](https://www.figma.com/community/file/1595473479756214994)


## 📁 Estrutura do Projeto

```
📁 src/
├── app/
├── components/
├── context/
├── firebase/
├── hooks/
```

---

## 👩‍💻 Contribuindo

Este projeto é de cunho pessoal, porém colaborativo. Pull requests são bem-vindos!

---

## 🧑‍💻 Desenvolvido por

**Flávia Correia**  
[LinkedIn](https://www.linkedin.com/in/fllaviacorreia)

---

## 📃 Licença

Este projeto está licenciado sob a licença MIT.
