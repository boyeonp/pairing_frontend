import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ProfileScreen({ navigation }: { navigation: any }) {
  // Dummy data for now
  const userData = {
    name: 'Jin',
    mbti: 'INFP',
    firstMessage: '다음 주에 같이 영화보러 가실래요?',
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={30} color="#fff" />
      </TouchableOpacity>
      <View style={styles.profileContainer}>
        <View style={styles.avatarContainer}>
          <Icon name="person" size={80} color="#fff" />
        </View>
        <Text style={styles.name}>{userData.name}</Text>
        <Text style={styles.mbti}>{userData.mbti}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>페어링 시 첫 메세지</Text>
        <Text style={styles.infoValue}>{userData.firstMessage}</Text>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>비밀번호 변경</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 174, 172, 0.5)',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 40,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  mbti: {
    fontSize: 18,
    color: '#fff',
    marginTop: 5,
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  infoValue: {
    fontSize: 16,
    color: '#fff',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#a6c1ee',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
