import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {  useDispatch } from 'react-redux';
import React, { useState, useEffect, useCallback } from 'react';
import Header from '../common/Header';
import Images from '../components/Images';
import { Fonts } from '../components/Fonts';
import { getMission } from '../modules/getMissionSlice';
import axios from 'axios';
import { BASE_URL } from '../config/baseUrl';
import { retrieveData } from '../common/LocalStorage';
import { color } from '../components/color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import { useFocusEffect } from '@react-navigation/native';
import { openComposer } from "react-native-email-link";
const CreateList = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [value, setValue] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [name, setName] = useState('');
  const [dis, setDis] = useState('');
  const [modalVisible, setmodalVisible] = useState(false);
  const [mission, setMission] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);

  const DATA = mission?.result?.map(item => ({
    label: item.mission_type,
    value: item.id.toString(),
  }));

  useFocusEffect(
    useCallback(() => {
      setName('');
      setValue(null);
      setLoading(false);
      setTasks([]);
      getMissionCategories();
      getFriends();
      setFriends([]);
    }, []),
  );
  const dispatch = useDispatch();


  const handleAddTask = () => {
    const trimmedTaskInput = taskInput.trim();

    if (trimmedTaskInput !== '') {
      if (tasks.some(task => task === trimmedTaskInput)) {
        Alert.alert('Task with the same name already exists!');
        return;
      }
      setTasks([...tasks, trimmedTaskInput]);
      setTaskInput('');
    } else {
      Alert.alert('Please enter a valid task name!');
    }
  };
  const getMissionCategories = async () => {
    dispatch(getMission()).then(response => {
      setMission(response.payload.data);
    });
  };

  const createTaskApi = async () => {
    if (!name.trim()) {
      Alert.alert('Please fill in mission name');
      return;
    }
    if (!value) {
      Alert.alert('Please select the category');
      return;
    }
    if (!dis.trim()) {
      Alert.alert('Please add discription');
      return;
    }


    setLoading(true);
    const apiUrl = `${BASE_URL}data/create-mission-task/`;
    const api_list = friends.map(item => item.id);

    const requestData = {
      name: name.trim(),
      mission_type: value,
      task: tasks,
      friend_list: api_list,
      description: dis.trim(),
    };
    try {
      const token = await retrieveData();
      const response = await axios.post(apiUrl, requestData, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      Alert.alert('Mission Created Successfully');
      navigation.goBack();
      setLoading(false);
  
      return response.data;
    } catch (error) {
      setLoading(false);
      console.error('Error:', error.response?.data?.Error);
      Alert.alert("Task with the same name already exists");
      throw error;
    }
  };

  const handleSelect = selectedValue => {
    setValue(selectedValue);
    setShowPicker(false);
  };

  const renderPickerItems = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleSelect(item.value)}
      style={styles.map}>
      <View style={styles.circleLabel}></View>
      <Text style={{ color: 'black' }}>{item.label}</Text>
    </TouchableOpacity>
  );

  const [data, setData] = useState([]);

  const handleCheckBoxChange = item => {
    const index = friends.findIndex(friend => friend.id === item.id);
    if (index === -1) {
      setFriends([...friends, item]);
    } else {
      const updatedFriends = [...friends];
      updatedFriends.splice(index, 1);
      setFriends(updatedFriends);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.FlatList}>
      <View
        style={{
          flexDirection: 'row',
          alignContent: 'center',
          flex: 1,
          width: '100%',
          justifyContent: 'space-between',
        }}>
        <View style={styles.user}>
          <Text style={styles.userName}>
            {item?.friend_name.substring(0, 1).toUpperCase()}
          </Text>
        </View>
        <View>
          <Text style={[styles.HeaderText, { marginTop: 11 }]}>
            {' '}
            {item?.friend_name}
          </Text>
        </View>
        <View
          style={{
            borderColor: 'gray',
            borderWidth: 1,
            height: 20,
            width: 20,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 4,
            marginTop: 11,
          }}>
          <CheckBox
            value={friends.some(friend => friend.id === item.friend_id)}
            onValueChange={() =>
              handleCheckBoxChange({ id: item.friend_id, name: item.friend_name })
            }
          />
        </View>
      </View>
    </View>
  );

  const getFriends = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await axios.get(`${BASE_URL}/data/user-friends-name/`, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onPressBack = () => {
    navigation.goBack();
  };
  return (
    <>
      <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
        <Header
          navigation={navigation}
          Header={'Create Mission'}
          back={Images.back}
          headerStyle={styles.he}
          backOnPress={onPressBack}
        />
        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.name}>Mission</Text>
            <TextInput
              placeholder="Name"
              placeholderTextColor={'gray'}
              style={styles.input}
              value={name}
              onChangeText={firstName => setName(firstName)}
              maxLength={25}

            />
            <Text style={styles.name}>Category</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowPicker(!showPicker)}>
              <Text style={{ color: 'black', fontFamily: Fonts.DroidSans }}>
                {value
                  ? DATA.find(item => item.value === value)?.label || 'Category'
                  : 'Category'}
              </Text>
              <Image
                source={require('../assets/Images/down.png')}
                style={{ height: 24, width: 24 }}
              />
            </TouchableOpacity>


            {showPicker && (
              <View style={styles.pickerContainer}>
                <FlatList
                  data={DATA}
                  renderItem={renderPickerItems}
                  keyExtractor={item => item.value}
                />
              </View>
            )}

            <Text style={styles.name}>Description</Text>
            <TextInput
              placeholder="Description"
              placeholderTextColor={'gray'}
              style={styles.input}
              value={dis}
              onChangeText={discr => setDis(discr)}
            />
            <Text style={styles.name}>Tasks</Text>
            <View style={[styles.input, { marginBottom: 10 }]}>

              <TextInput
                numberOfLines={2}
                placeholder="Tasks"
                placeholderTextColor={'gray'}
                style={{ flex: 1,color:'black' }}
                value={taskInput}
                onChangeText={text => setTaskInput(text)}
              />
              <TouchableOpacity onPress={handleAddTask}>
                <Image source={Images.plus} style={{ tintColor: color.green, height: 22, width: 22, marginLeft: 7, }} />
              </TouchableOpacity>

            </View>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View>
                <FlatList
                  data={tasks}
                  renderItem={({ item }) => (
                    <View style={styles.taskItem}>
                      <Text
                        style={{
                          color: '#000',
                          fontSize: 15,
                          padding: 14,
                          fontFamily: Fonts.DroidSans,
                        }}>
                        {item.length > 18
                          ? item.substring(0, 10) + '...'
                          : item}
                      </Text>
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
              <View>
                <FlatList
                  data={friends}
                  renderItem={({ item }) => (
                    <View style={styles.taskIteml}>
                      <Text
                        style={{
                          color: '#000',
                          fontSize: 15,
                          padding: 14,
                          fontFamily: Fonts.DroidSans,
                        }}>
                        {item.name.length > 15
                          ? item.name.substring(0, 10) + '...'
                          : item.name}
                      </Text>
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            </View>
          </View>
          <ScrollView>
            {tasks.length > 0 && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 30,
                  marginTop: 5,
                }}>
                <TouchableOpacity
                  onPress={() => createTaskApi()}
                  disabled={loading}
                  style={{ alignItems: 'center' }}>
                  <View style={[styles.button, { height: 32, width: 100 }]}>
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text
                        style={{ color: '#fff', fontFamily: Fonts.DroidSans }}>
                        Submit
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setmodalVisible(true);
                  }}
                  style={{ alignItems: 'center' }}>
                  <View style={[styles.button, { height: 32, width: 100 }]}>
                    <Text style={{ color: '#fff', fontFamily: Fonts.DroidSans }}>
                      Add Friend
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
          <View style={{ marginTop: '33%', }}>
            <View style={{ height: 140, backgroundColor: color.green, alignItems: 'center', justifyContent: 'center' }}>
              <TouchableOpacity
                onPress={() => openComposer({
                  to: 'JustCheckItOff@gmail.com'
                })}
                style={{
                  height: 40, paddingHorizontal: 20, backgroundColor: '#fff',
                  alignItems: 'center', justifyContent: 'center', borderRadius: 20
                }}>
                <Text  style={{ color:'black'}}>Share your idea here!</Text>

              </TouchableOpacity>

              <View style={{ alignItems: 'center', paddingHorizontal: 20, marginTop: 20 }}>
                <Text style={{ textAlign: 'center', color: '#fff' }}>Have an idea for a category or mission that does not yet exist? Share your vision with us!</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setmodalVisible(false)}>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>

          <View
            style={{
              backgroundColor: '#fff',
              flex: 0.5,
              padding: 20,
              borderRadius: 10,
              width: '90%',
            }}>
            <TouchableOpacity
              onPress={() => setmodalVisible(false)}
              style={{ alignSelf: 'flex-end' }}>
              <Image
                source={Images.close}
                style={{ height: 28, width: 28, tintColor: 'gray' }}
              />
            </TouchableOpacity>
            <Text
              style={{
                color: color.green,
                fontFamily: Fonts.DroidSansBold,
                textAlign: 'center',
                fontSize: 18,
              }}>
              Friends
            </Text>
            {data.length === 0 ? (
              <View
                style={{
                  height: 200,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{ color: 'black' }}>No friends to show!</Text>
              </View>
            ) : (

              <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id}
              />
            )}

          </View>

        </View>
      </Modal>
    </>
  );
};

