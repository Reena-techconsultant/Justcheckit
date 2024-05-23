import React, { useEffect, useState } from 'react';
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

const FriendsMissionTask = ({ navigation, route }) => {
  const name = route.params.name;
  const friend_count = route.params.friend_count;
  const id = route.params.id;
  const des = route.params.dis;
  const isjoined = route.params.joined;
  const fd = route.params.friends
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
  const openModal = (text) => {
    setFullText(text);
    setModal(true);
  };
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

  useEffect(() => {
    setMission_name(route.params.name);
    getTaskList();
    setRefreshing(false);
  }, [refreshing]);

  const handleDelete = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const deltetask = await axios.delete(`${BASE_URL}data/tasks/${taskId}`, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      })

    } catch (error) {
      console.log(error);
    }
  }


  const getTaskList = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    try {
      const value = await AsyncStorage.getItem('user_id');

      let data = {
        id: id,
        fd: fd
      }
      const res = await axios.get(
        `${BASE_URL}data/user-friend-mission-details/?mission_id=${id}&friend_id=${fd}`,
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
            </View>

            <TouchableOpacity onPress={() => openModal(item.name)}>
              <Text style={[styles.text, { marginLeft: 33 }]}>
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
              onPress={() => {
                if (item?.complete_task) {
                  navigation.navigate('ShowFriendPhotos', { fid: fd, name: item.name, tid: item.id });
                } else {

                }
              }}

              style={{ flexDirection: 'row', alignItems: 'center' }}>
              {item.complete_task === false ? (
                <View style={{ height: 15, width: 15, backgroundColor: "transparent", marginRight: 10 }}></View>
              ) : (
                <Image
                  style={{ marginRight: 10 }}
                  source={require('../assets/Images/upload1.png')}
                />
              )}
              <TouchableOpacity
            
                style={[
                  styles.checkbox,
                  { alignItems: 'center', justifyContent: 'center' },
                ]}>

                <TouchableOpacity

                  style={{ flexDirection: 'row', gap: 2 }}>
                  {item.complete_task === false ? (
                    <></>
                  ) : (
                    <>
                      <Image
                        source={require('../assets/Images/tick.png')}
                        style={styles.tickImage}
                      />
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
  const handleJoinClick = async () => {
    const token = await AsyncStorage.getItem('token');
    const missionId = id;
    try {
      const response = await axios.post(
        `${BASE_URL}data/my-missions/?mission_id=${missionId}`,
        null,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
   
      navigation.goBack();
      Alert.alert('Mission Joined Successfully');
    } catch (error) {
      navigation.goBack();
      Alert.alert('Failed to join mission');
      console.error('Error:', error);
    }
  };
  return (
    <>
      <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
        <Header
          Header={name}
          back={Images.back}
          img={Images.info}
          navigation={navigation}
          backOnPress={onPressBack}
          infoOnpress={() => setmodalVisible(true)}
          info={true}
          showProgress
          isCenterShown
          styleinfo={styles.styleinfo}
          joinWithInfo
        
          join={!isjoined}
          joinOnpress={handleJoinClick}
          centerStyle={styles.center}
      
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
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                      colors={['#9Bd35A', '#689F38']}
                      progressBackgroundColor="#ffffff"
                    />
                  }
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
  styleinfo: {
    marginTop: 4,
    marginLeft: 20
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
  checkboxChecked: {
    height: 24,
    width: 24,
    borderRadius: 4,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
  },

});

export default FriendsMissionTask;
