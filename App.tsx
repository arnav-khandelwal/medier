import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { LanguageProvider } from './src/utils/translations/LanguageContext';
import Toast from 'react-native-toast-message';

function App(): React.JSX.Element {
  return (
    <LanguageProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
      <Toast />
    </LanguageProvider>
  );
}

export default App;
