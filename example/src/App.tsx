import { View, StyleSheet } from 'react-native';
import PitchDetection from '@techoptio/react-native-live-pitch-detection';

PitchDetection.init();

export default function App() {
  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
