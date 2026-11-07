import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from './Icon';
import { COLORS } from '../theme/colors';

export function Card({ style, children }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const BUTTON_VARIANTS = {
  primary: { bg: COLORS.primary, border: COLORS.primary, text: COLORS.white },
  success: { bg: COLORS.success, border: COLORS.success, text: COLORS.white },
  outline: { bg: COLORS.white, border: COLORS.border, text: COLORS.primary },
  outlinePrimary: { bg: COLORS.infoBg, border: COLORS.primaryLight, text: COLORS.primaryDark },
};

export function Button({ title, onPress, variant = 'primary', size = 'md', disabled = false, style, iconLeft }) {
  const v = BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.primary;
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        size === 'sm' && styles.buttonSm,
        { backgroundColor: v.bg, borderColor: v.border },
        disabled && styles.buttonDisabled,
        style,
      ]}
    >
      {iconLeft ? <Icon name={iconLeft} size={18} color={v.text} strokeWidth={2.6} /> : null}
      <Text style={[styles.buttonText, size === 'sm' && styles.buttonTextSm, { color: v.text }, iconLeft && { marginLeft: 6 }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export function ProgressTrack({ progress, color = COLORS.primary, height = 8, style }) {
  const pct = Math.max(0, Math.min(progress, 1)) * 100;
  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }, style]}>
      <View style={[styles.trackFill, { width: `${pct}%`, backgroundColor: color, borderRadius: height / 2 }]} />
    </View>
  );
}

export function StepProgress({ step, total }) {
  return (
    <View style={styles.stepRow} accessibilityLabel={`Paso ${step} de ${total}`}>
      <ProgressTrack progress={step / total} style={{ flex: 1 }} />
      <Text style={styles.stepText}>
        {step}/{total}
      </Text>
    </View>
  );
}

// Pie de pantalla para los flujos paso a paso (barra de progreso + Anterior/Siguiente).
export function FlowFooter({
  step,
  total,
  onPrev,
  onNext,
  nextLabel = 'Siguiente',
  nextVariant = 'primary',
  nextDisabled = false,
  safeBottom = true,
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.footer, { paddingBottom: 12 + (safeBottom ? insets.bottom : 0) }]}>
      {total ? <StepProgress step={step} total={total} /> : null}
      {onPrev || onNext ? (
        <View style={styles.footerButtons}>
          {onPrev ? <Button title="Anterior" variant="outline" onPress={onPrev} style={styles.footerBtn} /> : null}
          {onNext ? (
            <Button
              title={nextLabel}
              variant={nextVariant}
              onPress={onNext}
              disabled={nextDisabled}
              style={styles.footerBtn}
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

export function StatusDot({ color, size = 14 }) {
  return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  button: {
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSm: {
    height: 36,
    borderRadius: 18,
    paddingHorizontal: 14,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
  },
  buttonTextSm: {
    fontSize: 15,
  },
  track: {
    backgroundColor: COLORS.borderLight,
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepText: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  footer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 18,
    paddingTop: 14,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  footerButtons: {
    flexDirection: 'row',
    marginTop: 12,
  },
  footerBtn: {
    flex: 1,
    marginHorizontal: 5,
  },
});
