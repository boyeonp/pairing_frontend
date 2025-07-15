import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import GoogleSignInButton from './android_light_rd_SI.svg';

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
          onPress={() => navigation.navigate('SignUp')}
        >
          <GoogleSignInButton width={200} height={50} />
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
    paddingBottom: 100,
    alignItems: 'center',
  },
});
