import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Colors from '../constants/Colors';

export default function ChatModal({
  visible,
  onClose,
  initialMessages = [],
}: {
  visible: boolean;
  onClose: () => void;
  initialMessages?: any[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // scroll to bottom whenever messages change
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const nextId = messages.length + 1;
    setMessages([
      ...messages,
      { id: nextId, sender: 'user', text: newMessage },
    ]);
    setNewMessage('');
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isAdmin = item.sender === 'admin';
    return (
      <View
        style={[styles.messageRow, isAdmin ? styles.adminMsg : styles.userMsg]}
      >
        <Text
          style={[styles.messageText, isAdmin && { color: Colors.charcoal }]}
        >
          {item.text}
        </Text>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <View style={styles.handle} />
          <Text style={styles.title}>Chat</Text>

          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 8 }}
          />

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              value={newMessage}
              onChangeText={setNewMessage}
            />
            <Pressable style={styles.sendBtn} onPress={sendMessage}>
              <Text style={styles.sendText}>Send</Text>
            </Pressable>
          </View>

          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  container: {
    height: '70%',
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: Colors.gray,
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  messageRow: {
    padding: 10,
    borderRadius: 15,
    marginVertical: 4,
    maxWidth: '75%',
  },
  adminMsg: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
  },
  userMsg: {
    backgroundColor: Colors.lightTangerine,
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 14,
    color: Colors.white,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 25,
    paddingHorizontal: 12,
    height: 45,
    marginRight: 8,
  },
  sendBtn: {
    backgroundColor: Colors.darkTangerine,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 25,
  },
  sendText: { color: Colors.white, fontWeight: '600' },
  closeBtn: {
    marginTop: 10,
    alignSelf: 'center',
    paddingVertical: 10,
    width: '100%',
  },
  closeText: {
    color: Colors.grayBar2,
    fontWeight: '800',
    fontSize: 16,
    textAlign: 'center',
  },
});
