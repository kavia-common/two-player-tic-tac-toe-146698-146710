import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

type Props = {
  onRestart: () => void;
  onResetScores: () => void;
  disabled?: boolean;
};

const Controls: React.FC<Props> = ({ onRestart, onResetScores, disabled }) => {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Restart board"
        onPress={onRestart}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        disabled={disabled}
      >
        <Text style={styles.buttonText}>Restart</Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Reset scores"
        onPress={onResetScores}
        style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
      >
        <Text style={styles.secondaryText}>Reset Scores</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 360,
    marginTop: 16,
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  secondary: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 14,
  },
  pressed: {
    opacity: 0.9,
  },
});

export default Controls;
