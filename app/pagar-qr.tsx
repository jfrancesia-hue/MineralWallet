import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Text, MoneyText, Card, Badge, Button } from '../src/components/ui';
import { colors } from '../src/theme/colors';
import { spacing, layout } from '../src/theme/spacing';
import { Svg, Path, Rect } from 'react-native-svg';

export default function PagarQRScreen() {
  const [scanned, setScanned] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path d="M19 12H5M12 19l-7-7 7-7" stroke={colors.textPrimary} strokeWidth={2} strokeLinecap="round" />
          </Svg>
        </TouchableOpacity>
        <Text variant="h2" color={colors.textPrimary}>Mineral Wallet</Text>
        <TouchableOpacity style={styles.flashBtn}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke={colors.amber} strokeWidth={1.5} />
          </Svg>
        </TouchableOpacity>
      </View>

      {/* Scanner Area */}
      <View style={styles.scannerArea}>
        <View style={styles.scannerFrame}>
          {/* Corner brackets */}
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />

          {/* QR placeholder */}
          <View style={styles.qrPlaceholder}>
            <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
              <Rect x={3} y={3} width={7} height={7} rx={1} stroke={colors.cyan} strokeWidth={1} />
              <Rect x={14} y={3} width={7} height={7} rx={1} stroke={colors.cyan} strokeWidth={1} />
              <Rect x={3} y={14} width={7} height={7} rx={1} stroke={colors.cyan} strokeWidth={1} />
              <Rect x={14} y={14} width={4} height={4} rx={1} stroke={colors.cyan} strokeWidth={1} />
            </Svg>
          </View>

          {/* Scan line animation */}
          <View style={styles.scanLine} />
        </View>
      </View>

      {/* Scanned Result */}
      <View style={styles.resultSection}>
        <View style={styles.resultCard}>
          <Text variant="labelSm" color={colors.textMuted}>Comercio detectado</Text>
          <Text variant="h2" color={colors.textPrimary} style={styles.merchantName}>
            Farmacia del Norte
          </Text>
          <View style={styles.discountBadge}>
            <Badge label="20% OFF" variant="emerald" />
          </View>
          <View style={styles.verifiedRow}>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke={colors.emerald} strokeWidth={2} strokeLinecap="round" />
              <Path d="M22 4L12 14.01l-3-3" stroke={colors.emerald} strokeWidth={2} strokeLinecap="round" />
            </Svg>
            <Text variant="caption" color={colors.textSecondary}>Vendedor verificado por Mineral Network</Text>
          </View>

          {/* Price */}
          <View style={styles.priceSection}>
            <View style={styles.priceRow}>
              <Text variant="bodySm" color={colors.textMuted}>Monto original</Text>
              <Text variant="moneySm" color={colors.textMuted} style={styles.strikethrough}>$5,625.00</Text>
            </View>
            <View style={styles.priceRow}>
              <Text variant="h3" color={colors.textPrimary}>Total a pagar</Text>
              <MoneyText amount="4,500.00" variant="moneyMd" color={colors.textPrimary} />
            </View>
            <View style={styles.savingsRow}>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={colors.emerald} strokeWidth={1.5} />
              </Svg>
              <Text variant="caption" color={colors.emerald}>$1,125 ahorrados</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom Tab (payment context) */}
      <View style={styles.bottomBar}>
        <Button title="Confirmar pago" onPress={() => {}} variant="primary" size="lg" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.xl, paddingTop: spacing['5xl'],
  },
  backBtn: { width: layout.touchTarget, height: layout.touchTarget, justifyContent: 'center' },
  flashBtn: { width: layout.touchTarget, height: layout.touchTarget, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderRadius: layout.borderRadius.sm },
  scannerArea: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing['4xl'] },
  scannerFrame: {
    width: 250, height: 250, position: 'relative',
    alignItems: 'center', justifyContent: 'center',
  },
  corner: { position: 'absolute', width: 30, height: 30, borderColor: colors.copper, borderWidth: 3 },
  cornerTL: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  cornerTR: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  cornerBL: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  cornerBR: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  qrPlaceholder: { opacity: 0.3 },
  scanLine: {
    position: 'absolute', left: 10, right: 10, height: 2,
    backgroundColor: colors.cyan, top: '50%', opacity: 0.7,
  },
  resultSection: { paddingHorizontal: spacing.xl },
  resultCard: {
    backgroundColor: colors.surface, borderRadius: layout.borderRadius.lg,
    padding: spacing.xl, borderWidth: 1, borderColor: colors.copperMuted,
  },
  merchantName: { marginVertical: spacing.sm },
  discountBadge: { marginBottom: spacing.sm },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  priceSection: { borderTopWidth: 1, borderTopColor: colors.copperMuted, paddingTop: spacing.lg },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  strikethrough: { textDecorationLine: 'line-through' },
  savingsRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, justifyContent: 'flex-end' },
  bottomBar: { padding: spacing.xl, paddingBottom: spacing['3xl'] },
});
