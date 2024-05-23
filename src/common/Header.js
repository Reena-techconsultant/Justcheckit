import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  Dimensions
} from 'react-native';
import React, { useState } from 'react';
import Images from '../components/Images';
import { useNavigation } from '@react-navigation/native';
import { color } from '../components/color';
import { Fonts } from '../components/Fonts';


const Header = ({
  Header,
  img,
  top,
  HeaderTop,
  back,
  styleinfo,
  onPressAdd,
  addfriends,
  infoOnpress,
  shareOnpress,
  showSearch,
  filter,
  joinstyle,
  information,
  joinWithInfo,
  showProgress,
  progress,
  progres,
  isCenterShown,
  onPressFrnd,
  upload,
  infoStyle,
  centerStyle,
  headerStyle,
  onPressCenter,
  headerTextInputProps,
  LowerText,
  showShare,
  friends,
  info,
  frnds,
  filterOnpress,
  joinOnpress,
  join,
  backOnPress,
  centerText,
  showTextInput,
}) => {
  const navigation = useNavigation();
  const [loading, setloading] = useState(false)
  const { height } = Dimensions.get('window');

  const isIOS = Platform.OS === 'ios';
  const androidHeight = 140;
  return (
    <>
      <StatusBar backgroundColor={color.green} barStyle={'dark-content'} />
      <View style={{ height: isIOS ? (height >= 812 ? 210 : 170) : androidHeight, backgroundColor: '#F5F5F5' }}>
        <View style={styles.header}>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 20,
              paddingTop: Platform.OS === 'ios' ? 40 : 5,
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              style={[styles.back, { marginTop: Platform.OS === 'ios' ? 13 : 0 }]}
              onPress={() => navigation.goBack()}>
              <Image source={back} style={styles.image} />
            </TouchableOpacity>


            <View style={{ flexDirection: 'row' }}>

              {joinWithInfo && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {join && (
                    <View style={[{ flexDirection: 'row', alignItems: 'center' }, { joinstyle }]}>
                      <TouchableOpacity
                        style={{
                          borderColor: '#fff',
                          borderWidth: 1,
                          justifyContent: 'center',
                          padding: 6,
                          marginTop: Platform.OS === 'ios' ? 18 : 0,
                          alignItems: 'center',
                          paddingHorizontal: 20,
                          borderRadius: 20,
                        }}
                        disabled={loading}
                        onPress={() => {
                          setloading(true);

                          joinOnpress().then(() => setloading(false)).catch((error) => { setloading(false); console.log(error) });
                          // setloading(false);
                        }}>
                        <Text style={{ color: '#fff', fontFamily: Fonts.DroidSans }}>
                          Join
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  {information && (
                    <TouchableOpacity onPress={infoOnpress}>
                      <Image
                        source={Images.info}
                        style={[styles.imageStyle, { marginLeft: 20 }, infoStyle]}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {info && (
                <TouchableOpacity style={styleinfo} onPress={infoOnpress}>
                  <Image source={img} style={[styles.imageStyle, infoStyle]} />
                </TouchableOpacity>
              )}
              {addfriends && (
                <TouchableOpacity
                  onPress={onPressAdd}
                  style={[styles.back, { alignItems: 'center', marginTop: 7.2, marginRight: 15, }]}>
                  <View style={styles.imgView}>
                    <Image source={require('../assets/Images/add.png')} style={{ height: 16, width: 16 }} />
                  </View>
                  <Text style={styles.friends}>Requests</Text>
                </TouchableOpacity>
              )}


              {friends && (
                <TouchableOpacity
                  onPress={onPressFrnd}
                  style={[styles.back, { alignItems: 'center', marginTop: 8 }]}>
                  <View style={styles.imgView}>
                    <Image source={frnds} style={{ height: 16, width: 16 }} />
                  </View>
                  <Text style={styles.friends}>Friends</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          {top && (
            <View style={{ marginTop: Platform.OS === 'ios' ? 0 : 5 }}>
              <Text style={[styles.BrowseStyle, headerStyle]}>{HeaderTop}</Text>
            </View>
          )}
          <View style={{ marginTop: Platform.OS === 'ios' ? 0 : 20 }}>
            <Text style={[styles.BrowseStyle, headerStyle]}>{Header}</Text>
          </View>

          {isCenterShown && (
            <TouchableOpacity onPress={onPressCenter}>
              <Text style={[styles.centerText, centerStyle]}>{centerText}</Text>
              <Text style={styles.LowerText}>{LowerText}</Text>
            </TouchableOpacity>
          )}
          {showProgress && (
            <View style={styles.ViewStyle}>
              <Text style={styles.progres}>{progress}</Text>
              <Text style={styles.progress}>{progres}</Text>
            </View>
          )}
        </View>
        {showSearch && (
          <View style={{ position: 'absolute', top: 100, width: '100%' }}>
            <View style={[styles.input, { justifyContent: 'center' }]}>
              <TextInput
                placeholder="Search.."
                placeholderTextColor="black"
                style={styles.searchInput}
                {...headerTextInputProps}
              />
            </View>
          </View>
        )}
        {showTextInput && (
          <View style={{ position: 'absolute', top: 100, width: '100%' }}>
            <View style={styles.input}>
              <TextInput
                placeholder="Search.."
                placeholderTextColor="black"
                style={styles.searchInput}
                {...headerTextInputProps}
              />

              <View style={styles.img}>
                <Image source={filter} style={{ height: 24, width: 24 }} />
              </View>
            </View>
          </View>
        )}

        {showShare && (
          <View
            style={{
              position: 'absolute',
              top: Platform.OS === 'ios' ? 159 : 100,
              justifyContent: 'center',
              alignItems: 'center',

            }}>
            <View
              style={{
                marginHorizontal: 20,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '91%',

              }}>
              {upload && (
                <TouchableOpacity onPress={shareOnpress} style={styles.imag}>
                  <Image
                    source={require('../assets/Images/upload.png')}
                    style={{ height: 20, width: 20 }}
                  />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={filterOnpress}
                style={[styles.Image, { marginTop: 0 }]}>
                <Image source={Images.filter} style={{ height: 21, width: 21 }} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </>
  );
};

export default Header;

const styles = StyleSheet.create({
  friends: {
    color: '#fff',
    marginTop: 4,
    fontSize: 11,
    fontFamily: Fonts.DroidSans,
  },
  imgView: {
    height: 33,
    width: 33,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  Image: {
    height: 40,
    width: 60,
    backgroundColor: '#fff',
    alignItems: 'center',

    borderColor: '#F5F5F5',
    borderWidth: 1,
    justifyContent: 'center',
    borderRadius: 8,
  },
  ViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    justifyContent: 'space-between',
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginHorizontal: 20,
  },
  img: {
    height: 40,
    width: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  imag: {
    height: 40,
    width: 60,
    borderColor: '#F5F5F5',
    borderWidth: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#fff',
    width: '82%',
    borderRadius: 8,
    height: 40,
    color: 'black',
    backgroundColor: '#fff',
    paddingStart: 10,
    fontFamily: Fonts.DroidSans,
  },
  progress: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 15,
    fontFamily: Fonts.DroidSans,
  },
  progres: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 15,
    fontFamily: Fonts.DroidSans,
  },
  LowerText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 15,
    fontFamily: Fonts.DroidSans,
  },
  centerText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,

    fontFamily: Fonts.DroidSans,
  },
  imageStyle: {
    height: 24,
    marginTop: Platform.OS === 'ios' ? 17 : 0,
    width: 24,
    tintColor: '#fff',
  },
  image: {
    height: 24,
    width: 24,
    tintColor: '#fff',
  },
  header: {
    backgroundColor: color.green,
    height: Platform.OS === 'ios' ? 180 : 120,
    width: '100%',
  },
  BrowseStyle: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 24,
    marginTop: 20,
    marginHorizontal: 20,
    fontFamily: Fonts.DroidSansBold,
  },
  createBtn: {
    alignItems: 'flex-end',
    marginRight: 20,
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
  back: {
    marginTop: Platform.OS === 'ios' ? 0 : 0,
  },
});
