import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTaskStore } from '../../src/store/useTaskStore';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const task = useTaskStore((state) => state.tasks.find((t) => t._id === id));
  const toggleTaskCompleted = useTaskStore((state) => state.toggleTaskCompleted);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  if (!task) {
    return (
      <View style={styles.errorContainer}>
        <Feather name="alert-circle" size={48} color="#ef4444" />
        <Text style={styles.errorText}>Tarefa não encontrada.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'Alta':
        return '#ef4444';
      case 'Média':
        return '#f59e0b';
      default:
        return '#10b981';
    }
  };

  const handleDelete = () => {
    deleteTask(task._id);
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={[styles.badge, { backgroundColor: 'rgba(255, 255, 255, 0.05)' }]}>
            <Text style={styles.badgeText}>{task.category}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: `${getPriorityColor(task.priority)}15` }]}>
            <Text style={[styles.badgeText, { color: getPriorityColor(task.priority) }]}>
              Prioridade {task.priority}
            </Text>
          </View>
        </View>

        <Text style={[styles.title, task.completed && styles.titleCompleted]}>
          {task.text}
        </Text>

        <Text style={styles.sectionLabel}>Descrição</Text>
        <Text style={styles.description}>
          {task.description || 'Nenhuma descrição adicionada.'}
        </Text>

        <View style={styles.divider} />

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Feather name="calendar" size={16} color="#64748b" />
            <View>
              <Text style={styles.metaLabel}>Data Limite</Text>
              <Text style={styles.metaValue}>
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString('pt-BR') : 'Sem prazo'}
              </Text>
            </View>
          </View>

          <View style={styles.metaItem}>
            <Feather name="check-square" size={16} color="#64748b" />
            <View>
              <Text style={styles.metaLabel}>Status</Text>
              <Text style={[styles.metaValue, { color: task.completed ? '#10b981' : '#f59e0b' }]}>
                {task.completed ? 'Concluída' : 'Pendente'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Feather name="plus-circle" size={16} color="#64748b" />
            <View>
              <Text style={styles.metaLabel}>Criada em</Text>
              <Text style={styles.metaValue}>
                {new Date(task.createdAt).toLocaleDateString('pt-BR')} às{' '}
                {new Date(task.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.toggleButton, task.completed && styles.toggleButtonCompleted]}
          onPress={() => toggleTaskCompleted(task._id)}
        >
          <Feather name={task.completed ? 'rotate-ccw' : 'check'} size={18} color="#ffffff" />
          <Text style={styles.actionButtonText}>
            {task.completed ? 'Marcar como Pendente' : 'Marcar como Concluída'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={handleDelete}>
          <Feather name="trash-2" size={18} color="#ffffff" />
          <Text style={styles.actionButtonText}>Excluir Tarefa</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090d16',
  },
  content: {
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#090d16',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 16,
    marginBottom: 24,
  },
  backBtn: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#94a3b8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 24,
    lineHeight: 32,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#64748b',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#e2e8f0',
    marginBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 24,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  metaLabel: {
    fontSize: 11,
    color: '#64748b',
    textTransform: 'uppercase',
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#f8fafc',
    marginTop: 2,
  },
  actions: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 16,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleButton: {
    backgroundColor: '#6366f1',
  },
  toggleButtonCompleted: {
    backgroundColor: '#64748b',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
});
