import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, SafeAreaView, Easing, TouchableOpacity, PermissionsAndroid, Platform, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import Icon from 'react-native-vector-icons/Ionicons';
import Geolocation from 'react-native-geolocation-service';
import { getLoveAlarmCount } from '../services/userApi';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const heartSize = 100;

const PulsatingCircle = ({ delay, size, duration, finalOpacity }: { delay: number, size: number, duration: number, finalOpacity: number }) => {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1,
          duration,
          delay,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration,
          delay,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [delay, scale, opacity, duration]);

  return (
    <Animated.View
      style={[
        styles.pulsatingCircle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: `rgba(255, 255, 255, ${finalOpacity})`,
          transform: [{ scale }],
          opacity,
        },
      ]}
    />
  );
};

const LoveAlarmScreen = ({ navigation }: { navigation: any }) => {
  const [likes, setLikes] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [isFetchingUser, setIsFetchingUser] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        console.log('User data from AsyncStorage in LoveAlarmScreen:', storedUser); // <-- 콘솔 로그 추가
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          console.log('No user data found in AsyncStorage.'); // <-- 데이터 없을 때 로그 추가
        }
      } catch (e) {
        console.error("Failed to fetch user from AsyncStorage", e);
      } finally {
        setIsFetchingUser(false);
      }
    };
    fetchUser();
  }, []);

  const handleFindCrushes = () => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'This app needs access to your location to find nearby users.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the location');
            getLocation();
          } else {
            console.log('Location permission denied');
            Alert.alert("Location permission denied");
          }
        } catch (err) {
          console.warn(err);
        }
      } else {
        // iOS permission request logic can be added here
        getLocation();
      }
    };

    requestLocationPermission();
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      async (position) => {
        try {
          if (!user || !user.id) {
            Alert.alert("오류", "현재 사용자 정보를 불러올 수 없습니다. 다시 로그인해주세요.");
            return;
          }
          const data = await getLoveAlarmCount(user.id, {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLikes(data.crushCount);
        } catch (error) {
          Alert.alert("API Error", "Could not fetch love alarm count.");
        }
      },
      (error) => {
        console.log(error.code, error.message);
        Alert.alert("Could not get location", error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  return (
    <LinearGradient colors={['#fbc2eb', '#a6c1ee']} locations={[0.1, 0.9]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={{ width: 28 }} />
          <View />
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <View style={styles.profileIconContainer}>
              <Icon name="person-outline" size={28} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.mainContent}>
          <TouchableOpacity onPress={handleFindCrushes} disabled={isFetchingUser} style={styles.gpsContainer}>
            <PulsatingCircle delay={0} size={heartSize * 2} duration={3000} finalOpacity={0.5} />
            <PulsatingCircle delay={1000} size={heartSize * 3} duration={3000} finalOpacity={0.4} />
            <PulsatingCircle delay={2000} size={heartSize * 4} duration={3000} finalOpacity={0.3} />
            <View style={styles.heartContainer}>
              <Svg width={heartSize} height={heartSize} viewBox="0 0 24 24">
                <Path
                  fill="#FF6B6B"
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </Svg>
            </View>
          </TouchableOpacity>
          <Text style={styles.likesCount}>{likes}</Text>
          <Text style={styles.instructionText}>하트를 눌러 주변의 인연을 찾아보세요</Text>
        </View>


      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    padding: 5,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  notificationBadge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gpsContainer: {
    width: heartSize * 4,
    height: heartSize * 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulsatingCircle: {
    position: 'absolute',
    borderWidth: 4,
  },
  heartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  likesCount: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#fff',
  },
  instructionText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  bottomIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomIconCircle: {
    borderRadius: 40,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    position: 'absolute',
  },
});

export default LoveAlarmScreen;
