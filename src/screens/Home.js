import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text as RNText,
  Image,
  TouchableOpacity,
  View,
  Platform,
  RefreshControl,
  ActivityIndicator,
  Alert,
  TextInput
} from 'react-native';
import Header from '../common/Header';
import { Fonts } from '../components/Fonts';
import { Svg, Ellipse, Circle, Text } from 'react-native-svg';
import Images from '../components/Images';
import { searchMission, } from '../modules/searchMissionSlice';
import Swipeout from 'react-native-swipeout';
import axios from 'axios';
import { BASE_URL } from '../config/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RBSheet from 'react-native-raw-bottom-sheet';
import { ScrollView } from 'react-native';
import { Modal } from 'react-native';
import { useDispatch } from 'react-redux';

const Home = ({ route }) => {
  const navigation = useNavigation();

  const OvalProgressBar = ({ progress }) => {
    const diameter = 40;
    const strokeWidth = 5;
    const radius = (diameter - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progressValue = circumference * (1 - progress / 100);
    const percentage = Math.round(progress);

    const textX = diameter / 2;
    const textY = diameter / 2;

    return (
      <Svg height={diameter} width={diameter}>
        <Circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          fill="transparent"
          stroke="#D9D9D9"
          strokeWidth={strokeWidth}
        />

        <Circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          fill="transparent"
          stroke="#DA423C"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={progressValue}
          strokeLinecap="round"
          transform={`rotate(-90 ${diameter / 2} ${diameter / 2})`}
        />

        <Text
          x={diameter / 2}
          y={diameter / 2}
          textAnchor="middle"
          alignmentBaseline="middle"
          fill="#DA423C"
          fontSize="10">
          {`${percentage}%`}
        </Text>
      </Svg>
    );
  };
  const [mission, setMission] = useState([]);
  const [mission_name, setMission_name] = useState('');
  const [searchText, setSearchText] = useState('');
  const [showData, setShowData] = useState([]);
  const [filteredMission, setFilteredMission] = useState([]);
  const [loading, setLoading] = useState(true);
  const bottomSheetRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setmodalVisible] = useState(false);
  const [name, setName] = useState('');
  const [dis, setDis] = useState('');
  const [value, setValue] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const onRefresh = () => {
    setSearchText('');
    setRefreshing(true);

  };
  const dispatch = useDispatch();

  const [missions, setMissions] = useState([]);


  const renderPickerItems = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleSelect(item.mission_type)}
      style={styles.map}>
      <View style={styles.circleLabel}></View>
      <RNText style={{ color: 'black' }}>{item.mission_type} </RNText>
    </TouchableOpacity>
  );
  const isFocused = useIsFocused();

  const openBottomSheet = () => {
    navigation.navigate('UserSettings')
    // bottomSheetRef.current.open();
  };

  useFocusEffect(
    React.useCallback(() => {
      setValue(null);
      getUserMissionList();
      searchMission();
      setRefreshing(false);
    }, []),
  );

  useEffect(() => {
    getUserMissionList();
    setRefreshing(false);
    return () => {
      setShowData([]);
      setSearchText('');
    };

  }, [refreshing]);

  useEffect(() => {
    if (isFocused) {
      setShowData([]);
      setSearchText('');
    }
    setRefreshing(false);
  }, [isFocused]);

  useEffect(() => {
    if (!searchText) {
      setFilteredMission(mission);
    } else {
      const filtered = mission.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase()),
      );
      setFilteredMission(filtered);
    }
    setRefreshing(false);
  }, [searchText, mission]);

  const getUserMissionList = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await axios.get(`${BASE_URL}data/my-missions/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setLoading(false);
      setMission(res.data.data);
    } catch (error) {
      setLoading(false);
    }
  };




  const OvalProgressBarItem = ({ item, onDelete, onUpdate }) => {
    return (
      <Swipeout
        right={[
          {
            backgroundColor: 'transparent',
            onPress: () => handleDelete(item.mission_detail_id),
            component: (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 18, }}>
                <Image source={require('../assets/Images/del.png')} style={{ width: 24, height: 24, tintColor: 'gray' }} />
              </View>
            ),
          },
        ]}
        autoClose={true}
        backgroundColor="transparent"
      >
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('User',
              {
                name: item.name,
                id: item.mission_detail_id,
                friend_count: item.friend_count,
                dis: item.description,
                mission_category: item.mission_category_name,


              })
          }
          style={styles.flatlist}>
          <OvalProgressBar progress={item.percentage} />
          <View style={{ paddingStart: 15, width: '88%', marginTop: 5 }}>
            <RNText style={styles.text}>{item.name}</RNText>
            <RNText
              style={[
                styles.text,
                { color: 'black', flex: 1, paddingTop: 2, paddingRight: 30, fontFamily: Fonts.DroidSans, fontSize: 11 },
              ]}>
            
              {item?.friend_count === 0
                ? 'No friends are participating in this mission yet'
                : item?.friend_count === 1
                  ? '1 friend is participating in this mission'
                  : `${item?.friend_count} friends are participating in this mission`}

            </RNText>
          </View>
          {item?.check_mission === true ? (
            <>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(
                    `${item?.check_mission === true ? 'UpdateCreate' : 'User'}`,
                    {
                      name: item.name,
                      id: item.mission_detail_id,
                      friend_count: item.friend_count,
                      dis: item.description,
                      mission_category: item.mission_category_name,
                      catId: item.mission_category,
                      friendList: item.user_friend_name,
                      frnd_not_join: item.user_friend_name_not_join_mission
                    })
                }
                style={{}}
              >
                <Image source={Images.editing} style={{ height: 24, width: 24, tintColor: 'gray', }} />
              </TouchableOpacity>
            </>
          ) : (
            <View style={{ height: 24, width: 24, backgroundColor: 'tranparent' }}>

            </View>
          )}

        </TouchableOpacity>
      </Swipeout>
    );
  };
  const handleDelete = async (id) => {
    const newData = filteredMission.filter((item) => item.mission_detail_id !== id);
    setFilteredMission(newData);

    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`${BASE_URL}data/user-missions-del/${id}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      Alert.alert("Mission deleted successfully")

    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };



  const handleSelect = selectedValue => {
    setValue(selectedValue);
    setShowPicker(false);
  };



  const renderItem = ({ item }) => (
    <>
      <View style={{ flex: 1 }}>
        <OvalProgressBarItem item={item} onDelete={handleDelete} />
      </View>

    </>
  );
  const onPressBack = () => {
    navigation.navigate('Dashboard');
  };
  return (
    <>
      <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
        <Header
          backOnPress={onPressBack}
          Header={'My Missions'}
          back={Images.back}
          headerStyle={styles.he}
          infoStyle={styles.info}
          info={Images.settings}
          navigation={navigation}
          infoOnpress={openBottomSheet}
          img={Images.settings}
        />
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
              }}
            />
          </View>
        </View>
        <View style={{ flex: 1, marginTop: 15 }}>
          {!loading ? (
            <>
              {filteredMission.length === 0 ? (
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
                 <RNText style={{ color: 'black' }}>No data found!</RNText>
               </View>
              ) : (
                <>
                  <FlatList
                    data={filteredMission}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.container}
                    refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#9Bd35A', '#689F38']}
                        progressBackgroundColor="#ffffff"
                      />
                    }
                  />
                </>
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
        </View>

      </View>

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
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
  src: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 160 : 100,
    width: '100%',
  },
  flatlist: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#fff',
    marginHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    paddingVertical: 6,

    borderRadius: 4,
  },
  map: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingStart: 15,
    borderColor: '#F2EFEF',
    borderBottomWidth: 0.5,
    padding: 7,
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
  modalContent: {
    backgroundColor: 'white',
    padding: 30,

    borderRadius: 10,
    width: '80%',
    // alignItems: 'center',
  },
  progressBarContainer: {},
  text: {
    color: '#000',
    fontSize: 14,
    fontFamily: Fonts.DroidSansBold,
  },
  he: {
    marginTop:Platform.OS==='ios'? 38:10
  },
  name: {
    color: '#000',
    marginTop: 10,
    fontWeight: '500',
    fontFamily: Fonts.DroidSans,
  },
  btmtext: {
    color: '#000',
    fontSize: 12,
    marginTop: 4,
    fontFamily: Fonts.DroidSans,
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
    width: '100%',
    borderWidth: 1,
    borderColor: '#F5F5F5',
    fontFamily: Fonts.DroidSans,
    backgroundColor: '#fff',
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

  info: {
    height: 25,
    width: 25
  }

});

export default Home;
