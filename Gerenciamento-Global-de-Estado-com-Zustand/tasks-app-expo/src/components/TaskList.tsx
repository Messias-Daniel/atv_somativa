import React, { useMemo } from 'react';
import { SectionList, StyleSheet, View, Text } from 'react-native';
import TaskItem from './TaskItem';
import { useTaskStore, Task } from '../store/useTaskStore';

interface TaskListProps {
  filter: 'all' | 'completed' | 'pending';
  searchQuery: string;
  onEdit: (task: Task) => void;
}

export default function TaskList({ filter, searchQuery, onEdit }: TaskListProps) {
  const tasks = useTaskStore((state) => state.tasks);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.text.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        filter === 'all' ||
        (filter === 'completed' && task.completed) ||
        (filter === 'pending' && !task.completed);
      return matchesSearch && matchesFilter;
    });
  }, [tasks, filter, searchQuery]);

  const sections = useMemo(() => {
    const completed = filteredTasks.filter((task) => task.completed);
    const pending = filteredTasks.filter((task) => !task.completed);

    return [
      { title: '📋 Pendentes', data: pending },
      { title: '✅ Concluídas', data: completed },
    ];
  }, [filteredTasks]);

  return (
    <View style={styles.listContainer}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        renderSectionHeader={({ section: { title, data } }) =>
          data.length > 0 ? (
            <Text style={styles.sectionHeader}>{title}</Text>
          ) : null
        }
        renderItem={({ item }) => (
          <TaskItem task={item} onEdit={onEdit} />
        )}
        renderSectionFooter={({ section }) =>
          section.data.length === 0 ? (
            <Text style={styles.emptySectionText}>Sem tarefas</Text>
          ) : null
        }
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 80,
  },
  sectionHeader: {
    color: '#94a3b8',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  emptySectionText: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    color: '#475569',
    fontSize: 14,
    fontStyle: 'italic',
  },
});
