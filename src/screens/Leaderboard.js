import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text as RNText,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {Svg, Ellipse, Circle, Text} from 'react-native-svg';
import Header from '../common/Header';
import Images from '../components/Images';
import {useDispatch} from 'react-redux';
import {Fonts} from '../components/Fonts';
import {color} from '../components/color';
import axios from 'axios';
import {BASE_URL} from '../config/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RefreshControl } from 'react-native';

const Leaderboard = ({navigation, route}) => {
  const id = route.params.id;
  const count = route.params.count;
  const OvalProgressBar = ({progress}) => {
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

  const [refreshing, setRefreshing] = useState(false);
  

  const onRefresh = () => {
  
    setRefreshing(true);
  };
  const [friendList, setFriendList] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const Data =
    friendList?.map(item => ({
      id: item.id,
      text: `${(item.friend_first_name || '').charAt(0).toUpperCase()}${(
        item.friend_first_name || ''
      ).slice(1)} ${(item.friend_last_name || '').charAt(0).toUpperCase()}${(
        item.friend_last_name || ''
      ).slice(1)}`,
      progress: item.completed_percentage || 0,
      friend_first_name: item.friend_first_name,
      profile: item.friend_first_name
        ? item.friend_first_name.charAt(0).toUpperCase()
        : '',
      mission_name: item.mission_name,
      id: item.friend_user_id,
    })) || [];
  useEffect(() => {
    getFriendsList();
    setRefreshing(false);
  }, [refreshing]);

  const getFriendsList = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');

    try {
      const res = await axios.get(
        `${BASE_URL}data/leaderboard-by-mission/?mission=${id}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      setFriendList(res.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const renderItem = ({item, index}) => (
    <View style={{flex: 1}}>
      <OvalProgressBarItem item={item} index={index} />
    </View>
  );

  const OvalProgressBarItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('MyProgress', {
            name: item.mission_name,
            fid: item.id,
            fname: item.friend_first_name,
          })
        }
        style={styles.flatlist}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            // position: 'relative',
          }}>
          <View style={{}}>
            <ImageBackground
              source={require('../assets/Images/star.png')}
              style={{
                width: 35,
                height: 35,
                justifyContent: 'center',
                alignItems: 'center',
                // position: 'relative',
              }}>
              <RNText
                style={{
                  color: 'black',
                  /// position: 'absolute',
                  zIndex: 100,
                }}>
                {index + 1}
              </RNText>
            </ImageBackground>
          </View>

          <View style={styles.user}>
            <RNText style={styles.userName}>{item.profile}</RNText>
          </View>
          <RNText style={styles.text}>{item.text} </RNText>
        </View>
        <OvalProgressBar progress={item.progress} />
      </TouchableOpacity>
    );
  };
  return (
    <View style={{flex: 1, backgroundColor: '#F5F5F5'}}>
      <Header
        back={Images.back}
        isCenterShown
        navigation={navigation}
        Header={'Leaderboard'}
        headerStyle={styles.heade}
        centerStyle={styles.center}
    
            centerText= {!loading
              ? count === 0
                  ? 'No friends are participating in this mission yet'
                  : count === 1
                      ? '1 friend is participating in this mission'
                      : `${count} friends are participating in this mission`
              : ''}
      />
      {!loading ? (
        <>
          {Data.length === 0 ? (
            <View
              style={{
                height: 350,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <RNText style={{color: 'black'}}>
                No friends for comparison!
              </RNText>
            </View>
          ) : (
            <>
              <View style={{flex: 1, marginTop: 10}}>
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
                  contentContainerStyle={styles.container}
                />
              </View>
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
  );
};

export default Leaderboard;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  flatlist: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#fff',
    marginHorizontal: 20,
    justifyContent: 'space-between',
    marginBottom: 5,
    backgroundColor: '#fff',
    paddingVertical: 6,

    borderRadius: 4,
  },
  center: {
    marginTop: 8,
    fontSize: 13,
  },
  heade:{
  
    marginTop:Platform.OS==='ios'? 38:10
  },
  userName: {
    color: '#fff',
    fontSize: 14,
    fontFamily: Fonts.DroidSansBold,
  },
  progressBarContainer: {},
  user: {
    height: 35,
    width: 35,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.green,
    marginStart: 10,
  },
  text: {
    fontWeight: '500',
    color: '#000',
    fontSize: 13,
    marginStart: 10,
  },
  btmtext: {
    color: '#000',
    fontSize: 11,
  },
});
