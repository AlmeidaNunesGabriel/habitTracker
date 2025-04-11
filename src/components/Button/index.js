import React from "react";
import { TouchableOpacity, Text } from "react-native";
import styles from './styles';

const MyButton = ({title, onPress, color = '#6200ee'}) =>{
    return(
        <TouchableOpacity style={[styles.button, {backgroundColor: color}]} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    )
}

export default MyButton;