import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Task {
  _id: string;
  text: string;
  completed: boolean;
  dueDate: string | null;
  priority: 'Baixa' | 'Média' | 'Alta';
  category: string;
  description?: string;
  createdAt: string;
}

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, '_id' | 'createdAt'>) => void;
  updateTask: (id: string, updatedTask: Partial<Omit<Task, '_id' | 'createdAt'>>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompleted: (id: string) => void;
  clearAllTasks: () => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              _id: Math.random().toString(36).substring(7) + Date.now().toString(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      updateTask: (id, updatedTask) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t._id === id ? { ...t, ...updatedTask } : t)),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t._id !== id),
        })),
      toggleTaskCompleted: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t._id === id ? { ...t, completed: !t.completed } : t)),
        })),
      clearAllTasks: () => set({ tasks: [] }),
    }),
    {
      name: 'task-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
