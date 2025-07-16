import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, TextInput } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import GoogleSignInButton from './android_light_rd_SI.svg';
// import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import axios from 'axios';

const { width, height } = Dimensions.get('window');
const API_URL = 'http://172.20.12.170:80'; // Make sure this is the correct IP

export default function WelcomeScreen({ navigation }: { navigation: any }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [userClass, setUserClass] = useState('');


  // useEffect(() => {
  //   GoogleSignin.configure({
  //     webClientId: process.env.GOOGLE_WEB_CLIENT_ID, // client ID of type WEB for your server (needed to verify user ID and offline access)
  //   });
  // }, []);

  // const signIn = async () => {
  //   try {
  //     await GoogleSignin.hasPlayServices();
  //     const userInfo: any = await GoogleSignin.signIn();
  //     const idToken = userInfo.idToken;

  //     if (!idToken) {
  //       throw new Error('Failed to get ID token');
  //     }

  //     const response = await axios.post(`${API_URL}/auth/google/login`, { token: idToken });

  //     if (response.data.isNewUser) {
  //       navigation.navigate('SignUp', { userInfo: response.data.user });
  //     } else {
  //       // You'll need to handle storing the JWT and navigating to the main app
  //       // For now, just navigating to a placeholder
  //       navigation.navigate('MainApp');
  //     }
  //   } catch (error: any) {
  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //       // user cancelled the login flow
  //     } else if (error.code === statusCodes.IN_PROGRESS) {
  //       // operation (e.g. sign in) is in progress already
  //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //       // play services not available or outdated
  //     } else if (axios.isAxiosError(error)) {
  //       Alert.alert('Backend error', error.message);
  //     } else {
  //       Alert.alert('Error', error.message ?? 'Unknown error');
  //     }
  //   }
  // };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const user = response.data;
      console.log('Login successful, user data from backend:', user); // <-- 콘솔 로그 추가
      if (!user || !user.id) {
        Alert.alert('Login Error', 'Received invalid user data from server.');
        return;
      }
      await AsyncStorage.setItem('user', JSON.stringify(user));
      navigation.navigate('Main', { user });
    } catch (error) {
      console.error('Login API error:', error); // <-- 에러 로그 추가
      Alert.alert('Login Failed', 'Invalid credentials');
    }
  };

  const handleSignUp = async () => {
    try {
      const newUser = {
        email,
        username,
        age: parseInt(age, 10),
        class: parseInt(userClass, 10),
        password, // Assuming backend handles password hashing
      };
      await axios.post(`${API_URL}/user`, newUser);
      Alert.alert('Success', 'User created! Please log in.');
      setIsLogin(true);
    } catch (error) {
      Alert.alert('Sign Up Failed', 'Could not create user');
    }
  };

  return (
    <LinearGradient
      colors={['#fbc2eb', '#a6c1ee']}
      style={styles.container}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Pairing</Text>
        <Text style={styles.subtitle}>스쳐 지나가는 인연을 잡아보세요</Text>
      </View>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {!isLogin && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Age"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Class (e.g., 20)"
              value={userClass}
              onChangeText={setUserClass}
              keyboardType="numeric"
            />
          </>
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={isLogin ? handleLogin : handleSignUp}
        >
          <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
          <Text style={styles.toggleText}>
            {isLogin ? 'Need an account? Sign Up' : 'Have an account? Login'}
          </Text>
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
    paddingTop: 50,
  },
  title: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Parisienne-Regular',
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginTop: 10,
  },
  formContainer: {
    width: '80%',
    paddingBottom: 100,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#a6c1ee',
    fontWeight: 'bold',
    fontSize: 16,
  },
  toggleText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 15,
  },
});
