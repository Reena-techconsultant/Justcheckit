import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Fonts } from '../components/Fonts';
import { featureMissions } from '../modules/getFeatureMission';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../common/Header';
import Images from '../components/Images';
import { retrieveData } from '../common/LocalStorage';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-gesture-handler';
import { BASE_URL } from '../config/baseUrl';
import { useFocusEffect } from '@react-navigation/native';

const FeaturesMissions = ({ navigation, route }) => {
  console.disableLogBox = true;
  const [homeData, setHomeData] = useState([]);
  const [showData, setShowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const onRefresh = () => {
    setSearchText('');
    setRefreshing(true);
  };

  const Data =
    filteredData?.map(item => ({
      id: item.id,
      is_Joined: item.is_joined,
      name: item.name,
      lowerText: item.total_friends_in_mission,
      image: { uri: item.mission_detail_photo },
      description: item.description,
      friend_names:item.friend_names,
      tasks:item.tasks
    })) || [];

  useEffect(() => {
    getFeatureMission();
    setRefreshing(false);
  }, [refreshing]);

  useFocusEffect(
    React.useCallback(() => {
      getFeatureMission();
      //setLoading(false)
      setRefreshing(false);
    }, []),
  );



  useEffect(() => {
    if (!searchText) {
      setFilteredData(homeData);
    } else {
      const filtered = homeData.filter(item =>
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
      setHomeData(response.payload.data.result);
  
      setLoading(false);
    });
  };

  const searchMission = async () => {
    const authToken = await retrieveData();
    try {
      const res = await axios.get(
        `${BASE_URL}data/my-missions/?name=${searchText}`,
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        },
      );
      setShowData(res.data.data);
      dispatch(storeMissionSearch(res.data));
    } catch (error) {
      console.log(error);
    }
  };

  const item = ({ item }) => (
    <View style={{ flex: 1 }}>
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
              cfriend:item?.friend_names,
              ftask:item?.tasks
            },
          )
        }
        style={styles.flatlist}>
        <View style={styles.top}>
          <View
            style={{
              flexDirection: 'row',

              alignItems: 'center',
            }}>
            <Image source={item.image} style={styles.image} />
            <View style={{ marginLeft: 10, marginTop: 7, flex: 1 }}>
              <Text style={[styles.text, { fontSize: 14 }]}>{item.name}</Text>
              <Text
                numberOfLines={2}
                style={[styles.lowerText, { fontSize: 12, flex: 1 }]}>
           
                {item.lowerText === 0
                  ? 'No friends are participating in this mission yet'
                  : item.lowerText === 1
                    ? '1 friend is participating in this mission'
                    : `${item.lowerText} friends are participating in this mission`}
              </Text>
            </View>
            {!item.is_Joined && (
              <TouchableOpacity
                onPress={() => {
                  handleJoin(item.id);
                }}>
                <Image source={Images.plus} style={{ height: 18, width: 18 }} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  console.log(Data);
  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <Header
        back={Images.back}
        disabled={loading}
        headerStyle={styles.he}
        Header={'Featured Missions'}
        filter={Images.filter}
      />

      <View style={styles.src}>
        <View
          style={[
            styles.searchInput,
            {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'white',
              zIndex: 10,
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
          {/* <TouchableOpacity onPress={searchMission}>
            <Image
              source={require('../assets/Images/send.png')}
              style={{height: 25, width: 25, marginRight: 20}}
            />
          </TouchableOpacity> */}
        </View>
      </View>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#9Bd35A', '#689F38']}
            progressBackgroundColor="#ffffff"
          />
        }>
        {!loading ? (
          <>
            {Data.length > 0 ? (
              <View style={{ marginBottom: 130, marginTop: Platform.OS === 'ios' ? 40 : 10 }}>
                <FlatList
                  data={Data}
                  renderItem={item}
                  keyExtractor={item => item.id}
                />
              </View>
            ) : (
              <View
                style={{
                  height: 300,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{ textAlign: 'center', color: 'black' }}>
                  No feature mission available!
                </Text>
              </View>
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
      </ScrollView>
    </View>
  );
};

export default FeaturesMissions;

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    color: 'black',
    fontWeight: '600',
    fontFamily: Fonts.DroidSansBold,
    paddingStart: 8,
    fontSize: 18,
    paddingVertical: 3,
  },
  lowerText: {
    color: 'black',
    fontFamily: Fonts.DroidSans,
    paddingStart: 8,
  },

  image: { height: 60, width: 60, borderRadius: 12 },

  flatListContainer: {
    marginHorizontal: 10,
  },
  flatlist: {
    borderWidth: 1,
    borderColor: '#fff',
    marginHorizontal: 15,
    marginTop: 20,
    backgroundColor: '#fff',
    // paddingHorizontal: 10,
    padding: 10,
    borderRadius: 4,
  },

  input: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },

  src: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 160 : 100,
    width: '100%',
  },
  he: { marginTop: Platform.OS === 'ios' ? 39 : 7 },
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

  createListText: {
    color: '#fff',
    paddingHorizontal: 17,
    borderWidth: 1,
    borderColor: '#fff',
    marginTop: 25,
    borderRadius: 100,
    paddingVertical: 6,
  },
});
