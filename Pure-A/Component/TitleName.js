import { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Button, Alert, Modal, Pressable, Image, TextInput, Keyboard, KeyboardAvoidingView, } from 'react-native';


const TitleName = (props) => {

    return (
        <View style={styles.titleVIew}>
            {/* 어떤걸 넣을 것인지 = props.title */}
            <Text style={styles.titleText}>{props.title}</Text>
        </View>
    );
};

export default TitleName;



const styles = StyleSheet.create({
    titleVIew: {
        width: Dimensions.get('window').width * 0.8,
        borderBottomColor: '#6699FF',
        borderBottomWidth: 3,
        paddingBottom: 10,
    },
    titleText: {
        fontSize: 25,
        marginTop: 8,
        marginLeft: 8,
        color: '#6699FF',
        fontWeight: 'bold',
    },
}
);