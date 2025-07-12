import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, SafeAreaView, Easing } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import Icon from 'react-native-vector-icons/Ionicons';

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

const LoveAlarmScreen = () => {
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLikes(prev => (prev < 10 ? prev + 1 : 10));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <LinearGradient colors={['#6fe5fc', '#F8BBD0']} locations={[0.1, 0.9]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Icon name="person-outline" size={28} color="#fff" />
          <Text style={styles.headerTitle}>LoveAlarm</Text>
          <View>
            <Icon name="heart-outline" size={28} color="#fff" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>1</Text>
            </View>
          </View>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.gpsContainer}>
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
          </View>

          <Text style={styles.likesCount}>{likes}</Text>
          <Text style={styles.heartId}>Heart ID : 123456789</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.bottomIconContainer}>
            <View style={[styles.bottomIconCircle, { width: 80, height: 80, borderWidth: 1.5 }]} />
            <View style={[styles.bottomIconCircle, { width: 60, height: 60, borderWidth: 1.5 }]} />
            <View style={[styles.bottomIconCircle, { width: 40, height: 40, borderWidth: 1.5 }]} />
            <Icon name="heart" size={18} color="#fff" />
          </View>
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
    paddingTop: 10,
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
    marginTop: 20,
  },
  heartId: {
    fontSize: 16,
    color: '#fff',
    marginTop: 10,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 30,
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
