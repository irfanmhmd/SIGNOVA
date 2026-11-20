
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

export default function ApprovalsScreen() {
  const [intents, setIntents] = useState<TransactionIntent[]>([]);

  useFocusEffect(
    useCallback(() => {
      const refresh = () => setIntents(getIntents());

      refresh();
      const unsubscribe = subscribeToIntents(refresh);

      return unsubscribe;
    }, [])
  );

  const pendingIntents = intents.filter(
    (intent) =>
      intent.status === 'pending_approval' ||
      intent.status === 'submitted'
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>‹ Back</Text>
        </Pressable>

        <Text style={styles.label}>SECURE AUTHORISATION</Text>
        <Text style={styles.heading}>Approval Room</Text>
        <Text style={styles.subtitle}>
          Review transaction intents awaiting authorisation.
        </Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>AWAITING APPROVAL</Text>
          <Text style={styles.summaryNumber}>
            {pendingIntents.length}
          </Text>
          <Text style={styles.summaryHint}>
            Locally recorded pending intents
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Pending Requests</Text>

        {pendingIntents.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No pending approvals</Text>
            <Text style={styles.emptyText}>
              There are currently no intents marked as submitted
              or pending approval.
            </Text>
          </View>
        ) : (
          pendingIntents.map((intent) => (
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
              <View style={styles.row}>
                <Text style={styles.token}>{intent.token}</Text>
                <Text style={styles.pending}>PENDING</Text>
              </View>

              <Text style={styles.amount}>
                {intent.amount} {intent.token}
              </Text>

              <Text style={styles.smallLabel}>RECIPIENT</Text>
              <Text style={styles.address} numberOfLines={1}>
                {intent.recipient}
              </Text>

              <Text style={styles.details}>Review Intent →</Text>
            </Pressable>
          ))
        )}

        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>Authorisation protection</Text>
          <Text style={styles.noticeText}>
            This screen is currently read-only. No approval,
            rejection, wallet signature, or blockchain execution
            is performed here. Multisig authorisation will be
            connected when the backend and smart contracts are ready.
          </Text>
        </View>

        <Pressable
          style={styles.createButton}
          onPress={() => router.push('/create-intent')}
        >
          <Text style={styles.createButtonText}>+ Create Intent</Text>
        </Pressable>
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
  summaryCard: {
    backgroundColor: '#12253A',
    borderRadius: 16,
    padding: 20,
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
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 10,
  },
  summaryHint: {
    color: '#91A5B8',
    fontSize: 11,
    marginTop: 5,
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
    fontSize: 17,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#9BAABD',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 10,
  },
  intentCard: {
    backgroundColor: '#12253A',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#24516A',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  token: {
    color: '#55D1DA',
    fontWeight: 'bold',
  },
  pending: {
    color: '#E5AA4B',
    fontSize: 11,
    fontWeight: 'bold',
  },
  amount: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 15,
  },
  smallLabel: {
    color: '#91A5B8',
    fontSize: 10,
    marginTop: 18,
  },
  address: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 7,
  },
  details: {
    color: '#55D1DA',
    fontWeight: 'bold',
    marginTop: 16,
  },
  notice: {
    backgroundColor: '#19384B',
    borderRadius: 12,
    padding: 16,
    marginTop: 25,
  },
  noticeTitle: {
    color: '#55D1DA',
    fontWeight: 'bold',
  },
  noticeText: {
    color: '#C0CCD8',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
  },
  createButton: {
    backgroundColor: '#35B9C8',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 35,
  },
  createButtonText: {
    color: '#081321',
    fontWeight: 'bold',
  },
});
