import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Header from '../common/Header';
import Images from '../components/Images';
import {Fonts} from '../components/Fonts';
import {useDispatch, useSelector} from 'react-redux';
import {color} from '../components/color';
import {getAdminTask} from '../modules/getAdminTaskSlice';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../config/baseUrl';
import { RefreshControl } from 'react-native';

const AdminTask = ({navigation, route}) => {
  const id = route.params.id;
  const name = route.params.name;
  const dis = route.params.dis; 
  const ftask = route.params.ftask;
  const cfriend = route.params.cfriend; 
  const isjoined = route.params.joined;
  const friendCount = route.params.friend_count;
  const [modalVisible, setmodalVisible] = useState(false);
  const [friendList, setFriendList] = useState([]);
  const [showImage, setShowImage] = useState(false);
  const [isJoinClicked, setIsJoinClicked] = useState(false);
  const [isInfo, setIsInfo] = useState(false);
  const [join, setJoin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modal, setModal] = useState(false);
  const [fullText, setFullText] = useState('');

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
  const dispatch = useDispatch();
  const Data =
    friendList?.map(item => ({
      id: item.id,
      name: item.name || '',
      progress: item.completed_percentage || 0,
      user_status: item.user_status || 'Not Completed',
    })) || [];

  useEffect(() => {
    getFriendsList();
    isJoined();
    setRefreshing(false);
  }, [isJoinClicked,refreshing]);

  const isJoined = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await axios.get(
        `${BASE_URL}data/joined-mission/?mission_name=${name}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      setJoin(res.data.mission_joined);
    } catch (error) {
      console.log(error);
    }
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

  const getFriendsList = () => {
    setLoading(true);
    let data = {
      mission: id,
    };
    dispatch(getAdminTask(data.mission)).then(response => {
      setFriendList(response.payload.data.result);
      setLoading(false);
    });
  };
 
  const handlePress = () => {
    if (!join === true) {
      Alert.alert('Would you like to join this mission?', 'Please join the mission before proceeding.');
    }
  };
  const renderItem = ({item, index}) => {
    const serialCount = index + 1;
    return (
      <TouchableOpacity
      onPress={handlePress}
      style={styles.checkboxContainer}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.text}>{serialCount}</Text>
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
        onPress={handlePress}
        style={styles.checkbox}></TouchableOpacity>
      </TouchableOpacity>
    );
  };
  const onPressBack = () => {
    navigation.goBack();
  };
  const onPressCenter = () => {
    if (friendCount > 0) {
      navigation.navigate('CommonFriends', { cfriend: cfriend, ftask: ftask });
    }
  };

  return (
    <>
      <View style={{flex: 1, backgroundColor: '#F5F5F5'}}>
        <Header
          backOnPress={onPressBack}
          Header={name}
          headerStyle={
            name.length < 40? styles.he: styles.ce
          }
          back={Images.back}
          join={!isjoined}
          navigation={navigation}
          infoOnpress={() => setmodalVisible(true)}
          showProgress
          information={!isInfo}
          joinWithInfo
          isCenterShown
          centerStyle={styles.center}
          centerText= {!loading
            ? friendCount === 0
                ? 'No friends are participating in this mission yet'
                : friendCount === 1
                    ? '1 friend is participating in this mission'
                    : `${friendCount} friends are participating in this mission`
            : ''}
  
          joinOnpress={handleJoinClick}
        
           onPressCenter={onPressCenter}
         
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
              {' '}
              Task
            </Text>
            <Text style={{color: '#000', fontWeight: 'bold', marginRight: 11}}>
              {' '}
            </Text>
          </View>
          {!loading ? (
            <View>
                        {Data.length > 0? (
            <FlatList
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#9Bd35A', '#689F38']}
                progressBackgroundColor="#ffffff"
              />
            }
              data={Data}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.flatListContainer}
            />
          ):(
            <View style={{height:200,justifyContent:'center' , alignItems:'center'}}>
              <Text style={{color:'black'}}>No tasks available!</Text>
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
              style={{alignSelf: 'flex-end'}}>
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
              {dis ? dis : 'No description to show'}
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
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  center: {
    marginTop: 8,
    fontSize: 13,
  },
  checkboxContainer: {
    marginBottom: 12,
    backgroundColor: '#fff',
    padding: 16,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  he:{
    marginTop:Platform.OS==='ios'? 27: 0,
    
      },
      ce:{
        marginTop:Platform.OS==='ios'? 16: -10,
        fontSize:17
      },
  checkbox: {
    height: 24,
    width: 24,
    borderRadius: 4,
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    color: '#000',
    fontFamily: Fonts.DroidSans,
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
});

export default AdminTask;
