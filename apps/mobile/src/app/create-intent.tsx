
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

export default function CreateIntentScreen() {
  const [token, setToken] = useState('USDC');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [expiry, setExpiry] = useState('24');

  const handleContinue = () => {
    if (!recipient.trim() || !amount.trim()) {
      Alert.alert('Missing details', 'Please enter recipient and amount.');
      return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(recipient.trim())) {
      Alert.alert('Invalid address', 'Enter a valid Ethereum wallet address.');
      return;
    }

    if (!/^\d+(\.\d+)?$/.test(amount) || Number(amount) <= 0) {
      Alert.alert('Invalid amount', 'Enter an amount greater than zero.');
      return;
    }

    if (!/^\d+$/.test(expiry) || Number(expiry) <= 0) {
      Alert.alert('Invalid expiry', 'Enter a valid number of hours.');
      return;
    }

    router.push({
      pathname: '/intent-review',
      params: {
        token,
        recipient: recipient.trim(),
        amount,
        expiry,
      },
    });
  };

  return (
    <ScrollView style={styles.container}>
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
        />

        <Text style={styles.fieldLabel}>AMOUNT</Text>
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
    padding: 20,
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
