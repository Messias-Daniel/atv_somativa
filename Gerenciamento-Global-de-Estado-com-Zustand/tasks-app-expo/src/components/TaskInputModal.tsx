import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal, Platform, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';
import { useTaskStore, Task } from '../store/useTaskStore';

interface TaskInputModalProps {
  visible: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
}

const CATEGORIES = ['Trabalho', 'Pessoal', 'Estudos', 'Compras', 'Outro'];

export default function TaskInputModal({ visible, onClose, taskToEdit }: TaskInputModalProps) {
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);

  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Baixa' | 'Média' | 'Alta'>('Baixa');
  const [category, setCategory] = useState('Pessoal');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setText(taskToEdit.text);
      setDescription(taskToEdit.description || '');
      setPriority(taskToEdit.priority);
      setCategory(taskToEdit.category);
      setDueDate(taskToEdit.dueDate ? new Date(taskToEdit.dueDate) : null);
    } else {
      setText('');
      setDescription('');
      setPriority('Baixa');
      setCategory('Pessoal');
      setDueDate(null);
    }
  }, [taskToEdit, visible]);

  const handleSave = () => {
    if (!text.trim()) return;

    const taskData = {
      text: text.trim(),
      description: description.trim(),
      priority,
      category,
      completed: taskToEdit ? taskToEdit.completed : false,
      dueDate: dueDate ? dueDate.toISOString() : null,
    };

    if (taskToEdit) {
      updateTask(taskToEdit._id, taskData);
    } else {
      addTask(taskData);
    }
    onClose();
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDueDate(selectedDate);
  };

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
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>{taskToEdit ? 'Editar Tarefa' : 'Nova Tarefa'}</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="O que precisa ser feito?"
            placeholderTextColor="#475569"
            value={text}
            onChangeText={setText}
            maxLength={60}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Adicione uma descrição (opcional)"
            placeholderTextColor="#475569"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            maxLength={200}
          />

          <Text style={styles.label}>Prioridade</Text>
          <View style={styles.priorityRow}>
            {(['Baixa', 'Média', 'Alta'] as const).map((p) => {
              const color = getPriorityColor(p);
              const isSelected = priority === p;
              return (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.priorityBtn,
                    isSelected && { backgroundColor: `${color}20`, borderColor: color },
                  ]}
                  onPress={() => setPriority(p)}
                >
                  <Text style={[styles.priorityText, isSelected && { color }]}>{p}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>Categoria</Text>
          <View style={styles.categoryRow}>
            {CATEGORIES.map((c) => {
              const isSelected = category === c;
              return (
                <TouchableOpacity
                  key={c}
                  style={[styles.categoryBtn, isSelected && styles.categoryBtnActive]}
                  onPress={() => setCategory(c)}
                >
                  <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>{c}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>Data de Conclusão</Text>
          {Platform.OS === 'web' ? (
            <input
              type="date"
              value={dueDate ? dueDate.toISOString().split('T')[0] : ''}
              onChange={(e: any) => {
                const val = e.target.value;
                if (val) {
                  const parts = val.split('-');
                  setDueDate(new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])));
                } else {
                  setDueDate(null);
                }
              }}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                padding: 12,
                borderRadius: 8,
                outline: 'none',
                width: '100%',
                marginBottom: 20,
              }}
            />
          ) : (
            <View style={styles.datePickerContainer}>
              <TouchableOpacity style={styles.dateBtn} onPress={() => setShowDatePicker(true)}>
                <Feather name="calendar" size={18} color="#6366f1" />
                <Text style={styles.dateBtnText}>
                  {dueDate ? dueDate.toLocaleDateString('pt-BR') : 'Definir prazo'}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={dueDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={onChangeDate}
                />
              )}
            </View>
          )}

          <TouchableOpacity
            style={[styles.saveBtn, !text.trim() && styles.saveBtnDisabled]}
            disabled={!text.trim()}
            onPress={handleSave}
          >
            <Text style={styles.saveBtnText}>Salvar</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#090d16',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 12,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#94a3b8',
    marginBottom: 8,
    marginTop: 8,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  priorityBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  categoryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  categoryBtnActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  categoryText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  datePickerContainer: {
    marginBottom: 20,
  },
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 12,
  },
  dateBtnText: {
    color: '#ffffff',
    fontSize: 14,
  },
  saveBtn: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  saveBtnDisabled: {
    backgroundColor: 'rgba(99, 102, 241, 0.5)',
  },
  saveBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
