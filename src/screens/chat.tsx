import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface Message {
  id: string;
  text: string;
  time: string;
  sender: 'me' | 'other';
  read: boolean;
}

const initialMessages: Message[] = [
  { id: '1', text: 'Hey! How are you?', time: '10:00 AM', sender: 'other', read: true },
  { id: '2', text: 'I am good, thanks! How about you?', time: '10:01 AM', sender: 'me', read: true },
  { id: '3', text: 'Doing great! Wanna hang out later?', time: '10:01 AM', sender: 'other', read: true },
  { id: '4', text: 'Sure, sounds fun!', time: '10:02 AM', sender: 'me', read: false },
];

export default function ChatScreen() {
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim().length > 0) {
      const newMessage: Message = {
        id: (messages.length + 1).toString(),
        text: inputText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'me',
        read: false,
      };
      setMessages([...messages, newMessage]);
      setInputText('');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageContainer, item.sender === 'me' ? styles.myMessageContainer : styles.otherMessageContainer]}>
      <View style={[styles.messageBubble, item.sender === 'me' ? styles.myMessageBubble : styles.otherMessageBubble]}>
        <Text style={item.sender === 'me' ? styles.myMessageText : styles.otherMessageText}>{item.text}</Text>
      </View>
      <View style={styles.messageInfo}>
        <Text style={styles.timeText}>{item.time}</Text>
        {item.sender === 'me' && (
          <View style={[styles.readReceipt, { backgroundColor: item.read ? 'green' : 'red' }]} />
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Icon name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 174, 172, 0.5)',
  },
  messageList: {
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  messageContainer: {
    marginVertical: 5,
    maxWidth: '80%',
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  messageBubble: {
    padding: 10,
    borderRadius: 15,
  },
  myMessageBubble: {
    backgroundColor: '#ff69b4',
    borderBottomRightRadius: 0,
  },
  otherMessageBubble: {
    backgroundColor: '#e0e0e0',
    borderBottomLeftRadius: 0,
  },
  myMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#000',
  },
  messageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  timeText: {
    fontSize: 10,
    color: '#666',
    marginHorizontal: 5,
  },
  readReceipt: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#ff69b4',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
