import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import OnBoarding from '../screens/initialScreens/onBoarding/OnBoarding';
import LanguageSelection from '../screens/initialScreens/languageSelection/LanguageSelection';
import Login from '../screens/auth/login/Login';
import Register from '../screens/auth/register/Register';
import MainTabNavigator from './MainTabNavigator';
import ForgotPassword from '../screens/auth/forgotPassword/ForgotPassword';
import AppointmentDetail from '../screens/main/appointmentsScreen/AppointmentDetail';
import ProfileScreen from '../screens/main/profileScreen/ProfileScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator
      initialRouteName="OnBoarding"
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="OnBoarding" component={OnBoarding} />
      <Stack.Screen name="LanguageSelection" component={LanguageSelection} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="AppointmentDetail" component={AppointmentDetail} />
      <Stack.Screen name="Profile" component={ProfileScreen} />

    </Stack.Navigator>
  );
}

export default AppNavigator;
