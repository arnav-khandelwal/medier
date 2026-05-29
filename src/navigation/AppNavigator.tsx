import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import OnBoarding from '../screens/OnBoarding';
import LanguageSelection from '../screens/LanguageSelection';

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator
      initialRouteName="OnBoarding"
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="OnBoarding" component={OnBoarding} />
      <Stack.Screen name="LanguageSelection" component={LanguageSelection} />
    </Stack.Navigator>
  );
}

export default AppNavigator;
