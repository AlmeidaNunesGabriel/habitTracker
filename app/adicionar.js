import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useAppContext } from '../contexts/AppContext';

export default function AddHabit() {
  const router = useRouter();
  const { addHabit } = useAppContext();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#4a90e2');
  const [icon, setIcon] = useState('checkmark-circle');
  const [daysOfWeek, setDaysOfWeek] = useState({
    domingo: false,
    segunda: false,
    terca: false,
    quarta: false,
    quinta: false,
    sexta: false,
    sabado: false
  });
  const [goal, setGoal] = useState(1); // Frequência semanal desejada
  const [loading, setLoading] = useState(false);
  
  // Lista de ícones disponíveis
  const iconOptions = [
    { name: 'checkmark-circle', label: 'Verificar' },
    { name: 'fitness', label: 'Fitness' },
    { name: 'book', label: 'Leitura' },
    { name: 'water', label: 'Água' },
    { name: 'bed', label: 'Sono' },
    { name: 'walk', label: 'Caminhada' },
    { name: 'medkit', label: 'Saúde' },
    { name: 'musical-notes', label: 'Música' }
  ];
  
  // Lista de cores disponíveis
  const colorOptions = [
    '#4a90e2', // Azul
    '#50c878', // Verde
    '#ff6b6b', // Vermelho
    '#ffb347', // Laranja
    '#9370db', // Roxo
    '#ff69b4', // Rosa
    '#20b2aa', // Turquesa
    '#778899'  // Cinza
  ];
  
  // Atualizar status de um dia da semana
  const toggleDay = (day) => {
    setDaysOfWeek(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };
  
  // Salvar hábito
  const handleSaveHabit = async () => {
    // Validação dos campos
    if (!name.trim()) {
      Alert.alert('Erro', 'Por favor, informe o nome do hábito');
      return;
    }
    
    // Verificar se pelo menos um dia foi selecionado
    const hasSelectedDay = Object.values(daysOfWeek).some(day => day);
    if (!hasSelectedDay) {
      Alert.alert('Erro', 'Selecione pelo menos um dia da semana');
      return;
    }
    
    setLoading(true);
    
    try {
      const habitData = {
        name,
        description,
        color,
        icon,
        daysOfWeek,
        goal
      };
      
      const result = await addHabit(habitData);
      
      if (result.success) {
        Alert.alert(
          'Sucesso', 
          'Hábito adicionado com sucesso!',
          [
            { 
              text: 'OK', 
              onPress: () => router.push('/') 
            }
          ]
        );
      } else {
        Alert.alert('Erro', result.message || 'Falha ao adicionar hábito');
      }
    } catch (error) {
      console.error('Erro ao salvar hábito:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o hábito');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações Básicas</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome do Hábito*</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Beber água"
            value={name}
            onChangeText={setName}
            maxLength={30}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Descrição (opcional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descreva seu hábito..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            maxLength={100}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aparência</Text>
        
        <Text style={styles.label}>Escolha um ícone</Text>
        <View style={styles.iconGrid}>
          {iconOptions.map(option => (
            <TouchableOpacity
              key={option.name}
              style={[
                styles.iconOption,
                icon === option.name && styles.selectedIconOption
              ]}
              onPress={() => setIcon(option.name)}
            >
              <Ionicons 
                name={option.name} 
                size={24} 
                color={icon === option.name ? '#fff' : '#555'} 
              />
              <Text style={[
                styles.iconLabel,
                icon === option.name && styles.selectedIconLabel
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={[styles.label, {marginTop: 15}]}>Escolha uma cor</Text>
        <View style={styles.colorGrid}>
          {colorOptions.map(colorOption => (
            <TouchableOpacity
              key={colorOption}
              style={[
                styles.colorOption,
                { backgroundColor: colorOption },
                color === colorOption && styles.selectedColorOption
              ]}
              onPress={() => setColor(colorOption)}
            />
          ))}
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dias da Semana</Text>
        <Text style={styles.hint}>Escolha em quais dias você planeja realizar esse hábito:</Text>
        
        <View style={styles.daysContainer}>
          {Object.entries(daysOfWeek).map(([day, isSelected]) => {
            // Formatar nome do dia
            const formattedDay = day.charAt(0).toUpperCase() + day.slice(1);
            // Abreviação do dia
            const shortDay = formattedDay.substring(0, 3);
            
            return (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayItem,
                  isSelected && [styles.selectedDayItem, { backgroundColor: color }]
                ]}
                onPress={() => toggleDay(day)}
              >
                <Text style={[
                  styles.dayText,
                  isSelected && styles.selectedDayText
                ]}>
                  {shortDay}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Meta Semanal</Text>
        <Text style={styles.hint}>Quantas vezes por semana você deseja realizar esse hábito?</Text>
        
        <View style={styles.goalContainer}>
          <TouchableOpacity
            style={styles.goalButton}
            onPress={() => goal > 1 && setGoal(goal - 1)}
          >
            <Ionicons name="remove" size={24} color="#555" />
          </TouchableOpacity>
          
          <View style={styles.goalValue}>
            <Text style={styles.goalValueText}>{goal}</Text>
            <Text style={styles.goalLabel}>vezes por semana</Text>
          </View>
          
          <TouchableOpacity
            style={styles.goalButton}
            onPress={() => goal < 7 && setGoal(goal + 1)}
          >
            <Ionicons name="add" size={24} color="#555" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.disabledButton]}
          onPress={handleSaveHabit}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Salvando...' : 'Salvar Hábito'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  iconOption: {
    width: '23%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '2%',
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    padding: 8,
  },
  selectedIconOption: {
    backgroundColor: '#4a90e2',
  },
  iconLabel: {
    fontSize: 10,
    marginTop: 4,
    color: '#555',
    textAlign: 'center',
  },
  selectedIconLabel: {
    color: '#fff',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedColorOption: {
    borderWidth: 3,
    borderColor: '#333',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  selectedDayItem: {
    backgroundColor: '#4a90e2',
  },
  dayText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
  },
  selectedDayText: {
    color: '#fff',
  },
  goalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  goalButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalValue: {
    marginHorizontal: 20,
    alignItems: 'center',
  },
  goalValueText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  goalLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingVertical: 15,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#555',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 2,
    backgroundColor: '#4a90e2',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.7,
  },
});