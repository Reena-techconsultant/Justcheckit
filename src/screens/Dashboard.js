import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  StatusBar,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  Platform,
  RefreshControl,
  Alert,
  ActivityIndicator,
  BackHandler,
  PermissionsAndroid,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import React, { useEffect, useState } from 'react';
import { Fonts } from '../components/Fonts';
import { featureMissions } from '../modules/getFeatureMission';
import { useDispatch, useSelector } from 'react-redux';
import { getMission } from '../modules/getMissionSlice';
import { BASE_URL } from '../config/baseUrl';
import axios from 'axios';
import { ScrollView } from 'react-native-virtualized-view';
import { color } from '../components/color';
import Images from '../components/Images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Contacts from 'react-native-contacts';

const Dashboard = ({ navigation }) => {
  console.disableLogBox = true;
  const [homeData, setHomeData] = useState(null);
  const [mission, setMission] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [showSearchFlatList, setShowSearchFlatList] = useState(false);
  const { data } = useSelector(state => state.getMissionTaskSlice);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);

  const getPermission = () => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: 'Contacts',
      message: 'This app would like to view your contacts.',
      buttonPositive: 'Please accept bare mortal',
    }).then(res => {
      if (res === 'granted') {
        console.log(res)
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
        { phone_numbers: cont },
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
  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        Alert.alert('Alert', 'Are you sure you want to exit?', [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: 'Exit',
            onPress: () => BackHandler.exitApp(),
          },
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }, []),
  );

  const onRefresh = () => {
    setSearchText('');
    setRefreshing(true);
  };
  const DATA =
    (mission?.slice(0, 10) || []).map(item => ({
      id: item.id,
      Text: item.mission_type || '',
      image: { uri: item.category_photo || '' },
    })) || null;

  const Data =
    (homeData?.slice(0, 3) || []).map(item => ({
      id: item.id,
      name: item.name || '',
      lowerText: item.total_friends_in_mission,
      image: { uri: item.mission_detail_photo || '' },
      description: item.description,
      is_Joined: item.is_joined,
      friend_names: item.friend_names,
      tasks: item.tasks

    })) || null;

  useFocusEffect(
    React.useCallback(() => {
      setSearchText('');
      getFeatureMission();
      getMissionCategories();
    }, []),
  );
  useEffect(() => {
    loadContacts();
    getPermission();

    getFeatureMission();
    getMissionCategories();
    setRefreshing(false);

  }, [refreshing]);
  useEffect(() => {
    if (!searchText) {
      setFilteredData(Data);
    } else {
      const filtered = Data.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase()),
      );
      setFilteredData(filtered);
    }
  }, [searchText, homeData]);


  const handleJoin = async id => {
    const token = await AsyncStorage.getItem('token');
    setLoading(true);

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
      Alert.alert('Mission joined successfully');
      getFeatureMission();
    } catch (error) {
      setLoading(false);
      console.error('Error:', error);
    }
  };

  const dispatch = useDispatch();
  const getFeatureMission = () => {
    setLoading(true);
    dispatch(featureMissions()).then(response => {
      setLoading(false);
      setHomeData(response.payload?.data?.result);

    });
  };
  const getMissionCategories = () => {
    setLoading(true);
    dispatch(getMission()).then(response => {
      const missionf = response.payload?.data.result;

      if (missionf) {
        const filteredMissions = missionf.filter((item) => item.is_active === true);

        setMission(filteredMissions);
      }
      setLoading(false);
    });
  };


  const item = ({ item }) => (
    <View style={{ flex: 1 }}>
      <View style={[styles.flatlist]}>
        <View style={styles.top}>
          <TouchableOpacity
            onPress={() =>

              navigation.navigate(
                `${item.is_Joined ? 'User' : 'FeaturesTask'}`,
                {
                  name: item.name,
                  id: item.id,
                  friend_count: item.lowerText,
                  dis: item.description,
                  joined: item.is_Joined,
                  cfriend: item?.friend_names,
                  ftask: item?.tasks
                },
              )
            }
                    >
            {item.image.uri !== '' ? (
              <Image
                source={item.image}
                style={{ height: 45, width: 45, borderRadius: 4 }}
              />
            ) : (
              <Image
                source={Images.photo}
                style={{
                  height: 45,
                  tintColor: 'gray',
                  width: 45,
                  borderRadius: 4,
                }}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>

              navigation.navigate(
                `${item.is_Joined ? 'User' : 'FeaturesTask'}`,
                {
                  name: item.name,
                  id: item.id,
                  friend_count: item.lowerText,
                  dis: item.description,
                  joined: item.is_Joined,
                  cfriend: item?.friend_names,
                  ftask: item?.tasks
                },
              )
            }
            >
            <View style={{ paddingHorizontal: 5, marginTop: 4,width:'97%', flex: 1 }}>
              <Text numberOfLines={3} style={styles.text}>{item.name}</Text>
              <Text numberOfLines={2} style={[styles.lowerText, { flex: 1, width: '90%',marginTop:3 }]}>
                {item.lowerText === 0
                  ? 'No friends are participating in this mission yet'
                  : item.lowerText === 1
                    ? '1 friend is participating in this mission'
                    : `${item.lowerText} friends are participating in this mission`}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {!item.is_Joined && (
          <TouchableOpacity
            onPress={() => {
              handleJoin(item.id);
            }}>
            <Image source={Images.plus} style={{ height: 15, width: 15,marginLeft:Platform.OS==='ios'?12:12, }} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={{ flex: 1, marginHorizontal: 10, justifyContent: 'center' }}>
      <View style={styles.imageView}>
        <TouchableOpacity
          onPress={() => {
            if (item && item.id) {
              navigation.navigate('Missions', { id: item.id, name: item.Text });
            } else {
              console.error('Item or id is undefined:', item);
            }
          }}>
          {item.image.uri !== '' ? (
            <Image source={item.image} style={styles.img} />
          ) : (
            <Image
              source={Images.photo}
              style={[styles.img, { tintColor: 'gray', resizeMode: 'contain' }]}
            />
          )}
        </TouchableOpacity>
        <Text style={styles.Text}>{item.Text}</Text>
      </View>
      <View style={styles.Flatlist}></View>
    </View>
  );

  return (
    <>
      <StatusBar backgroundColor={color.green} barStyle={'dark-content'} />
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#F5F5F5' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
          <View style={styles.header}>
            <View

              style={styles.createBtn}>
              <TouchableOpacity onPress={() => navigation.navigate('CreateList')}>
                <Text style={styles.createListText}>Create Mission</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.BrowseStyle}>Browse</Text>
          </View>
          <View style={styles.src}>
            <View
              style={[
                styles.searchInput,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                },
              ]}>
              <TextInput
                placeholder="Search.."
                placeholderTextColor="black"
                style={{ flex: 1, color: 'black' }}
                value={searchText}
                onChangeText={text => {
                  setSearchText(text);
                  //  searchMission();
                }}
              />
              {/* <TouchableOpacity >
                <Image
                  source={require('../assets/Images/send.png')}
                  style={{ height: 25, width: 25, marginRight: 20 }}
                />
              </TouchableOpacity> */}
            </View>
          </View>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#9Bd35A', '#689F38']}
                progressBackgroundColor="#ffffff"
              />
            }
            style={{ flex: 1, marginTop: 27 }}>
            {searchText.length > 0 ? (
              <FlatList
                data={filteredData}
                renderItem={item}
                keyExtractor={item => item.id}
                contentContainerStyle={{
                  height: 300,
                  backgroundColor: 'red',
                }}
              />
            ) : (
              <>
                {!loading ? (
                  <>
                    <View style={styles.viewMore}>
                      <Text style={styles.missions}>Featured Missions:</Text>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('FeaturesMissions', { cfriend: homeData?.friend_names, ftask: homeData?.tasks })}>
                        {homeData?.length > 3 ? (
                          <Text style={[styles.missions, { color: color.green }]}>
                            View more
                          </Text>
                        ) : (
                          <></>
                        )}
                      </TouchableOpacity>
                    </View>
                    {Data.length === 0 ? (
                      <View
                        style={{
                          height: 200,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text style={{ color: 'black' }}>
                          No Featured Mission Available!
                        </Text>
                      </View>
                    ) : (
                      <FlatList
                        data={Data}
                        renderItem={item}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{
                          height: 300,
                          backgroundColor: 'red',
                        }}
                      />
                    )}
                    <View style={styles.viewMore}>
                      <Text style={styles.missions}>Categories:</Text>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('FeaturesMissions')}>
                        <Text
                          style={[styles.missions, { color: '#38bad1' }]}></Text>
                      </TouchableOpacity>
                    </View>
                    {DATA.length === 0 ? (
                      <View
                        style={{
                          height: 200,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text style={{ color: 'black' }}>
                          No categories Available!
                        </Text>
                      </View>
                    ) : (
                      <FlatList
                        data={DATA}
                        renderItem={renderItem}
                        numColumns={2}
                        contentContainerStyle={styles.flatListContainer}
                        keyExtractor={item => item.id.toString()}
                      />
                    )}
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
              </>
            )}

            {filteredData.length === 0 && searchText.length > 0 && (
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
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  FlatList: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    marginTop: responsiveHeight(2),
    marginHorizontal: responsiveWidth(5),
    backgroundColor: '#fff',
    paddingVertical: responsiveHeight(2),
    borderRadius: 4,
    width: responsiveWidth(90),
    height: responsiveHeight(30),
    alignSelf: 'center',
  },
  imageView: {
    backgroundColor: '#fff',
    borderWidth: 1,
    alignItems: 'center',
    marginVertical: 10,
    borderColor: '#fff',
    borderRadius: 10,
    width: responsiveWidth(45),
    height: responsiveHeight(15),
  },
  img: {
    height: responsiveHeight(10.5),
    width: responsiveWidth(41),
    marginTop: 6,
    borderRadius: 10,
  },
  top: {
    flexDirection: 'row',
    width: '88%',
    alignItems: 'center',
  },
  viewMore: {
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  Text: {
    color: 'black',
    fontFamily: Fonts.DroidSansBold,
    paddingStart: 10,
    marginTop: 4,
    fontSize: 13,
  },
  text: {
    color: 'black',
    fontWeight: '600',
    fontFamily: Fonts.DroidSansBold,
    paddingStart: 8,
    fontSize: 13,
    paddingVertical: 3,
  },
  lowerText: {
    color: 'black',
    fontFamily: Fonts.DroidSans,
    paddingStart: 8,
    fontSize: 11,
  },

  header: {
    backgroundColor: color.green,
    height: Platform.OS === 'ios' ? 180 : 120,
    width: '100%',
  },
  image: {
    height: 37,
    width: 38,
    borderRadius: 2,
  },
  missions: {
    marginTop: 3,
    color: 'black',
    fontWeight: 'bold',
    fontSize: 15,
  },
  flatListContainer: {
    backgroundColor: 'red',
  },
  src: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 160 : 100,
    width: '100%',
  },
  flatlist: {
    borderWidth: 1,
    justifyContent: 'space-between',
    borderColor: '#fff',
    marginHorizontal: 15,
    marginTop: 10,
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 4,
    paddingHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },

  searchInput: {
    borderWidth: 1,
    borderColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 8,
    height: 40,
    color: 'black',
    backgroundColor: '#fff',
    paddingStart: 10,
    fontFamily: Fonts.DroidSans,
  },
  BrowseStyle: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 24,
    marginTop: Platform.OS === 'ios' ?38 : 16,
    fontFamily: Fonts.DroidSansBold,
  },
  createBtn: {
    alignItems: 'flex-end',
    marginRight: 20,
    marginTop: Platform.OS === 'ios' ? 25 : 0,
  },
  createListText: {
    color: '#fff',
    paddingHorizontal: 14,
    borderWidth: 2,
    borderColor: '#fff',
    marginTop:  Platform.OS ==='ios' ? 25:15,
    fontSize: 11,
    // paddingTop: Platform.OS ==='ios' ? 0 : 9,
    borderRadius: 15,
    fontFamily: Fonts.DroidSansBold,
    paddingVertical: 6,
  },
});
