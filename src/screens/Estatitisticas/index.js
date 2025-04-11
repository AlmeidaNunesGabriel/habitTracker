
import React from 'react';
import { ScrollView, View, Text, Image  } from 'react-native';
import MyButton from '../../components/Button';
import styles from './styles';

export default function Statistics({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Estatísticas dos Hábitos</Text>
        <View style={styles.imageContainer}>
            <Image source={{ uri: 'https://s4.static.brasilescola.uol.com.br/be/2020/03/shutterstock-396863464.jpg'}}
            style={styles.image}
            resizeMode='container' />
        </View>
      <MyButton title="Voltar" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
}

