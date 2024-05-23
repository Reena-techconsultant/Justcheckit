import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import InputText from '../common/InputText';
import { Button } from '../common/Button';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ScrollView } from 'react-native';
import { Fonts } from '../components/Fonts';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { color } from '../components/color';
import { createUser } from '../modules/registerSlice';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../config/baseUrl';
import CheckBox from '@react-native-community/checkbox';
import Contacts from 'react-native-contacts';
import Images from '../components/Images';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";
const data = [
  { label: 'Male', value: '1' },
  { label: 'Female', value: '2' },
  { label: 'Other', value: '4' },
];
const Register = () => {
  useEffect(() => {
    setLoading(false);
  }, []);

  const navigation = useNavigation();
  const [value, setValue] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [mydate, setDate] = useState(new Date());
  const [displaymode, setMode] = useState('date');
  const [isDisplayDate, setShowDate] = useState(false);
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [totalFriends, setTotalFriends] = useState('');
  const [Zipcode, setZipcode] = useState('');
  const [formattedDate, setFormattedDate] = useState('');
  useFocusEffect(
    React.useCallback(() => {
      getPermission();
    }, []),
  );

  // would you like to join this mission?

  const [toggleCheckBox, setToggleCheckBox] = useState(false)
  useEffect(() => {
    getPermission();
    loadContacts();
  }, []);

  const handlePress = () => {
    Linking.openURL(
      'https://www.privacypolicies.com/live/191a4aba-4d32-4ca9-9a18-c438fb64e0de',
    );
  };
  const getPermission = () => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: 'Contacts',
      message: 'This app would like to view your contacts.',
      buttonPositive: 'Please accept bare mortal',
    }).then(res => {
      if (res === 'granted') {
        console.log(res);
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
    try {
      const res = await axios.post(
        `${BASE_URL}data/total-user-friends-already-registered/`,

        { phone_numbers: cont },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      setTotalFriends(res?.data.data.total_friends);
    } catch (error) {
      console.log(error);
    }
  };

  const validateEmail = email => {
    const emailPattern = new RegExp(
      '^(?!.*\\.[^\\.]*\\.[^\\.]*\\.[^\\.]*\\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    );
    return emailPattern.test(email);
  };

  const validatePhoneNumber = phoneNumber => {
    const phonePattern = /^\d{10}$/;
    return phonePattern.test(phoneNumber);
  };

  const userRegisterApiCall = () => {
    if (!firstName) {
      Alert.alert('Please fill in first name');
      return;
    }
    if (!lastName) {
      Alert.alert('Please fill in last name');
      return;
    }

    if (!Zipcode) {
      Alert.alert('Please fill zipcode');
      return;
    }

    if (!phone) {
      Alert.alert('Please fill in phone number');
      return;
    }
    if (!emailId) {
      Alert.alert('Please fill in email');
      return;
    }

    if (!password) {
      Alert.alert('Please fill in password');
      return;
    }

    if (!validateEmail(emailId)) {
      Alert.alert('Please enter a valid email address');
      return;
    } else {
      console.log('email is valid');
    }

    if (!validatePhoneNumber(phone)) {
      Alert.alert('Please enter a valid mobile number');
      return;
    }
    if (!toggleCheckBox) {
      Alert.alert('Please accept the terms & conditions');
      return;
    }
    const formattedDateOfBirth = `${mydate.getFullYear()}-${(
      mydate.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${mydate.getDate().toString().padStart(2, '0')}`;

    let data = {
      username: `${firstName}-${phone}`,
      first_name: firstName,
      last_name: lastName,
      zip_code: Zipcode,
      email: emailId,
      phone_number: phone,
      date_of_birth: formattedDateOfBirth,
      password: password,
      gender:
        value === '1'
          ? 'Male'
          : value === '2'
            ? 'Female'
            : value === '4'
              ? 'Other'
              : '',
    };
  
    setLoading(true);
    dispatch(createUser(data))
      .then(response => {
        if (response && response.payload && response.payload.data) {
          if (
            response.payload.data.email &&
            response.payload.data.email.length > 0
          ) {
            Alert.alert(response.payload.data.email[0]);
          }
          if (
            response.payload.data.phone_number &&
            response.payload.data.phone_number.length > 0
          ) {
            Alert.alert(response.payload.data.phone_number[0]);
          }
          setLoading(false);
        
        } else {
          setLoading(false);
          navigation.navigate('VerifyEmail', { emailId: emailId });
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  };

  const changeSelectedDate = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      setShowDate(false);
    } else {
      const currentDate = selectedDate || mydate;
      //   setShowDate(false);
      setDate(currentDate);
      const newFormattedDate = currentDate.toLocaleDateString();
      setFormattedDate(newFormattedDate);
    }
  };
  const maximumDate = new Date();
  maximumDate.setHours(0, 0, 0, 0);

  const displayDatepicker = () => {
    setShowDate(true);
  };

  const handleSelect = itemValue => {
    setValue(itemValue);
    setShowPicker(false);
  };

  const renderPickerItems = () => {
    return data.map(item => (
      <TouchableOpacity
        key={item.label}
        onPress={() => handleSelect(item.value)}
        style={styles.map}>
        <View style={styles.circleLabel}></View>
        <Text style={{ color: 'black' }}>{item.label}</Text>
      </TouchableOpacity>
    ));
  };

  const handleChangeFirstName = (text) => {
    const trimmedText = text.trim(); 
    const capitalizedFirstName =
      trimmedText.charAt(0).toUpperCase() + trimmedText.slice(1);
    setFirstName(capitalizedFirstName);
  };


  const handleChangeLastName = (text) => {
    const trimmedText = text.trim(); 
    const capitalizedLastName =
      trimmedText.charAt(0).toUpperCase() + trimmedText.slice(1);
    setLastName(capitalizedLastName);
  };

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#F5F5F5' }}
        behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <ScrollView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
          <View style={{ marginTop: 20 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={require('../assets/Images/back.png')}
                style={styles.back}
              />
            </TouchableOpacity>
            <Text
              style={{
                color: color.green,
                //color: 'red',
                // marginStart: 40,
                textAlign: 'center',
                fontSize: 15,
                paddingHorizontal: 20,
                paddingTop: 7,
              }}>
              {totalFriends > 0
                ? totalFriends === 1
                  ? `1 friend is already using Check It`
                  : `${totalFriends} friends are already using Check It`
                : `No friends are using Check It. Be the first to join us!`}
            </Text>
            <View style={{justifyContent:'center',alignItems:'center'}}>
            <Image source={Images.web} style={{
            width: responsiveWidth(29),
            height: responsiveHeight(14),
            marginTop:15
          }} /> 
            </View>
          
          </View>

          <View style={styles.containter}>
            <View style={{ marginTop: 7}}>
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <InputText
                  placeholder={'First Name'}
                  placeholderTextColor={'gray'}
                  inputstying={styles.inputEdit}
                  value={firstName}
                  onChangeText={handleChangeFirstName}
                />
                <InputText
                  placeholder={'Last Name'}
                  placeholderTextColor={'gray'}
                  inputstying={styles.inputEdit}
                  value={lastName}
                  onChangeText={handleChangeLastName}
                />
              </View>
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity
                  style={styles.genderStyling}
                  onPress={() => setShowPicker(!showPicker)}>
                  <Text
                    style={{
                      color: 'gray',
                      fontSize: 16,
                      fontFamily: Fonts.DroidSans,
                    }}>
                    {value
                      ? data.find(item => item.value === value)?.label
                      : 'Gender'}
                  </Text>
                  <Image
                    source={require('../assets/Images/down.png')}
                    style={{ height: 22, width: 22 }}
                  />
                </TouchableOpacity>

                <InputText
                  placeholder={'Zipcode'}
                  placeholderTextColor={'gray'}
                  keyboardType={'phone-pad'}
                  inputstying={styles.inputEdit}
                  maxLength={5}
                  value={Zipcode}
                  onChangeText={Zipcode => setZipcode(Zipcode)}
                />
              </View>

              {showPicker && (
                <View style={styles.pickerContainer}>
                  {renderPickerItems()}
                </View>
              )}

              <TouchableOpacity style={styles.dob} onPress={displayDatepicker}>
                <Text
                  style={{
                    color: 'gray',
                    fontFamily: Fonts.DroidSans,
                    fontSize: 16,
                  }}>{isDisplayDate ? '' : formattedDate ? formattedDate : 'Date of Birth'}
                </Text>
                <View style={{ marginLeft: -13 }}>
                  {isDisplayDate && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={mydate}
                      mode={displaymode}
                      is24Hour={true}
                      display="default"
                      maximumDate={maximumDate}
                      onChange={changeSelectedDate}
                    />
                  )}
                </View>
              </TouchableOpacity>

              <InputText
                placeholder={'Mobile Number'}
                placeholderTextColor={'gray'}
                keyboardType={'phone-pad'}
                inputstying={{ marginTop: 14 }}
                value={phone}
                maxLength={10}
                onChangeText={phone => setPhone(phone)}
              />
              <InputText
                placeholder={'Email Address'}
                placeholderTextColor={'gray'}
                inputstying={{ marginTop: 14 }}
                value={emailId}
                onChangeText={emailId => setEmailId(emailId)}
              />

              <InputText
                placeholder={'Password'}
                placeholderTextColor={'gray'}
                inputstying={{ marginTop: 14 }}
                secureTextEntry
                value={password}
                onChangeText={password => setPassword(password)}
              />
            </View>

            <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ marginTop: 6 }}>
                <CheckBox
                  disabled={false}
                  value={toggleCheckBox}
                  tintColors={{ true: color.green }}
                  onCheckColor={color.green}
                  style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                  onValueChange={(newValue) => setToggleCheckBox(newValue)}
                />
              </View>
              <TouchableOpacity style={{  }} onPress={handlePress}>
                <Text  numberOfLines={2} style={styles.title}>
                  {' '}
                  I have{' '}
                  <Text style={styles.title}>
                  read and agree <Text style={styles.title }>to the </Text>
                    <Text style={styles.titletxt}>policy and terms<Text style={styles.title}> of service</Text></Text>
                  </Text>
                </Text>
                   
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 30 }}>
              <Button
                loading={loading}
                disable={loading}
                onPress={() => userRegisterApiCall()}
                // onPress={()=>navigation.navigate('VerifyEmail')}
                styling={styles.logbtn}
                text={'Next'}></Button>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={{
                flex: 1,
                height: 50,
                alignItems: 'center',
                marginTop: 19,
                marginBottom: 40,
              }}>
              <Text style={{ color: 'black', fontFamily: Fonts.DroidSans }}>
                Already Registered?{' '}
                <Text
                  style={{
                    color: color.green,
                    fontFamily: Fonts.DroidSansBold,
                    fontSize: 14,
                  }}>
                  Login
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Register;

const styles = StyleSheet.create({
  containter: {
    flex: 1,
    paddingHorizontal: 20,
  },
  genderStyling: {
    width: '48%',
    height: 48,
    borderWidth: 1,
    borderColor: '#F1EDED',
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 6,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  dob: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#F1EDED',
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 6,
    flexDirection: 'row',
    paddingHorizontal: 13,
    alignItems: 'center',
  },
  text: {
    color: color.green,
    marginTop: 10,
    fontSize: 29,
  },
  back: {
    marginTop: Platform.OS === 'ios' ? 30 : 0,
    height: 28,
    width: 28,
    marginStart: 20,
    tintColor: color.green,
  },
  map: {
    flexDirection: 'row',

    paddingStart: 15,
    borderColor: '#F2EFEF',
    borderBottomWidth: 0.5,
    padding: 7,
  },
  inputEdit: {
    width: '48%',
  },
  img: {
    alignSelf: 'center',
    marginTop: 34,
    height: 120,
    width: 180,
  },
  txt: {
    color: 'gray',
    fontSize: 14,
    marginTop: 10,
    lineHeight: 20,
  },
  newTxt: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
  },
  regTxt: {
    color: color.green,
    fontSize: 18,
    textAlign: 'center',
  },
  title: {
    color: '#000',
    fontSize: 11,
    fontFamily: Fonts.DroidSans,
  },
  titletxt: {
    color: color.green,
    fontSize: 11,
    lineHeight: 18,
    fontFamily: Fonts.DroidSans,
  },
  last: {
    borderTopColor: 'gray',
    borderTopWidth: 1,
    paddingVertical: 14,
    marginTop: 40,
  },
  pickerContainer: {
    marginTop: 10,
    backgroundColor: 'white',

    width: '100%',
    elevation: 5,
  },
});
