
import { router } from 'expo-router';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  Pressable,
} from 'react-native';

export default function HomeScreen() {
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
            Connect your wallet to manage transaction approvals.
          </Text>
          <Pressable
            style={styles.connectButton}
            onPress={() => alert('Wallet integration coming soon')}
          >
            <Text style={styles.connectText}>Connect Wallet</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Overview</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>00</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>00</Text>
            <Text style={styles.statLabel}>Approved</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>00</Text>
            <Text style={styles.statLabel}>Executed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>00</Text>
            <Text style={styles.statLabel}>Flagged</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <Pressable
          style={styles.actionCard}
          onPress={() => router.push('/create-intent')}
        >
          <View style={styles.actionIcon}>
            <Text style={styles.iconText}>+</Text>
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Create Intent</Text>
            <Text style={styles.actionDescription}>
              Start a secure payment request
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </Pressable>

        <Pressable
          style={styles.actionCard}
          onPress={() => alert('Approval Room coming soon')}
        >
          <View style={styles.actionIcon}>
            <Text style={styles.iconText}>✓</Text>
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Approvals</Text>
            <Text style={styles.actionDescription}>
              Review transaction approvals
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </Pressable>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            SIGNOVA • SECURE TRANSACTION MANAGEMENT
          </Text>
        </View>
      </ScrollView>
    </View>
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
  connectButton: {
    backgroundColor: '#35B9C8',
    borderRadius: 10,
    padding: 13,
    alignItems: 'center',
    marginTop: 18,
  },
  connectText: {
    color: '#081321',
    fontWeight: 'bold',
    fontSize: 14,
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
