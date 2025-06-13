import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Alert, ActivityIndicator } from 'react-native';
import styles from './styles';
import MyButton from '../../components/Button';
import { useHabits } from '../../context/HabitsContext';
import { ThemeContext } from '../../context/ThemeContext';

const AddHabitScreen = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { addHabit } = useHabits();
  const { theme } = useContext(ThemeContext);

  const handleSave = async () => {
    if (!nome.trim()) {
      Alert.alert('Erro', 'Por favor, insira um nome para o hábito');
      return;
    }

    setIsSaving(true);
    try {
      await addHabit(nome.trim(), descricao.trim());
      Alert.alert(
        'Sucesso', 
        'Hábito adicionado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert(
        'Erro', 
        'Não foi possível adicionar o hábito. Tente novamente.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (nome.trim() || descricao.trim()) {
      Alert.alert(
        'Descartar alterações?',
        'Você tem alterações não salvas. Deseja descartar?',
        [
          { text: 'Continuar editando', style: 'cancel' },
          { text: 'Descartar', onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Novo Hábito</Text>
      
      <Text style={[styles.label, { color: theme.text }]}>Nome do Hábito *</Text>
      <TextInput
        style={[
          styles.input,
          { 
            backgroundColor: theme.card,
            color: theme.text,
            borderColor: theme.subtleText 
          }
        ]}
        value={nome}
        onChangeText={setNome}
        placeholder="Ex: Meditar, Exercitar, Ler..."
        placeholderTextColor={theme.subtleText}
        maxLength={50}
        editable={!isSaving}
      />
      <Text style={[styles.charCount, { color: theme.subtleText }]}>
        {nome.length}/50
      </Text>
      
      <Text style={[styles.label, { color: theme.text }]}>Descrição (opcional)</Text>
      <TextInput
        style={[
          styles.input, 
          styles.textArea,
          { 
            backgroundColor: theme.card,
            color: theme.text,
            borderColor: theme.subtleText 
          }
        ]}
        value={descricao}
        onChangeText={setDescricao}
        placeholder="Ex: Meditação diária por 10 minutos para reduzir o estresse..."
        placeholderTextColor={theme.subtleText}
        multiline
        maxLength={200}
        editable={!isSaving}
      />
      <Text style={[styles.charCount, { color: theme.subtleText }]}>
        {descricao.length}/200
      </Text>

      <View style={styles.buttonContainer}>
        <MyButton 
          title={isSaving ? "Salvando..." : "Salvar Hábito"}
          onPress={handleSave}
          color={isSaving ? "#999" : "#4CAF50"}
          disabled={isSaving}
        />
        
        {isSaving && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#6200ee" />
            <Text style={[styles.loadingText, { color: theme.subtleText }]}>
              Salvando hábito...
            </Text>
          </View>
        )}
        
        <MyButton 
          title="Cancelar" 
          onPress={handleCancel}
          color="#f44336"
          disabled={isSaving}
        />
      </View>
    </View>
  );
};

export default AddHabitScreen;