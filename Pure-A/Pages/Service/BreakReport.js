import { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet,
    Dimensions, ScrollView,
    TextInput, TouchableOpacity,
    Keyboard, Alert,
    KeyboardAvoidingView, NativeModules,
    Image,
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

// firebase 데이터 추가
import { db } from '../../firebaseConfig';
import { addDoc, getDocs, collection, setDoc, doc } from 'firebase/firestore';

import GraySmallButton from '../../Component/GraySmallButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 키보드가 가리는 문제 때문에 아마 아이폰에만 있을 듯?
const { StatusBarManager } = NativeModules


const BreakReport = ({ navigation, route }) => {


    const [breakList, setBreakList] = useState([false, false, false, false]); // 고장 내용 입력 list
    const [sentence, setSentence] = useState(''); // 구체적인 고장 사유 입력
    const [notifiData, setNotifiData] = useState(); // 고장 내용 입력 list

    const [station, setStation] = useState(route.params != undefined ? route.params.stationData : null); // scan한 station data
    const [statusBarHeight, setStatusBarHeight] = useState(0);

    // 답변, 신고 내역 확인할때 사용 stete
    const [checkBreak, setCheckBreak] = useState();


    const breakListFunc = (index) => {
        const temp = breakList;
        temp[index] = !temp[index];
        setBreakList(temp);
    }


    useEffect(() => {
        (async () => {
            try {

                if (route.params != undefined) {
                    if (route.params.checkReport != undefined) {
                        setCheckBreak(route.params.checkReport)
                        console.log(route.params.checkReport.no_type)
                        console.log(route.params.checkReport.no_type[0])
                    }

                    console.log('---------route.params.isbreak', route.params.checkReport)
                    console.log('---------route.params.stationData', route.params.stationData)
                    setStation(route.params.stationData)
                }

                console.log('breakreport')
                const data = await getDocs(collection(db, "StationNotification")) // Station이라는 테이블 명
                setNotifiData(data.docs.map(doc => ({ ...doc.data(), id: doc.id }))) // map을 돌려서 데이터를 복사하여 붙여놓고, id를 추가해줌
                data.docs.map(doc => (console.log(doc.data())))
            } catch (error) {
                console.log('eerror', error.message)
            }
        })();
    }, [route.params]);


    const submit = () => {
        (async () => {
            console.log(station)
            if (station) {// station 스캔했으면

                // notifyN : station의 다음 신고 내역 작성하기 위한 조사 notifyN
                var notifyN = 0;

                // 해당하는 station의 신고 내역을 다음 신고 번호를 부여하기 위해 staion의 신고 내역 DB 확인
                notifiData.map((item) => {
                    if (item.id.split('_')[0] == 'BR' && item.id.split('_')[1] == station.st_id) { // scan한 station id와 동일
                        if (item.id.split('_')[2] >= notifyN) {
                            // station관련 신고의 번호와 달라야 하니까 
                            // station 신고 번호 중 가장 큰 번호를 찾음
                            notifyN = parseInt(item.id.split('_')[2])
                        }
                    }
                })

                let todayData = new Date();
                let today = todayData.toLocaleDateString()

                let dbid = "BR_" + station.st_id + "_" + (notifyN + 1)
                console.log(dbid) // data id


                var okaysubmit = false
                var errormessage = ""

                console.log('sentence =', sentence)
                console.log('nofityN =', notifyN + 1)
                console.log('breakList =', breakList)
                console.log('station.st_id =', station.st_id)
                console.log('id', await AsyncStorage.getItem('id'))

                if (!station) {
                    console.log('station이 없음')
                    errormessage = "QR코드 촬영하여 station을 선택해주세요"
                } else if (sentence.length < 5) {
                    errormessage = "구체적인 고장 사유를 입력해주세요(5자 이상)"
                } else {
                    okaysubmit = true
                }


                console.log('errormessage', errormessage)
                console.log('okaysubmit', okaysubmit)



                if (okaysubmit) {

                    const docRef = await setDoc(doc(db, "StationNotification", dbid), {
                        no_additional: sentence,
                        a_id: '',
                        a_state: false,
                        answer: '',
                        no_category: 'BR',
                        no_date: today,
                        no_num: notifyN + 1,
                        no_type: breakList,
                        st_id: station.st_id,
                        u_id: await AsyncStorage.getItem('id'),
                    });

                    Alert.alert('신고 접수',
                        '신고가 완료되었습니다',
                        [
                            {
                                text: "확인",
                                onPress: () => navigation.pop()
                            }
                        ]
                    )
                }
                else { // 만약에 false라면
                    Alert.alert('신고 접수 실패', errormessage)
                }
            } else {
                alert('QR코드 촬영하여 station을 선택해주세요')
            }

        })();
    }



    return (
        <>
            {
                checkBreak ?
                    // 답변, 신고 내역 확인할때 UI
                    (
                        <KeyboardAvoidingView
                            style={styles.container}
                            behavior={"padding"}
                            keyboardVerticalOffset={statusBarHeight + 44}
                        >
                            <View style={{ padding: 10, height: '95%', }}>
                                <ScrollView
                                    style={{ width: '100%', }}
                                >

                                    <View style={{ height: 100, padding: 8 }}>
                                        <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#6699FF', }}>신고할 station</Text>
                                        <TouchableOpacity
                                            style={styles.bigbutton}
                                            onPress={() => {
                                                console.log('check')
                                                navigation.navigate('ScanStation')
                                            }}
                                            disabled={true}
                                        >
                                            {
                                                checkBreak == null ?
                                                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>QR코드 촬영</Text>
                                                    : <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{checkBreak.st_id}</Text>
                                            }

                                        </TouchableOpacity>
                                    </View>


                                    <View style={{ height: 150, padding: 8, }}>
                                        <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#6699FF' }}>고장 내용</Text>

                                        <View style={styles.breakselect}>
                                            <View style={{ justifyContent: 'space-around', width: '50%', marginRight: 5 }}>
                                                <GraySmallButton title="여닫이 작동 안함" disabled={true} color={checkBreak.no_type[0]} />
                                                <GraySmallButton title="폐우산 기부 안됨" disabled={true} color={checkBreak.no_type[1]} />
                                            </View>
                                            <View style={{ justifyContent: 'space-around', width: '50%', marginLeft: 5 }}>
                                                <GraySmallButton title="모터 작동 안함" disabled={true} color={checkBreak.no_type[2]} />
                                                <GraySmallButton title="QR코드 손실" disabled={true} color={checkBreak.no_type[3]} />
                                            </View>
                                        </View>
                                    </View>


                                    <View style={{ padding: 8, height: 250 }}>
                                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                            <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#6699FF' }}>구체적인 고장 사유</Text>
                                        </TouchableWithoutFeedback>

                                        <View style={{ marginTop: 10, }}>
                                            <View style={styles.sentenceInputView}>
                                                <Text style={{ fontSize: 18 }}>{checkBreak.no_additional}</Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={{ width: '100%', padding: 10, flexDirection: 'row', marginBottom: 20, }}>
                                        <Image style={{ width: 30, height: 30, marginTop: 10 }} source={require('../../assets/answer_arrow.gif')} />

                                        <View style={{ backgroundColor: '#CEEBE9', width: '85%', borderRadius: 10, padding: 5, }}>
                                            <View style={{ borderBottomColor: '#6699FF', borderBottomWidth: 2, }}>
                                                <Text style={{ fontSize: 20, marginLeft: 10, marginTop: 5 }}>Answer</Text>
                                                <Text style={{ fontSize: 15, marginLeft: 10, marginTop: 5, marginBottom: 10 }}>관리자 : {checkBreak.a_id}</Text>
                                            </View>
                                            <View style={{ padding: 5 }}>
                                                <Text style={{ fontSize: 15, marginLeft: 10, marginTop: 5, marginBottom: 10 }} multiline={true} >{checkBreak.answer}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </ScrollView>
                            </View>
                        </KeyboardAvoidingView >
                    )

                    :

                    // 사용자가 직접 작성하는 신고 내역                    
                    (
                        <KeyboardAvoidingView
                            style={styles.container}
                            behavior={"padding"}
                            keyboardVerticalOffset={statusBarHeight + 44}
                        >
                            <View>
                                <ScrollView
                                    style={styles.breakReportView}
                                >

                                    {/* <View style={styles.breakReportView}> */}
                                    <View style={styles.stationnum}>
                                        <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#6699FF' }}>신고할 station</Text>
                                        <TouchableOpacity
                                            style={styles.bigbutton}
                                            onPress={() => {
                                                console.log('check')
                                                navigation.navigate('ScanStation')
                                            }}
                                        >
                                            {
                                                station == null ?
                                                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>QR코드 촬영</Text>
                                                    : <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{station.st_id}</Text>
                                            }

                                        </TouchableOpacity>
                                    </View>


                                    <View style={styles.breakInfo}>
                                        <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#6699FF' }}>고장 내용</Text>
                                        <Text>* 해당되는 문제를 클릭하여주세요(복수 선택 가능)</Text>
                                        <View style={styles.breakselect}>
                                            <View style={{ justifyContent: 'space-around', width: '50%', marginRight: 5 }}>
                                                <GraySmallButton title="여닫이 작동 안함" func={() => breakListFunc(0)} />
                                                <GraySmallButton title="폐우산 기부 안됨" func={() => breakListFunc(1)} />
                                            </View>
                                            <View style={{ justifyContent: 'space-around', width: '50%', marginLeft: 5 }}>
                                                <GraySmallButton title="모터 작동 안함" func={() => breakListFunc(2)} />
                                                <GraySmallButton title="QR코드 손실" func={() => breakListFunc(3)} />
                                            </View>
                                        </View>
                                    </View>


                                    <View style={styles.sentence}>
                                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                            <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#6699FF' }}>구체적인 고장 사유</Text>
                                        </TouchableWithoutFeedback>

                                        <View style={{ marginTop: 10, }}>
                                            <View style={styles.sentenceInputView}>
                                                <TextInput
                                                    value={sentence}
                                                    onChangeText={text => setSentence(text)}
                                                    placeholder="useless placeholder"
                                                    multiline={true}
                                                />
                                            </View>
                                        </View>
                                    </View>


                                </ScrollView>
                            </View>
                            <View style={styles.submitView}>
                                <TouchableOpacity
                                    style={styles.submit}
                                    onPress={() => {
                                        console.log('DB에 저장 ')
                                        submit()
                                    }}
                                >
                                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>제출하기</Text>
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    )
            }
        </>
    );

};

export default BreakReport;

const styles = StyleSheet.create({
    container: {
        flex : 1,
        backgroundColor: '#fff',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    breakReportView: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 0.75,
        padding: 10,
        marginTop: 10,
    },
    stationnum: {
        height: '30%',
        padding: 8,
    },
    breakInfo: {
        height: '50%',
        padding: 8,
    },
    breakselect: {
        height: '75%',
        justifyContent: 'center',
        flexDirection: 'row',
        width: '100%',
    },
    sentence: {
        height: '100%',
        padding: 8,
    },
    sentenceInputView: {
        height: '90%',
        width: '100%',
        backgroundColor: '#F2F2F2',
        borderRadius: 10,
        padding: 10,
    },
    bigbutton: {
        backgroundColor: '#F2F2F2',
        padding: 10,
        borderRadius: 10,
        height: '70%',
        marginTop: 3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    submitView: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 0.25,
        padding: 10,
    },
    submit: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D9E5FF',
        borderRadius: 15,
        height: '40%',
        width: '100%'
    },
});