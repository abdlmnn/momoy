import {
  StyleSheet,
  Animated,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Pressable,
  Image,
  TextInput,
  TextStyle,
  Keyboard,
} from 'react-native';
import React, { useEffect, useRef, useState, useContext } from 'react';
import { styleInputs } from '../../styles/Inputs';
import { StyleSignup } from '../../styles/SignupScreen';
import Images from '../../constants/Images';
import Colors from '../../constants/Colors';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  submitted?: boolean;
  isValid?: boolean;
}

export default function Inputs({
  label,
  value,
  onChangeText,
  keyboardType = 'default',
  autoCapitalize = 'none',
  submitted = false,
  isValid = true,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: isFocused || value ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const showError = submitted && !isValid;

  let borderColor = Colors.gray;
  let labelColor = Colors.mediumGray;

  if (showError) {
    borderColor = Colors.red;
    labelColor = Colors.red;
  } else if (isFocused || (submitted && isValid)) {
    borderColor = Colors.charcoal;
    labelColor = Colors.charcoal;
  }
  return (
    <View
      style={[
        StyleSignup.inputContainer2,
        {
          borderColor,
        },
      ]}
    >
      <Animated.Text
        style={{
          position: 'absolute',
          left: 12,
          backgroundColor: Colors.white,
          paddingHorizontal: 4,
          top: labelAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [14, -10],
          }),
          color: labelAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [Colors.mediumGray, labelColor],
          }),
        }}
      >
        {label}
      </Animated.Text>
      <TextInput
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChangeText={text => onChangeText(text)}
        value={value}
        style={[StyleSignup.input]}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />

      {showError && (
        <Text
          style={{
            color: Colors.red,
            fontSize: 10,
            fontWeight: '700',
            position: 'absolute',
            left: 14,
            bottom: -20,
          }}
        >
          Enter a valid {label.toLowerCase()}
        </Text>
      )}
    </View>
  );
}

export function Prefix() {
  return (
    <View style={StyleSignup.prefixBox}>
      <Image
        source={Images.philippineFlag}
        style={{ width: 30, height: 30, marginRight: 8 }}
        resizeMode="contain"
      />
      <Text style={StyleSignup.prefixText}>+63</Text>
    </View>
  );
}
