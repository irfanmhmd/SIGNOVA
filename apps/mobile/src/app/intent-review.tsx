
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

export default function IntentReviewScreen() {
  const { token, recipient, amount, expiry } =
    useLocalSearchParams<{
      token: string;
      recipient: string;
      amount: string;
      expiry: string;
    }>();

  return (
    <ScrollView style={styles.container}>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>‹ Back</Text>
      </Pressable>

      <Text style={styles.label}>TRANSACTION VERIFICATION</Text>
      <Text style={styles.heading}>Review Intent</Text>
      <Text style={styles.subtitle}>
        Verify every detail before requesting approval.
      </Text>

      <View style={styles.card}>
        <Text style={styles.smallLabel}>PAYMENT AMOUNT</Text>
        <Text style={styles.amount}>
          {amount || '0'} {token || 'USDC'}
        </Text>

        <View style={styles.divider} />

        <Text style={styles.smallLabel}>TOKEN</Text>
        <Text style={styles.value}>{token || 'USDC'}</Text>

        <Text style={styles.smallLabel}>RECIPIENT ADDRESS</Text>
        <Text selectable style={styles.address}>
          {recipient || 'Not provided'}
        </Text>

        <Text style={styles.smallLabel}>EXPIRY</Text>
        <Text style={styles.value}>{expiry || '24'} hours</Text>

        <View style={styles.warning}>
          <Text style={styles.warningTitle}>Security reminder</Text>
          <Text style={styles.warningText}>
            Check the recipient and amount carefully.
            This is a review preview only. No wallet signature
            or blockchain transaction has been submitted.
          </Text>
        </View>
      </View>

      <Pressable
        style={styles.button}
        onPress={() =>
          router.back()
        }
      >
        <Text style={styles.buttonText}>Back to Edit</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080F1E',
    padding: 20,
  },
  back: {
    color: '#55C8D5',
    fontSize: 16,
    marginTop: 15,
  },
  label: {
    color: '#55C8D5',
    fontSize: 11,
    letterSpacing: 2,
    marginTop: 35,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 8,
  },
  subtitle: {
    color: '#9BAABD',
    marginTop: 8,
    marginBottom: 25,
  },
  card: {
    backgroundColor: '#12253A',
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#24516A',
  },
  smallLabel: {
    color: '#91A5B8',
    fontSize: 11,
    letterSpacing: 1,
    marginTop: 20,
  },
  amount: {
    color: '#55D1DA',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 8,
  },
  address: {
    color: '#FFFFFF',
    fontSize: 13,
    marginTop: 8,
    lineHeight: 21,
  },
  divider: {
    height: 1,
    backgroundColor: '#294157',
    marginTop: 22,
  },
  warning: {
    backgroundColor: '#19384B',
    padding: 14,
    borderRadius: 10,
    marginTop: 25,
  },
  warningTitle: {
    color: '#55D1DA',
    fontWeight: 'bold',
  },
  warningText: {
    color: '#C0CCD8',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
  },
  button: {
    backgroundColor: '#35B9C8',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 35,
  },
  buttonText: {
    color: '#081321',
    fontWeight: 'bold',
  },
});
