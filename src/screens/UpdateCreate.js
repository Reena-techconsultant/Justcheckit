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
import { color } from '../components/color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import { useFocusEffect } from '@react-navigation/native';
import { openComposer } from "react-native-email-link";
import { friendsList } from '../modules/getFriendList';

const UpdateCreate = ({ navigation, route }) => {
  const catId = route.params.catId
  const ne = route.params.name;
  const friend_count = route.params.friend_count;
  const id = route.params.id;
  const des = route.params.dis;
  const cat = route.params.mission_category;
  const friendList = route.params.friendList
  const frnd_not_join = route.params.frnd_not_join
  const [tasks, setTasks] = useState([]);
  const [task_id, setTaskid] = useState([]);
  const [friend_id, setfriend_id] = useState([]);
  const [list, setlist] = useState(friendList)
  const [taskInput, setTaskInput] = useState('');
  const [value, setValue] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [name, setName] = useState(ne);
  const [dis, setDis] = useState(des);
  const [modalVisible, setmodalVisible] = useState(false);
  const [mission, setMission] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [missionId, setMissionId] = useState();
  const [modalVisibleEdit, setmodalVisibleEdit] = useState(false);
  const [taskNames, setTaskNames] = useState([]);
  const [row, setRow] = useState(null);
  const [editName, setEditName] = useState('');
  const [editedTaskIndex, setEditedTaskIndex] = useState(null);
  const DATA = mission?.result?.map(item => ({
    label: item.mission_type,
    value: item.id.toString(),
  }));
  useFocusEffect(
    useCallback(() => {
      getTaskList();
      setLoading(false);
      getMissionCategories();
  
    }, []),
  );
  const dispatch = useDispatch();

  const getTaskList = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    try {
      const value = await AsyncStorage.getItem('user_id');
      const res = await axios.get(
        `${BASE_URL}data/mission-details/?mission_id=${id}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      setMissionId(res.data.mission_detail.id);
      setTaskNames(res.data.tasks_data);

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const getMissionCategories = async () => {
    dispatch(getMission()).then(response => {
      setMission(response.payload.data);

    });
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

  const [data, setData] = useState(frnd_not_join);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedTaskName, setEditedTaskName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleCheckBoxChange = item => {
    const index = friends.findIndex(friend => friend.user__id === item.id);
    if (index === -1) {
      setFriends([...friends, { user__id: item.id, user__first_name: item.name }]);
    } else {
      const updatedFriends = [...friends];
      updatedFriends.splice(index, 1);
      setFriends(updatedFriends);
    }
  };


  const openEditModal = (index) => {
    setEditingIndex(index);
    setEditedTaskName(tasks[index]);
    setIsModalVisible(true);
  };
  const handleEditTask = () => {
    if (editName.trim() !== '') {
      const trimmedEditName = editName.trim();
      if (editedTaskIndex !== null) {
        if (taskNames.some((task, index) => task.name === trimmedEditName)) {
          Alert.alert('Task name already exists!');
          return;
        }
        if (tasks.some(task => task === trimmedEditName)) {
          Alert.alert('Task name already exists in the list!');
          return; 
        }
        const updatedTaskNames = [...taskNames];
        updatedTaskNames[editedTaskIndex].name = editName.trim();
        console.log(updatedTaskNames,"updatedTaskNames");
        setTaskNames(updatedTaskNames);
        closeModalForEdit();
      }
    }

  };
  const handleSaveEditedTask = () => {
    console.log(editedTaskName, 'editedTaskName');
    if (editingIndex !== null && editedTaskName.trim() !== '') {
      if (taskNames.some((task, index) => task.name === editedTaskName.trim())) {
        Alert.alert('Task name already exists!');
        return;
      }
      
      // Check if the edited task name already exists in list array
      if (tasks.some(task => task === editedTaskName.trim())) {
        Alert.alert('Task name already exists in the list!');
        return; 
      }
     
      const updatedTasks = [...tasks];
      updatedTasks[editingIndex] = editedTaskName.trim();
      setTasks(updatedTasks);
      setIsModalVisible(false);
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
            {item?.first_name?.substring(0, 1).toUpperCase()}
          </Text>
        </View>
        <View>
          <Text style={[styles.HeaderText, { marginTop: 11 }]}>
            {item?.last_name?.length > 15
              ? item.last_name.substring(0, 15) + '...'
              : `${item.first_name} ${item.last_name}`}
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
            value={friends.some(friend => friend?.user__id === item.id)}
            onValueChange={() =>
              handleCheckBoxChange({ id: item?.id, name: `${item?.first_name} ${item.last_name}` })
            }
          />
        </View>
      </View>
    </View>
  );

  const onPressBack = () => {
    navigation.goBack();
  };
 



  const handleAddTask = () => {
    const trimmedTaskInput = taskInput.trim();

    console.log(trimmedTaskInput,"trimmedTaskInput");
  
    // Check if the trimmed input is not empty
    if (trimmedTaskInput !== '') {
      // Check if the task already exists in the tasks array
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


  console.log(tasks,"list");
  console.log(taskNames,"TASKNAMW");


  const openModalForEdit = (index) => {
    setEditedTaskIndex(index);
    setEditName(taskNames[index].name);
    setmodalVisibleEdit(true);
  };

  const closeModalForEdit = () => {
    setmodalVisibleEdit(false);
    setEditName('');
    setEditedTaskIndex(null);
  };




  const updateTask = async () => {
    if (!name.trim()) {
      Alert.alert('Please fill in mission name');
      return;
    }
    if (!dis.trim()) {
      Alert.alert('Please add discription');
      return;
    }

    if (tasks.length === 0 && taskNames.length === 0) {
      Alert.alert('Please add tasks');
      return;
    }
    setLoading(true);
    const updatedTask = {
      name: name.trim() || ne.trim(),
      description: dis.trim(),
      mission_type: value || catId.toString(),
      task_list: [...taskNames.map(task => ({ id: task.id, name: task.name })), ...tasks.map(name => {
        return { name }
      })],
      task_id,
      friend_id,
      friend_list: friends.map(item => ({ id: item.user__id }))
    };
  
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.put(
        `${BASE_URL}data/create-mission-task/?mission_id=${id}`,
        updatedTask,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        },
      );
      setLoading(false)
      navigation.goBack();
    } catch (error) {
      console.log(error);

      if (error.response && error.response.status === 409) {
        console.log(error.response.data.Warning);
        Alert.alert(error.response.data.Warning);
      }
      setLoading(false);
      console.error('Error updating task:', error);
    }
  };

  return (
    <>
      <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
        <Header
          navigation={navigation}
          Header={'Update Mission'}


          back={Images.back}
          headerStyle={styles.he}
          backOnPress={onPressBack}
        />
        <ScrollView>

          <View style={styles.container}>
            <Text style={styles.name}>Mission</Text>
            <TextInput
              placeholderTextColor={'gray'}
              style={styles.input}
              value={name}
              maxLength={25}
              onChangeText={firstName => setName(firstName)}
            />



            <Text style={styles.name}>Category</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowPicker(!showPicker)}>
              <Text style={{ color: 'black', fontFamily: Fonts.DroidSans }}>
                {value
                  ? DATA.find(item => item.value === value)?.label || 'Category'
                  : cat}
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
                style={{ flex: 1 }}
                value={taskInput}
                onChangeText={text => setTaskInput(text)}
              />
              <TouchableOpacity onPress={handleAddTask}>
                <Image source={Images.plus} style={{ tintColor: color.green, height: 22, width: 22, marginLeft: 7, }} />
              </TouchableOpacity>

            </View>

          </View>
          <ScrollView style={{ backgroundColor: 'transparent' }}>
          
            <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: "100%", marginTop: 10 }}>


              <View style={{ alignSelf: "flex-start" }}>
                <View>
                  <FlatList
                    data={taskNames}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                      <View style={{ position: "relative", zIndex: 999, paddingTop: 10 }}>
                        <TouchableOpacity onPress={() => openModalForEdit(index)} style={[styles.taskItem, { marginStart: 20 }]}>
                          <Text
                            style={{
                              color: '#000',
                              fontSize: 15,
                              padding: 14,
                              fontFamily: Fonts.DroidSans,
                            }}>{item.name.length > 15
                              ? item.name.substring(0, 15) + '...'
                              : item.name}</Text>

                          <TouchableOpacity
                            onPress={() => {
                              setTaskid((prev) => [...prev, item.id]);
                              const updated = taskNames.filter((task) => task.id !== item.id);
                              setTaskNames(updated)

                            }}
                            style={{ position: 'absolute', left: -12, top: -10 }}>
                            <Image source={Images.close} style={{ height: 20, resizeMode: 'cover', tintColor: '#fff', width: 20, backgroundColor: 'red', borderRadius: 20, }} />
                          </TouchableOpacity>
                        </TouchableOpacity>


                      </View>
                    )}
                  />
                </View>
                <View>
                  <FlatList
                    data={tasks}
                    renderItem={({ item, index }) => (
                      <View style={{ position: "relative", zIndex: 999, paddingTop: 10 }}>
                        <TouchableOpacity
                          onPress={() => openEditModal(index)}
                          style={[styles.taskItem, { marginStart: 20 }]}>
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
                          <TouchableOpacity
                            onPress={() => {
                              const updated = tasks.filter((task) => task !== item);
                              setTasks(updated);
                            }}
                            style={{ position: 'absolute', left: -12, top: -10 }}>
                            <Image source={Images.close} style={{ height: 20, resizeMode: 'cover', tintColor: '#fff', width: 20, backgroundColor: 'red', borderRadius: 20, }} />
                          </TouchableOpacity>
                        </TouchableOpacity>

                      </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>


              </View>
              <View style={{ marginRight: 8, }}>
                <View>
                  <FlatList
                    data={list}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                      <View style={{ position: "relative", zIndex: 999, paddingTop: 10, paddingRight: 12, }}>
                        <TouchableOpacity  style={[styles.taskItem, { marginStart: 20, alignSelf: 'flex-end' }]}>
                          <Text
                            style={{
                              color: '#000',
                              fontSize: 15,
                              padding: 14,
                              fontFamily: Fonts.DroidSans,
                            }}> {
                              (item.user__first_name + item.user__last_name).length > 15
                                ? (item.user__first_name + item.user__last_name).substring(0, 15) + '...'
                                : `${item.user__first_name} ${item.user__last_name}`
                            }
                          </Text>

                          <TouchableOpacity onPress={
                            () => {
                              setfriend_id((prev) => [...prev, item.user__id])
                              setData((prev) => [...prev, { friend__first_name: item.user__first_name, friend__id: item.user__id, friend__last_name: item.user__last_name }])
                              const updated = list.filter((friend) => item.user__id !== friend.user__id);
                              setlist(updated);
                            }
                          }
                            style={{ position: 'absolute', right: -12, top: -10 }}>
                            <Image source={Images.close} style={{ height: 20, resizeMode: 'cover', tintColor: '#fff', width: 20, backgroundColor: 'red', borderRadius: 20, }} />
                          </TouchableOpacity>
                        </TouchableOpacity>

                      </View>
                    )}
                  />
                </View>
                <View style={{}}>
                  <FlatList
                    data={friends}
                    renderItem={({ item }) => (
                      <View style={{ position: "relative", zIndex: 999, paddingTop: 10, paddingRight: 12, }}>
                        <View style={styles.taskIteml}>
                          <Text
                            style={{
                              color: '#000',
                              fontSize: 15,
                              padding: 14,
                              fontFamily: Fonts.DroidSans,
                            }}>
                          

                            {
                              item.user__first_name.length > 15 ? item.user__first_name.substring(0, 14) + '...' : item.user__first_name
                           
                            }
                          </Text>
                          <TouchableOpacity onPress={
                            () => {
                              const updated = friends.filter((friend) => item.user__id !== friend.user__id);
                              setFriends(updated);
                            }
                          }
                            style={{ position: 'absolute', right: -12, top: -10 }}>
                            <Image source={Images.close} style={{ height: 20, resizeMode: 'cover', tintColor: '#fff', width: 20, backgroundColor: 'red', borderRadius: 20, }} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              </View>

            </View>

            <View style={{ flexDirection: 'row', marginTop: 25, paddingHorizontal: 20, justifyContent: 'space-between' }}>

              <TouchableOpacity onPress={updateTask}
                disabled={loading}
                style={{ alignItems: 'center', }}
              >
                <View style={[styles.button, { height: 32, width: 100 }]}>
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={{ color: '#fff', fontFamily: Fonts.DroidSans }}>
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

          </ScrollView>
          <View style={{ marginTop: '23%', }}>
            <View style={{ height: 140, backgroundColor: color.green, alignItems: 'center', justifyContent: 'center' }}>
              <TouchableOpacity
                onPress={() => openComposer({
                  to: 'JustCheckItOff@gmail.com'
                })}
                style={{
                  height: 40, paddingHorizontal: 20, backgroundColor: '#fff',
                  alignItems: 'center', justifyContent: 'center', borderRadius: 20
                }}>
                <Text>Share your idea here!</Text>

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
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              flex:0.5,
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Task Name</Text>
            <TextInput
              placeholderTextColor={'gray'}
              style={styles.input}
              value={editedTaskName}
              onChangeText={text => setEditedTaskName(text)}
            />
            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20, }}>
              <TouchableOpacity
                disabled={loading}
                onPress={handleSaveEditedTask}
                style={{ height: 30, width: 70, borderRadius: 4, backgroundColor: color.green, alignItems: 'center', justifyContent: 'center' }}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={{ color: '#fff' }}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleEdit}
        onRequestClose={() => setmodalVisibleEdit(false)}
      >
        <TouchableOpacity onPress={() => setmodalVisibleEdit(false)} style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Task Name</Text>
            <TextInput
              placeholderTextColor={'gray'}
              style={styles.input}
              value={editName || row?.name}
              onChangeText={editname => setEditName(editname)}
            />
            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20, }}>
              <TouchableOpacity
                disabled={loading}
                onPress={handleEditTask}
                style={{ height: 30, width: 70, borderRadius: 4, backgroundColor: color.green, alignItems: 'center', justifyContent: 'center' }}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={{ color: '#fff' }}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default UpdateCreate;
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
  he: {
    marginTop:Platform.OS==='ios'? 38:10
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
  modalContent: {
    backgroundColor: 'white',
    padding: 30,

    borderRadius: 10,
    width: '80%',
    // alignItems: 'center',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
