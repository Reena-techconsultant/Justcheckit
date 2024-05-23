import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import InputText from '../common/InputText';
import {Button} from '../common/Button';
import {Fonts} from '../components/Fonts';
import AuthHeader from '../common/AuthHeader';
import {loginUser} from '../modules/loginSlice';
import {useDispatch} from 'react-redux';
import {PermissionsAndroid} from 'react-native';
import Contacts from 'react-native-contacts';
import {color} from '../components/color';
import {useFocusEffect} from '@react-navigation/native';
import {BASE_URL} from '../config/baseUrl';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({navigation}) => {
  console.disableLogBox = true;
  const [emailId, setEmailId] = useState('');
  const dispatch = useDispatch();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const users = [{username: emailId, password: password}];
  const emailInputRef = useRef(null);

  const focusEmailInput = () => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  };

  const checkAuthentication = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      navigation.reset({
        index: 0,
        routes: [{name: 'BottomTabNavigation'}],
      });
    }
  };
  useFocusEffect(
    useCallback(() => {
      setEmailId('');
      setPassword('');
      checkAuthentication();
    }, []),
  );

  useEffect(() => {
    checkAuthentication();
  }, []);


  const getPermission = () => {
    setLoading(true);
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: 'Contacts',
      message: 'This app would like to view your contacts.',
      buttonPositive: 'Please accept bare mortal',
    }).then(res => {
      if (res === 'granted') {
      
      }
    });
  };

  const loadContacts = () => {
    Contacts.getAll()
      .then(loadedContacts => {
        const contactss = loadedContacts.map(
          item => item?.phoneNumbers[0]?.number,
        );
        syncContacts(contactss);
      })
      .catch(error => {
        console.error('Error loading contacts:', error);
      });
  };

  const syncContacts = async cont => {
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await axios.post(
        `${BASE_URL}data/user-friends-already-registered/`,
        {phone_numbers: cont},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        },
      );

    } catch (error) {
      console.log(error, 'sync contanct api');
    }
  };

  const handleLogin = () => {
    if (emailId && password) {
      setLoading(true);
      dispatch(loginUser({username: emailId, password: password}))
        .then(response => {
          if (
            response.payload &&
            response.payload.token &&
            response.payload.user_id
          ) {
            getPermission();
            loadContacts();
            setLoading(false);
            navigation.reset({
              index: 0,
              routes: [{ name: 'BottomTabNavigation' }],
            });
          } else {
            setLoading(false);
            Alert.alert('Alert', 'Incorrect email or password');
          }
        })
        .catch(error => {
          console.error('Login error:', error);
          setLoading(false);

          Alert.alert('Alert', 'Login failed. Please try again.');
        });
    } else {
      setLoading(false);
      Alert.alert('Alert', 'Enter email and password');
    }
  };

  return (
    <>
      <StatusBar backgroundColor={'#F5F5F5'} barStyle={'dark-content'} />
    
                  <ScrollView style={{flex: 1}}>
          <AuthHeader />
          <View style={styles.containter}>
            <View style={{}}>
              <Text style={styles.text}>User Login </Text>
            </View>
            <View  onLayout={focusEmailInput}>
              <InputText
                placeholder={'Email Address / Mobile Number'}
                placeholderTextColor={'gray'}
                value={emailId}
                onChangeText={emailId => setEmailId(emailId)}
                onFocus={true}
              />
              <InputText
                placeholder={'Password'}
                placeholderTextColor={'gray'}
                value={password}
                secureTextEntry={true}
                onChangeText={password => setPassword(password)}
              />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Forget')}>
              <Text style={styles.forTxt}> Forgot Password? </Text>
            </TouchableOpacity>
            <View style={{marginTop: 24}}>
              <Button
                onPress={() => handleLogin()}
                loading={loading}
                text={'Login'}
                img={'arrowright'}
                disable={loading}
              />

              <View
               
                style={{
                  flex: 1,
                  height: 300,
                  alignItems: 'center',
                  marginTop: 19,
                }}>
                  <View>
                  
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={{color: 'black', fontFamily: Fonts.DroidSans}}>
                  New User?{' '}
                  <Text
                    style={{
                      color: color.green,
                      fontFamily: Fonts.DroidSansBold,
                      fontSize: 14,
                    }}>
                    Register
                  </Text>
                </Text>
                </TouchableOpacity>
                </View> 
              </View>
            </View>
          </View>
        </ScrollView>
   
    </>
  );
};

export default Login;
const styles = StyleSheet.create({
  containter: {
    flex: 1,
    paddingHorizontal: 20,
  },
  text: {
    marginTop: 30,
    color: color.green,
    fontSize: 29,
    fontFamily: Fonts.DroidSansBold,
  },
  img: {
    alignSelf: 'center',
    marginTop: 42,
    height: 140,
    width: 140,
    tintColor: color.green,
  },
  txt: {
    fontSize: 14,
    marginTop: 10,
    color: 'gray',
  },
  forTxt: {
    color: '#0C0C0C',
    fontSize: 15,
    marginTop: 22,
    fontFamily: Fonts.DroidSans,
    textAlign: 'center',
  },
  newTxt: {
    color: '#1C1C1C',
    fontSize: 16,
    textAlign: 'center',
  },
  regTxt: {
    color: color.green,
    fontSize: 18,
  },
  last: {
    borderTopColor: 'gray',
    borderTopWidth: 0.5,
    paddingVertical: 14,
    flex: 1,
    backgroundColor: 'red',
  },
});
