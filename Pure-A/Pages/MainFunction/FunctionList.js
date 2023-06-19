//23.06.04 19:14
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Button } from 'react-native';

import { db } from '../../firebaseConfig';
import { addDoc, getDocs, collection, setDoc, doc } from 'firebase/firestore';
import { set } from 'react-native-reanimated';

const FunctionList = ({ navigation, route }) => {
    const [retalButton, setRentalButton] = useState(true)
    const [returnButton, setReturnButton] = useState(true)
    const [userstate, setUserState] = useState(true)
    const [stationNum, setStationNum] = useState('') //station data
    const [manager, setManager] = useState(); //ble manager
    const [st_id, setStId]= useState(); //station id
    const [id, setId] = useState(AsyncStorage.getItem('id'))

    useEffect(() => {
        // 로직
        // 1. station QR 코드 스캔 완료
        // 2. 사용자 상태 확인(대여 / 반납 / 폐우산 기부 버튼 활성화)
        // 3. station에 우산(대여 가능)이 있는 지 확인하기
        // 4. station에 우산(반납 가능)이 있는 지 확인하기
        console.log('funcionlist', route.params.data.st_id);
        
        if (route.params != undefined) {
            setStationNum(route.params.data);
            setManager(route.params.device);
            setStId(route.params.st_id);
            var rentalCount = 0
            var returnCount = 0
            for (var i = 0; i < Object.keys(route.params.data.um_count_state).length; i++) { // um_count_state의 길이만큼 반복
                // key값이 string이라서 변환 후 state읽기
                if (route.params.data.um_count_state[String(i + 1)].state) { // true이면 대여 가능
                    rentalCount++; // 대여 가능한 우산 개수
                } else {
                    returnCount++; // 반납 가능한 우산 개수 false이면 우산 없음
                }
            }
            if (Object.keys(route.params.data.um_count_state).length == rentalCount) {
                // 전체 우산 개수와 대여 가능한 우산이 같으면
                // 남은 공간이 없음 -> 반납할 수 없음
                console.log('반납 불가능')
                setRentalButton(!retalButton)
            }
            if (Object.keys(route.params.data.um_count_state).length == returnCount) { 
                // 전체 우산 넣는 부분과 반납 가능한 우산 개수가 같으면
                // 대여 가능한 우산이 없음 -> 대여할 수 없음
                console.log('대여 불가능')
                setReturnButton(!returnButton)
            }
            console.log('userstate', userstate)
        }
    }, []);

    useEffect(() => {
        (async () => {
            try {
                // DB에 있는 User 데이터 가져오기
                const data = await getDocs(collection(db, "User"));
                data.docs.map(doc => { 
                    if (doc.data().u_id == id && doc.data().u_rent) { //사용자의 아이디와 같고 대여한 상태
                        // u_rent == false : 우산 대여 가능 -> 대여 버튼 활성화, 반납 버튼 비활성화
                        setUserState(false)
                    }
                 })
            } catch (error) {
                console.log('eerror', error.message)
            }
        })();
    
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.buttonView}>
                <TouchableOpacity
                    style={retalButton || userstate ? styles.buttonstyle : [styles.buttonstyle, { opacity: 0.5 }]}
                    onPress={() => 
                        navigation.push('Rental', { data: stationNum, device: manager, st_id: st_id})
                    }
                >
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>대여하기</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.buttonView}>
                <TouchableOpacity
                    style={retalButton || userstate ? styles.buttonstyle : [styles.buttonstyle, { opacity: 0.5 }]}
                    onPress={() => navigation.push('ReturnPage', { data: stationNum, device: manager, code: route.params.code})}
                >
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>반납하기</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.buttonView}>
                <TouchableOpacity
                    style={styles.buttonstyle}
                    onPress={() => navigation.push('DonationPage', { stationdata: route.params.data, device: manager })}
                >
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>폐우산 기부하기</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default FunctionList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        padding: 20,
        paddingTop: 50,
    },
    buttonView: {
        justifyContent: 'space-between',
        height: Dimensions.get('window').height * 0.1,
        marginBottom: 40,
    },
    buttonstyle: {
        width: '100%',
        height: Dimensions.get('window').height * 0.10,
        backgroundColor: '#6699FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    }
});