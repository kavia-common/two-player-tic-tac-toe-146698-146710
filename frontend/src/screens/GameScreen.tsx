import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Board from '../components/Board';
import Controls from '../components/Controls';
import Scoreboard from '../components/Scoreboard';
import { colors } from '../theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BoardState,
  Player,
  checkWinner,
  emptyBoard,
  getNextPlayer,
  isDraw,
} from '../utils/game';

const SCORES_KEY = 'ttt_scores_v1';

type Scores = { X: number; O: number };

const GameScreen: React.FC = () => {
  const [board, setBoard] = useState<BoardState>(emptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [scores, setScores] = useState<Scores>({ X: 0, O: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [resultModal, setResultModal] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: '',
  });

  // Load persisted scores
  useEffect(() => {
    (async () => {
      try {
        const val = await AsyncStorage.getItem(SCORES_KEY);
        if (val) {
          const parsed = JSON.parse(val) as Scores;
          setScores(parsed);
        }
      } catch {
        // ignore read errors
      }
    })();
  }, []);

  const persistScores = useCallback(async (s: Scores) => {
    try {
      await AsyncStorage.setItem(SCORES_KEY, JSON.stringify(s));
    } catch {
      // ignore write errors
    }
  }, []);

  const handleCellPress = useCallback(
    (index: number) => {
      if (gameOver || board[index]) return;

      const next = [...board];
      next[index] = currentPlayer;
      setBoard(next);

      // Check result
      const { winner, line } = checkWinner(next);
      if (winner) {
        setWinningLine(line);
        setGameOver(true);
        const newScores = { ...scores, [winner]: scores[winner] + 1 } as Scores;
        setScores(newScores);
        persistScores(newScores);
        setResultModal({ visible: true, message: `Player ${winner} wins!` });
        return;
      }

      if (isDraw(next)) {
        setGameOver(true);
        setResultModal({ visible: true, message: "It's a draw!" });
        return;
      }

      setCurrentPlayer((p) => getNextPlayer(p));
    },
    [board, currentPlayer, gameOver, persistScores, scores]
  );

  const restartBoard = useCallback(() => {
    setBoard(emptyBoard());
    setWinningLine(null);
    setGameOver(false);
    setCurrentPlayer('X');
    setResultModal({ visible: false, message: '' });
  }, []);

  const resetScores = useCallback(async () => {
    const reset = { X: 0, O: 0 };
    setScores(reset);
    await persistScores(reset);
  }, [persistScores]);

  const title = useMemo(() => 'Tic Tac Toe', []);

  const onCloseModal = useCallback(() => {
    setResultModal({ visible: false, message: '' });
  }, []);

  // Also show quick native Alert as backup on platforms where modal may not feel native
  useEffect(() => {
    if (resultModal.visible && Platform.OS !== 'web') {
      Alert.alert('Game Over', resultModal.message, [{ text: 'OK', onPress: onCloseModal }], {
        cancelable: true,
      });
    }
  }, [resultModal, onCloseModal]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text accessibilityRole="header" style={styles.title}>
          {title}
        </Text>

        <Scoreboard
          scoreX={scores.X}
          scoreO={scores.O}
          currentPlayer={currentPlayer}
        />

        <View style={styles.boardCard}>
          <Board
            board={board}
            onCellPress={handleCellPress}
            disabled={gameOver}
            winningLine={winningLine}
          />
        </View>

        <Controls
          onRestart={restartBoard}
          onResetScores={resetScores}
          disabled={false}
        />

        {/* Subtle modal for web or consistent UX */}
        <Modal
          visible={resultModal.visible}
          transparent
          animationType="fade"
          onRequestClose={onCloseModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Game Over</Text>
              <Text style={styles.modalMessage}>{resultModal.message}</Text>
              <Pressable onPress={onCloseModal} style={styles.modalButton} accessibilityRole="button">
                <Text style={styles.modalButtonText}>OK</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
  },
  boardCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    width: '100%',
    maxWidth: 380,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 320,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
  },
  modalMessage: {
    fontSize: 16,
    color: colors.mutedText,
    marginBottom: 14,
  },
  modalButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default GameScreen;
