import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useRef } from 'react'
import { Fonts } from '../components/Fonts'

const InputText = ({
    placeholder,
    placeholderTextColor,
    secureTextEntry,
    inputstying,
    onChangeText,
    inputText,
    keyboardType,
    value,
    onChange,
    editable,
    defaultValue,
    textAlignVertical,
    maxLength,
    multiline,
    returnKeyType,
    onSubmitEditing,
    selection,
    onBlur,
    onFocus,
    ref,
    rows
}) => {
    const inputRef = useRef(null); // Create a ref for the TextInput

    const handleClick = () => {
        if (inputRef.current) {
            inputRef.current.focus(); // Focus the TextInput when clicked
        }
    };
    return (
        <View 
            style={[ inputstying]}>
            <TextInput
                ref={inputRef}
                style={[styles.input, inputText]}
                placeholder={placeholder}
                placeholderTextColor={placeholderTextColor}
                secureTextEntry={secureTextEntry}
                onChangeText={onChangeText}
                autoCapitalize={"none"}
                keyboardType={keyboardType}
                value={value}
                selection={selection}
                multiline={multiline}
                onChange={onChange}
              //  ref={ref}
                editable={editable}
                defaultValue={defaultValue}
                textAlignVertical={textAlignVertical}
                maxLength={maxLength}
                autoFocus={onFocus}
                onBlur={onBlur}
                //onFocus={onFocus}
                onSubmitEditing={onSubmitEditing}
                returnKeyType={returnKeyType}
                rows={rows}
            />
        </View>
    )
}

export default InputText

const styles = StyleSheet.create({
    input: {
        width: "100%",
        height: 48,
        
        borderWidth: 1,
        borderColor: '#F1EDED',
        marginTop: 20,
        color:'#000',
       backgroundColor: '#fff',
        padding:6,
        borderRadius: 6,
        flexDirection: "row",
        paddingHorizontal: 10,
        alignItems: "flex-start",
        justifyContent: "center",
    },
    view: {
        flex: 1, fontSize: 16,
        color: 'gray',
        fontFamily:Fonts.DroidSans

    }
})