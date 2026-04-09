import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Text, Button } from '../src/components/ui';
import { colors } from '../src/theme/colors';
import { spacing, layout } from '../src/theme/spacing';
import { walletService } from '../src/services/wallet.service';
import { Svg, Path } from 'react-native-svg';

export default function ScanQRScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [flashOn, setFlashOn] = useState(false);
  const [paying, setPaying] = useState(false);
  const scanLocked = useRef(false);

  const handleBarCodeScanned = ({ data }: { type: string; data: string }) => {
    if (scanLocked.current) return;
    scanLocked.current = true;

    Alert.alert(
      'QR Detectado',
      `¿Confirmar pago?\n\nDatos: ${data}`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: () => {
            scanLocked.current = false;
          },
        },
        {
          text: 'Confirmar',
          onPress: async () => {
            setPaying(true);
            try {
              await walletService.payQR(data);
              Alert.alert('Pago exitoso', 'El pago fue procesado correctamente.', [
                { text: 'OK', onPress: () => router.back() },
              ]);
            } catch (err: unknown) {
              const message = err instanceof Error ? err.message : 'Error al procesar el pago.';
              Alert.alert('Error', message, [
                {
                  text: 'Reintentar',
                  onPress: () => {
                    scanLocked.current = false;
                  },
                },
              ]);
            } finally {
              setPaying(false);
            }
          },
        },
      ],
    );
  };

  // Permission loading state
  if (!permission) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator color={colors.copper} size="large" />
      </View>
    );
  }

  // Permission denied / not granted
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path
                d="M19 12H5M12 19l-7-7 7-7"
                stroke={colors.textPrimary}
                strokeWidth={2}
                strokeLinecap="round"
              />
            </Svg>
          </TouchableOpacity>
          <Text variant="h2" color={colors.textPrimary}>Escanear QR</Text>
          <View style={styles.placeholderBtn} />
        </View>

        <View style={styles.permissionContent}>
          <View style={styles.permissionIcon}>
            <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
              <Path
                d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
                stroke={colors.copper}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M12 17a4 4 0 100-8 4 4 0 000 8z"
                stroke={colors.copper}
                strokeWidth={1.5}
              />
            </Svg>
          </View>
          <Text variant="h2" color={colors.textPrimary} style={styles.permissionTitle}>
            Permiso de cámara
          </Text>
          <Text variant="body" color={colors.textSecondary} style={styles.permissionDesc}>
            Necesitamos acceso a tu cámara para escanear códigos QR de pago de forma segura.
          </Text>
          <Button
            title="Permitir Cámara"
            onPress={requestPermission}
            variant="primary"
            size="lg"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M19 12H5M12 19l-7-7 7-7"
              stroke={colors.textPrimary}
              strokeWidth={2}
              strokeLinecap="round"
            />
          </Svg>
        </TouchableOpacity>
        <Text variant="h2" color={colors.textPrimary}>Escanear QR</Text>
        <TouchableOpacity
          style={[styles.flashBtn, flashOn && styles.flashBtnActive]}
          onPress={() => setFlashOn(prev => !prev)}
        >
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path
              d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
              stroke={flashOn ? colors.amber : colors.textSecondary}
              strokeWidth={1.5}
              fill={flashOn ? colors.amberMuted : 'none'}
            />
          </Svg>
        </TouchableOpacity>
      </View>

      {/* Camera + overlay */}
      <View style={styles.cameraContainer}>
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          enableTorch={flashOn}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={paying ? undefined : handleBarCodeScanned}
        />

        {/* Dark overlay with transparent center cutout */}
        <View style={styles.overlayTop} />
        <View style={styles.overlayMiddleRow}>
          <View style={styles.overlaySide} />
          <View style={styles.scanFrame}>
            {/* Corner brackets */}
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
            {/* Scan line */}
            <View style={styles.scanLine} />
          </View>
          <View style={styles.overlaySide} />
        </View>
        <View style={styles.overlayBottom}>
          <Text variant="bodySm" color={colors.textSecondary} style={styles.hintText}>
            Apuntá la cámara al código QR del comercio
          </Text>
        </View>

        {/* Paying indicator */}
        {paying && (
          <View style={styles.payingOverlay}>
            <ActivityIndicator color={colors.copper} size="large" />
            <Text variant="body" color={colors.textPrimary} style={styles.payingText}>
              Procesando pago...
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const FRAME_SIZE = 250;
const OVERLAY_COLOR = 'rgba(6, 10, 20, 0.72)';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centerContainer: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['5xl'],
    paddingBottom: spacing.lg,
    zIndex: 10,
  },
  backBtn: {
    width: layout.touchTarget,
    height: layout.touchTarget,
    justifyContent: 'center',
  },
  flashBtn: {
    width: layout.touchTarget,
    height: layout.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: layout.borderRadius.sm,
  },
  flashBtnActive: {
    backgroundColor: colors.amberMuted,
    borderWidth: 1,
    borderColor: colors.amber,
  },
  placeholderBtn: { width: layout.touchTarget, height: layout.touchTarget },

  // Camera
  cameraContainer: { flex: 1, position: 'relative' },

  // Overlay layers
  overlayTop: {
    backgroundColor: OVERLAY_COLOR,
    height: 80,
  },
  overlayMiddleRow: {
    flexDirection: 'row',
    height: FRAME_SIZE,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: OVERLAY_COLOR,
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: OVERLAY_COLOR,
    alignItems: 'center',
    paddingTop: spacing['2xl'],
  },
  hintText: {
    textAlign: 'center',
    paddingHorizontal: spacing['3xl'],
  },

  // Scan frame
  scanFrame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: colors.copper,
    borderWidth: 3,
  },
  cornerTL: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  cornerTR: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  cornerBL: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  cornerBR: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  scanLine: {
    position: 'absolute',
    left: 10,
    right: 10,
    height: 2,
    backgroundColor: colors.cyan,
    top: '50%',
    opacity: 0.7,
  },

  // Paying overlay
  payingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  payingText: { marginTop: spacing.md },

  // Permission screen
  permissionContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['4xl'],
    gap: spacing.xl,
  },
  permissionIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.copperMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  permissionTitle: { textAlign: 'center' },
  permissionDesc: { textAlign: 'center', lineHeight: 24, marginBottom: spacing.md },
});
