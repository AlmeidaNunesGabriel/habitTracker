import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 24
  },
  contentContainer: { 
    justifyContent: 'center' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20 
  },
  imageContainer: { 
    width: '100%', 
    alignItems: 'center',  
    marginBottom: 20
  }, 
  image: { 
    width: 150, 
    height: 150, 
    borderRadius: 75, 
    marginBottom: 20 
  },
});

export default styles;
