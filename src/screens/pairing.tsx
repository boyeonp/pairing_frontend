import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Modal,
  Text,
  TextInput,
  Button,
  SafeAreaView,
  Animated,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import { findUserByName, updateUser } from '../services/userApi';
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import io from 'socket.io-client';
import { TopTabParamList } from '../navigation/TopTabNavigator';

const { width } = Dimensions.get('window');
const heartSize = width * 0.6;

const HeartIcon = () => (
  <Svg width={heartSize} height={heartSize} viewBox="0 0 24 24">
    <Defs>
      <SvgGradient id="grad" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#E91E63" stopOpacity="1" />
        <Stop offset="1" stopColor="#C2185B" stopOpacity="1" />
      </SvgGradient>
    </Defs>
    <Path
      fill="url(#grad)"
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
    />
  </Svg>
);

export default function PairingScreen() {
  const [name, setName] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [matchStatus, setMatchStatus] = useState<string>('');
  const scale = useRef(new Animated.Value(1)).current;
  const route = useRoute();
  const navigation = useNavigation<StackNavigationProp<TopTabParamList, 'Pairing'>>();
  const user = (route.params as { user?: any })?.user;
  const socket = useRef<any>(null);

  useEffect(() => {
    if (user) {
      socket.current = io('http://172.20.12.170:80', {
        query: { userId: user.id },
      });

      socket.current.on('connect', () => {
        console.log('Connected to WebSocket server');
      });

      socket.current.on('matchFound', (match: any) => {
        console.log('Match found:', match);
        setIsAnimating(false);
        Alert.alert('Match Found!', `You have a match!`, [
          { text: 'OK', onPress: () => {
            socket.current.disconnect()
            navigation.navigate('Chat', { user, chatroomId: match.id })
           } },
        ]);
      });

      return () => {
        socket.current.disconnect();
      };
    }
  }, [user]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isAnimating) {
      interval = setInterval(() => {
        if (socket.current && user) {
          socket.current.emit('checkForMatch', user.id);
        }
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isAnimating, user]);

  useEffect(() => {
    let loop: Animated.CompositeAnimation | undefined;

    if (isAnimating) {
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.15, duration: 600, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1.0, duration: 600, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1.05, duration: 400, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1.0, duration: 400, useNativeDriver: true }),
        ])
      );
      loop.start();
    } else {
      scale.setValue(1);
    }

    return () => {
      loop?.stop();
    };
  }, [isAnimating, scale]);

  const handleHeartPress = () => {
    setModalVisible(true);
  };

  const handleSaveName = async () => {
    setModalVisible(false);
    if (name.trim().length > 0) {
      try {
        const lovedUser = await findUserByName(name.trim());
        if (lovedUser) {
          if (!user || !user.id) {
            Alert.alert('Error', 'Could not find current user. Please log in again.');
            return;
          }
          await updateUser(user.id, { love: lovedUser.id });
          setIsAnimating(true);
          setMatchStatus('Searching for a match...');
          Alert.alert('Success', 'Your love has been recorded.');
        } else {
          Alert.alert('Error', 'User not found.');
        }
      } catch (error) {
        Alert.alert('Error', 'An error occurred while saving your love.');
        console.error(error);
      }
    } else {
      setIsAnimating(false);
      setMatchStatus('');
    }
  };

  return (
    <LinearGradient colors={['#FFF7FB', '#FFEFF6']} style={styles.container}>
      <Pressable onPress={handleHeartPress}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <HeartIcon />
        </Animated.View>
      </Pressable>

      <Text style={styles.caption}>
        {name.trim() ? '당신의 인연을 기다리세요' : '좋아하는 사람을 입력하세요.'}
      </Text>

      {isAnimating && <Text style={styles.status}>{matchStatus}</Text>}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalLabel}>좋아하는 사람의 이름을 입력하세요:</Text>
            <TextInput
              style={styles.input}
              placeholder="좋아하는 사람의 이름을 입력하세요"
              value={name}
              onChangeText={setName}
            />
            <View style={styles.buttonRow}>
              <Button title="Save" onPress={handleSaveName} color="#E91E63" />
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  caption: {
    marginTop: 24,
    fontSize: 18,
    color: '#ff2aa3',
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalCard: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  modalLabel: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 16,
    marginBottom: 24,
  },
  buttonRow: {
    alignSelf: 'flex-end',
  },
  status: {
    marginTop: 20,
    fontSize: 16,
    color: '#E91E63',
  },
});
