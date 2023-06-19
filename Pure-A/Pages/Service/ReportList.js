import { useEffect, useState } from 'react';
import { 
    View, Text, StyleSheet, 
    Dimensions, ScrollView,
    Image, TouchableOpacity,

} from 'react-native';

    

// firebase 데이터 추가
import { db } from '../../firebaseConfig';
import { addDoc, getDocs, collection, setDoc, doc } from 'firebase/firestore';

import AsyncStorage from '@react-native-async-storage/async-storage';
import TitleName from '../../Component/TitleName';

const ReportList = (props) => {
    const [reportList, setReportList] = useState();
    const [id, setId] = useState();

    useEffect(() => {
        // DB 읽어오기   
        (async () => {
            try {
                console.log('ReprotList')

                const data = await getDocs(collection(db, "StationNotification")) // Station이라는 테이블 명
                const id = await AsyncStorage.getItem('id')
                setId(id)
                console.log(id)

                setReportList(data.docs.map(doc => ({ ...doc.data(), id: doc.id })))
                console.log(data.docs.map(doc => ({ ...doc.data(), id: doc.id })))

                // setDonationList(data.docs.map(doc => ({ ...doc.data(), id: doc.id }))) // map을 돌려서 데이터를 복사하여 붙여놓고, id를 추가해줌
                

            } catch (error) {
                console.log('eerror', error.message)
            }
        })();

    }, []);



    return (
        <View style={styles.container}>
            
            <View style={styles.titleView}>
                <TitleName title="나의 신고 내역" />
            </View>

            <View style={{ width: '100%', height: '100%', }}>
                <ScrollView>
                    <View style={{ padding: 10 }}>
                        {
                            reportList && reportList.map((item, index) => {

                                if (item.u_id == id) {


                                    return (
                                        <View
                                            key={index}
                                            style={{ marginBottom: 10, backgroundColor: '#F4F4F4', borderRadius:10 }}
                                        >
                                            <TouchableOpacity
                                                style={{ width: '100%', height: 80, padding: 10, justifyContent: 'center', }}
                                                onPress={() => {
                                                    console.log(item.id)
                                                    if (item.id.split("_")[0]=="BR") {
                                                        props.navigation.navigate('BreakReport', { checkReport: item })         
                                                    }else{
                                                        props.navigation.navigate('RentalReturnReport', { checkReport : item})
                                                    }                                           
                                                }}
                                            >
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Image style={{ width: 50, height: 50, marginRight: 10, }} source={require('../../assets/um.png')} />
                                                    {
                                                        // BR인지 RR인지 확인하기 위해 
                                                        item.id.split("_")[0] == "BR" ? 
                                                            <View style={{ justifyContent: 'center', width: '65%' }}>
                                                                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{item.no_additional}</Text>
                                                                <Text style={{ fontSize: 13, marginTop: 10 }}>{item.st_id}</Text>
                                                            </View>
                                                            :
                                                            <View style={{ justifyContent: 'center', width: '65%' }}>
                                                                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{item.no_additional}</Text>
                                                                <Text style={{ fontSize: 13, marginTop: 10 }}>{item.st_id}</Text>
                                                            </View>
                                                    }
                                                    <View style={{ justifyContent: 'center', width: '15%', alignItems: 'center' }}>
                                                        {
                                                            item.a_state ?
                                                            <Text style={{ color: '#6699FF', fontWeight: 'bold' }}>답변완료</Text> : 
                                                                <Text style={{ color: '#F96D86', fontWeight: 'bold' }}>미답변</Text> 
                                                                
                                                        }
                                                    </View>
                                                </View>


                                            </TouchableOpacity>


                                        </View>
                                    )
                                }
                            })
                        }
                        {
                            reportList == null ?
                                <Text style={{ color :'gray', fontWeight: 'bold', fontSize: 20, padding: 10 }}>신고 내역이 없습니다</Text>
                                :
                                null
                        }
                        {/* <DonationComponent date="2023.04.08" stationnum="station1" statiodnadd="충청남도 아산시 탕정면 선물로 221번길 70"/> */}
                    </View>

                </ScrollView>
            </View>

        </View>
    );
};

export default ReportList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        padding:10,
    },
    titleView: {
        justifyContent:'center',
        alignItems:'center',
        marginTop:10
    },
});