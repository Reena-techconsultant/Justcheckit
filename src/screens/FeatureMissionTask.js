
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native';
import Header from '../common/Header';
import Images from '../components/Images';
import { Fonts } from '../components/Fonts';
import { useDispatch, useSelector } from 'react-redux';
import { color } from '../components/color';
import { getFeatureAdminTask } from '../modules/featureAdminTaskSlice';
import { useNavigation } from '@react-navigation/native';

const FeatureMissionsTask = ({ route }) => {
  const navigation= useNavigation()
    const id = route.params.id;
  const name = route.params;
  const [modalVisible, setmodalVisible] = useState(false);
  const [friendList, setFriendList] = useState([]);
  const dispatch = useDispatch();

  const Data = friendList?.map(item => ({
    id: item.id,
    name: item.name || '',
    progress: item.completed_percentage || 0,
    user_status: item.user_status || 'Not Completed',
  })) || [];

  useEffect(() => {
    getFriendsList();
  }, []);


  const getFriendsList = () => {
    let data = {
      mission: id
    }
    dispatch(getFeatureAdminTask(data.mission)).then(response => {
      setFriendList(response.payload.data.result);
    });
  };

  const renderItem = ({ item, index }) => {
    const serialCount = index + 1;
    return (
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => navigation.navigate('SelectImage', { id: item.id })}
      >
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.text}>{serialCount}</Text>
        </View>
         <Text style={styles.text}>{item.name}</Text>
        <TouchableOpacity
          style={styles.checkbox}>
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }
  const onPressBack = () => {
    navigation.goBack();
}
  return (
    <>
      <View style={{ flex: 1,  backgroundColor: '#F5F5F5' }}>
        <Header
          Header={'r'}
          back={Images.back}
          img={Images.info}
          navigation={navigation}
          info
          backOnPress={onPressBack}
          infoOnpress={() => setmodalVisible(true)}
          showProgress
          isCenterShown
          onPress={() => navigation.navigate('Leaderboard')}
    
        />

`        <View style={styles.container}>
`          <View style={{ flexDirection: 'row', paddingBottom: 10, paddingHorizontal: 10, justifyContent: 'space-between' }}>
            <Text style={{ color: '#000', fontWeight: 'bold', fontFamily: Fonts.DroidSans }}>#</Text>
            <Text style={{ color: '#000', fontWeight: 'bold', fontFamily: Fonts.DroidSans }}> Task</Text>
            <Text style={{ color: '#000', fontWeight: 'bold', marginRight: 11 }}> </Text>
          </View>
          <FlatList
            data={Data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.flatListContainer}
          />
        </View>
      </View>
      <Modal animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setmodalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 30, alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', padding: 20, paddingVertical: 30, borderRadius: 10 }}>
            <TouchableOpacity
              onPress={() => setmodalVisible(false)}
              style={{ alignSelf: 'flex-end' }}>
              <Image source={Images.close} style={{ height: 28, width: 28, tintColor: 'gray' }} />
            </TouchableOpacity>
            <Text style={{ color: color.green, fontFamily: Fonts.DroidSansBold, fontSize: 18 }}>Description</Text>
            <Text style={{ color: 'gray', fontFamily: Fonts.DroidSans, paddingBottom: 30, textAlign: 'center', marginTop: 15, lineHeight: 17 }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, </Text>

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
    fontFamily: Fonts.DroidSans
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

export default FeatureMissionsTask;
