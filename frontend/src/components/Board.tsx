import React from 'react';
import { StyleSheet, View } from 'react-native';
import Cell from './Cell';
import type { BoardState } from '../utils/game';

type Props = {
  board: BoardState;
  onCellPress: (index: number) => void;
  disabled?: boolean;
  winningLine?: number[] | null;
};

const Board: React.FC<Props> = ({ board, onCellPress, disabled, winningLine }) => {
  const isHighlighted = (i: number) => winningLine?.includes(i);

  return (
    <View style={styles.wrapper} accessibilityLabel="Tic Tac Toe board">
      <View style={styles.grid}>
        {board.map((value, i) => (
          <Cell
            key={i}
            index={i}
            value={value}
            onPress={onCellPress}
            disabled={disabled}
            highlight={!!isHighlighted(i)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  grid: {
    width: '100%',
    maxWidth: 320,
    gap: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});

export default Board;
