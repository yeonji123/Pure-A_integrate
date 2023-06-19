import { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Button, Alert, Modal, Pressable, Image, TextInput, Keyboard, KeyboardAvoidingView, } from 'react-native';


const USCheckInput = (props) => {
    const [text, setText] = useState("");
    const placetext = props.title + "를 입력해주세요."

    return (
        <View style={styles.textInputView}>
            {/* 어떤걸 넣을 것인지 = props.title */}
            <Text style={styles.titleText}>{props.title}</Text>
            <View style={{flexDirection:'row'}}>
                <TextInput
                    style={styles.textInput}
                    value={text}
                    placeholder={placetext}
                    onChangeText={(text) => { setText(text) }}
                ></TextInput>
                <Button title='check' onPress={()=>{console.log('check')}}></Button>
            </View>
            
        </View>
    );
};

export default USCheckInput;



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    textInputView: {
        width: Dimensions.get('window').width * 0.8,
        borderBottomColor: '#6699FF',
        borderBottomWidth: 3,
    },
    titleText: {
        marginTop: 8,
        marginLeft: 8,
        color: '#6699FF',
        fontWeight: 'bold',
    },
    textInput: {
        padding: 10,
        backgroundColor: 'white',
    },
}
);