export default CreateList;
const styles = StyleSheet.create({
  customItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,

    height: 200,
  },
  FlatList: {
    flex: 1,
    width: '96%',

    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 2,
    alignItems: 'center',
    borderColor: '#F5F5F5',
    borderRadius: 8,
    justifyContent: 'space-between',
    marginHorizontal: 8,

    marginTop: 15,
  },
  HeaderText: {
    flex: 1,

    fontWeight: '600',

    color: 'black',
    fontSize: 14,
    fontFamily: Fonts.DroidSans,
  },
  user: {
    height: 42,
    width: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.green,
  },
  userName: {
    color: '#fff',
    fontSize: 12,
    fontFamily: Fonts.DroidSans,
  },
  roundLabel: {
    backgroundColor: 'blue',
    borderRadius: 50,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  map: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingStart: 15,
    borderColor: '#F2EFEF',
    borderBottomWidth: 0.5,
    padding: 7,
  },

  labelText: {
    color: 'white',
    fontWeight: 'bold',
  },
  itemText: {
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#000',
  },
  item: {
    fontSize: 14,
    color: '#000',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#000',
  },
  contain: {
    color: '#000',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  itemStyle: {
    borderBottomWidth: 1,
    borderBlockColor: 'gray',
    padding: -5,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  container: {
    flex: 1,
    marginHorizontal: 20,
  },
  taskIteml: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F5F5F5',
    alignSelf: 'flex-end',
    borderRadius: 8,
    marginBottom: 8,
    flex: 0.5,
  },
  taskItem: {
    borderWidth: 1,
    borderColor: '#F5F5F5',
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderRadius: 8,
    marginBottom: 8,
    flex: 0.5,
  },
  button: {
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
    height: 42,
    width: 200,
    borderRadius: 26,
    fontFamily: Fonts.DroidSans,
    backgroundColor: color.green,
  },
  input: {
    marginTop: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    color: '#000',
    paddingHorizontal: 15,
    flexDirection: 'row',
    height: 44,
    borderWidth: 1,
    borderColor: '#F5F5F5',
    fontFamily: Fonts.DroidSans,
    backgroundColor: '#fff',
  },
  name: {
    color: '#000',
    marginTop: 10,
    fontWeight: '500',
    fontFamily: Fonts.DroidSans,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    paddingHorizontal: 8,
    fontSize: 14,
  },
  he: {
    marginTop: Platform.OS==='ios'? 39: 10,
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
  },
  pickerContainer: {
    marginTop: 10,
    backgroundColor: 'white',

    width: '100%',
    elevation: 5,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  circleLabel: {
    width: 7,
    height: 7,
    borderRadius: 12,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  labelText: {
    color: 'white',
    fontWeight: 'bold',
  },
  textInput: {
    borderColor: 'gray',
    borderWidth: 1,
  },
});
