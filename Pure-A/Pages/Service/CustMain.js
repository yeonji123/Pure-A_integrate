import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';


import TitleName from '../../Component/TitleName';
import Detail from '../../Component/Detail';



const CustMain = ({navigation}) => {
    return (
        <View style={styles.container}>
            <View style={styles.titleView}>
                <TitleName title="고객센터" />
            </View>

            
            <TouchableOpacity
                onPress={() =>navigation.navigate("BreakReport")}
            >
                <Detail title="Station 고장 신고" icon="true" />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() =>navigation.navigate("RentalReturnReport")}
            >
                <Detail title="대여/반납 신고" icon="true" />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() =>navigation.navigate("ReposrtList")}
            >
                <Detail title="나의 신고 내역 보기" icon="true" />
            </TouchableOpacity>
        </View>
    );
};

export default CustMain;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        paddingTop:30,
        alignItems:'center',
    },
    titleView: {
        justifyContent:'center',
        alignItems:'center',
        
    },
});