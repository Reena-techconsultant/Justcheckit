import { StyleSheet, Text, View, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react';
import Header from '../common/Header'
import Images from '../components/Images'
import { Fonts } from '../components/Fonts';
import { useDispatch } from 'react-redux';
import { friendsList } from '../modules/getFriendList';
import { color } from '../components/color';

const AddFriends = () => {

    const [friendList, setFriendList] = useState([]);
    const CreateMissionData = friendList && friendList.common_mission
        ? [
            {
                id: friendList.id || '',
                HeaderText: friendList.common_mission.friend_name || '',
                bottomText: friendList.common_mission.count || '',
                profile: friendList.common_mission.friend_name ? friendList.common_mission.friend_name.charAt(0).toUpperCase() : '',
            },
        ]
        : [];
    const dispatch = useDispatch();

    useEffect(() => {
        getFriendsList();

    }, []);
    const getFriendsList = () => {
        dispatch(friendsList()).then(response => {
            setFriendList(response.payload.result[0]);
        });
    };



    const renderItem = ({ item }) => (
        <View style={styles.FlatList}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.user}>
                    <Text style={styles.userName}>{item.profile}</Text>
                </View>
                <View style={{ width: '85%' }}>
                    <Text style={styles.HeaderText}>{item.HeaderText}</Text>
                    <Text style={styles.bottomText}>You both have {item.bottomText} same travelling Missions</Text>
                </View>
            </View>
            <Image source={Images.plus} style={{ height: 15, width: 15 }} />
        </View>
    )
    const onPressBack = () => {
        navigation.goBack();
    }
    return (
        <View style={{ flex: 1, backgroundColor: '#F5F5F5', paddingBottom: 10, }}>
            <Header
                backOnPress={onPressBack}
                Header={'Friends List'}
                back={Images.back}
                showTextInput
                filter={Images.filter}
            />
            <View style={{ marginTop: 30 }}>

            </View>

            <FlatList
                data={CreateMissionData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />

        </View>
    )
}

export default AddFriends


const styles = StyleSheet.create({
    user: {
        height: 35, width: 35,
        borderRadius: 10, alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: color.green,
    },
    FlatList: {
        flex: 1, backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 2,
        borderColor: '#F5F5F5',
        borderRadius: 8,
        marginHorizontal: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 15,
    },
    userName: {
        color: '#fff',
        fontSize: 12,
        fontFamily: Fonts.DroidSans

    },
    img: {
        height: 42, width: 42,
        borderRadius: 4, marginLeft: 7
    },
    HeaderText: {
        flex: 1,

        fontWeight: '600',
        paddingStart: 20,
        color: 'black',
        fontSize: 12,
        fontFamily: Fonts.DroidSans
    },
    bottomText: {
        flex: 1,
        paddingStart: 20,
        paddingVertical: 6,
        color: 'gray',
        fontSize: 11,
        fontFamily: Fonts.DroidSans
    }
})