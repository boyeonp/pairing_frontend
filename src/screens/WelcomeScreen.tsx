import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }: { navigation: any }) {
  return (
    <LinearGradient
      colors={['#fbc2eb', '#a6c1ee']}
      style={styles.container}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Pairing</Text>
        <Text style={styles.subtitle}>스쳐 지나가는 인연을 잡아보세요</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>로그인</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.signUpButton]}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={[styles.buttonText, styles.signUpButtonText]}>회원가입</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Parisienne-Regular', // A romantic-style font
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginTop: 10,
  },
  buttonContainer: {
    paddingBottom: 50,
    width: '80%',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
  },
  signUpButton: {
    backgroundColor: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpButtonText: {
    color: '#a6c1ee',
  },
});
