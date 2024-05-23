import { Platform, StyleSheet, Dimensions, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Image } from 'react-native'
import Images from '../components/Images'
import { color } from '../components/color'
import { useNavigation } from '@react-navigation/native';
import {
    responsiveHeight,
    responsiveWidth,
} from "react-native-responsive-dimensions";
const { width, height } = Dimensions.get('window');
const isAndroid = Platform.OS === 'android';

const AuthHeader = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.top}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image source={require('../assets/Images/back.png')}
                    style={styles.img} />
            </TouchableOpacity>
            <View style={styles.imgview}>
            <Image source={Images.web}
              style={{
                width: isAndroid ? responsiveWidth(40) : responsiveWidth(44),
                height: isAndroid ? responsiveHeight(20) : responsiveHeight(21),
            }} 
           />
            </View>
        </View>
    )
}

export default AuthHeader

const styles = StyleSheet.create({
    imgview: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: responsiveHeight(10)
    },
    top: {
        height: height >= 812 ? 350 : 300,
        paddingHorizontal: 20
    },
    icon: {
        height: width * 0.40,
        width: width * 0.60,
    },
    img: {
        height: 28,
        marginTop: Platform.OS === 'ios' ? 45 : 10,
        width: 28, tintColor: color.green,
    },
})