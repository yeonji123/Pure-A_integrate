import {useEffect, useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';


const GraySmallButton = (props) => {
    const [color, setColor] = useState(props.color);

    useEffect (() => {
        setColor(props.color)
    }, [props.color])

    return (
        <TouchableOpacity
            style={color ? [styles.smallbutton, { backgroundColor: '#6699FF'}] : styles.smallbutton}
            onPress={() => {
                props.func()
                setColor(!color)
            }}
            disabled={props.disabled}
        >
            <Text style={color ? [styles.textstyle, { color: 'white' }] : styles.textstyle}>{props.title}</Text>
        </TouchableOpacity>
    );
};

export default GraySmallButton;

const styles = StyleSheet.create({
    smallbutton: {
        backgroundColor: '#F2F2F2',
        borderRadius: 10,
        padding:10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textstyle:{
        fontSize: 20, 
        fontWeight: 'bold',
    }
});