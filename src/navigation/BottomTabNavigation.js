import React, { useRef, useState } from 'react';
import { Image, Platform, Text, Dimensions, View, StyleSheet, Settings } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from '../screens/Dashboard';
import User from '../screens/User';
import Home from '../screens/Home';
import Images from '../components/Images';
import { createStackNavigator } from '@react-navigation/stack';
import Leaderboard from '../screens/Leaderboard';
import MyProgress from '../screens/MyProgress';
import CreateList from '../screens/CreateList';
import Missions from '../screens/Missions';
import Friends from '../screens/Friends';
import { ScrollView, useScrollToTop } from '@react-navigation/native';
import SelectImage from '../screens/SelectImage';
import AddFriends from '../screens/AddFriends';
import ShowPhotos from '../screens/ShowPhotos';
import FeaturesMissions from '../screens/FeaturesMission';
import AdminTask from '../screens/AdminTask';
import FeatureMissionsTask from '../screens/FeatureMissionTask';
import FeaturesTask from '../screens/FeaturesTask';
import EditImage from '../screens/EditImage';
import FriendsList from '../screens/FriendsList';
import UpdateCreate from '../screens/UpdateCreate';
import UserSettings from '../screens/Settings';
import ShowComparePhotos from '../screens/ShowComparePhotos';
import FriendsMissions from '../screens/FriendsMissions';
import FriendsMissionTask from '../screens/FriendMissionTask';
import FriendRequest from '../screens/FriendRequest';
import ShowFriendPhotos from '../screens/ShowFriendPhotos';
import CommonFriends from '../screens/CommonFriends';

const { height } = Dimensions.get('window');
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const UserStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: '#fff' },
    }}>
    <Stack.Screen name="Friends" component={Friends} />
    <Stack.Screen name="FriendsMissions" component={FriendsMissions} />
    <Stack.Screen name="FriendsMissionTask" component={FriendsMissionTask} />
    <Stack.Screen name="ShowFriendPhotos" component={ShowFriendPhotos} />
    <Stack.Screen name="ShowPhotos" component={ShowPhotos} />
    <Stack.Screen name="MyProgress" component={MyProgress} />
    <Stack.Screen name="Leaderboard" component={Leaderboard} />
    <Stack.Screen name="FriendsList" component={FriendsList} />
    <Stack.Screen name="FriendRequest" component={FriendRequest} />
  </Stack.Navigator>
);
const DashboardStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: '#fff' },
    }}>
    <Stack.Screen name="Dashboard" component={Dashboard} />
    <Stack.Screen name="Missions" component={Missions} />
    <Stack.Screen name="User" component={User} />
    <Stack.Screen name="ShowPhotos" component={ShowPhotos} />
    <Stack.Screen name="CreateList" component={CreateList} />
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="AddFriends" component={AddFriends} />
    <Stack.Screen name="SelectImage" component={SelectImage} />
    <Stack.Screen name="MyProgress" component={MyProgress} />
    <Stack.Screen name="Leaderboard" component={Leaderboard} />
    <Stack.Screen name="FeaturesMissions" component={FeaturesMissions} />
    <Stack.Screen name="AdminTask" component={AdminTask} />
    <Stack.Screen name="FeaturesTask" component={FeaturesTask} />
    <Stack.Screen name="FeatureMissionsTask" component={FeatureMissionsTask} />
    <Stack.Screen name="EditImage" component={EditImage} />
    <Stack.Screen name="CommonFriends" component={CommonFriends} />
  </Stack.Navigator>
);
const UserLastStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: '#fff' },
    }}>
      
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="User" component={User} />
    <Stack.Screen name="ShowPhotos" component={ShowPhotos} />
    <Stack.Screen name="CreateList" component={CreateList} />
    <Stack.Screen name="AddFriends" component={AddFriends} />
    <Stack.Screen name="SelectImage" component={SelectImage} />
    <Stack.Screen name="MyProgress" component={MyProgress} />
    <Stack.Screen name="Leaderboard" component={Leaderboard} />
    <Stack.Screen name="ShowComparePhotos" component={ShowComparePhotos} />
    <Stack.Screen name="EditImage" component={EditImage} />
    <Stack.Screen name="UpdateCreate" component={UpdateCreate} />
    <Stack.Screen name="UserSettings" component={UserSettings} />
  </Stack.Navigator>
);

const BottomTabNavigation = () => {
  const scrollRef = useRef(null);
  const [hideTabBar, setHideTabBar] = useState(false);
  useScrollToTop(scrollRef);

  return (
    <View style={styles.container}>

    <Tab.Navigator
      initialRouteName="Dashboard"
       screenOptions={{
        tabBarVisible: !hideTabBar,
        tabBarStyle: styles.tabBarStyle,
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                backgroundColor: focused ? '#fff' : 'transparent',
                borderRadius: 50,
                padding: 5,
                height: 37,
                width: 66,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: height >= 812 ? 30 : 0,
              }}>
              <Image
                source={Images.home}
                style={{
                  height: 20,
                  width: 20,
                  tintColor: focused ? '#000' : 'white',
                }}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="FriendsList"
        component={UserStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                backgroundColor: focused ? '#fff' : 'transparent',
                borderRadius: 50,
                padding: 5,
                height: 37,
                width: 66,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: height >= 812 ? 30 : 0,
              }}>
              <Image
                source={Images.frnds}
                style={{
                  height: 20,
                  width: 20,
                  tintColor: focused ? '#000' : 'white',
                }}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={UserLastStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                backgroundColor: focused ? '#fff' : 'transparent',
                borderRadius: 50,
                padding: 5,
                height: 37,
                width: 66,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: height >= 812 ? 30 : 0,
              }}>
              <Image
                source={Images.check}
                style={{
                  height: 24,
                  width: 24,
                  tintColor: focused ? '#000' : 'white',
                }}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#F5F5F5', 
  
  },
  tabBarStyle: {
    backgroundColor: 'green',
    paddingHorizontal: 20,
    borderWidth: 0.5,
    marginHorizontal:20,
    marginBottom:20,
    borderColor: 'green',
    borderRadius: 30,
    elevation: 0,
    height: 60,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
});

export default BottomTabNavigation;
