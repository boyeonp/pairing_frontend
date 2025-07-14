import React, { useState, useEffect } from 'react';
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
];

export default function ChatScreen() {
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState('');
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60);
  const [hasMatch, setHasMatch] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

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

  const shouldShowTime = (item: Message, index: number) => {
    if (index === 0) return true;
    const prevMessage = messages[index - 1];
    return item.time !== prevMessage.time || item.sender !== prevMessage.sender;
  };

  const renderMessage = ({ item, index }: { item: Message, index: number }) => (
    <View style={[styles.messageContainer, item.sender === 'me' ? styles.myMessageContainer : styles.otherMessageContainer]}>
      {item.sender === 'me' && (
        <View style={styles.messageInfo}>
          {!item.read && <Text style={styles.readReceipt}>1</Text>}
          {shouldShowTime(item, index) && <Text style={styles.timeText}>{item.time}</Text>}
        </View>
      )}
      <View style={[styles.messageBubble, item.sender === 'me' ? styles.myMessageBubble : styles.otherMessageBubble]}>
        <Text style={item.sender === 'me' ? styles.myMessageText : styles.otherMessageText}>{item.text}</Text>
      </View>
      {item.sender === 'other' && shouldShowTime(item, index) && (
        <View style={styles.messageInfo}>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
      )}
    </View>
  );

  if (!hasMatch) {
    return (
      <View style={[styles.container, styles.noMatchContainer]}>
        <Text style={styles.noMatchText}>아직 인연이 없습니다</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
      </View>
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
  noMatchContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMatchText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  messageList: {
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  messageContainer: {
    marginVertical: 5,
    maxWidth: '80%',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
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
    alignItems: 'flex-end',
    marginHorizontal: 5,
    marginBottom: 5,
  },
  timeText: {
    fontSize: 10,
    color: '#666',
  },
  readReceipt: {
    fontSize: 10,
    color: 'yellow',
    fontWeight: 'bold',
  },
  timerContainer: {
    alignSelf: 'flex-end',
    margin: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 10,
  },
  timerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
