
import React, { useCallback, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  Pressable,
} from 'react-native';
import {
  getIntents,
  subscribeToIntents,
} from '../../services/intent-store';
import type { TransactionIntent } from '../../types/transaction';

export default function HomeScreen() {
  const [intents, setIntents] = useState<TransactionIntent[]>([]);

  useFocusEffect(
    useCallback(() => {
      const refresh = () => setIntents(getIntents());
      refresh();
      return subscribeToIntents(refresh);
    }, [])
  );

  const count = (statuses: string[]) =>
    intents.filter((item) => statuses.includes(item.status)).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>SIGNOVA</Text>
            <Text style={styles.tagline}>TRANSACTION TRUTH ENGINE</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>P</Text>
          </View>
        </View>

        <View style={styles.welcome}>
          <Text style={styles.muted}>WELCOME BACK</Text>
          <Text style={styles.heading}>Your Treasury</Text>
          <Text style={styles.description}>
            Secure. Transparent. Verified.
          </Text>
        </View>

        <View style={styles.walletCard}>
          <Text style={styles.cardLabel}>WALLET STATUS</Text>
          <View style={styles.statusRow}>
            <View style={styles.dot} />
            <Text style={styles.statusText}>Not Connected</Text>
          </View>
          <Text style={styles.walletHint}>
            Wallet integration is not available yet. No wallet is connected.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Overview</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {count(['submitted', 'pending_approval'])}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{count(['approved'])}</Text>
            <Text style={styles.statLabel}>Approved</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{count(['executed'])}</Text>
            <Text style={styles.statLabel}>Executed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{count(['draft'])}</Text>
            <Text style={styles.statLabel}>Local Drafts</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <ActionCard
          icon="+"
          title="Create Intent"
          description="Start a secure payment request"
          onPress={() => router.push('/create-intent')}
        />

        <ActionCard
          icon="↗"
          title="Transaction History"
          description="View locally saved transaction intents"
          onPress={() => router.push('/history')}
        />

        <ActionCard
          icon="✓"
          title="Approval Room"
          description="View intents awaiting authorisation"
          onPress={() => router.push('/approvals')}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            SIGNOVA • SECURE TRANSACTION MANAGEMENT
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function ActionCard({
  icon,
  title,
  description,
  onPress,
}: {
  icon: string;
  title: string;
  description: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.actionCard} onPress={onPress}>
      <View style={styles.actionIcon}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>
      <View style={styles.actionInfo}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionDescription}>{description}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080F1E',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 22,
  },
  logo: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '900',
    letterSpacing: 3,
  },
  tagline: {
    color: '#55C8D5',
    fontSize: 9,
    letterSpacing: 2,
    marginTop: 5,
  },
  avatar: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: '#183B52',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  welcome: {
    marginTop: 38,
    marginBottom: 22,
  },
  muted: {
    color: '#55C8D5',
    fontSize: 11,
    letterSpacing: 2,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 8,
  },
  description: {
    color: '#9BAABD',
    fontSize: 14,
    marginTop: 7,
  },
  walletCard: {
    backgroundColor: '#12253A',
    borderColor: '#24516A',
    borderWidth: 1,
    borderRadius: 18,
    padding: 20,
  },
  cardLabel: {
    color: '#9BAABD',
    fontSize: 11,
    letterSpacing: 1.5,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#E5AA4B',
    marginRight: 9,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  walletHint: {
    color: '#9BAABD',
    fontSize: 12,
    marginTop: 12,
    lineHeight: 19,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#142237',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#23364B',
  },
  statNumber: {
    color: '#55D1DA',
    fontSize: 27,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#AAB8C9',
    fontSize: 12,
    marginTop: 7,
  },
  actionCard: {
    backgroundColor: '#142237',
    borderRadius: 14,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#21465A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: '#55D1DA',
    fontSize: 24,
    fontWeight: 'bold',
  },
  actionInfo: {
    flex: 1,
    marginLeft: 13,
  },
  actionTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  actionDescription: {
    color: '#91A1B4',
    fontSize: 11,
    marginTop: 5,
  },
  arrow: {
    color: '#55D1DA',
    fontSize: 27,
  },
  footer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  footerText: {
    color: '#64758A',
    fontSize: 9,
    letterSpacing: 1,
  },
});
