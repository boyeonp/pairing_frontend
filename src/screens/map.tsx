import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';

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
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
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
