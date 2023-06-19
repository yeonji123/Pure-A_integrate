import {View, Text, StyleSheet, Dimensions, Button, Alert, Modal, Pressable, Image, TextInput, Keyboard, KeyboardAvoidingView, TouchableOpacity } from 'react-native';



const ButtonBig = (props) => {


    return (
        <TouchableOpacity
            style={[styles.loginBtn, { opacity: 0.5 }]}
            onPress={() => props.func()}
        >
            <Text style={styles.loginText}>{props.title}</Text>
        </TouchableOpacity>
    );
}
export default ButtonBig;

const styles = StyleSheet.create({
    loginBtn: {
        width: Dimensions.get('window').width * 0.8,
        borderRadius: 15,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        backgroundColor: "#6699FF",
    },
});