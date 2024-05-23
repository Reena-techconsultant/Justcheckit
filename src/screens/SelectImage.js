import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../common/Header';
import { color } from '../components/color';
import { Fonts } from '../components/Fonts';
import Images from '../components/Images';
import { Button } from '../common/Button';
import InputText from '../common/InputText';
import ImagePicker from 'react-native-image-crop-picker';
import { useDispatch } from 'react-redux';
import { retrieveData } from '../common/LocalStorage';
import axios from 'axios';
import { BASE_URL } from '../config/baseUrl';
import { getmissionType, storeImageData } from '../modules/getMissionTypeSlice';

const SelectImage = ({ navigation, route }) => {
  const [notes, setNotes] = useState('');
  const [selectedSecond, setSelectedSecond] = useState(null);
  const [selectedThird, setSelectedThird] = useState(null);
  const [selectedFourth, setSelectedFourth] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const PlaceholderText = `Put any notes you have on your experience here`;
  const id = route.params.id;
  const taskid = route.params.tid;
  const name = route.params.name;
  const dispatch = useDispatch();

  useEffect(() => {
    requestCameraRollPermission();
  }, []);

  const requestCameraRollPermission = async () => {
    if (Platform.OS === 'ios') {
      try {
        const status = await ImagePicker.requestMediaLibraryPermissions();
        if (status !== 'granted') {
          console.log('Permission to access camera roll denied');
        } else {
          console.log('Permission to access camera roll granted');
        }
      } catch (error) {
        console.error('Error requesting permission:', error);
      }
    } else if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Permission to access camera roll',
            message: 'This app needs permission to access your camera roll.',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Permission to access camera roll granted');
        } else {
          console.log('Permission to access camera roll denied');

        }
      } catch (error) {
        console.error('Error requesting permission:', error);
      }
    }
  };

  const uploadPhotoApi = async () => {
    if (!notes.trim()) {
      Alert.alert('Please add a description before submitting');
      return;
    }


    setLoading(true);
    try {
      const token = await retrieveData();
      const formData = new FormData();
      formData.append('name', name);
      formData.append('mission', id);

      formData.append('mission_task', taskid);
      formData.append('description', notes.trim());

      if (croppedImage) {
        const imageBlob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function () {
            resolve(xhr.response);
          };
          xhr.onerror = function (e) {
            reject(new TypeError('Network request failed'));
          };
          xhr.responseType = 'blob';
          xhr.open('GET', croppedImage, true);
          xhr.send(null);
        });

        formData.append('first_pic', {
          uri: croppedImage,
          type: 'image/jpeg', // Adjust the type accordingly
          name: 'first_pic.jpg',
        });
      }
      if (selectedSecond) {
        const imageBlob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function () {
            resolve(xhr.response);
          };
          xhr.onerror = function (e) {
            reject(new TypeError('Network request failed'));
          };
          xhr.responseType = 'blob';
          xhr.open('GET', selectedSecond, true);
          xhr.send(null);
        });

        formData.append('second_pic', {
          uri: selectedSecond,
          type: 'image/jpeg', // Adjust the type accordingly
          name: 'second_pic.jpg',
        });
      }
      if (selectedThird) {
        const imageBlob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function () {
            resolve(xhr.response);
          };
          xhr.onerror = function (e) {
            reject(new TypeError('Network request failed'));
          };
          xhr.responseType = 'blob';
          xhr.open('GET', selectedThird, true);
          xhr.send(null);
        });

        formData.append('third_pic', {
          uri: selectedThird,
          type: 'image/jpeg', // Adjust the type accordingly
          name: 'third_pic.jpg',
        });
      }
      if (selectedFourth) {
        const imageBlob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function () {
            resolve(xhr.response);
          };
          xhr.onerror = function (e) {
            reject(new TypeError('Network request failed'));
          };
          xhr.responseType = 'blob';
          xhr.open('GET', selectedFourth, true);
          xhr.send(null);
        });

        formData.append('fourth_pic', {
          uri: selectedFourth,
          type: 'image/jpeg', // Adjust the type accordingly
          name: 'fourth_pic.jpg',
        });
      }
      const response = await axios.post(`${BASE_URL}data/tasks/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Token ${token}`,
        },
      });

      if (response.data && response.data.message) {
        Alert.alert('Task completed successfully');
        navigation.navigate('Home');
      } else {
        dispatch(storeImageData(response.data, 'name', id));
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error uploading photos:', error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        ``;
        Alert.alert('Error uploading photos. ' + error.response.data.message);
      }
    }
  };

  const openImageCropper = async () => {
    try {
      const result = await ImagePicker.openPicker({
        width: 2000,
        height: 2000,
        cropping: true,
      });

      if (result) {
        setCroppedImage(result.path);
      }
    } catch (error) {
      console.log('Image picker error', error);
    }
  };

  const openImageCropperSecond = async () => {
    try {
      const result = await ImagePicker.openPicker({
        width: 2000,
        height: 2000,
        cropping: true,
      });

      if (result) {
        setSelectedSecond(result.path);
      }
    } catch (error) {
      console.log('Image picker error', error);
    }
  };
  const openImageCropperThird = async () => {
    try {
      const result = await ImagePicker.openPicker({
        width: 2000,
        height: 2000,
        cropping: true,
      });

      if (result) {
        setSelectedThird(result.path);
      }
    } catch (error) {
      console.log('Image picker error', error);
    }
  };

  const openImageCropperFourth = async () => {
    try {
      const result = await ImagePicker.openPicker({
        width: 2000,
        height: 2000,
        cropping: true,
      });

      if (result) {
        setSelectedFourth(result.path);
      }
    } catch (error) {
      console.log('Image picker error', error);
    }
  };

  return (
    <>
      <Header
        Header={name}
        headerStyle={styles.he}
        navigation={navigation}
        back={Images.back}
      />
      <ScrollView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 10
          }}>
          <Text style={styles.select}>Notes</Text>
          <Image
            source={require('../assets/Images/edit.png')}
            style={{ height: 24, width: 24, tintColor: color.green }}
          />
        </View>
        <View style={{ marginRight: 10 }}>
          <InputText
            placeholder={PlaceholderText}
            placeholderTextColor={'gray'}
            inputstying={styles.input}
            textAlignVertical={'top'}
            inputText={styles.text}
            multiline={true}
            onFocus={true}
            rows={10}
            onChangeText={firstName => setNotes(firstName)}>

          </InputText>
        </View>

        <View style={styles.container}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {!croppedImage && (
              <TouchableOpacity onPress={openImageCropper} style={styles.img}>
                <Image source={Images.plus} style={{ height: 35, width: 35 }} />
              </TouchableOpacity>
            )}
            {croppedImage && (
              <TouchableOpacity onPress={openImageCropper}>
                <Image source={{ uri: croppedImage }} style={styles.img} />
              </TouchableOpacity>
            )}
            {!selectedSecond && (
              <TouchableOpacity
                onPress={openImageCropperSecond}
                style={styles.img}>
                <Image source={Images.plus} style={{ height: 35, width: 35 }} />
              </TouchableOpacity>
            )}
            {selectedSecond && (
              <TouchableOpacity onPress={openImageCropperSecond}>
                <Image source={{ uri: selectedSecond }} style={styles.img} />
              </TouchableOpacity>
            )}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {!selectedThird && (
              <TouchableOpacity
                onPress={openImageCropperThird}
                style={styles.img}>
                <Image source={Images.plus} style={{ height: 35, width: 35 }} />
              </TouchableOpacity>
            )}
            {selectedThird && (
              <TouchableOpacity onPress={openImageCropperThird}>
                <Image source={{ uri: selectedThird }} style={styles.img} />
              </TouchableOpacity>
            )}
            {!selectedFourth && (
              <TouchableOpacity
                onPress={openImageCropperFourth}
                style={styles.img}>
                <Image source={Images.plus} style={{ height: 35, width: 35 }} />
              </TouchableOpacity>
            )}
            {selectedFourth && (
              <TouchableOpacity onPress={openImageCropperFourth}>
                <Image source={{ uri: selectedFourth }} style={styles.img} />
              </TouchableOpacity>
            )}
          </View>

          <Button
            onPress={() => uploadPhotoApi()}
            loading={loading}
            text={'Submit'}
            disable={loading}
            styling={styles.btn}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default SelectImage;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  btn: {
    height: 42,
    width: '50%',
    marginVertical: 25,
  },
  text: {
    fontSize: 14,
    height: 100,
    paddingTop: 10,
    marginStart: 0,

  },
  input: {
    height: 130,
    fontSize: 15,
    paddingStart: 10,
  },
  imgStyle: {
    height: 150,
    width: 150,
    borderWidth: 1,
    borderColor: color.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  select: {
    color: color.green,
    fontSize: 25,
    fontFamily: Fonts.DroidSansBold,
  },
  img: {
    height: 150,
    width: 150,
    borderColor: color.green,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  content: {
    color: 'gray',
    fontFamily: Fonts.DroidSans,
    marginVertical: 15,
  },
  upload: {
    backgroundColor: color.green,
    height: 31,
    width: 108,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  he: {
    marginTop:Platform.OS==='ios'? 38:10
  },
  userPhoto: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
