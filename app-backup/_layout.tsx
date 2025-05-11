import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <PaperProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="index" options={{ title: 'Inventory Management' }} />
          <Stack.Screen name="stock" options={{ title: 'Stock Items' }} />
          <Stack.Screen name="sales" options={{ title: 'Sales History' }} />
          <Stack.Screen
            name="add-item"
            options={{
              title: 'Add New Item',
              headerTitleStyle: { fontWeight: '600' },
            }}
          />
          <Stack.Screen
            name="item/[id]"
            options={{
              title: 'Item Details',
              headerTitleStyle: { fontWeight: '600' },
            }}
          />
          <Stack.Screen
            name="sell/[id]"
            options={{
              title: 'Sell Item',
              headerTitleStyle: { fontWeight: '600' },
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </PaperProvider>
    </ThemeProvider>
  );
}
