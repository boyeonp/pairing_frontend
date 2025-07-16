import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getMessages, sendMessage } from '../services/chatApi';
import { Message } from '../models/message';
import { useRoute } from '@react-navigation/native';
import io from 'socket.io-client';

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60);
  const route = useRoute();
  const { user, chatroomId } = route.params as { user: any; chatroomId: string };
  const hasMatch = !!chatroomId;
  const socket = useRef<any>(null);

  useEffect(() => {
    if (chatroomId && user) {
      socket.current = io('http://172.20.12.170:80', {
        query: { userId: user.id },
        transports: ['websocket'],
      });

      const setupChat = async () => {
        socket.current?.emit('joinRoom', { chatroomId });

        try {
          const fetchedMessages = await getMessages(chatroomId);
          if (fetchedMessages.length === 0 && user.comment) {
            const body = {
              message: user.comment,
              chatroomId,
              senderId: user.id,
            };
            const saved = await sendMessage(body);
            const payload = { ...saved, chatroomId };
            socket.current.emit('sendMessage', payload);
            setMessages([saved]);
          } else {
            setMessages(fetchedMessages);
          }
        } catch (error) {
          console.error('Failed to fetch initial messages or send first message:', error);
        }
      };

      if (socket.current.connected) {
        setupChat();
      } else {
        socket.current.once('connect', setupChat);
      }

      socket.current.on('newMessage', (raw: any) => {
        const newMessage = normalise(raw);
        if (newMessage.sender.id === user.id) return;
        setMessages(prev =>
          prev.some(m => m.id === newMessage.id) ? prev : [...prev, newMessage]
        );
      });

      return () => {
        socket.current.disconnect();
      };
    }
  }, [chatroomId, user]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // messages 길이가 바뀔 때마다 맨 끝으로
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const body = {
      message: inputText,
      chatroomId,
      senderId: user.id,
    };

    try {
      const saved = await sendMessage(body);
      const payload = { ...saved, chatroomId };
      socket.current.emit('sendMessage', payload);
      setMessages(prev => [...prev, saved]);
      setInputText('');
    } catch (err) {
      console.error('Failed to send:', err);
    }
  };
  const normalise = (m: any): Message => {
    if (m.sender) return m;
    return { ...m, sender: { id: m.senderId } };
  };



  const shouldShowTime = (item: Message, index: number) => {
    if (index === 0) return true;
    const prevMessage = messages[index - 1];
    return new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) !== new Date(prevMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || item.sender.id !== prevMessage.sender.id;
  };

  const renderMessage = ({ item, index }: { item: Message, index: number }) => {
    if (!user) {
      return null;
    }
    const isMe = item.sender.id === user.id;
    return (
      <View style={[styles.messageContainer, isMe ? styles.myMessageContainer : styles.otherMessageContainer]}>
        {isMe && (
          <View style={styles.messageInfo}>
            {shouldShowTime(item, index) && <Text style={styles.timeText}>{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>}
          </View>
        )}
        <View style={[styles.messageBubble, isMe ? styles.myMessageBubble : styles.otherMessageBubble]}>
          <Text style={isMe ? styles.myMessageText : styles.otherMessageText}>{item.message}</Text>
        </View>
        {!isMe && shouldShowTime(item, index) && (
          <View style={styles.messageInfo}>
            <Text style={styles.timeText}>{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </View>
        )}
      </View>
    );
  };

  if (!hasMatch) {
    return (
      <View style={[styles.container, styles.noMatchContainer]}>
        <Text style={styles.noMatchText}>인연이 아직 도착하지 않았어요</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
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
    backgroundColor: '#fff',
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
