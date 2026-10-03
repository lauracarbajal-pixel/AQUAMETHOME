import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { COLORS } from '../theme/colors';

export default function FloatingInput({
  label,
  required = false,
  value,
  onChangeText,
  secureTextEntry = false,
  placeholder,
  keyboardType = 'default',
}) {
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.requiredStar}>*</Text>}
      </Text>

      <View style={[styles.inputBox, isFocused && styles.inputBoxFocused]}>
        {required && (
          <View style={styles.requiredTag}>
            <Text style={styles.requiredTagText}>Requiried</Text>
          </View>
        )}

        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isSecure}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {secureTextEntry && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setIsSecure(!isSecure)}
          >
            <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <Path
                d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
                stroke="#64748B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Circle
                cx="12"
                cy="12"
                r="3"
                stroke="#64748B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  requiredStar: {
    color: '#EF4444',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#0F6CBD',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    height: 52,
    position: 'relative',
  },
  inputBoxFocused: {
    borderColor: '#0284C7',
    borderWidth: 2,
  },
  requiredTag: {
    position: 'absolute',
    top: -9,
    left: 14,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    zIndex: 1,
  },
  requiredTagText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#0F172A',
    paddingVertical: 8,
  },
  eyeButton: {
    padding: 6,
  },
});
