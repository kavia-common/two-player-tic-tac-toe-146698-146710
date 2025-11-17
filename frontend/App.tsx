import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import GameScreen from './src/screens/GameScreen';
import { colors } from './src/theme/colors';

class ErrorBoundary extends React.Component<React.PropsWithChildren, { hasError: boolean; message?: string }> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false, message: undefined };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error?.message ?? 'Unknown error' };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log error details to the console for debugging
    // eslint-disable-next-line no-console
    console.error('App error boundary caught:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={styles.safe}>
          <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
            <Text accessibilityRole="header" style={styles.fallbackTitle}>Something went wrong</Text>
            <Text style={styles.fallbackMsg}>{this.state.message}</Text>
          </View>
        </SafeAreaView>
      );
    }
    return this.props.children as React.ReactElement;
  }
}

// PUBLIC_INTERFACE
export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.safe}>
        <StatusBar style="dark" />
        <View style={styles.container}>
          <GameScreen />
        </View>
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  fallbackTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  fallbackMsg: {
    fontSize: 14,
    color: colors.mutedText,
  },
});
