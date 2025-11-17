import React, { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, Animated, Platform } from 'react-native';
import { colors } from '../theme/colors';
import type { CellValue } from '../utils/game';

type Props = {
  index: number;
  value: CellValue;
  disabled?: boolean;
  onPress: (index: number) => void;
  highlight?: boolean; // winning cell highlight
};

const Cell: React.FC<Props> = ({ index, value, disabled, onPress, highlight }) => {
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (value) {
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();
    } else {
      scale.setValue(0.9);
      opacity.setValue(0);
    }
  }, [value]);

  const label = `Cell ${index + 1}, ${value ? value : 'empty'}`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => onPress(index)}
      disabled={disabled || !!value}
      style={({ pressed }) => [
        styles.cell,
        highlight && styles.highlight,
        pressed && !value && !disabled ? styles.pressed : null,
      ]}
    >
      <Animated.View style={[styles.inner, { transform: [{ scale }], opacity }]}>
        <Text
          style={[
            styles.mark,
            value === 'X' ? styles.markX : value === 'O' ? styles.markO : null,
          ]}
        >
          {value ?? ''}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

const CELL_SIZE = 88; // >= 44 for a11y; scaled in Board for responsiveness

const styles = StyleSheet.create({
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: Platform.OS === 'android' ? 4 : 0,
    borderWidth: 1,
    borderColor: colors.border,
    margin: 6,
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mark: {
    fontSize: 40,
    fontWeight: '800',
    color: colors.text,
  },
  markX: {
    color: colors.primary,
  },
  markO: {
    color: colors.secondary,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  highlight: {
    borderColor: colors.secondary,
    borderWidth: 2,
  },
});

export default Cell;
