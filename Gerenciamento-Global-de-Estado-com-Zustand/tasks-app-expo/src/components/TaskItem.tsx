import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTaskStore, Task } from '../store/useTaskStore';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export default function TaskItem({ task, onEdit }: TaskItemProps) {
  const router = useRouter();
  const toggleTaskCompleted = useTaskStore((state) => state.toggleTaskCompleted);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0)) && !task.completed;

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

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed
      ]}
      onPress={() => router.push(`/task/${task._id}`)}
    >
      <View style={styles.leftSection}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => toggleTaskCompleted(task._id)}
        >
          {task.completed ? (
            <View style={styles.checkboxChecked}>
              <Feather name="check" size={14} color="#ffffff" />
            </View>
          ) : (
            <View style={[styles.checkboxUnchecked, { borderColor: getPriorityColor(task.priority) }]} />
          )}
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <Text style={[styles.title, task.completed && styles.titleCompleted]}>
            {task.text}
          </Text>

          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: 'rgba(255, 255, 255, 0.05)' }]}>
              <Text style={styles.badgeText}>{task.category}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: `${getPriorityColor(task.priority)}15` }]}>
              <Text style={[styles.badgeText, { color: getPriorityColor(task.priority) }]}>
                {task.priority}
              </Text>
            </View>
            {task.dueDate && (
              <View style={[styles.badge, styles.dateBadge]}>
                <Feather name="calendar" size={10} color={isOverdue ? '#ef4444' : '#64748b'} />
                <Text style={[styles.badgeText, isOverdue && styles.dateOverdue]}>
                  {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onEdit(task)}
        >
          <Feather name="edit-2" size={16} color="#6366f1" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => deleteTask(task._id)}
        >
          <Feather name="trash-2" size={16} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    padding: 4,
    marginRight: 12,
  },
  checkboxChecked: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxUnchecked: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  infoContainer: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 6,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#64748b',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94a3b8',
  },
  dateBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateOverdue: {
    color: '#ef4444',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
