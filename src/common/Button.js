import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { Fonts } from '../components/Fonts';

export const Button = ({
    text,
    onPress,
    styling,
    textstyle,
    loading,
    disable
}) => (
    
    <View style={{ alignItems: 'center' }}>
        <TouchableOpacity
            
            disabled={disable}
            style={[styles.container, styling]}
            onPress={onPress}>
            {loading ? (
                <ActivityIndicator size={'small'} color={'#fff'} />
            ) : (
                <Text style={[styles.title, textstyle]}> {text} </Text>
            )}

        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 49,
        backgroundColor: '#4cab28',
        borderRadius: 7,
        flexDirection: "row",
        width: "100%",
    },
    title: {
        fontSize: 18,
        color: '#fff',
        fontFamily: Fonts.DroidSansBold

    },
});
