import { FirebaseError } from "firebase/app";

const messages: Record<string, string> = {
  "auth/invalid-credential": "E-mail ou senha inválidos.",
  "auth/invalid-email": "Informe um e-mail válido.",
  "auth/too-many-requests": "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
  "auth/network-request-failed": "Não foi possível conectar. Verifique sua internet.",
  "auth/expired-action-code": "Este link expirou. Solicite uma nova redefinição.",
  "auth/invalid-action-code": "Este link é inválido ou já foi utilizado.",
  "auth/weak-password": "Escolha uma senha mais forte.",
};

export function getAuthErrorMessage(error: unknown) {
  if (error instanceof FirebaseError) {
    return messages[error.code] ?? "Não foi possível concluir a operação.";
  }

  if (error instanceof Error) return error.message;
  return "Não foi possível concluir a operação.";
}
