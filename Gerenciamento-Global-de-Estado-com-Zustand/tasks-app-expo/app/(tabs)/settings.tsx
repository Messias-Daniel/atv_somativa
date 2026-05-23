import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTaskStore } from '../../src/store/useTaskStore';
import AboutScreen from '../../src/components/AboutScreen';

export default function SettingsScreen() {
  const tasks = useTaskStore((state) => state.tasks);
  const clearAllTasks = useTaskStore((state) => state.clearAllTasks);

  const [aboutVisible, setAboutVisible] = useState(false);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const highPriorityTasks = tasks.filter((t) => t.priority === 'Alta');
  const highPriorityCompleted = highPriorityTasks.filter((t) => t.completed).length;

  const handleClearAll = () => {
    Alert.alert(
      'Limpar Tudo',
      'Tem certeza de que deseja excluir todas as tarefas permanentemente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: clearAllTasks },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Estatísticas de Produtividade</Text>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Feather name="list" size={20} color="#6366f1" />
          <Text style={styles.statNumber}>{totalTasks}</Text>
          <Text style={styles.statLabel}>Total Criadas</Text>
        </View>

        <View style={styles.statCard}>
          <Feather name="check-circle" size={20} color="#10b981" />
          <Text style={styles.statNumber}>{completedTasks}</Text>
          <Text style={styles.statLabel}>Concluídas</Text>
        </View>

        <View style={styles.statCard}>
          <Feather name="clock" size={20} color="#f59e0b" />
          <Text style={styles.statNumber}>{pendingTasks}</Text>
          <Text style={styles.statLabel}>Pendentes</Text>
        </View>

        <View style={styles.statCard}>
          <Feather name="activity" size={20} color="#ef4444" />
          <Text style={styles.statNumber}>{highPriorityTasks.length}</Text>
          <Text style={styles.statLabel}>Alta Prioridade</Text>
        </View>
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Taxa de Conclusão Global</Text>
        <Text style={styles.chartPercent}>{Math.round(completionRate)}%</Text>
        <View style={styles.barContainer}>
          <View style={[styles.barFill, { width: `${completionRate}%` }]} />
        </View>
        <Text style={styles.chartSubtitle}>
          {completedTasks} de {totalTasks} tarefas finalizadas
        </Text>
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Foco em Alta Prioridade</Text>
        <Text style={styles.chartPercent}>
          {highPriorityTasks.length > 0 ? Math.round((highPriorityCompleted / highPriorityTasks.length) * 100) : 0}%
        </Text>
        <View style={styles.barContainer}>
          <View
            style={[
              styles.barFill,
              {
                backgroundColor: '#ef4444',
                width: `${highPriorityTasks.length > 0 ? (highPriorityCompleted / highPriorityTasks.length) * 100 : 0}%`,
              },
            ]}
          />
        </View>
        <Text style={styles.chartSubtitle}>
          {highPriorityCompleted} de {highPriorityTasks.length} tarefas de alta prioridade finalizadas
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Ações & Informações</Text>

      <View style={styles.actionCard}>
        <TouchableOpacity style={styles.actionRow} onPress={() => setAboutVisible(true)}>
          <View style={styles.actionLeft}>
            <Feather name="info" size={18} color="#94a3b8" />
            <Text style={styles.actionText}>Sobre o Aplicativo</Text>
          </View>
          <Feather name="chevron-right" size={18} color="#475569" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionRow, styles.actionRowLast]} onPress={handleClearAll}>
          <View style={styles.actionLeft}>
            <Feather name="trash" size={18} color="#ef4444" />
            <Text style={[styles.actionText, styles.dangerText]}>Excluir Todas as Tarefas</Text>
          </View>
          <Feather name="chevron-right" size={18} color="#475569" />
        </TouchableOpacity>
      </View>

      <Modal visible={aboutVisible} animationType="slide" onRequestClose={() => setAboutVisible(false)}>
        <AboutScreen onClose={() => setAboutVisible(false)} />
      </Modal>
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
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#64748b',
    marginTop: 20,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'flex-start',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 12,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  chartCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  chartPercent: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  barContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  barFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  chartSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  actionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  actionRowLast: {
    borderBottomWidth: 0,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#e2e8f0',
  },
  dangerText: {
    color: '#ef4444',
  },
});
