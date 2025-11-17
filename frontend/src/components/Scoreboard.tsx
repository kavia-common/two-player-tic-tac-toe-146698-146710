import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import type { Player } from '../utils/game';

type Props = {
  scoreX: number;
  scoreO: number;
  currentPlayer: Player;
};

const Scoreboard: React.FC<Props> = ({ scoreX, scoreO, currentPlayer }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.card, currentPlayer === 'X' && styles.active]}>
        <Text style={styles.label}>Player X</Text>
        <Text style={[styles.score, { color: colors.primary }]}>{scoreX}</Text>
      </View>
      <View style={styles.turn}>
        <Text style={styles.turnText}>Turn</Text>
        <Text style={[styles.turnPlayer, { color: currentPlayer === 'X' ? colors.primary : colors.secondary }]}>
          {currentPlayer}
        </Text>
      </View>
      <View style={[styles.card, currentPlayer === 'O' && styles.active]}>
        <Text style={styles.label}>Player O</Text>
        <Text style={[styles.score, { color: colors.secondary }]}>{scoreO}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 360,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  active: {
    borderColor: colors.primary,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  label: {
    fontSize: 12,
    color: colors.mutedText,
    marginBottom: 4,
  },
  score: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  turn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    minWidth: 64,
  },
  turnText: {
    fontSize: 12,
    color: colors.mutedText,
  },
  turnPlayer: {
    marginTop: 2,
    fontSize: 20,
    fontWeight: '700',
  },
});

export default Scoreboard;
