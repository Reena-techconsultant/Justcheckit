import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  TextInput,
  Platform
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditImage = ({ navigation, route }) => {
  const des = route.params.des;
  const textInputRef = useRef(null)
  const [selectedSecond, setSelectedSecond] = useState(null);
  const [selectedThird, setSelectedThird] = useState(null);
  const [selectedFourth, setSelectedFourth] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState({});
  const [notes, setNotes] = useState(des);
  const [autoFocus, setAutoFocus] = useState(true);


  const FirstDeleteImage = () => {
    setCroppedImage(null)
    setSelectedThird(null)
    setSelectedSecond(null)
    setSelectedFourth(null)
  }
  const deleteImage = async () => {
    try {

      setTask(prevTask => {
        return { ...prevTask, first_pic: '' };
      });
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };
  const deleteImageSecond = async () => {
    try {
   
      setTask(prevTask => {
        return { ...prevTask, second_pic: '' };
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      // Handle error as needed
    }
  };


  const deleteImageThird = async () => {
    try {
    
      setTask(prevTask => {
        return { ...prevTask, third_pic: '' };
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      // Handle error as needed
    }
  };
  const deleteImageFourth = async () => {
    try {
  
      setTask(prevTask => {
        return { ...prevTask, fourth_pic: '' };
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      // Handle error as needed
    }
  };
  const id = route.params.id;
  const name = route.params.name;

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = async () => {
    const token = await AsyncStorage.getItem('token');
   
    const value = await AsyncStorage.getItem('user_id')

    try {
    
      const res = await axios.get(
        `${BASE_URL}data/tasks/?user=${value}&id=${id}`,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Token ${token}`,
          },
        },
      );
    
      setTask(res.data.data.result[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const missionId = route.params.missionId;

  const patchTask = async () => {

    console.log(task,"mytasl");
    
    if (!notes.trim() || notes.trim() == "undefined" || (!task.first_pic && !task.second_pic && !task.third_pic && !task.fourth_pic)  ) {
      Alert.alert('Upload your photo and notes to submit');
      return;
    }
   
    setLoading(true);
    try {
      const token = await retrieveData();
      const formData = new FormData();

      formData.append('description', notes.trim());
       if (task.first_pic) {
        formData.append('first_pic', {
          uri: task.first_pic,
          type: 'image/jpeg', // Adjust the type accordingly
          name: 'first_pic.jpg',
        });
       }else{
        formData.append('first_pic','');
       }
      if (task.second_pic) {
        formData.append('second_pic', {
          uri: task.second_pic,
          type: 'image/jpeg', // Adjust the type accordingly
          name: 'second_pic.jpg',
        });
      }else{
        formData.append('second_pic','')
      }
       if (task.third_pic) {

        formData.append('third_pic', {
          uri: task.third_pic,
          type: 'image/jpeg', // Adjust the type accordingly
          name: 'third_pic.jpg',
        });
      }else{
        formData.append('third_pic','')
      }
      if (task.fourth_pic) {
         formData.append('fourth_pic', {
          uri: task.fourth_pic,
          type: 'image/jpeg', // Adjust the type accordingly
          name: 'fourth_pic.jpg',
        });
      }else{
        formData.append('fourth_pic','');
      }
      const response = await axios.patch(
        `${BASE_URL}data/tasks/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Token ${token}`,
          },
        },
      );
      setLoading(false);

      navigation.goBack();
    } catch(error) {
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
        setTask(prev=>{ return {...prev,first_pic:result.path}})
      }
    } catch (error) {
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
        setTask(prev=>{ return {...prev,second_pic:result.path}})
      }
    } catch (error) {
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
        setTask(prev=>{ return {...prev,third_pic:result.path}})
        setSelectedThird(result.path);
      }
    } catch (error) {
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
        setTask(prev=>{ return {...prev,fourth_pic:result.path}})
        setSelectedFourth(result.path);
      }
    } catch (error) {
      console.log('Image picker error', error);
    }
  };

  const handleAutoFocus = () => {
    if(textInputRef.current) {
      textInputRef.current.focus();
    }
  }


  return (
    <>
      <Header
        headerStyle={styles.he}
        Header={name}
        navigation={navigation}
        back={Images.back}
      />
      <ScrollView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>

        <View style={styles.container}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.select}>Notes</Text>
            <Image
              source={require('../assets/Images/edit.png')}
              style={{ height: 24, width: 24, tintColor: color.green }}
            />
          </View>
          
            
            <TouchableOpacity onPress={handleAutoFocus}>
             
              <InputText
                ref={textInputRef}
                value={notes}
               
                placeholderTextColor={'gray'}
                inputstying={{height:100}}
                textAlignVertical={'top'}
                inputText={styles.text}
                multiline={true}
                onFocus={true}
                rows={10}
                onChangeText={firstName => setNotes(firstName)}>
              </InputText>
            </TouchableOpacity>
            
          
          

          <View style={{ flexDirection: 'row',marginTop:15, justifyContent: 'space-between' }}>
            {!croppedImage && (
              <View style={{position:'relative'}}>
                <View style={styles.userPhoto}>
                  <TouchableOpacity
                    onPress={openImageCropper}
                    style={styles.imgStyle}>
                    {task?.first_pic ? (
                      <Image
                        source={{ uri: task.first_pic }}
                        style={{
                          height: 150,
                          width: 150,
                        }}
                      />
                    ) : (
                      <Image source={Images.plus} style={{ height: 35, width: 35 }} />
                    )}
                  </TouchableOpacity>
                </View>
                {
                  task?.first_pic ? (
                    <TouchableOpacity
                      onPress={deleteImage}
                      style={{ position: 'absolute', right: -12, top: 5, }}>
                      <Image source={Images.close} style={{ height: 25, resizeMode: 'cover', tintColor: '#fff', width: 25, backgroundColor: 'red', borderRadius: 20, }} />
                    </TouchableOpacity>
                  ) : null
                }
              </View>
            )}


            {croppedImage && (
              <View style={{position:'relative'}}>
                <TouchableOpacity onPress={openImageCropper}>
                  <Image source={{ uri: croppedImage }} style={styles.img} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={FirstDeleteImage}
                  style={{ position: 'absolute', right: -12, top: 5, }}>
                  <Image source={Images.close} style={{ height: 25, resizeMode: 'cover', tintColor: '#fff', width: 25, backgroundColor: 'red', borderRadius: 20, }} />
                </TouchableOpacity>
              </View>
            )}



            {!selectedSecond && (
              <>

                <View style={styles.userPhoto}>
                  <TouchableOpacity
                    onPress={openImageCropperSecond}
                    style={styles.imgStyle}>
                    {task?.second_pic ? (
                      <Image
                        source={{ uri: task.second_pic }}
                        style={{
                          height: 150,
                          width: 150,
                        }}
                      />
                    ) : (
                      <Image source={Images.plus} style={{ height: 35, width: 35 }} />
                    )}
                  </TouchableOpacity>
                </View>
                {
                  task?.second_pic ? (
                    <TouchableOpacity
                      onPress={deleteImageSecond}
                      style={{ position: 'absolute', right: -12, top: 5, }}>
                      <Image source={Images.close} style={{ height: 25, resizeMode: 'cover', tintColor: '#fff', width: 25, backgroundColor: 'red', borderRadius: 20, }} />
                    </TouchableOpacity>
                  ) : null
                }

              </>
            )}


            {selectedSecond && (
              <>
             
              <TouchableOpacity onPress={openImageCropperSecond}>
                <Image source={{ uri: selectedSecond }} style={styles.img} />
              </TouchableOpacity>
              <TouchableOpacity
                 onPress={FirstDeleteImage}
                 style={{ position: 'absolute', right: -12, top: 5, }}>
                 <Image source={Images.close} style={{ height: 25, resizeMode: 'cover', tintColor: '#fff', width: 25, backgroundColor: 'red', borderRadius: 20, }} />
               </TouchableOpacity>
              </>
            )}

          </View>


          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>


            {!selectedThird && (
              <View style={{position:'relative'}}>
                <View style={[styles.userPhoto, { position: 'relative' }]}>
                  <TouchableOpacity
                    onPress={openImageCropperThird}
                    style={styles.imgStyle}>
                    {task?.third_pic ? (
                      <Image
                        source={{ uri: task.third_pic }}
                        style={{
                          height: 150,
                          width: 150,
                        }}
                      />
                    ) : (
                      <Image source={Images.plus} style={{ height: 35, width: 35 }} />
                    )}
                  </TouchableOpacity>
                </View>
                {
                  task?.third_pic ? (
                    <TouchableOpacity
                      onPress={deleteImageThird}
                      style={{ position: 'absolute', right:-13, top: 5, }}>
                      <Image source={Images.close} style={{ height: 25, resizeMode: 'cover', tintColor: '#fff', width: 25, backgroundColor: 'red', borderRadius: 20, }} />

                    </TouchableOpacity>
                  ) : null
                }
              </View>
            )}


            {selectedThird && (
              <View style={{position:'relative'}}>
             
              <TouchableOpacity onPress={openImageCropperThird}>
                <Image source={{ uri: selectedThird }} style={styles.img} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={FirstDeleteImage}
                style={{ position: 'absolute', right: -12, top: 5, }}>
                <Image source={Images.close} style={{ height: 25, resizeMode: 'cover', tintColor: '#fff', width: 25, backgroundColor: 'red', borderRadius: 20, }} />
              </TouchableOpacity>

              </View>
            )}


            {!selectedFourth && (
              <View style={{position:'relative'}}>

                <View style={styles.userPhoto}>
                  <TouchableOpacity
                    onPress={openImageCropperFourth}
                    style={styles.imgStyle}>
                    {task?.fourth_pic ? (
                      <Image
                        source={{ uri: task.fourth_pic }}
                        style={{
                          height: 150,
                          width: 150,
                        }}
                      />
                    ) : (
                      <Image source={Images.plus} style={{ height: 35, width: 35 }} />
                    )}
                  </TouchableOpacity>
                </View>
                {
                  task?.fourth_pic ? (
                    <TouchableOpacity
                      onPress={deleteImageFourth}
                      style={{ position: 'absolute', right: -13, top: 6, }}>
               <Image source={Images.close} style={{ height: 25,width: 25, tintColor: '#fff',  backgroundColor: 'red', borderRadius: 20, }} />

                    </TouchableOpacity>
                  ) : null
                }

              </View>
            )}


            {selectedFourth && (
              <View style={{position:'relative'}}>
              <TouchableOpacity onPress={openImageCropperFourth}>
                <Image source={{ uri: selectedFourth }} style={styles.img} />
              </TouchableOpacity>
               <TouchableOpacity
               onPress={FirstDeleteImage}
               style={{ position: 'absolute', right: -12, top: 5, }}>
               <Image source={Images.close} style={{ height: 25, resizeMode: 'cover', tintColor: '#fff', width: 25, backgroundColor: 'red', borderRadius: 20, }} />
             </TouchableOpacity>
             </View>
            )}

          </View>

          <Button
            onPress={() => patchTask()}
            loading={loading}
            text={'Submit'}
            styling={styles.btn}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default EditImage;

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
    fontSize: 15,
    height:100,
  
  },
  input: {
   //height: 130,
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
    justifyContent: 'space-between',
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
    marginTop:Platform.OS==='ios'? 39: 10,
  },
  userPhoto: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
