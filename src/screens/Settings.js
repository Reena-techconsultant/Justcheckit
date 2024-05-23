import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../common/Header'
import Images from '../components/Images'
import { Image } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { BASE_URL } from '../config/baseUrl'


const UserSettings = ({ navigation }) => {

  const [user, setUser] = useState(null);
  const firstLetter = user?.first_name ? user.first_name.charAt(0).toUpperCase() : '';

  useEffect(() => {
    getUser()
  })
  const getUser = async () => {
    const value = await AsyncStorage.getItem('user_id');
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await axios.get(`${BASE_URL}account/users/${value}`, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      })
    
      setUser(res.data)
    } catch (error) {
      console.log(error);
    }
  }
  const confirmDelete = () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to permanently delete your account?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: handleDelete,
        },
      ],
      { cancelable: false }
    );
  };

  const handleLogout = async () => {

    try {
      await AsyncStorage.removeItem('token');
      navigation.replace('Login');

    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  }

  const handleDelete = async () => {
    const token = await AsyncStorage.getItem('token');
    const value = await AsyncStorage.getItem('user_id');
    try {
      const res = await axios.delete(`${BASE_URL}account/users/${value}`, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      })

      handleLogout();
    } catch (error) {
      console.log(error);
    }
  }
  const confirmLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout your account?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: handleLogout,
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <>
      <Header
        Header={'Settings'}
        back={Images.back}
        infoStyle={styles.info}
        headerStyle={styles.he}
      />
      <View style={{ flex: 1, backgroundColor: '#F5F5F5', paddingHorizontal: 20 }}>

        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <View style={{height:70,width:70,backgroundColor:'gray',borderRadius:40,alignItems:'center',justifyContent:'center'}}>
        <Text style={{ fontSize: 24, color: 'white' }}>{firstLetter}</Text>

        </View>
          <Text style={{ marginTop: 10,color:'black', fontSize: 21,textTransform: 'capitalize' }}>{user?.first_name}</Text>
          <Text style={{ marginTop: 5,color:'black', fontSize: 15 }}>{user?.email}</Text>
        </View>

        <TouchableOpacity
          onPress={confirmLogout}
          style={{ flexDirection: 'row', marginTop: 40, alignItems: 'center', }}>
          <Image source={Images.logout} style={{ height: 20, width: 20 }} />
          <Text style={{ fontSize: 22,color:'black', paddingStart: 20 }}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={confirmDelete}
          style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center', }}>
          <Image source={require('../assets/Images/delete.png')} style={{ height: 20, width: 20 }} />
          <Text style={{ fontSize: 22,color:'black', paddingStart: 20 }}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

export default UserSettings

const styles = StyleSheet.create({
  info:{
    height:25,
    width:25
  },
  
  he:{
    marginTop:Platform.OS==='ios'? 38:10
  }
})