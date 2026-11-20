
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { saveIntent } from '../services/intent-store';
import type { TransactionIntent } from '../types/transaction';

function normalizeAddress(value: string): string {
  return value
    .normalize('NFKC')
    .replace(/[\u200B-\u200D\uFEFF\u00A0\s]/g, '')
    .replace(/[×Хх]/g, 'x');
}

function isValidAddress(value: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(value);
}

export default function CreateIntentScreen() {
  const [token] = useState('USDC');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [expiry, setExpiry] = useState('24');

  const handleContinue = () => {
    const cleanAddress = normalizeAddress(recipient);
    const cleanAmount = amount.trim();
    const cleanExpiry = expiry.trim();

    if (!cleanAddress || !cleanAmount) {
      Alert.alert('Missing details', 'Please enter recipient and amount.');
      return;
    }

    if (!isValidAddress(cleanAddress)) {
      Alert.alert(
        'Invalid address',
        `The address must start with 0x and contain exactly 40 hexadecimal characters after it. Current length: ${cleanAddress.startsWith('0x') ? cleanAddress.length - 2 : 'Invalid prefix'}.`,
      );
      return;
    }

    if (!/^\d+(\.\d+)?$/.test(cleanAmount) || Number(cleanAmount) <= 0) {
      Alert.alert('Invalid amount', 'Enter an amount greater than zero.');
      return;
    }

    if (!/^\d+$/.test(cleanExpiry) || Number(cleanExpiry) <= 0) {
      Alert.alert('Invalid expiry', 'Enter a valid number of hours.');
      return;
    }

    const now = new Date().toISOString();

    const intent: TransactionIntent = {
      id: `intent-${Date.now()}`,
      token,
      recipient: cleanAddress,
      amount: cleanAmount,
      expiryHours: Number(cleanExpiry),
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    };

    saveIntent(intent);

    router.push({
      pathname: '/intent-review',
      params: {
        id: intent.id,
        token: intent.token,
        recipient: intent.recipient,
        amount: intent.amount,
        expiry: String(intent.expiryHours),
      },
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>‹ Back to Dashboard</Text>
      </Pressable>

      <Text style={styles.label}>NEW TRANSACTION</Text>
      <Text style={styles.heading}>Create Intent</Text>
      <Text style={styles.subtitle}>
        Enter the payment details you want authorised.
      </Text>

      <View style={styles.card}>
        <Text style={styles.fieldLabel}>TOKEN</Text>
        <View style={styles.tokenBox}>
          <Text style={styles.tokenText}>{token}</Text>
        </View>

        <Text style={styles.fieldLabel}>RECIPIENT WALLET ADDRESS</Text>
        <TextInput
          style={styles.input}
          placeholder="0x..."
          placeholderTextColor="#718096"
          value={recipient}
          onChangeText={setRecipient}
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
        />

        <Text style={styles.fieldLabel}>AMOUNT (USDC)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          placeholderTextColor="#718096"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />

        <Text style={styles.fieldLabel}>EXPIRY (HOURS)</Text>
        <TextInput
          style={styles.input}
          placeholder="24"
          placeholderTextColor="#718096"
          keyboardType="number-pad"
          value={expiry}
          onChangeText={setExpiry}
        />

        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>Security notice</Text>
          <Text style={styles.noticeText}>
            Your transaction will be reviewed before any wallet signature
            or blockchain execution is requested.
          </Text>
        </View>

        <Pressable style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Review Transaction →</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080F1E',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  back: {
    color: '#55C8D5',
    fontSize: 15,
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
    fontSize: 13,
    marginTop: 8,
    marginBottom: 25,
  },
  card: {
    backgroundColor: '#12253A',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#24516A',
  },
  fieldLabel: {
    color: '#AAB8C9',
    fontSize: 11,
    letterSpacing: 1,
    marginTop: 20,
    marginBottom: 10,
  },
  tokenBox: {
    backgroundColor: '#1A3550',
    padding: 15,
    borderRadius: 10,
  },
  tokenText: {
    color: '#55D1DA',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#1A3550',
    borderRadius: 10,
    padding: 15,
    color: '#FFFFFF',
    fontSize: 14,
  },
  notice: {
    backgroundColor: '#19384B',
    padding: 14,
    borderRadius: 10,
    marginTop: 25,
  },
  noticeTitle: {
    color: '#55D1DA',
    fontWeight: 'bold',
    marginBottom: 7,
  },
  noticeText: {
    color: '#C0CCD8',
    fontSize: 12,
    lineHeight: 19,
  },
  button: {
    backgroundColor: '#35B9C8',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 25,
  },
  buttonText: {
    color: '#081321',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

