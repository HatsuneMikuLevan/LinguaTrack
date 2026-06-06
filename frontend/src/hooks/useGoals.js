import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

const fetchGoals = async (archived = false) => {
  const res = await api.get(`/goals?archived=${archived}`);
  return res.data;
};

const createGoal = async (goalData) => {
  const res = await api.post('/goals', goalData);
  return res.data;
};

const deleteGoal = async (id) => {
  await api.delete(`/goals/${id}`);
};

const updateProgress = async ({ goalId, progress, note }) => {
  const res = await api.patch(`/goals/${goalId}/progress`, { progress, note });
  return res.data;
};

export const useGoals = (archived = false) => {
  return useQuery({
    queryKey: ['goals', archived],
    queryFn: () => fetchGoals(archived),
  });
};

export const useCreateGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
};

export const useDeleteGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
};

export const useUpdateProgress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProgress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
};