import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Animated,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

export default function SignupScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const labelAnim = useRef(new Animated.Value(email ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: isFocused || email ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isFocused, email]);

  const labelStyle = {
    position: 'absolute',
    left: 12,
    top: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [12, -10], // moves up when focused
    }),
    fontSize: 16,
    color: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['#999', '#000'],
    }),
    backgroundColor: '#fff',
    paddingHorizontal: 4,
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {/* Top X button */}
        <Pressable
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ fontSize: 28, color: '#333' }}>X</Text>
        </Pressable>

        {/* Text title instead of icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.titleText}>Email</Text>
        </View>

        {/* Headings */}
        <Text style={styles.heading}>What's your email?</Text>
        <Text style={styles.subHeading}>
          We'll check if you have an account
        </Text>

        {/* Floating Label Input */}
        <View
          style={[
            styles.inputContainer,
            { borderColor: isFocused ? '#000' : '#ccc' }, // <-- border color changes
          ]}
        >
          <Animated.Text style={labelStyle}>Email</Animated.Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Continue button */}
        <Pressable
          style={styles.continueButton}
          onPress={() => console.log(email)}
        >
          <Text style={styles.continueText}>Continue</Text>
        </Pressable>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    left: 24,
    zIndex: 10,
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 24,
  },
  titleText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF6F61',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subHeading: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginBottom: 32,
    position: 'relative',
  },
  input: {
    height: 50,
    fontSize: 16,
    color: '#000',
  },
  continueButton: {
    backgroundColor: '#FF6F61',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: -2 },
    elevation: 3,
    marginBottom: 20,
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
