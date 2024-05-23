import React, {useRef, useEffect} from 'react';
import {StyleSheet, Animated, Easing, Dimensions} from 'react-native';
import Images from '../components/Images';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";
export default function Splash() {
  const { width, height } = Dimensions.get('window');
  const isAndroid = Platform.OS === 'android';
  const checkAuthentication = async () => {
    const token = await AsyncStorage.getItem('token');
  
    if (token) {
      navigation.reset({
        index: 0,
        routes: [{name: 'BottomTabNavigation'}],
      });
    } else {
      const timer = setTimeout(() => {
        navigation.navigate('Onboarding');
      }, 1000);
      return () => clearTimeout(timer);
    }
  };

  const navigation = useNavigation();
  useEffect(() => {

    checkAuthentication();
  }, []);

  const backgroundFade = useRef(new Animated.Value(0)).current;
  const logoFade = useRef(new Animated.Value(0)).current;
  const logoMovement = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(backgroundFade, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
    Animated.timing(logoFade, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      Animated.timing(logoMovement, {
        toValue: -250,
        duration: 2000,
        easing: Easing.inOut(Easing.exp),
        useNativeDriver: true,
      }).start();
    }, 2250);
  }, [backgroundFade, logoFade, logoMovement]); 
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ffffff',
      opacity: backgroundFade,
    },
    logo: {
      color: 'white',
      fontSize: 48,
      fontWeight: 'bold',
      opacity: logoFade,
      transform: [{translateY: logoMovement}],
    },
    
    animatedImage: {
      width: isAndroid ? responsiveWidth(40) : responsiveWidth(44),
      height: isAndroid ? responsiveHeight(20) : responsiveHeight(21),
   
      opacity: logoFade,
      transform: [{translateY: logoMovement}],
    },
  });
  return (
    <Animated.View style={styles.container}>
      <Animated.Image
        source={Images.web} 
      style={styles.animatedImage}
      />
    </Animated.View>
  );
}
