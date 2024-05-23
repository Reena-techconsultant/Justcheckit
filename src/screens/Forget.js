import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import {Button} from '../common/Button';
import InputText from '../common/InputText';
import {Fonts} from '../components/Fonts';
import AuthHeader from '../common/AuthHeader';
import {useSelector, useDispatch} from 'react-redux';
import {forgot} from '../modules/forgotSlice';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {color} from '../components/color';
import { KeyboardAvoidingView } from 'react-native';

const ForgotPassword = ({}) => {
  useFocusEffect(
    React.useCallback(() => {
      // Fetch data here
      setLoading(false);
    }, []),
  );

  useEffect(() => {
    setLoading(false);
  }, []);
  const [emailId, setEmailId] = useState('');
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const isEmailValid = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const userForgotApiCall = () => {
    if (!isEmailValid(emailId)) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }

    let data = {
      email: emailId,
    };

    setLoading(true);
    dispatch(forgot(data))
      .then(response => {
        if (response.payload && response.payload.message) {
          //Alert.alert('');
          setLoading(false);
          navigation.navigate('VerifyNumber', {emailId: emailId});
        } else {
          setLoading(false);
          Alert.alert('User not found.');
        }
      })
      .catch(error => {
        setLoading(false);
        console.error('Error:', error);
        Alert.alert('Error', 'Something went wrong. Please try again later.');
      });
  };

  return (
    <>
     
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <KeyboardAvoidingView
        style={{flex: 1, backgroundColor: '#F5F5F5'}}
        behavior={Platform.OS === 'ios' ? 'padding' : null}>
                  <ScrollView style={{flex: 1, backgroundColor: '#F5F5F5'}}>

      <AuthHeader />
      <View style={styles.containter}>
        <View>
          <Text style={styles.text}>Forgot Password</Text>
        
        </View>
        <View style={{marginTop: 18}}>
          <InputText
            placeholder={'Email Address'}
            placeholderTextColor={'gray'}
            value={emailId}
            onChangeText={emailId => setEmailId(emailId)}
          />
          <View style={{marginTop: 42}}>
            <Button
              loading={loading}
              onPress={() => userForgotApiCall()}
              styling={styles.logbtn}
              text={'Submit'}></Button>
          </View>
        </View>
      </View>
      </ScrollView>
</KeyboardAvoidingView>
    </>
  );
};
export default ForgotPassword;

const styles = StyleSheet.create({
  containter: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5'
  },
  text: {
    color: color.green,
    marginTop: 30,
    fontSize: 29,
    fontFamily: Fonts.DroidSansBold,
  },
  txt: {
    color: 'gray',
    fontSize: 14,
    marginTop: 10,
    fontFamily: Fonts.DroidSans,
  },
  imgview: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 90,
  },
});
