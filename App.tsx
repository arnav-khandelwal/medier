import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { LanguageProvider } from './src/utils/translations/LanguageContext';
import Toast from 'react-native-toast-message';
import { colors } from './src/theme/colors';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={{ backgroundColor: colors.primary, flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <LanguageProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
        <Toast />
      </LanguageProvider>
    </SafeAreaView>
  );
}

export default App;
