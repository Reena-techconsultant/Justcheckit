import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text as RNText,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import Header from '../common/Header';
import Images from '../components/Images';
import { Svg, Ellipse, Circle, Text } from 'react-native-svg';
import { Fonts } from '../components/Fonts';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../config/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RefreshControl } from 'react-native';

const MyProgress = ({ navigation, route }) => {
  const name = route.params.name;
  const fid = route.params.fid;
  const fname = route.params.fname;
  const [data, setData] = useState([]);

  const [refreshing, setRefreshing] = useState(false);



  const onRefresh = () => {

    setRefreshing(true);
  };
  const dispatch = useDispatch();
  const progress = data.total_my_percentage || 0;
  const friendPercentage = data.total_friend_percentage || 0;
  const getCompare = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
    
      const res = await axios.get(
        `${BASE_URL}data/compare-mission/?mission_name=${name}&friend=${fid}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCompare();
    setRefreshing(false);
  }, [refreshing]);

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


  const renderItem = ({ item, index }) => {
    const renderImagesu = () => {
      if (item.complete_by_me?.complete) {
        return (
          <>
            <TouchableOpacity onPress={()=>{
               navigation.navigate('ShowComparePhotos', {
                completed_task : item.complete_by_me,
                name : item.name
              })
            }}>
              <Image
                source={require('../assets/Images/upload1.png')}
                style={{ marginRight: 9, marginLeft: 9 }}
              />
            </TouchableOpacity>
          </>
        );
      }
      return (
        <View style={{ height: 22, width: 22, backgroundColor: "transparent", marginLeft: 10 }}></View>
      );
    };
    const renderImages = () => {
      if (item.complete_by_friend?.complete) {
        return (
          <>
            <TouchableOpacity onPress={()=>{
                             navigation.navigate('ShowComparePhotos', {
                              completed_task : item.complete_by_friend,
                              name : item.name
                            })
            }}>
              <Image
                source={require('../assets/Images/upload1.png')}
                style={{ marginRight: 9, marginLeft: 9 }}
              />
            </TouchableOpacity>
          </>
        );
      }
      return (
        <View style={{ height: 21, width: 21, backgroundColor: "transparent", marginRight: 10 }}></View>
      );
    };
    const renderBox = () => {
      if (item.complete_by_friend?.complete) {
        return (
          <>
            <View style={styles.checkbox}>
              <Image source={require('../assets/Images/tick.png')} />
            </View>
          </>
        );
      } else {
        return (
          <>
            <View style={styles.checkbox}></View>
          </>
        );
      }
      return null;
    };

    const renderBoxu = () => {
      if (item.complete_by_me?.complete) {
        return (
          <>
            <View style={styles.checkbox}>
              <Image source={require('../assets/Images/tick.png')} />
            </View>
          </>
        );
      } else {
        return (
          <>
            <View style={styles.checkbox}>

            </View>
          </>
        );
      }
      return null;
    };
    const serialCount = index + 1;
    return (
      <TouchableOpacity style={[styles.checkboxContainer]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <RNText style={[styles.text, { width: 28 }]}>{serialCount}</RNText>
          {renderBoxu()}
          {/* {Boxu()} */}
          {renderImagesu()}
        </View>
        <RNText style={styles.text}>
          {item.name.length > 15
            ? item.name.substring(0, 10) + '...'
            : item.name}
        </RNText>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {renderImages()}
          {renderBox()}
          {/* {Box()} */}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
        <Header
          Header={name}
          back={Images.back}
          navigation={navigation}
          headerStyle={
            name.length < 40? styles.btm: styles.ce
          }
          showProgress
          progres={`${fname.charAt(0).toUpperCase() + fname.slice(1)
            }'s Progress`}
          progress={'My Progress'}
          onPress={() => navigation.navigate('Leaderboard')}
        />
        <View style={styles.container}>
          <View
            style={{
              flexDirection: 'row',
              paddingBottom: 10,
              paddingHorizontal: 0,
              justifyContent: 'space-between',
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RNText
                style={{
                  color: '#000',
                  fontWeight: 'bold',
                  fontFamily: Fonts.DroidSans,
                  marginRight: 14,
                }}>
                #
              </RNText>
              <OvalProgressBar progress={progress} />
            </View>

            <RNText
              style={{
                color: '#000',
                fontWeight: 'bold',
                fontFamily: Fonts.DroidSans,
                // marginRight: 2
              }}>
              {' '}
              Task
            </RNText>
            <View style={{ }}>
              <OvalProgressBar  progress={friendPercentage} />
            </View>
          </View>
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#9Bd35A', '#689F38']}
                progressBackgroundColor="#ffffff"
              />
            }
            data={data.data}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.flatListContainer}
          />
        </View>
      </View>
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
  checkboxContainer: {
    marginBottom: 12,
    backgroundColor: '#fff',
    padding: 16,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkbox: {
    height: 22,
    width: 22,
    borderRadius: 4,
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // checkbox: {
  //   marginRight: 10,
  // },
  btm:{
    marginTop:Platform.OS==='ios'? 38: -6,
    
      },
      ce:{
        marginTop:Platform.OS==='ios'? 26: -2,
        fontSize:17
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
});

export default MyProgress;
