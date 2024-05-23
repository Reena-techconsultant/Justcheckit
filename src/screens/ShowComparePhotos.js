import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
  } from 'react-native';
  import React, {useEffect, useState} from 'react';
  import Header from '../common/Header';
  import {color} from '../components/color';
  import {Fonts} from '../components/Fonts';
  import Images from '../components/Images';
  
  const ShowComparePhotos = ({route}) => {
    const navigation = useNavigation();
    const task = route.params?.completed_task;
    const name = route.params?.name;

   // const [task, setTask] = useState({});
    const [loading, setLoading] = useState(false);
  
  
  
    return (
      <View style={{flex: 1, backgroundColor:'#F5F5F5'}}>
        <Header 
        headerStyle={styles.he}
        Header={name} back={Images.back} />
        <View style={styles.container}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.select}>Notes</Text>

          </View>
          {!loading ? (
            <>
              <View
                style={{
                  paddingHorizontal: 10,
                  borderColor: 'gray',
                  borderWidth: 0.5,
                  borderRadius: 8,
                  marginTop: 10,
                  height: 100,
                }}>
                <Text style={styles.content}>{task.description}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                }}>
                {task.first_pic && (
                  <View style={styles.userPhoto}>
                    <TouchableOpacity style={styles.imgStyle}>
                      <Image
                        source={{uri: task.first_pic}}
                        style={{
                          height: 150,
                          width: 150,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                )}
  
                {task.second_pic && (
                  <View style={styles.userPhoto}>
                    <TouchableOpacity style={styles.imgStyle}>
                      <Image
                        source={{uri: task.second_pic}}
                        style={{
                          height: 150,
                          width: 150,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                )}
  
                {task.third_pic && (
                  <View style={styles.userPhoto}>
                    <TouchableOpacity style={styles.imgStyle}>
                      <Image
                        source={{uri: task.third_pic}}
                        style={{
                          height: 150,
                          width: 150,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                )}
  
                {task.fourth_pic && (
                  <View style={styles.userPhoto}>
                    <TouchableOpacity style={styles.imgStyle}>
                      <Image
                        source={{uri: task.fourth_pic}}
                        style={{
                          height: 150,
                          width: 150,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </>
          ) : (
            <>
              <View
                style={{
                  flex: 1,
                  marginTop: 200,
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <ActivityIndicator />
              </View>
            </>
          )}
        </View>
      </View>
    );
  };
  
  export default ShowComparePhotos;
  
  const styles = StyleSheet.create({
    container: {
      padding: 20,
    },
    btn: {
      height: 42,
      width: '50%',
      marginVertical: 25,
    },
    imgStyle: {
      height: 150,
      width: 150,
      borderWidth: 1,
      borderColor: color.green,
      alignItems: 'center',
      justifyContent: 'center',
    },
    select: {
      color: color.green,
      fontSize: 25,
      fontFamily: Fonts.DroidSansBold,
    },
    img: {
      height: 150,
      width: 150,
      borderColor: color.green,
      borderWidth: 1,
    },
    content: {
      color: 'gray',
      fontFamily: Fonts.DroidSans,
      marginVertical: 15,
      fontSize: 16,
    },
    upload: {
      backgroundColor: color.green,
      height: 31,
      width: 108,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 6,
    },
    he:{
      marginTop:Platform.OS==='ios'? 14:10
        },
    userPhoto: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 20,
    },
  });
  