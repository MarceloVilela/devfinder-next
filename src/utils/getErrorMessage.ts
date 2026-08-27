import { isAxiosError } from 'axios';

const getErrorMessage = (error: unknown, notFoundMessage: string): string => {
  if (isAxiosError(error)) {
    if (!error.response) {
      return 'Não foi possível conectar à API. Verifique sua conexão e tente novamente.';
    }
    if (error.response.status === 404) {
      return notFoundMessage;
    }
  }
  return 'Ocorreu um erro inesperado. Tente novamente.';
};

export default getErrorMessage;
