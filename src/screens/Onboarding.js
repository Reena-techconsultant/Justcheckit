import React, { useEffect } from 'react';
import {
  Text,
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  StatusBar,
  Platform,
  Dimensions,
} from 'react-native';
import { Button } from '../common/Button';
import Images from '../components/Images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const Onboarding = ({ navigation }) => {
  const { width, height } = Dimensions.get('window');
  const isAndroid = Platform.OS === 'android';
  const checkAuthentication = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'BottomTabNavigation' }],
      });
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);
  return (
    <>
      <StatusBar backgroundColor={'#F5F5F5'} barStyle={'dark-content'} />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
        <View style={styles.top}>
          <Image source={Images.web} style={{
           
            width: isAndroid ? responsiveWidth(50) : responsiveWidth(54),
            height: isAndroid ? responsiveHeight(25) : responsiveHeight(26),
          }} />
        </View>

        <View style={styles.end}>
          <Button text={'Login'} onPress={() => navigation.navigate('Login')} />
          <Button
            styling={styles.resbtn}
            text={'Register'}
            textstyle={styles.restext}
            onPress={() => navigation.navigate('Register')}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  containter: {
    flex: 1,
  },

  btntext: {
    color: 'black',
  },
  resbtn: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#4cab28',
    marginTop: 21,
  },
  top: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  end: {
    flex: 0.2,
    paddingBottom: 30,
    paddingStart: 24,
    paddingEnd: 15,
  },
  restext: {
    fontSize: 18,
    color: '#4cab28',
  },
});
export default Onboarding;
