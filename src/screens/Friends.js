import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from 'react-native';
import Share from 'react-native-share';
import React, { useEffect, useRef, useState } from 'react';
import Header from '../common/Header';
import Images from '../components/Images';
import { Fonts } from '../components/Fonts';
import RBSheet from 'react-native-raw-bottom-sheet';
import { color } from '../components/color';
import axios from 'axios';
import { BASE_URL } from '../config/baseUrl';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-virtualized-view';

const Friends = ({ navigation }) => {
  const [newsfeedData, setNewsfeedData] = useState([]);
  const [type, setType] = useState('');
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const bottomSheetRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const [imgloading, setimgLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const handleImagePress = imageUri => {
    setSelectedImage(imageUri);
    setModalVisible(true);
  };
  const onRefresh = () => {

    setRefreshing(true);
  };

  const getFeed = async () => {
    setLoading(true)
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await axios.get(
        `${BASE_URL}data/common-friends-feed/?category=${type}`,
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      setLoading(false);
      setNewsfeedData(res.data);
    } catch (error) {
      setLoading(false);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      getFeed();
      getTypes();
    }, []),
  );

  const getTypes = async () => {
    const token = await AsyncStorage.getItem('token');
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}data/mission-type/`, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      //setLoading(false);

      setTypes(res.data.data.result);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getTypes();
    getFeed();
    setRefreshing(false);
  }, [type, refreshing]);

  const shareContent = async () => {
    try {
      const options = {
        message: 'Check out this awesome content!',
        url: 'https://apps.apple.com/in/app/justcheckit/id6479005091',
        title: 'Share Content',
      };
      await Share.open(options);
    } catch (error) {
      console.error('Error sharing content:', error);
    }
  };
  const openBottomSheet = () => {
    bottomSheetRef.current.open();
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current.close();
  };
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ShowPhotos', { id: item.mission, name: item.mission_name, tid: item.mission_task, userId: item.user })}

      style={styles.FlatList}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('FriendsMissions', { name: item.username, friend: item.user })}
          style={styles.user}>
          <Text style={styles.userName}>
            {item?.username.slice(0, 1).toUpperCase()}
          </Text>
        </TouchableOpacity>

        <Text
          numberOfLines={3}
          style={[
            styles.HeaderText,
            { flex: 1 },
          ]}>'{`${item?.username}' has Completed the Task '${item?.name}'  from '${item?.mission_name}'`}</Text>
      </View>
      <View style={{ paddingStart: 40, marginTop: 5 }}>
        <Text numberOfLines={2} style={styles.bottomText}>
          {item?.description}
        </Text>
        <View style={{ flexDirection: 'row', paddingStart: 10, marginTop: 5 }}>
          {item.first_pic && (
            <TouchableOpacity onPress={() => handleImagePress(item.first_pic)}>
              <Image source={{ uri: item.first_pic }} style={styles.img} />
            </TouchableOpacity>
          )}

          {item.second_pic && (
            <TouchableOpacity onPress={() => handleImagePress(item.second_pic)}>
              <Image source={{ uri: item.second_pic }} style={[styles.img, { marginLeft: 8 }]} />
            </TouchableOpacity>
          )}

          {item.third_pic && (
            <TouchableOpacity onPress={() => handleImagePress(item.third_pic)}>
              <Image source={{ uri: item.third_pic }} style={[styles.img, { marginLeft: 8 }]} />
            </TouchableOpacity>
          )}

          {item.fourth_pic && (
            <TouchableOpacity onPress={() => handleImagePress(item.fourth_pic)}>
              <Image source={{ uri: item.fourth_pic }} style={[styles.img, { marginLeft: 8 }]} />
            </TouchableOpacity>
          )}

          <Modal visible={modalVisible} transparent={true}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalBackground}>
              {imgloading && <ActivityIndicator style={styles.activityIndicator} size="large" color="#000" />}
              <Image
                source={{ uri: selectedImage }}
                style={[styles.modalImage, imgloading && { display: 'none' }]}
                onLoadStart={() => setimgLoading(true)}
                onLoadEnd={() => setimgLoading(false)}
              />
            </TouchableOpacity>
          </Modal>
        </View>
      </View>
    </TouchableOpacity>
  );
  return (
    <>
      <Header
        shareOnpress={shareContent}
        // Header={'Friends'}
        top
        HeaderTop={'Friends'}
        headerStyle={styles.bo}
        navigation={navigation}
        back={Images.back}
        centerStyle={styles.centerStyle}
        friends
        addfriends
        showShare
        upload
        onPressAdd={() => navigation.navigate('FriendRequest')}
        filterOnpress={openBottomSheet}
        onPressFrnd={() => navigation.navigate('FriendsList')}
        frnds={Images.friends}

      />
      <View style={{ flex: 1, paddingTop: 15, backgroundColor: '#F5F5F5' }}>
        {!loading ? (
          <>
            {newsfeedData.length > 0 ? (
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['#9Bd35A', '#689F38']}
                    progressBackgroundColor="#ffffff"
                  />
                }
                data={newsfeedData}
                renderItem={renderItem}
                keyExtractor={item => item.id}
              />
            ) : (
              <View
                style={{
                  height: 400,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={Images.photo}
                  style={{ marginBottom: 10, height: 40, width: 40 }}
                />
                <Text style={{ color: 'black' }}>No data found!</Text>
              </View>
            )}

            <RBSheet
              ref={bottomSheetRef}
              closeOnDragDown={true}
              height={350}
              openDuration={250}
              customStyles={{
                container: {
                  padding: 20,

                  borderRadius: 30,
                },
              }}>
              <Text
                style={{
                  fontSize: 18,
                  textAlign: 'center',
                  fontFamily: Fonts.DroidSansBold,
                  color: color.green,
                  marginBottom: 10,
                }}>
                Filter By Category
              </Text>
              <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                <View style={{ marginTop: 19 }}>
                  {types.length === 0 ? (
                    <View
                      style={{
                        height: 200,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text style={{ color: 'black' }}>
                        No categories available!
                      </Text>
                    </View>
                  ) : (
                    <>
                      {types.map(item => (
                        <TouchableOpacity
                          key={item.id}
                          onPress={() => {
                            setType(item.id);
                            closeBottomSheet();
                          }}>
                          <View
                            style={{
                              borderWidth: 1,
                              borderColor: '#F5F5F5',
                              padding: 5,
                              borderRadius: 4,
                              marginBottom: 10,
                            }}>
                            <Text
                              style={{
                                color: 'black',
                                fontFamily: Fonts.DroidSans,
                                fontSize: 17,
                              }}>
                              {item.mission_type}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </>
                  )}
                </View>
              </ScrollView>
            </RBSheet>
          </>
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

    </>
  );
};

export default Friends;

const styles = StyleSheet.create({
  btn: {
    height: 40,
    width: 120,
    marginTop: 20,
  },
  images: {
    height: 50,
    width: 50,
    borderRadius: 4,
  },
  user: {
    height: 35,
    width: 35,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.green,
  },
  bo: {
    marginBottom: Platform.OS === 'ios' ? -20 : 0,
    position: 'relative',
    bottom: Platform.OS === 'ios' ? 0 : 27
  },
  FlatList: {
    flex: 1,
    backgroundColor: '#FFFFFF',

    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: '#F5F5F5',
    borderRadius: 8,
    marginHorizontal: 20,
    justifyContent: 'space-between',
    marginTop: 20,
  },
  userName: {
    color: '#fff',
    fontSize: 12,
    fontFamily: Fonts.DroidSans,
  },
  img: {
    height: 42,
    width: 42,
    borderRadius: 4,
    marginLeft: 7,
  },
  HeaderText: {
    // padding: 10,
    fontWeight: '600',
    paddingStart: 10,
    color: 'black',
    fontSize: 14,

    fontFamily: Fonts.DroidSans,
  },
  // btm:{
  //   marginBottom:20,
  //   color:'red',
  // },

  bottomText: {
    flex: 1,
    paddingStart: 7,
    paddingBottom: 4,

    color: 'gray',
    fontSize: 13,
    fontFamily: Fonts.DroidSans,
  },
  images: {
    width: 100,
    height: 100,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },

});
