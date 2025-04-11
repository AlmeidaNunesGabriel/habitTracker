import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import styles from './styles'
const AddHabitScreen = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');

  const handleSave = () => {
    // Aqui você pode implementar a lógica para salvar o novo hábito.
    // Por exemplo, atualizar um estado global ou armazenar localmente.
    console.log('Hábito salvo:', { nome, descricao });
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
      <Button title="Salvar Hábito" onPress={handleSave} />
    </View>
  );
};


export default AddHabitScreen;