import {
    StyleSheet,
    Text,
    View,
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
import Contacts from 'react-native-contacts';

const FriendsList = ({ navigation }) => {
    const [searchInput, setSearchInput] = useState('');
    const [data, setData] = useState([]);
    const [frndData, setFrndData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const bottomSheetRef = useRef(null);
    const [type, setType] = useState('');
    const [types, setTypes] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [request, setrequest] = useState([]);
    const [search, setSearch] = useState([]);
    const [filtersearch, setfiliterSearch] = useState()
    const [mRequest, setmRequest] = useState([]);

    const Data =
        frndData?.map(item => ({
            id: item.id,
            text: `${(item.first_name || '').charAt(0).toUpperCase()}${(
                item.first_name || ''
            ).slice(1)} ${(item.last_name || '').charAt(0).toUpperCase()}${(
                item.last_name || ''
            ).slice(1)}`,
            first: `${(item.first_name || '').charAt(0).toUpperCase()}`,
            is_accepted_id: item.is_accepted_id,
            is_accepted: item.is_accepted,
            is_requested: item.is_requested
        })) || [];

    const missionRequest = async () => {
        const token = await AsyncStorage.getItem('token');
        const from_user = await AsyncStorage.getItem('user_id');
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}data/mission-request/?is_accepted=0&to_user=${from_user}`, {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setmRequest(res.data.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }

    const handleMission = async (id) => {
        const token = await AsyncStorage.getItem('token');

        setLoading(true);
        try {
            const res = await axios.patch(`${BASE_URL}data/mission-request/${id}/`, {
                is_accepted: true
            }, {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            missionRequest();

        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }

    const handledelMission = async (id) => {
        const token = await AsyncStorage.getItem('token');

        setLoading(true);
        try {
            const res = await axios.delete(`${BASE_URL}data/mission-request/${id}/`, {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            missionRequest();

        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }
    const getData = async () => {
        const token = await AsyncStorage.getItem('token');
        const from_user = await AsyncStorage.getItem('user_id');
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}data/friend-request/?to_user=${from_user}&accepted=false`, {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!refreshing) {
                setLoading(false);
            }
            setrequest(res.data.data.result);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }

    const loadContacts = () => {

        Contacts.getAll()
            .then(loadedContacts => {
                const contactss = loadedContacts.map(
                    item => item?.phoneNumbers[0]?.number,
                );
                syncContacts(contactss);
            })
            .catch(error => {
                console.error('Error loading contacts:', error);
            });
    };

    const syncContacts = async cont => {
        const token = await AsyncStorage.getItem('token');
        try {
            const res = await axios.post(
                `${BASE_URL}data/user-friends-already-registered/`,
                { phone_numbers: cont },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${token}`,
                    },
                },
            );
            setFrndData(res?.data?.data)
            setLoading(false);
        } catch (error) {
            console.log(error, 'sync contanct api');
        }
    };

    const handleAddFriend = async (to_user) => {
        const token = await AsyncStorage.getItem('token');
        const from_user = await AsyncStorage.getItem('user_id');
        setLoading(true);
        try {
            const res = await axios.post(`${BASE_URL}data/friend-request/`, {
                from_user,
                to_user
            }, {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            loadContacts();

        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }

    const handleSearch = async (to_user) => {
        if (searchInput.length > 0) {
            const token = await AsyncStorage.getItem('token');
            setLoading(true);
            try {
                const res = await axios.get(`${BASE_URL}data/custom-user-search/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                setSearch(res?.data)
            } catch (error) {
                setLoading(false);
                console.log(error);
            }
        }
    }

    const searchItem = ({ item }) => (
        <TouchableOpacity

            style={styles.FlatList}>
            <View style={styles.user}>
                <Text style={styles.userName}>
                    {item.first_name ? item.first_name.charAt(0).toUpperCase() : ''}

                </Text>
            </View>

            <Text style={styles.HeaderText}>

                {(item.first_name || '').charAt(0).toUpperCase()}{(
                    item.first_name || ''
                ).slice(1)} {(item.last_name || '').charAt(0).toUpperCase()}{(
                    item.last_name || ''
                ).slice(1)}
            </Text>

            {item.is_accepted && (
                <>
                    <TouchableOpacity
                        onPress={() => { handleAccept(item?.is_accepted_id) }}
                        disabled={loading}
                        style={[styles.accept, { marginRight: 10 }]}>
                        <Text style={{ color: '#fff', fontSize: 12 }}>
                            Accept
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={loading}
                        onPress={() => { handleDelete(item?.is_accepted_id) }}
                        style={[styles.accept, { backgroundColor: 'red', }]}>
                        <Text style={{ color: '#fff', fontSize: 12 }}>
                            Reject
                        </Text>
                    </TouchableOpacity>
                </>
            )}

            {!item.is_requested && (
                <TouchableOpacity disabled={loading}
                    onPress={() => { handleAddFriend(item.id) }}
                    style={[styles.accept, { backgroundColor: color.green, width: 79, }]}>
                    <Text style={{ color: '#fff', fontSize: 12 }}>
                        Add Friend
                    </Text>
                </TouchableOpacity>

            )}

            {item.is_requested && (
                <TouchableOpacity disabled={loading}
                    onPress={() => { }}
                    style={[styles.accept, { backgroundColor: color.green, width: 79, }]}>
                    <Text style={{ color: '#fff', fontSize: 12 }}>
                        Sent
                    </Text>
                </TouchableOpacity>

            )}


        </TouchableOpacity>
    );
    const handleAccept = async (id) => {
        const token = await AsyncStorage.getItem('token');

        setLoading(true);
        try {
            const res = await axios.put(`${BASE_URL}data/friend-request/${id}/`, {
                accepted: true
            }, {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            getData();
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }

    const handleDelete = async (id) => {
        const token = await AsyncStorage.getItem('token');
        setLoading(true);
        try {
            const res = await axios.delete(`${BASE_URL}data/friend-request/${id}/`, {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setRefreshing(true);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }

    const renderFriendItem = ({ item }) => (
        <View

            style={styles.FlatList}>
            <View style={styles.user}>
                <Text style={styles.userName}>
                    {item.send_from ? item.send_from.charAt(0).toUpperCase() : ''}
                </Text>
            </View>

            <Text style={styles.HeaderText}>
                {item.send_from ? item.send_from.charAt(0).toUpperCase() + item.send_from.slice(1) : ''}
            </Text>
            <TouchableOpacity
                disabled={loading}
                onPress={() => { handleAccept(item.id) }} style={[styles.accept, { marginRight: 10 }]}>
                <Text style={{ color: '#fff', fontSize: 12 }}>
                    Accept
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                disabled={loading}
                onPress={() => { handleDelete(item.id) }}
                style={[styles.accept, { backgroundColor: 'red', }]}>
                <Text style={{ color: '#fff', fontSize: 12 }}>
                    Reject
                </Text>
            </TouchableOpacity>
        </View>
    );

    const renderItem = ({ item }) => (
        <View
            style={styles.FlatList}>
            <View style={styles.user}>
                <Text style={styles.userName}>
                    {item.first}
                </Text>
            </View>
            <Text style={styles.HeaderText}>
                {item.text}
            </Text>
            {item.is_accepted && (
                <>
                    <TouchableOpacity
                        disabled={loading}
                        onPress={() => { handleAccept(item.is_accepted_id) }}
                        style={[styles.accept, { marginRight: 10 }]}>
                        <Text style={{ color: '#fff', fontSize: 12 }}>
                            Accept
                        </Text>
                    </TouchableOpacity>


                    <TouchableOpacity
                        onPress={() => { handleDelete(item.is_accepted_id) }}
                        disabled={loading}
                        style={[styles.accept, { backgroundColor: 'red', }]}>
                        <Text style={{ color: '#fff', fontSize: 12 }}>
                            Reject
                        </Text>
                    </TouchableOpacity>
                </>
            )}

            {!item.is_requested && (
                <TouchableOpacity
                    onPress={() => { handleAddFriend(item.id) }}
                    disabled={loading}
                    style={[styles.accept, { backgroundColor: color.green, width: 79, }]}>
                    <Text style={{ color: '#fff', fontSize: 12 }}>
                        Add Friend
                    </Text>
                </TouchableOpacity>

            )}

            {item.is_requested && (
                <TouchableOpacity
                    disabled={loading}
                    onPress={() => { }}
                    style={[styles.accept, { backgroundColor: color.green, width: 79, }]}>
                    <Text style={{ color: '#fff', fontSize: 12 }}>
                        Sent
                    </Text>
                </TouchableOpacity>

            )}


        </View>
    );

    const renderItemRequest = ({ item }) => (
        <View
            style={[styles.FlatList, { flexDirection: 'row', justifyContent: 'space-between' }]}>
            <View style={{}}>
                <Text style={[styles.HeaderText, { paddingStart: 0 }]}>
                    {item.mission_name}
                </Text>
                <Text style={{ fontSize: 10, color: 'gray', fontWeight: '400' }}>
                    Requested from {item.from_user_name}
                </Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                    disabled={loading}
                    onPress={() => { handleMission(item.id) }}
                    style={[styles.accept, { backgroundColor: color.green, width: 60, marginRight: 5 }]}>
                    <Text style={{ color: '#fff', fontSize: 12 }}>
                        Aceept
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => { handledelMission(item.id) }}
                    disabled={loading}
                    style={[styles.accept, { backgroundColor: 'red', width: 60 }]}>
                    <Text style={{ color: '#fff', fontSize: 12 }}>
                        Reject
                    </Text>
                </TouchableOpacity>
            </View>




        </View>
    );
    const onRefresh = () => {
        setSearchInput('');
        setRefreshing(true);

    };
    useEffect(() => {
        getFriends();
        getTypes();
        loadContacts();
        getData();
        handleSearch();
        missionRequest();
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

            if (!refreshing) {
                setLoading(false);
            }
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
                `${BASE_URL}/data/user-friend/?mission_type=${type}`,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'application/json',
                    },
                },
            );
            if (!refreshing) {
                setLoading(false);
            }
            setData(res.data?.result);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
            <Header
                Header={'Friend Requests'}
                back={Images.back}
                img={Images.upload}
                headerStyle={styles.he}
                navigation={navigation}
                filter={Images.refresh}
                infoStyle={styles.info}
            />
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
                <>
                    {loading ? (
                        <View
                            style={{
                                flex: 1,
                                height: 200,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                            <ActivityIndicator />
                        </View>

                    ) : (
                        <>

                            {searchInput.length > 0 ? (
                                <>
                                    <View style={{}}>

                                        <>
                                            {search.length > 0 ? (
                                                <FlatList
                                                    data={filtersearch}
                                                    renderItem={searchItem}
                                                    keyExtractor={item => item.id}
                                                />
                                            ) : (
                                                <View
                                                    style={{
                                                        height: 300,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}>
                                                    <Text style={{ textAlign: 'center', color: 'black' }}>
                                                        No friend requests to show at the moment
                                                    </Text>
                                                </View>
                                            )}
                                        </>

                                    </View>
                                </>
                            ) : (
                                <>
                                    <View style={{}}>
                                        <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold', marginStart: 20, }}>Friend Requests</Text>
                                        <>
                                            {request.length > 0 ? (
                                                <FlatList
                                                    data={request}
                                                    renderItem={renderFriendItem}
                                                    keyExtractor={item => item.id}
                                                />
                                            ) : (
                                                <View
                                                    style={{
                                                        height: 200,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}>
                                                    <Text style={{ textAlign: 'center', color: 'black' }}>
                                                        No friend requests to show at the moment
                                                    </Text>
                                                </View>
                                            )}
                                        </>


                                    </View>
                                    <View style={{}}>
                                        <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold', marginStart: 20, marginTop: 20 }}>People You May Know</Text>

                                        <>
                                            {Data.length > 0 ? (
                                                <FlatList
                                                    data={Data}
                                                    renderItem={renderItem}
                                                    keyExtractor={item => item.id}
                                                />
                                            ) : (
                                                <View
                                                    style={{
                                                        height: 200,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}>
                                                    <Text style={{ textAlign: 'center', color: 'black' }}>
                                                        No people to show at the moment

                                                    </Text>
                                                </View>
                                            )}
                                        </>



                                    </View>
                                </>
                            )}

                            <View style={{}}>
                                <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold', marginStart: 20, marginTop: 20 }}>Suggested Missions</Text>

                                <>
                                    {mRequest?.length > 0 ? (
                                        <FlatList
                                            data={mRequest}
                                            renderItem={renderItemRequest}
                                            keyExtractor={item => item.id}
                                        />
                                    ) : (
                                        <View
                                            style={{
                                                height: 200,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}>
                                            <Text style={{ textAlign: 'center', color: 'black' }}>
                                                No suggested missions to show at the moment

                                            </Text>
                                        </View>
                                    )}
                                </>

                            </View>
                        </>
                    )}



                </>
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
    accept: {
        height: 27, width: 60,
        backgroundColor: color.green, borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center'
    },
    src: {

        width: '100%',
        position: 'absolute',
        top: Platform.OS === 'ios' ? 130 : 100,
        flexDirection: 'row',
        justifyContent: 'center',

    },
    he: {
        marginTop: Platform.OS==='ios'? 39: 13
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
        paddingHorizontal: 10,
        borderWidth: 2,
        borderColor: '#F5F5F5',
        borderRadius: 8,
        marginHorizontal: 20,
        alignItems: 'center',
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
