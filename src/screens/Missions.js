import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  RefreshControl,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../common/Header';
import Images from '../components/Images';
import {Fonts} from '../components/Fonts';
import {getTarget} from '../modules/getTargetSlice';
import {useDispatch} from 'react-redux';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {TextInput} from 'react-native-gesture-handler';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../config/baseUrl';

const Missions = route => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [mission, setMission] = useState([]);
  const [filteredMission, setFilteredMission] = useState([]);
  const [searchText, setSearchText] = useState('');
  const id = route.route.params.id;
  const name = route.route.params.name;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
console.log(name,"nameeeeee");
  const onRefresh = () => {
    setSearchText('');
    setRefreshing(true);
  };

  const handleJoin = async id => {

    const token = await AsyncStorage.getItem('token');
    const missionId = id;
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
  
      getUserMissionList();
      Alert.alert('Mission joined successfully');
    } catch (error) {
      setLoading(false);
      console.error('Error:', error);
    }
  };

  const handleChange = async text => {
    setSearchText(text);
    const filteredData = mission.filter(item => {
      return item.description.toLowerCase().includes(text.toLowerCase());
    });
    setFilteredMission(filteredData);
  };

  useFocusEffect(
    React.useCallback(() => {
      getUserMissionList();
      setSearchText('');
    }, []),
  );

  useEffect(() => {
    getUserMissionList();
    setRefreshing(false);
  }, [refreshing]);

  const getUserMissionList = () => {
    setLoading(true);
    let data = {
      mission_type: id,
    };
    dispatch(getTarget(data.mission_type))
      .then(response => {
        setMission(response?.payload.data.result);
        setLoading(false);
      
      })
      .catch(error => {
        console.error('Error dispatching missionCount:', error);
        setLoading(false);
      });
  };

  const item = ({item}) => (
    <View style={{flex: 1}}>
      <TouchableOpacity
        onPress={() =>{
          navigation.navigate(
          `${item.is_joined ? 'User' : 'AdminTask'}`,
          {
            id: item?.id,
            dis: item.description,
            name: item?.name,
            friend_count: item?.total_friends_in_mission,
            joined: item?.is_joined,
            cfriend:item?.friend_names,
            ftask:item?.tasks
          })}
        }
        
        style={styles.flatlist}>
        <View style={[styles.top]}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={{uri: `${item?.mission_detail_photo}`}}
              style={styles.image}
            />

            <View style={{marginLeft: 10, flex: 1}}>
              <Text style={styles.text}>{item?.name}</Text>
              <Text numberOfLines={2} style={[styles.lowerText, {flex: 1}]}>
             
                  {item.total_friends_in_mission === 0
          ? 'No friends are participating in this mission yet'
          : item.total_friends_in_mission === 1
            ? '1 friend is participating in this mission'
            : `${item.total_friends_in_mission} friends are participating in this mission`}
              </Text>
            </View>
          </View>
          {!item?.is_joined && (
            <TouchableOpacity onPress={() => handleJoin(item.id)}>
              <Image source={Images.plus} style={{height: 18, width: 18}} />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
  const onPressBack = () => {
    navigation.goBack();
  };
  return (
    <View style={{flex: 1, backgroundColor: '#F5F5F5'}}>

      <Header
        navigation={navigation}
        back={Images.back}
       
        backOnPress={onPressBack}
        Header={name}
        headerStyle={
          name.length < 40? styles.btm: styles.ce
        }
        filter={Images.filter}
      />
      <View
        
        style={{
          position: 'absolute',
          top: Platform.OS === 'ios' ? 160 : 100,
          width: '100%',
        }}>

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
            style={{flex: 1, color: 'black'}}
            value={searchText}
            onChangeText={handleChange}
          />
    
        </View>
      </View>
      {!loading ? (
        <View style={{marginBottom: 40,marginTop:Platform.OS ==='ios' ?40:10}}>
          {mission.length > 0? (
                      <FlatList
                      refreshControl={
                        <RefreshControl
                          refreshing={refreshing}
                          onRefresh={onRefresh}
                          colors={['#9Bd35A', '#689F38']}
                          progressBackgroundColor="#ffffff"
                        />
                      }
                        data={filteredMission?.length > 0 ? filteredMission : mission}
                        renderItem={item}
                        keyExtractor={item => item?.id.toString()}
                      />
          ):(
            <View style={{height:200,justifyContent:'center' , alignItems:'center'}}>
              <Text style={{color:'black'}}>No missions available!</Text>
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
  );
};

export default Missions;

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  text: {
    color: 'black',
    fontWeight: '600',
    fontFamily: Fonts.DroidSansBold,
    paddingStart: 8,
    fontSize: 14,
    paddingVertical: 3,
  },
  ce:{

  },
  lowerText: {
    color: 'black',
    fontFamily: Fonts.DroidSans,
    paddingStart: 8,
    fontSize: 11,
  },

  image: {height: 50, width: 50, borderRadius: 2},

  flatListContainer: {
    marginHorizontal: 10,
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
btm:{
  marginTop:Platform.OS==='ios'? 38:10
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
