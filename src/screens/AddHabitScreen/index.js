import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import styles from './styles';
import MyButton from '../../components/Button';
import { useHabits } from '../../context/HabitsContext';

const AddHabitScreen = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const { addHabit } = useHabits();

  const handleSave = () => {
    if (!nome.trim()) return;
    addHabit(nome, descricao);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome do Hábito</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Ex: Meditar"
      />
      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={descricao}
        onChangeText={setDescricao}
        placeholder="Ex: Meditação diária por 10 minutos"
        multiline
      />
      <MyButton title="Salvar Hábito" onPress={handleSave} />
    </View>
  );
};

export default AddHabitScreen;
