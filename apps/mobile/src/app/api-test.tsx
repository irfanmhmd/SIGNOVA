
import { useState } from 'react';
import { Alert, StyleSheet, Text, View, Pressable } from 'react-native';
import { checkApiHealth, HealthResponse } from '../services/api';

export default function ApiTestScreen() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('Not tested yet');

  async function testConnection() {
    setLoading(true);
    setResult('Connecting to SIGNOVA backend...');

    try {
      const data: HealthResponse = await checkApiHealth();

      setResult(
        `Status: ${data.status}\nService: ${data.service}\nVersion: ${data.version}`,
      );
      Alert.alert('Connected', 'SIGNOVA backend is reachable!');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Connection failed';

      setResult(message);
      Alert.alert('Connection failed', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SIGNOVA API TEST</Text>
      <Text style={styles.description}>
        Check communication between the Android app and SIGNOVA backend.
      </Text>

      <Pressable
        style={styles.button}
        onPress={testConnection}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'CONNECTING...' : 'TEST BACKEND CONNECTION'}
        </Text>
      </Pressable>

      <Text style={styles.result}>{result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#071426',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    color: '#38D9F5',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    color: '#AABBCD',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#13B8D5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#071426',
    fontWeight: 'bold',
  },
  result: {
    color: '#FFFFFF',
    marginTop: 24,
    lineHeight: 24,
  },
});
