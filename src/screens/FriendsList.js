import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Header from '../common/Header';
import Images from '../components/Images';
import { Fonts } from '../components/Fonts';
import { color } from '../components/color';
import axios from 'axios';
import { BASE_URL } from '../config/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-gesture-handler';
import RBSheet from 'react-native-raw-bottom-sheet';
import Swipeout from 'react-native-swipeout';

const categories = [
  { id: 1, name: 'Category 1' },
  { id: 2, name: 'Category 2' },
  { id: 3, name: 'Category 3' },
];

const options = () => {
  const renderItem = ({ item }) => (
    <View style={styles.categoryItem}>
      <Text>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.containers}>
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};
const FriendsList = ({ navigation }) => {
  const [searchInput, setSearchInput] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const bottomSheetRef = useRef(null);
  const [type, setType] = useState('');
  const [types, setTypes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const onRefresh = () => {
    setSearchInput('');
    setRefreshing(true);

  };
  useEffect(() => {
    getFriends();
    getTypes();

  }, [type, refreshing]);

  useEffect(() => {
    if (!searchInput) {
      setFilteredData(data);
    } else {
      const filtered = data.filter(item =>
        item.common_mission.friend_details.first_name
          .toLowerCase()
          .includes(searchInput.toLowerCase()),
      );
      setFilteredData(filtered);
    }
    setRefreshing(false);
  }, [searchInput, data, refreshing]);

  const handleDelete = async (id) => {
    const newData = filteredData.filter((item) => item.id !== id);

    setFilteredData(newData);
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`${BASE_URL}data/user-friend/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      Alert.alert("Friend deleted successfully")

    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const renderItem = ({ item }) => (
    <Swipeout
    right={[
      {
        backgroundColor: 'transparent',
        onPress: () => handleDelete(item.id),
        component: (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center',marginTop:5 }}>
            <Image source={require('../assets/Images/del.png')} style={{ width: 24, height: 24, tintColor: 'gray' }} />
          </View>
        ),
      },
    ]}
    autoClose={true}
    backgroundColor="transparent"
  >
    <TouchableOpacity
      onPress={() => navigation.navigate('FriendsMissions', { friend: item.friend_id, name: item.common_mission.friend_details.first_name })}
      style={styles.FlatList}>
      <View style={styles.user}>
        <Text style={styles.userName}>
          {item.common_mission.friend_details.first_name
            .substring(0, 1)
            .toUpperCase()}
        </Text>
      </View>
      <View>
        <Text style={styles.HeaderText}>
          {' '}
          {item.common_mission.friend_details.first_name
            .substring(0, 1)
            .toUpperCase()}
          {item.common_mission.friend_details.first_name.substring(1)}{' '}
          {item.common_mission.friend_details.last_name}
        </Text>
        <Text style={styles.bottomText}>
          {item.common_mission.count > 0
            ? `You share ${item.common_mission.count} common mission`
            : "You don't have common mission"}

        </Text>
      </View>
    </TouchableOpacity>
    </Swipeout>
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
      setLoading(false);
      setTypes(res.data.data.result);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const getFriends = async () => {
    const token = await AsyncStorage.getItem('token');
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/data/user-friend/`,
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      setLoading(false);
      setData(res.data?.result);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };



  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <Header
        Header={'Friends List'}
        back={Images.back}
        img={Images.upload}
        headerStyle={styles.he}
        navigation={navigation}
        filter={Images.refresh}
        infoStyle={styles.info}
      />

      <View style={styles.src}>
        <View style={[styles.searchInput]}>
          <TextInput
            placeholder="Search.."
            placeholderTextColor="black"
            style={{ flex: 1, color: 'black' }}
            onChangeText={text => {
              setSearchInput(text);
            }}
          />
         
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
        <View style={{ marginTop: 15 }}></View>

        {!loading ? (
          <>
            {filteredData.length > 0 ? (
              <FlatList
                data={filteredData}
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

export default FriendsList;

const styles = StyleSheet.create({
  user: {
    height: 42,
    width: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.green,
  },
  Image: {
    height: 40,
    width: 55,
    backgroundColor: '#fff',
    alignItems: 'center',

    justifyContent: 'center',
    borderRadius: 8,
  },
  src: {
    width: '100%',
    position: 'absolute',
    top: Platform.OS === 'ios' ? 160 : 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  he: {
    marginTop:Platform.OS==='ios'? 38:10
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#fff',

    borderRadius: 8,
    height: 40,
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: 'black',
    backgroundColor: '#fff',
    paddingStart: 10,
    fontFamily: Fonts.DroidSans,
  },
  containers: {
    flexDirection: 'row',
    marginTop: 10,
  },
  categoryItem: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },

  FlatList: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#F5F5F5',
    borderRadius: 8,
    marginHorizontal: 20,

    marginTop: 15,
  },
  userName: {
    color: '#fff',
    fontSize: 12,
    fontFamily: Fonts.DroidSans,
  },
  info: {
    height: 20,
    width: 20,
  },
  img: {
    height: 42,
    width: 42,
    borderRadius: 4,
    marginLeft: 7,
  },
  HeaderText: {
    flex: 1,

    fontWeight: '600',
    paddingStart: 15,
    color: 'black',
    fontSize: 14,
    fontFamily: Fonts.DroidSans,
  },
  input: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  bottomText: {
    width: '100%',
    paddingStart: 20,
    paddingVertical: 6,

    color: 'gray',
    fontSize: 11,
    fontFamily: Fonts.DroidSans,
  },
});
