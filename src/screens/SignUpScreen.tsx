import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export default function SignUpScreen({ navigation }: { navigation: any }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [mbti, setMbti] = useState('');
  const [firstMessage, setFirstMessage] = useState('');

  const handleSignUp = () => {
    // For now, just navigate back to the Welcome screen
    navigation.navigate('Welcome');
  };

  return (
    <LinearGradient
      colors={['#fbc2eb', '#a6c1ee']}
      style={styles.container}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={30} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title}>회원가입</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="이름"
          placeholderTextColor="#fff"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          placeholderTextColor="#fff"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="MBTI"
          placeholderTextColor="#fff"
          value={mbti}
          onChangeText={setMbti}
        />
        <TextInput
          style={[styles.input, styles.messageInput]}
          placeholder="페어링 시 보낼 첫번째 멘트"
          placeholderTextColor="#fff"
          value={firstMessage}
          onChangeText={setFirstMessage}
          multiline
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>회원가입</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    color: '#fff',
    fontSize: 16,
    marginBottom: 15,
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fbc2eb',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
