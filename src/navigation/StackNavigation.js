import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import BottomTabNavigation from './BottomTabNavigation';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Forget from '../screens/Forget';
import VerifyNumber from '../screens/VerifyNumber';
import Onboarding from '../screens/Onboarding';
import ConfirmPassword from '../screens/ConfirmPassword';
import VerifyEmail from '../screens/VerifyEmail';
import Splash from '../screens/Splash';
import {color} from '../components/color';

const Stack = createStackNavigator();
const StackNavigation = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <Splash />;
  } else {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: {backgroundColor: '#fff'},
        }}
        >
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Onboarding"  options={{ gestureEnabled: false, }}  component={Onboarding} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Forget" component={Forget} />
        <Stack.Screen name="VerifyNumber" component={VerifyNumber} />
        <Stack.Screen
          name="BottomTabNavigation"
          component={BottomTabNavigation}
        />
        <Stack.Screen name="ConfirmPassword" component={ConfirmPassword} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
      </Stack.Navigator>
    );
  }
};

const App = () => {
  return (
    <NavigationContainer theme={{colors: {background: color.green}}}>
      <StackNavigation />
    </NavigationContainer>
  );
};
export default App;
