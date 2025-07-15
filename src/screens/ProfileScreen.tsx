import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { updateUser } from '../services/userApi';

export default function ProfileScreen({ route, navigation }: { route: any, navigation: any }) {
  const { user: initialUser } = route.params;
  const [user, setUser] = useState(initialUser);
  const [email, setEmail] = useState(user.email);
  const [comment, setComment] = useState(user.comment || '');
  const [emoji, setEmoji] = useState(user.profileEmoji || '😊');
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = async () => {
    try {
      const updatedData = { email, comment, profileEmoji: emoji };
      const updatedUser = await updateUser(user.id, updatedData);
      setUser(updatedUser);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={30} color="#fff" />
      </TouchableOpacity>
      <ScrollView>
        <View style={styles.profileContainer}>
          <View style={styles.avatarContainer}>
            {isEditing ? (
              <TextInput
                style={styles.emojiInput}
                value={emoji}
                onChangeText={setEmoji}
                maxLength={2}
              />
            ) : (
              <Text style={styles.emoji}>{emoji}</Text>
            )}
          </View>
          <Text style={styles.name}>{user.username}</Text>
          <Text style={styles.mbti}> {user.class}분반 0{user.age-24}년생</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Email</Text>
          <TextInput
            style={styles.infoValue}
            value={email}
            onChangeText={setEmail}
            editable={isEditing}
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>페어링 됐을 때 첫마디</Text>
          <TextInput
            style={styles.infoValue}
            value={comment}
            onChangeText={setComment}
            editable={isEditing}
            placeholder="No comment yet."
            placeholderTextColor="#ddd"
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={() => {
          if (isEditing) {
            handleUpdate();
          } else {
            setIsEditing(true);
          }
        }}>
          <Text style={styles.buttonText}>{isEditing ? 'Save Profile' : 'Edit Profile'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a6c1ee',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 1,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 30,
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
  emoji: {
    fontSize: 80,
    textAlign: 'center',
    lineHeight: 120,
  },
  emojiInput: {
    fontSize: 80,
    textAlign: 'center',
    height: 120,
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
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 20,
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
