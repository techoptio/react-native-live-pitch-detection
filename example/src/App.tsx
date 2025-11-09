import { View, StyleSheet, Button, Alert, Platform } from 'react-native';
import PitchDetection from '@techoptio/react-native-live-pitch-detection';
import { useState } from 'react';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

PitchDetection.init();

export default function App() {
  const [isListening, setIsListening] = useState(false);

  const requestMicrophonePermission = async () => {
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
  };

  const handleStartListening = async () => {
    const hasPermission = await requestMicrophonePermission();
    if (hasPermission) {
      PitchDetection.startListening()
        .then(() => setIsListening(true))
        .catch((error) => console.error(error));
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title={isListening ? 'Stop Listening' : 'Start Listening'}
        onPress={() => {
          if (isListening) {
            PitchDetection.stopListening()
              .then(() => setIsListening(false))
              .catch((error) => console.error(error));
          } else {
            handleStartListening();
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
