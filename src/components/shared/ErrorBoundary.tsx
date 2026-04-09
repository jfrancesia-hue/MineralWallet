import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Button } from '../ui';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <View style={styles.container}>
          <Text variant="h1" color={colors.red} align="center">
            Algo salio mal
          </Text>
          <Text variant="body" color={colors.textSecondary} align="center" style={styles.message}>
            Ocurrio un error inesperado. Intenta de nuevo.
          </Text>
          {this.state.error && (
            <Text variant="caption" color={colors.textMuted} align="center" style={styles.errorText}>
              {this.state.error.message}
            </Text>
          )}
          <Button
            title="Reintentar"
            onPress={this.handleRetry}
            variant="primary"
            size="lg"
            style={styles.retryBtn}
          />
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  message: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  errorText: {
    marginBottom: spacing.xl,
    fontFamily: 'JetBrainsMono',
    maxWidth: '90%',
  },
  retryBtn: {
    width: '100%',
  },
});
