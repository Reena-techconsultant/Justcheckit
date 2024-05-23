import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {useDispatch} from 'react-redux';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Button} from '../common/Button';
import {Fonts} from '../components/Fonts';
import AuthHeader from '../common/AuthHeader';
import {passwordResetOtp} from '../modules/forgotOtpSlice';
import {color} from '../components/color';
import axios from 'axios';
import { BASE_URL } from '../config/baseUrl';

const CELL_COUNT = 6;

const VerifyNumber = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFilled, setIsFilled] = useState(true);

  const handleChangeText = text => {
    setValue(text);

    setIsFilled(text.length !== CELL_COUNT);
  };
  const {emailId} = route.params;
  useEffect(() => {
    setLoading(false);
  }, []);

  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const handleResendOTP = async () => {
    Alert.alert('Your password email has been successfully resent');
    try {
      const res = await axios.post(`${BASE_URL}account/resend-otp/`, {
        email: emailId,
      });
     
    } catch (error) {
      console.log(error);
    }
  };
  const handleVerification = async () => {
    try {
      console.log(value, emailId, 'testing');
      const response = await dispatch(
        passwordResetOtp({otp: value, email: emailId}),
      );
      console.log(value, emailId, 'value Email');
      if (response.payload && response.payload.message) {
       Alert.alert('OTP verified successfully');
        console.log('OTP Message:', response.payload.message);
        navigation.navigate('ConfirmPassword', {
          otp: value,
          email: emailId,
        });
      } else {
        Alert.alert('Invalid OTP');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <ScrollView style={{flex: 1, backgroundColor: '#F5F5F5'}}>
        <AuthHeader />
        
        <View style={styles.header}>
          <View style={{flex: 1}}>
            <Text style={styles.number}>Verify your email </Text>
            <Text style={styles.text}>
               Please enter the verification code sent to your email address
            </Text>
          </View>
          <View style={{flex: 2}}>
            <View style={{marginTop: 15}}>
              <CodeField
                ref={ref}
                {...props}
                value={value}
                onChangeText={handleChangeText}
                cellCount={CELL_COUNT}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({index, symbol, isFocused}) => (
                  <Text
                    key={index}
                    style={[styles.cell, isFocused && styles.focusCell]}
                    onLayout={getCellOnLayoutHandler(index)}>
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                )}
              />
            </View>
            <View style={{}}>
              <Button
                loading={loading}
                onPress={handleVerification}
                styling={styles.verifybtn}
                text={'Next'}
                disable={loading}
              />
            </View>
            <View style={{marginVertical: 30,alignItems:'center'}} >
              <TouchableOpacity onPress={handleResendOTP}>
              <Text style={styles.resend}> Resend verification code?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </>     
  );
};

export default VerifyNumber;

const styles = StyleSheet.create({
  header: {
    flex: 1,

    padding: 25,
  },
  resend: {
    color: 'gray',
    textAlign: 'center',
    fontSize: 15,
 
  
    width:'60%',
    fontFamily: Fonts.DroidSans,
  },
  root: {
    flex: 1,
    padding: 20,
  },
  imgview: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 90,
  },
  num: {
    marginTop: 3,
    fontFamily: 'Poppins-Regular',
  },
  back: {
    color: 'black',
    marginLeft: 9,
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
  },
  img: {
    flexDirection: 'row',
    marginTop: '17%',
    alignItems: 'center',
  },
  text: {
    color: 'gray',
    fontSize: 14,
    fontFamily: Fonts.DroidSans,
    marginTop: 10,
  },
  verifybtn: {
    marginTop: '10%',
    color: '#fff',
  },
  number: {
    marginTop: 29,
    fontSize: 26,
    color: color.green,
    fontFamily: Fonts.DroidSansBold,
  },
  title: {
    textAlign: 'center',
    fontSize: 30,
  },
  codeFieldRoot: {
    marginTop: 20,
    color: 'gray',
  },
  cell: {
    width: 47,
    height: 47,
    borderRadius: 8,
    lineHeight: 38,
    paddingTop: 3,
    color: 'gray',
    fontSize: 24,
    borderWidth: 2,
    borderColor: '#00000030',
    textAlign: 'center',
  },
  focusCell: {
    borderColor: '#000',
  },
});

