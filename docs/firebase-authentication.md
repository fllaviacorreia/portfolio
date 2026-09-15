# Configuração da autenticação Firebase

## Authentication

1. No Firebase Console, acesse **Authentication > Sign-in method**.
2. Habilite **E-mail/senha**.
3. Em **Settings > Authorized domains**, adicione o domínio de produção e os domínios de preview utilizados pelo projeto.

## Redefinição de senha dentro do portfólio

Em **Authentication > Templates > Password reset**, configure a URL de ação personalizada:

```text
https://SEU_DOMINIO/auth/reset-password
```

O Firebase acrescentará `mode`, `oobCode`, `continueUrl` e `lang` à URL. A página `/auth/reset-password` valida o código antes de permitir a troca da senha.

Durante o desenvolvimento, adicione `localhost` aos domínios autorizados e use:

```text
http://localhost:3000/auth/reset-password
```

## Credenciais

Copie `env.example` para `.env.local` e preencha as variáveis públicas do aplicativo web.

No Firebase App Hosting ou Google Cloud, o Admin SDK utiliza Application Default Credentials. Em outra hospedagem, configure `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL` e `FIREBASE_ADMIN_PRIVATE_KEY` exclusivamente no ambiente do servidor.

Nunca use ou exponha uma chave privada do Admin SDK em uma variável `NEXT_PUBLIC_*`.

## Desenvolvimento com emuladores

Defina no `.env.local`:

```text
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true
```

Depois execute em terminais separados:

```bash
npm run firebase:emulators
npm run dev
```

O aplicativo usa Auth em `9099`, Firestore em `8080`, Storage em `9199` e a interface dos emuladores em `4000`.
