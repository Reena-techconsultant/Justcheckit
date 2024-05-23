import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import InputText from '../common/InputText';
import {Button} from '../common/Button';
import {Fonts} from '../components/Fonts';
import AuthHeader from '../common/AuthHeader';
import {useDispatch} from 'react-redux';
import {confirmSlice} from '../modules/confirmPassword';
import {useNavigation, useRoute} from '@react-navigation/native';
import {color} from '../components/color';
import { KeyboardAvoidingView } from 'react-native';

const ConfirmPassword = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const {otp, email} = route.params;

  const userResetPassword = () => {
    if (!newPassword.trim()) {
      Alert.alert('Please fill in the new password');
      return;
    }
    if (!confirmPassword.trim()) {
      Alert.alert('Please fill in the confirm password');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('New password and confirm password do not match');
      return;
    }
    setLoading(true);
    dispatch(
      confirmSlice({
        otp: otp,
        email: email,
        new_password: newPassword,
        confirm_new_password: confirmPassword,
      }),
    )
      .then(response => {
        setLoading(false);

        if (response.payload && response.payload.message) {
          Alert.alert('Password changed successfully');
          navigation.navigate('Login');
        } else {
          console.log('Unexpected response:', response);
        }
      })
      .catch(error => {
        setLoading(false);
        console.error('Error:', error);
      });
  };

  return (
    <KeyboardAvoidingView
    style={{flex: 1, backgroundColor: '#F5F5F5'}}
    behavior={Platform.OS === 'ios' ? 'padding' : null}>
    <ScrollView
      style={{flex: 1, backgroundColor: '#F5F5F5', }}>
      <AuthHeader />
<View style={{paddingHorizontal:20}}>
      <Text style={styles.text}>Set Your Password </Text>

      <Text
        style={{
          fontSize: 16,
          color: 'black',
          fontFamily: Fonts.DroidSans,
          marginTop: 25,
        }}>
        New Password
      </Text>
      <InputText
        placeholder={'New Password'}
        placeholderTextColor={'gray'}
        inputstying={{marginTop: 10}}
        value={newPassword}
        onChangeText={firstName => setNewPassword(firstName)}
      />
      <Text
        style={{
          fontSize: 16,
          color: 'black',
          marginTop: 25,
          fontFamily: Fonts.DroidSans,
        }}>
        Confirm Password
      </Text>
      <InputText
        placeholder={'Confirm Password'}
        placeholderTextColor={'gray'}
        inputstying={{marginTop: 10}}
        value={confirmPassword}
        onChangeText={first => setConfirmPassword(first)}
      />
      <View style={{marginVertical: 40}}>
        <Button
          onPress={() => userResetPassword()}
          loading={loading}
          styling={styles.logbtn}
          text={'Continue'}></Button>
      </View>
      </View>
    </ScrollView>
    
    </KeyboardAvoidingView>
    
  );
};

export default ConfirmPassword;

const styles = StyleSheet.create({
  imgview: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 90,
  },
  text: {
    marginTop: 30,
    color: color.green,
    fontSize: 29,
    fontFamily: Fonts.DroidSansBold,
  },
});
