
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import {
  getIntents,
  subscribeToIntents,
} from '../services/intent-store';
import type { TransactionIntent } from '../types/transaction';

export default function HistoryScreen() {
  const [intents, setIntents] = useState<TransactionIntent[]>([]);

  useFocusEffect(
    useCallback(() => {
      const refresh = () => setIntents(getIntents());

      refresh();
      const unsubscribe = subscribeToIntents(refresh);

      return unsubscribe;
    }, [])
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'executed':
        return '#55D1A5';
      case 'rejected':
      case 'expired':
        return '#FF7777';
      case 'pending_approval':
      case 'submitted':
        return '#E5AA4B';
      default:
        return '#55C8D5';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>‹ Back</Text>
        </Pressable>

        <Text style={styles.label}>YOUR ACTIVITY</Text>
        <Text style={styles.heading}>Transaction History</Text>
        <Text style={styles.subtitle}>
          Review your locally saved transaction intents.
        </Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>TOTAL LOCAL INTENTS</Text>
          <Text style={styles.summaryNumber}>{intents.length}</Text>
        </View>

        <Text style={styles.sectionTitle}>All Intents</Text>

        {intents.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No intents yet</Text>
            <Text style={styles.emptyText}>
              Your saved transaction drafts will appear here.
            </Text>

            <Pressable
              style={styles.button}
              onPress={() => router.push('/create-intent')}
            >
              <Text style={styles.buttonText}>Create First Intent</Text>
            </Pressable>
          </View>
        ) : (
          intents.map((intent) => (
            <Pressable
              key={intent.id}
              style={styles.intentCard}
              onPress={() =>
                router.push({
                  pathname: '/intent-review',
                  params: { id: intent.id },
                })
              }
            >
              <View style={styles.intentHeader}>
                <Text style={styles.token}>{intent.token}</Text>
                <Text
                  style={[
                    styles.status,
                    { color: getStatusColor(intent.status) },
                  ]}
                >
                  {intent.status.replace('_', ' ').toUpperCase()}
                </Text>
              </View>

              <Text style={styles.amount}>
                {intent.amount} {intent.token}
              </Text>

              <Text style={styles.recipientLabel}>RECIPIENT</Text>
              <Text style={styles.recipient} numberOfLines={1}>
                {intent.recipient}
              </Text>

              <Text style={styles.date}>
                Created: {new Date(intent.createdAt).toLocaleString()}
              </Text>

              <Text style={styles.viewDetails}>View Details →</Text>
            </Pressable>
          ))
        )}

        <Text style={styles.disclaimer}>
          History is stored in app memory for this session only.
          It is not a record of confirmed blockchain transactions.
        </Text>
      </ScrollView>
    </View>
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
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 8,
  },
  subtitle: {
    color: '#9BAABD',
    fontSize: 13,
    marginTop: 8,
    marginBottom: 25,
  },
  summaryCard: {
    backgroundColor: '#12253A',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#24516A',
  },
  summaryLabel: {
    color: '#9BAABD',
    fontSize: 11,
    letterSpacing: 1.5,
  },
  summaryNumber: {
    color: '#55D1DA',
    fontSize: 34,
    fontWeight: 'bold',
    marginTop: 10,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 15,
  },
  emptyCard: {
    backgroundColor: '#12253A',
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#9BAABD',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#35B9C8',
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#081321',
    fontWeight: 'bold',
  },
  intentCard: {
    backgroundColor: '#12253A',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#24516A',
  },
  intentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  token: {
    color: '#55D1DA',
    fontWeight: 'bold',
    fontSize: 14,
  },
  status: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  amount: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 15,
  },
  recipientLabel: {
    color: '#91A5B8',
    fontSize: 10,
    marginTop: 18,
    letterSpacing: 1,
  },
  recipient: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 7,
  },
  date: {
    color: '#91A5B8',
    fontSize: 11,
    marginTop: 15,
  },
  viewDetails: {
    color: '#55D1DA',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 15,
  },
  disclaimer: {
    color: '#718096',
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 35,
  },
});
