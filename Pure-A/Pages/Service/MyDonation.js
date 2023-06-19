import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';

import DonationComponent from '../../Component/DonationComponent';

// firebase 데이터 추가
import { db } from '../../firebaseConfig';
import { addDoc, getDocs, collection, setDoc, doc } from 'firebase/firestore';

import AsyncStorage from '@react-native-async-storage/async-storage';

import TitleName from '../../Component/TitleName';

const MyDonation = ({ navigation }) => {
    const [donationList, setDonationList] = useState();
    const [id, setId] = useState();

    useEffect(() => {
        // DB 읽어오기   
        (async () => {
            try {
                console.log('MyDonation')

                const data = await getDocs(collection(db, "Donation")) // Station이라는 테이블 명
                const id = await AsyncStorage.getItem('id')
                setId(id)

                console.log(id)

                setDonationList(data.docs.map(doc => ({ ...doc.data(), id: doc.id }))) // map을 돌려서 데이터를 복사하여 붙여놓고, id를 추가해줌


            } catch (error) {
                console.log('eerror', error.message)
            }
        })();

    }, []);



    return (
        <View style={styles.container}>
            <View style={styles.titleView}>
                

                <TitleName title={"나의 기부 내역"} />
           
                <View style={{ width: '100%', height: '100%', marginTop: 5 }}>
                    <ScrollView>
                        <View style={{ padding: 10 }}>
                            {
                                donationList && donationList.map((item, index) => {

                                    if (item.u_id.split('_')[0] == id) {

                                        return (
                                            <View
                                                key={index}
                                                style={{ marginBottom: 10, }}
                                            >
                                                <DonationComponent key={index} date={item.d_date} stationnum={item.st_id} image={item.d_image} />
                                            </View>
                                        )
                                    }
                                })
                            }
                            {
                                donationList == null ?
                                    <Text style={{ color: 'gray', fontWeight: 'bold', fontSize: 20, padding: 10 }}>기부 내역이 없습니다</Text>
                                    :
                                    null
                            }
                            {/* <DonationComponent date="2023.04.08" stationnum="station1" statiodnadd="충청남도 아산시 탕정면 선물로 221번길 70"/> */}
                        </View>

                    </ScrollView>
                </View>

            </View>
        </View>
    );
};

export default MyDonation;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        paddingTop: 30,
    },
    titleView: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
    },
});