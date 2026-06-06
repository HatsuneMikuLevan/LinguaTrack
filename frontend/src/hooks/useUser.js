import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

const fetchUser = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};

const updateUser = async (data) => {
  const res = await api.patch('/auth/me', data);
  return res.data;
};

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    retry: false,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data);
    },
  });
};