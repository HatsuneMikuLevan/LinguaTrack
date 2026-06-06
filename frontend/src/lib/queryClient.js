import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,        // данные считаются свежими 30 секунд
      retry: 1,                // 1 повтор при ошибке
      refetchOnWindowFocus: false,  // не обновлять при фокусе окна
    },
  },
});