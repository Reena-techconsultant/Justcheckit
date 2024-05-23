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

const FriendsMissions = ({ route }) => {
  const navigation = useNavigation();
  const fname = route?.params?.name
  const friends = route?.params?.friend
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
  const [searchText, setSearchText] = useState('');
  const [showData, setShowData] = useState([]);
  const [filteredMission, setFilteredMission] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setSearchText('');
    setRefreshing(true);

  };  
  const Data =
  mission?.map(item => ({
    id: item.mission_detail_id,
    is_joined: item.is_joined,
    name: item.name ,
    description:item.description,
    friend_count: item.friend_count ,
    image: {uri: item.mission_detail_photo},
    percentage:item.percentage
  })) || [];

  const OvalProgressBarItem = ({ item, onDelete, onUpdate }) => {
    return (

      <TouchableOpacity
        onPress={() =>
          navigation.navigate('FriendsMissionTask',
            {
              name: item.name,
              id: item.id,
              friends: friends,
              friend_count: item.friend_count,
              dis: item.description,
              mission_category: item.mission_category_name,
              joined:item.is_joined
            })
        }
        style={styles.flatlist}>
        <OvalProgressBar progress={item.percentage} />
        <View style={{ paddingStart: 15, width: '88%',}}>
          <RNText style={styles.text}>{item.name}</RNText>
        

        </View>
        {!item.is_joined ? (
          <TouchableOpacity
            onPress={() => {
              handleJoin(item.id);
            }}>
            <Image source={Images.plus} style={{ height: 15, width: 15 }} />
          </TouchableOpacity>
        ):(
          <View style={{ height: 15, width: 15 }}>

          </View>
        )
        }
      </TouchableOpacity>

    );
  };


  const handleJoin = async id => {
    const missionId = id;
    const token = await AsyncStorage.getItem('token');
    setLoading(true);

   
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
      getUserMissionList();
    } catch (error) {
      setLoading(false);
      console.error('Error:', error);
    }
  };

  const isFocused = useIsFocused();

  const openBottomSheet = () => {
    navigation.navigate('UserSettings')
  };

  useFocusEffect(
    React.useCallback(() => {
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
    const res = `${BASE_URL}user-my-missions/?friend_id=${friends}`;
    try {
      const res = await axios.get(`${BASE_URL}data/user-my-missions/?friend_id=${friends}`, {
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

  const renderItem = ({ item }) => (
    <>
      <View style={{ flex: 1 }}>
        <OvalProgressBarItem item={item} />
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
          Header={`${fname?.charAt(0).toUpperCase() + fname.slice(1)
          }'s Missions`}
          back={Images.back}
          headerStyle={styles.he}
          infoStyle={styles.info}
          navigation={navigation}
          infoOnpress={openBottomSheet}
          img={Images.settings}
        />
        <View style={{ flex: 1, marginTop: 15 }}>
          {!loading ? (
            <>
              {filteredMission.length === 0 ? (
                <View
                  style={{
                    height: 300,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <RNText style={{ color: 'black' }}>
                    Your friend has not joined any mission !
                  </RNText>
                </View>
              ) : (
                <>
                  <FlatList
                    data={Data}
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
    top: Platform.OS === 'ios' ? 130 : 100,
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

export default FriendsMissions;
