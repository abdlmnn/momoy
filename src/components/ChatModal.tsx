import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  ScrollView,
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
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    // scroll to bottom whenever messages change
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.handle} />
          <Text style={styles.title}>Chat with Admin</Text>

          <ScrollView style={styles.messages} ref={scrollRef}>
            {messages.map(msg => (
              <View
                key={msg.id}
                style={[
                  styles.messageRow,
                  msg.sender === 'admin' ? styles.adminMsg : styles.userMsg,
                ]}
              >
                <Text style={styles.messageText}>{msg.text}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              value={newMessage}
              onChangeText={setNewMessage}
            />
            <Pressable
              style={styles.sendBtn}
              onPress={() => {
                if (!newMessage.trim()) return;
                const nextId = messages.length + 1;
                setMessages([
                  ...messages,
                  { id: nextId, sender: 'user', text: newMessage },
                ]);
                setNewMessage('');
              }}
            >
              <Text style={styles.sendText}>Send</Text>
            </Pressable>
          </View>

          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.1)',
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
  messages: { flex: 1, marginBottom: 12 },
  messageRow: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    maxWidth: '80%',
  },
  adminMsg: { backgroundColor: '#f0f0f0', alignSelf: 'flex-start' },
  userMsg: { backgroundColor: Colors.lightTangerine, alignSelf: 'flex-end' },
  messageText: { fontSize: 14, color: Colors.charcoal },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 45,
    marginRight: 8,
  },
  sendBtn: {
    backgroundColor: Colors.darkTangerine,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  sendText: { color: Colors.white, fontWeight: '600' },
  closeBtn: {
    marginTop: 10,
    alignSelf: 'center',
    alignItems: 'center',
    // borderWidth: 1,
    // borderRadius: 10,
    paddingVertical: 10,
    width: '100%',
  },
  closeText: { color: Colors.grayBar2, fontWeight: '800', fontSize: 16 },
});
