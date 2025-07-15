import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, PermissionsAndroid, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import Geolocation from 'react-native-geolocation-service';

// IMPORTANT: To enable Google Maps, you must add your API key ("API-KEY").
//
// For Android:
// Edit android/app/src/main/AndroidManifest.xml and add this inside the <application> tag:
// <meta-data
//    android:name="com.google.android.geo.API_KEY"
//    android:value="API-KEY"/>
//
// For iOS:
// Edit ios/pairing_frontend/AppDelegate.swift, import GoogleMaps,
// and add GMSServices.provideAPIKey("API-KEY")
// inside the application(_:didFinishLaunchingWithOptions:) method.

interface Position {
  coords: {
    latitude: number;
    longitude: number;
  };
}

const dummyUsers = [
  {
    id: '1',
    name: 'Alice',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    coordinate: { latitude: 37.78825, longitude: -122.4324 },
    compatibility: '92% match',
  },
  {
    id: '2',
    name: 'Bob',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    coordinate: { latitude: 37.75825, longitude: -122.4624 },
    compatibility: 'Similar route',
  },
  {
    id: '3',
    name: 'Charlie',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    coordinate: { latitude: 37.79825, longitude: -122.4824 },
    compatibility: 'Often nearby',
  },
];

export default function MapScreen() {
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization('whenInUse');
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'This app needs access to your location to show you on the map.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the location');
          } else {
            console.log('Location permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };

    requestLocationPermission();
  }, []);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position: Position) => {
        const { latitude, longitude } = position.coords;
        const region = {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setInitialRegion(region);
        if (mapRef.current) {
          mapRef.current.animateToRegion(region, 1000);
        }
      },
      (error: { code: number; message: string }) => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []);

  const renderUserCard = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <Text style={styles.cardName}>{item.name}</Text>
      <Text style={styles.cardCompatibility}>{item.compatibility}</Text>
      <TouchableOpacity style={styles.cardButton}>
        <Icon name="person-add-outline" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion || {
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
      >
        {dummyUsers.map(user => (
          <Marker key={user.id} coordinate={user.coordinate} title={user.name}>
            <Image source={{ uri: user.avatar }} style={styles.markerAvatar} />
          </Marker>
        ))}
      </MapView>
      <View style={styles.bottomContainer}>
        <FlatList
          data={dummyUsers}
          renderItem={renderUserCard}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardList}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  cardList: {
    paddingHorizontal: 10,
  },
  card: {
    width: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  markerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ff69b4',
  },
  cardName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardCompatibility: {
    fontSize: 12,
    color: '#666',
    marginVertical: 5,
  },
  cardButton: {
    backgroundColor: '#ff69b4',
    padding: 8,
    borderRadius: 20,
  },
});
