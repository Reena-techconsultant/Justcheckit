import {
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    TouchableOpacity,
  } from 'react-native';
  import Header from '../common/Header';
  import Images from '../components/Images';
  import {Fonts} from '../components/Fonts';
  import {color} from '../components/color';
  import {TextInput} from 'react-native-gesture-handler';
  

  const FriendsAdd = ({navigation}) => {

    return (
      <View style={{flex: 1, backgroundColor: '#F5F5F5'}}>
        <Header
          Header={'Friends List'}
          back={Images.back}
          img={Images.upload}
          navigation={navigation}
          info
          filter={Images.refresh}
          infoStyle={styles.info}
        />
  
        <View style={styles.src}>
          <View style={[styles.searchInput]}>
            <TextInput
              placeholder="Search.."
              placeholderTextColor="black"
              style={{flex: 1, color: 'black'}}
              // value={searchText}
              onChangeText={text => {
                setSearchInput(text);
              }}
            />
        
          </View>
        </View>
  
        <View style={{marginTop: 30}}>

        </View>
      </View>
    );
  };
  
  export default FriendsAdd;
  
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
      position: 'absolute',
      top: Platform.OS === 'ios' ? 130 : 100,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: 20,
    },
    searchInput: {
      borderWidth: 1,
      borderColor: '#fff',
  
      borderRadius: 8,
      height: 40,
      width: '82%',
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
  