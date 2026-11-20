
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { getIntentById } from '../services/intent-store';
import { explainRisk, RiskExplanation } from '../services/api';

export default function IntentReviewScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();

  const intentId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const intent = intentId ? getIntentById(intentId) : undefined;

  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] =
    useState<RiskExplanation | null>(null);

  async function loadExampleRisk() {
    setLoading(true);
    setExplanation(null);

    try {
      const result = await explainRisk('UNLIMITED_APPROVAL');
      setExplanation(result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Request failed';

      Alert.alert('Risk service error', message);
    } finally {
      setLoading(false);
    }
  }

  if (!intent) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Intent not found</Text>
        <Text style={styles.subtitle}>
          This draft may be unavailable. Create a new intent to continue.
        </Text>
        <Pressable
          style={styles.button}
          onPress={() => router.replace('/create-intent')}
        >
          <Text style={styles.buttonText}>Create Intent</Text>
        </Pressable>
      </View>
    );
  }

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
          {intent.amount} {intent.token}
        </Text>

        <View style={styles.divider} />

        <Text style={styles.smallLabel}>TOKEN</Text>
        <Text style={styles.value}>{intent.token}</Text>

        <Text style={styles.smallLabel}>RECIPIENT ADDRESS</Text>
        <Text selectable style={styles.address}>
          {intent.recipient}
        </Text>

        <Text style={styles.smallLabel}>EXPIRY</Text>
        <Text style={styles.value}>
          {intent.expiryHours} hours
        </Text>

        <Text style={styles.smallLabel}>INTENT STATUS</Text>
        <Text style={styles.status}>DRAFT — NOT SUBMITTED</Text>
      </View>

      <View style={styles.warning}>
        <Text style={styles.warningTitle}>
          Security inspection not performed
        </Text>
        <Text style={styles.warningText}>
          The backend currently provides risk explanations,
          but does not yet provide an endpoint to inspect
          this transaction intent. No security decision
          has been made about this transaction.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Backend Risk Explanation
        </Text>

        <Text style={styles.subtitle}>
          Test the explanation service using an example
          unlimited-approval risk code. This is not a finding
          detected in your transaction.
        </Text>

        <Pressable
          style={[styles.button, loading && styles.disabled]}
          onPress={loadExampleRisk}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#081321" />
          ) : (
            <Text style={styles.buttonText}>
              LOAD EXAMPLE RISK EXPLANATION
            </Text>
          )}
        </Pressable>

        {explanation && (
          <View style={styles.explanation}>
            <Text style={styles.smallLabel}>EXAMPLE RISK CODE</Text>
            <Text style={styles.value}>
              {explanation.riskCode}
            </Text>

            <Text style={styles.smallLabel}>SEVERITY</Text>
            <Text style={styles.severity}>
              {explanation.severity.toUpperCase()}
            </Text>

            <Text style={styles.smallLabel}>RISK TITLE</Text>
            <Text style={styles.value}>
              {explanation.title}
            </Text>

            <Text style={styles.smallLabel}>EXPLANATION</Text>
            <Text style={styles.bodyText}>
              {explanation.explanation}
            </Text>

            <Text style={styles.smallLabel}>
              RECOMMENDED ACTION
            </Text>
            <Text style={styles.bodyText}>
              {explanation.recommendedAction}
            </Text>

            <Text style={styles.smallLabel}>SOURCE</Text>
            <Text style={styles.value}>
              {explanation.source}
            </Text>

            <Text style={styles.disclaimer}>
              Example only — this risk has not been detected
              in the transaction being reviewed.
            </Text>
          </View>
        )}
      </View>

      <Pressable
        style={styles.secondaryButton}
        onPress={() => router.back()}
      >
        <Text style={styles.secondaryButtonText}>Back to Edit</Text>
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
    marginBottom: 20,
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#12253A',
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#24516A',
    marginBottom: 18,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: 'bold',
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
    fontSize: 15,
    marginTop: 8,
  },
  address: {
    color: '#FFFFFF',
    fontSize: 13,
    marginTop: 8,
    lineHeight: 21,
  },
  status: {
    color: '#55D1DA',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#294157',
    marginTop: 22,
  },
  warning: {
    backgroundColor: '#49331C',
    padding: 16,
    borderRadius: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#9A7136',
  },
  warningTitle: {
    color: '#FFD27A',
    fontWeight: 'bold',
    fontSize: 15,
  },
  warningText: {
    color: '#E6D6B9',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
  },
  button: {
    backgroundColor: '#35B9C8',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  disabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#081321',
    fontWeight: 'bold',
    fontSize: 12,
  },
  explanation: {
    marginTop: 15,
    padding: 14,
    backgroundColor: '#19384B',
    borderRadius: 10,
  },
  severity: {
    color: '#FFB86B',
    fontWeight: 'bold',
    marginTop: 8,
  },
  bodyText: {
    color: '#D2DFEA',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },
  disclaimer: {
    color: '#FFD27A',
    fontSize: 11,
    marginTop: 18,
    lineHeight: 17,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#35B9C8',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 35,
  },
  secondaryButtonText: {
    color: '#55D1DA',
    fontWeight: 'bold',
  },
});
