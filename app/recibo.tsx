import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { generatePayStubPdf, sharePayStubPdf } from '../src/utils/pdfGenerator';
import { router } from 'expo-router';
import { Text, MoneyText, Label, Card, Badge, Button } from '../src/components/ui';
import { PayStubCard } from '../src/components/cards';
import { useWorkStore, useAuthStore } from '../src/stores';
import { colors } from '../src/theme/colors';
import { spacing, layout } from '../src/theme/spacing';
import { Svg, Path } from 'react-native-svg';

export default function ReciboScreen() {
  const payStubs = useWorkStore((s) => s.payStubs);
  const user = useAuthStore((s) => s.user);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const currentStub = payStubs[selectedIndex];
  if (!currentStub) {
    return (
      <View style={styles.container}>
        <Text variant="body" color={colors.textSecondary}>Sin recibos disponibles</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path d="M19 12H5M12 19l-7-7 7-7" stroke={colors.textPrimary} strokeWidth={2} strokeLinecap="round" />
            </Svg>
          </TouchableOpacity>
          <View>
            <Text variant="h1" color={colors.textPrimary}>Mi Recibo</Text>
            <Text variant="labelSm" color={colors.textMuted}>Control de haberes</Text>
          </View>
        </View>

        {/* Month selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monthScroll}>
          <View style={styles.monthRow}>
            {payStubs.map((stub, i) => (
              <TouchableOpacity
                key={stub.id}
                style={[styles.monthPill, i === selectedIndex && styles.monthActive]}
                onPress={() => setSelectedIndex(i)}
              >
                <Text variant="buttonSm" color={i === selectedIndex ? colors.background : colors.textSecondary}>
                  {stub.month}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Recibo Card */}
        <Card variant="financial" style={styles.reciboCard}>
          {/* Company Info */}
          <View style={styles.companyRow}>
            <View style={styles.companyLogo}>
              <Text variant="bodySm" color={colors.copper}>
                {user?.empresa ? user.empresa.split(' ').map(w => w[0]).join('').slice(0, 2) : 'MW'}
              </Text>
            </View>
            <View>
              <Text variant="h3" color={colors.textPrimary}>{user?.empresa ?? 'Empresa'}</Text>
              <Text variant="labelSm" color={colors.textMuted}>CUIT: 30-71234567-9</Text>
            </View>
          </View>

          {/* Worker */}
          <View style={styles.workerSection}>
            <Text variant="labelSm" color={colors.textMuted}>Empleado</Text>
            <Text variant="h3" color={colors.textPrimary}>
              {user ? `${user.nombre} ${user.apellido}` : 'Trabajador'}
            </Text>
            <Text variant="caption" color={colors.textMuted}>
              Legajo: #{user?.legajo ?? '0000'} · Cat: {user?.categoria ?? ''}
            </Text>
          </View>

          <View style={styles.periodoSection}>
            <Text variant="labelSm" color={colors.textMuted}>Periodo de liquidacion</Text>
            <Text variant="h2" color={colors.copper}>{currentStub.period}</Text>
            <Text variant="caption" color={colors.textMuted}>Fecha de pago: {currentStub.paidDate}</Text>
          </View>

          {/* Haberes */}
          <Text variant="h3" color={colors.emerald} style={styles.sectionLabel}>Haberes</Text>
          {currentStub.haberes.map((h) => (
            <View key={h.label} style={styles.lineItem}>
              <Text variant="bodySm" color={colors.textSecondary}>{h.label}</Text>
              <MoneyText amount={h.amount} variant="moneySm" color={colors.textPrimary} />
            </View>
          ))}
          <View style={[styles.lineItem, styles.totalLine]}>
            <Text variant="bodySm" color={colors.textMuted}>Total Haberes</Text>
            <MoneyText amount={currentStub.totalHaberes} variant="moneySm" color={colors.emerald} prefix="+$" />
          </View>

          {/* Descuentos */}
          <Text variant="h3" color={colors.red} style={styles.sectionLabel}>Descuentos</Text>
          {currentStub.descuentos.map((d) => (
            <View key={d.label} style={styles.lineItem}>
              <Text variant="bodySm" color={colors.textSecondary}>{d.label}</Text>
              <MoneyText amount={d.amount} variant="moneySm" color={colors.textPrimary} />
            </View>
          ))}
          <View style={[styles.lineItem, styles.totalLine]}>
            <Text variant="bodySm" color={colors.textMuted}>Total Descuentos</Text>
            <MoneyText amount={currentStub.totalDescuentos} variant="moneySm" color={colors.red} prefix="-$" />
          </View>

          {/* Neto */}
          <View style={styles.netoSection}>
            <Text variant="label" color={colors.copper}>Neto a Cobrar</Text>
            <MoneyText amount={currentStub.neto} variant="moneyLg" color={colors.copper} />
          </View>
        </Card>

        {/* Actions */}
        <Button
          title="Descargar PDF"
          onPress={async () => {
            try {
              const userName = user ? `${user.nombre} ${user.apellido}` : 'Trabajador';
              const empresa = user?.empresa ?? 'Empresa';
              await generatePayStubPdf(currentStub, userName, empresa);
              Alert.alert('PDF generado', 'Tu recibo fue guardado correctamente.');
            } catch {
              Alert.alert('Error', 'No se pudo generar el PDF. Intenta nuevamente.');
            }
          }}
          variant="primary"
          size="lg"
        />
        <Button
          title="Compartir"
          onPress={async () => {
            try {
              const userName = user ? `${user.nombre} ${user.apellido}` : 'Trabajador';
              const empresa = user?.empresa ?? 'Empresa';
              await sharePayStubPdf(currentStub, userName, empresa);
            } catch {
              Alert.alert('Error', 'No se pudo compartir el recibo. Intenta nuevamente.');
            }
          }}
          variant="secondary"
          size="lg"
          style={styles.shareBtn}
        />

        <View style={{ height: spacing['4xl'] }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing['5xl'] },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl },
  backBtn: { width: layout.touchTarget, height: layout.touchTarget, justifyContent: 'center' },
  monthScroll: { marginBottom: spacing.xl },
  monthRow: { flexDirection: 'row', gap: spacing.sm },
  monthPill: {
    paddingHorizontal: spacing.xl, paddingVertical: spacing.md,
    borderRadius: layout.borderRadius.sm, 
    minHeight: 40, justifyContent: 'center',
  },
  monthActive: { backgroundColor: colors.copper, borderColor: colors.copper },
  reciboCard: { marginBottom: spacing.xl },
  companyRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl },
  companyLogo: {
    width: 40, height: 40, borderRadius: 8, backgroundColor: colors.elevated,
    alignItems: 'center', justifyContent: 'center',
  },
  workerSection: { marginBottom: spacing.lg, gap: 2 },
  periodoSection: { marginBottom: spacing.xl, gap: 2 },
  sectionLabel: { marginTop: spacing.lg, marginBottom: spacing.md },
  lineItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: spacing.sm, 
  },
  totalLine: { borderBottomWidth: 0, paddingTop: spacing.md },
  netoSection: {
    marginTop: spacing.xl, padding: spacing.lg, backgroundColor: `${colors.copper}08`,
    borderRadius: layout.borderRadius.md, 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  shareBtn: { marginTop: spacing.sm },
});
