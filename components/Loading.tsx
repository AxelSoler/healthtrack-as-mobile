import { View, ActivityIndicator, StyleSheet, Image, useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

export default function Loading() {
  const colorScheme = useColorScheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: Colors[colorScheme === 'dark' ? 'dark' : 'light'].background,
        },
      ]}
    >
      <Image
        source={require('@/assets/images/icon.png')}
        style={styles.logo}
      />
      <ActivityIndicator
        size="large"
        color={Colors[colorScheme === 'dark' ? 'dark' : 'light'].tint}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
});
