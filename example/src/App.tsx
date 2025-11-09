import {
  View,
  StyleSheet,
  Button,
  Alert,
  Platform,
  type EventSubscription,
  Text,
} from 'react-native';
import PitchDetection from '@techoptio/react-native-live-pitch-detection';
import { useState, useCallback, useRef } from 'react';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export default function App() {
  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState('-');
  const [frequency, setFrequency] = useState(-1);

  const listenerRef = useRef<EventSubscription | null>(null);

  const requestMicrophonePermission = useCallback(async () => {
    try {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.MICROPHONE
          : PERMISSIONS.ANDROID.RECORD_AUDIO;

      const result = await request(permission);

      if (result === RESULTS.GRANTED) {
        return true;
      } else {
        Alert.alert(
          'Microphone Permission Required',
          'This app needs microphone access to detect pitch. Please enable it in your device settings.',
          [{ text: 'OK' }]
        );
        return false;
      }
    } catch (error) {
      console.error('Error requesting microphone permission:', error);
      Alert.alert(
        'Permission Error',
        'Failed to request microphone permission.',
        [{ text: 'OK' }]
      );
      return false;
    }
  }, []);

  const handleStartListening = useCallback(async () => {
    const hasPermission = await requestMicrophonePermission();
    if (hasPermission) {
      PitchDetection.startListening()
        .then(() => {
          setIsListening(true);

          listenerRef.current = PitchDetection.addListener((event) => {
            setNote(event.note);
            setFrequency(event.frequency);
          });
        })
        .catch((error) => console.error(error));
    }
  }, [requestMicrophonePermission]);

  return (
    <View style={styles.container}>
      <Button
        title={isListening ? 'Stop Listening' : 'Start Listening'}
        onPress={() => {
          if (isListening) {
            PitchDetection.stopListening()
              .then(() => {
                setIsListening(false);
                listenerRef.current?.remove();
                listenerRef.current = null;
              })
              .catch((error) => console.error(error));
          } else {
            handleStartListening();
          }
        }}
      />
      {
        isListening && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Note: {note}</Text>
            <Text style={styles.infoText}>Frequency: {frequency}</Text>
          </View>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    marginTop: 20,
  },
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});