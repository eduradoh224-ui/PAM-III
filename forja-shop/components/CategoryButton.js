import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

export default function CategoryButton({ label, emoji, isActive, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, isActive ? styles.activeButton : styles.inactiveButton]}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.label, isActive ? styles.activeLabel : styles.inactiveLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 10,
    borderWidth: 1,
  },
  activeButton: {
    backgroundColor: '#f97316',
    borderColor: '#f97316',
  },
  inactiveButton: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
  },
  emoji: {
    fontSize: 16,
    marginRight: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
  activeLabel: {
    color: '#fff',
  },
  inactiveLabel: {
    color: '#1f2937',
  },
});
