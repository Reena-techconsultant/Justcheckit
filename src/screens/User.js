import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import Header from '../common/Header';
import Images from '../components/Images';
import { Fonts } from '../components/Fonts';
import { useSelector } from 'react-redux';
import { color } from '../components/color';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { BASE_URL } from '../config/baseUrl';
import { RefreshControl } from 'react-native';

const CountryList = ({ navigation, route }) => {
  const flatListRef = useRef(null);
  const name = route.params.name;
  const friend_count = route.params.friend_count;
  const id = route.params.id;
  const des = route.params.dis;
  const [modalVisible, setmodalVisible] = useState(false);
  const [missionId, setMissionId] = useState();
  const [mission_name, setMission_name] = useState('');
  const [task, setTask] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const selectedImages = useSelector(state => state.missionCountSlice.users);
  const [modal, setModal] = useState(false);
  const [fullText, setFullText] = useState('');
  const [taskId, setTaskId] = useState();
  const [selectedItems, setSelectedItems] = useState([]); const openModal = (text) => {
    setFullText(text);
    setModal(true);
  };
  const [scrollOffset, setScrollOffset] = useState(0);

  const closeModal = () => {
    setModal(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
  };

  useFocusEffect(
    React.useCallback(() => {
      getTaskList();
      setRefreshing(false);
    }, []),
  );
  // tasks/101
  useEffect(() => {
    setMission_name(route.params.name);
    getTaskList();
    setRefreshing(false);
  }, [refreshing]);

  useEffect(() => {
    if(flatListRef.current !== null && flatListRef.current) {
      const currentList = flatListRef.current
      if(scrollOffset === 0) return
      setTimeout(() => {
        currentList.scrollToOffset({ offset: scrollOffset, animated: true });
      },2000);
    }  
  },[loading])


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
      setTask(res.data.tasks_data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const handleCheckboxPress = async (obj) => {
    const updatedItems = selectedItems.includes(obj.tid)
      ? selectedItems.filter((item) => item !== obj.tid)
      : [...selectedItems, obj.tid];
    setSelectedItems(updatedItems);
    try {
      await handleCheck(obj);
      //}
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheck = async obj => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    const formData = new FormData();
    formData.append('name', obj.name);
    formData.append('mission', obj.id);
    formData.append('mission_task', obj.tid);
    try {
      const res = await axios.post(`${BASE_URL}data/tasks/`, formData, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setRefreshing(true)
      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.log(error);
    }
  };
  const renderItem = ({ item, index }) => {
    const serialCount = index + 1;
    return (
      <>
        <View
          style={styles.checkboxContainer}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.text, { marginTop: 4 }]}>{serialCount}</Text>
              {selectedItems.includes(item.id) && (
                <View style={{
                  
                  
                  backgroundColor: "transparent", }}></View>
              )}
            </View>
            <TouchableOpacity onPress={() => openModal(item.name)}>
              <Text style={[styles.text, { marginLeft: 33, }]}>
                {item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name}
              </Text>
            </TouchableOpacity>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modal}
              onRequestClose={closeModal}
            >
              <TouchableOpacity onPress={closeModal} style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={{color:'black'}}>{fullText}</Text>
                </View>
              </TouchableOpacity>
            </Modal>

            <TouchableOpacity
            onPress={() =>
              navigation.navigate(
                `${item?.complete_task ? 'ShowPhotos' : 'SelectImage'}`,
                { id: missionId, name: item.name, tid: item.id },
              )
            }
              style={{ flexDirection: 'row', alignItems: 'center' }}>
              {item.complete_task === false ? (
                <View style={{ height: 15, width: 15, backgroundColor: "transparent", marginRight: 10 }}></View>
              ) : (
                <>

                  {item.is_edit === false && (<Image
                    style={{ marginRight: 10 }}
                    source={require('../assets/Images/upload1.png')}
                  />)}

                </>
              )}
              {item.is_edit === true && item.complete_task === true && (
                <>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate(
                        'EditImage',
                        { id: item.task_id, name: item.name, tid: item.id,  },
                      )
                    }
                    >
                    <Image
                      style={{ marginRight: 10, height: 16, width: 16, tintColor: 'gray', }}
                      source={require('../assets/Images/editing.png')}
                    />
                  </TouchableOpacity>

                </>

              )}
            
              <TouchableOpacity
                onPress={() => handleCheckboxPress({ id: missionId, name: item.name, tid: item.id })}
                style={[
                  styles.checkbox,
                  { alignItems: 'center', justifyContent: 'center' },
                ]}
              >
               
                <TouchableOpacity
                  onPress={() => {
                    if (item.complete_task === true) {
                      Alert.alert(
                        'Confirmation',
                        'Are you sure you want to delete this task?',
                        [
                          {
                            text: 'Cancel',
                            style: 'cancel',
                          },
                          {
                            text: 'Yes',
                            onPress: async () => {
                              try {
                                setLoading(true);
                               
                                const token = await AsyncStorage.getItem(
                                  'token',
                                );
                                const response = await axios.delete(
                                  `${BASE_URL}/data/tasks/${item.task_id}`,
                                  {
                                    headers: {
                                      Authorization: `Token ${token}`,
                                    },
                                  },
                                );
                               
                                setLoading(false);
                                getTaskList();
                              } catch (error) {
                                setLoading(false);
                                console.error('Error deleting task:', error);
                              }
                            },
                          },
                        ],
                        { cancelable: false }, 
                      );
                    }
                  }}
                  style={{ flexDirection: 'row', gap: 2 }}>
                  {item.complete_task === false ? (
                    <></>
                  ) : (
                    <>
                    <View style={{height:25,width:25,alignItems:'center',justifyContent:'center'}}>
                    <Image
                        source={require('../assets/Images/tick.png')}
                        style={styles.tickImage}
                      />
                    </View>
                   
                    </>
                  )}
                </TouchableOpacity>


              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  };
  const onPressBack = () => {
    navigation.navigate('Home');
  };

  const onScroll = (event) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };
 
  return (
    <>
      <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
        <Header
          Header={name}
          back={Images.back}
          img={Images.info}
          headerStyle={
            name.length < 40? styles.btm: styles.ce
          }
          navigation={navigation}
          backOnPress={onPressBack}
          infoOnpress={() => setmodalVisible(true)}
          info={true}
          showProgress
          isCenterShown
          centerText= {!loading
            ? friend_count === 0
                ? 'No friends are participating in this mission yet'
                : friend_count === 1
                    ? '1 friend is participating in this mission'
                    : `${friend_count} friends are participating in this mission`
            : ''}
          
          centerStyle={styles.center}
          onPressCenter={() => {
            if (friend_count > 0) {
              navigation.navigate('Leaderboard', {
                id: missionId,
                count: friend_count,
              });
            }
          }}
        />

        <View style={styles.container}>
          <View
            style={{
              flexDirection: 'row',
              paddingBottom: 10,
              paddingHorizontal: 10,
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                color: '#000',
                fontWeight: 'bold',
                fontFamily: Fonts.DroidSans,
              }}>
              #
            </Text>
            <Text
              style={{
                color: '#000',
                fontWeight: 'bold',
                fontFamily: Fonts.DroidSans,
              }}>
              Task
            </Text>
            <Text style={{ color: '#000', fontWeight: 'bold', marginRight: 11 }}>
              {' '}
            </Text>
          </View>
          {!loading ? (
            <View>
            {task.length > 0 ? (
              <FlatList
                ref={flatListRef}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['#9Bd35A', '#689F38']}
                    progressBackgroundColor="#ffffff"
                  />
                }
                onScroll={onScroll}
                data={task}
                renderItem={renderItem}
                keyExtractor={item => item.name}
                contentContainerStyle={styles.flatListContainer}
              />
            ) : (
              <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'black' }}>No task available!</Text>
              </View>
            )}
          </View>
          ) : (
            <View
              style={{
                flex: 1,
                height: 200,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ActivityIndicator />
            </View>
          )}
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setmodalVisible(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            paddingHorizontal: 30,
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              paddingTop: 20,
              borderRadius: 10,
            }}>
            <TouchableOpacity
              onPress={() => setmodalVisible(false)}
              style={{ alignSelf: 'flex-end' }}>
              <Image
                source={Images.close}
                style={{
                  height: 28,
                  width: 28,
                  tintColor: 'gray',
                  marginRight: 10,
                }}
              />
            </TouchableOpacity>
            <Text
              style={{
                color: color.green,
                fontFamily: Fonts.DroidSansBold,
                fontSize: 18,
              }}>
              Description
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: 'gray',
                fontFamily: Fonts.DroidSans,
                paddingBottom: 30,
                textAlign: 'center',
                marginTop: 15,
                lineHeight: 17,
              }}>
              {des ? des : 'No description to show'}
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 6,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  flatListContainer: {
    paddingBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  center: {
    marginTop: 8,
    fontSize: 13,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkboxContainer: {
    marginBottom: 12,
    backgroundColor: '#fff',
    padding: 16,
  },
  checkbox: {
    height: 24,
    width: 24,
    borderRadius: 4,
    backgroundColor: '#D9D9D9',
  },
  text: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
    fontFamily: Fonts.DroidSansBold,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 10,
    color: 'blue',
  },
  checkboxUnchecked: {
    height: 24,
    width: 24,
    borderRadius: 4,
    backgroundColor: '#D9D9D9',
  },
  // btm:{
  //   marginTop:Platform.OS==='ios'? 38:10
    
  // },
  // ce:{
  //   marginTop:26,
  //   fontSize:17
  // },
  btm:{
    marginTop:Platform.OS==='ios'? 38: 0,
    
      },
      ce:{
        marginTop:Platform.OS==='ios'? 26: -2,
        fontSize:17
      },
  checkboxChecked: {
    height: 24,
    width: 24,
    borderRadius: 4,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CountryList;
