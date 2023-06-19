import { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet,
    Dimensions, Alert,
    TextInput, TouchableOpacity,
    Keyboard, KeyboardAvoidingView,
    Platform, ScrollView,
    Image,
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { RadioButton } from 'react-native-paper';

import GraySmallButton from '../../Component/GraySmallButton';

// firebase 데이터 추가
import { db } from '../../firebaseConfig';
import { getDocs, collection, setDoc, doc } from 'firebase/firestore';
// id
import AsyncStorage from '@react-native-async-storage/async-storage';




const RentalReturnReport = ({ navigation, route }) => {
    const [id, setId] = useState(); // user id
    const [rentalReturnList, setRentalReturnList] = useState([false, false]); // 반납, 대여 값
    const [checked, setChecked] = useState('first'); // 고장 라디오 값
    const [sentence, setSentence] = useState(''); // 구체적인 고장 사유 입력

    const [notifiData, setNotifiData] = useState(); // 고장 내용 DB list

    const [report, setReport] = useState(); // 신고 내용

    const [isButton, setIsButton] = useState(false)
    const [show, setShow] = useState(false); // 대여/반납 신고 선택


    useEffect(() => {
        (async () => {
            try {
                if (route.params != undefined) {
                    console.log('---------route.params.report', route.params.checkReport)
                    setReport(route.params.checkReport)
                }
                console.log('retalreturnReport')
                const data = await getDocs(collection(db, "StationNotification")) // Station이라는 테이블 명
                setNotifiData(data.docs.map(doc => ({ ...doc.data(), id: doc.id }))) // map을 돌려서 데이터를 복사하여 붙여놓고, id를 추가해줌
                const id = await AsyncStorage.getItem('id')
                setId(id)
            } catch (error) {
                console.log('eerror', error.message)
            }
        })();
    }, [route.params]);




    const rentalReport = (index) => {
        setIsButton(true)
        const temp = rentalReturnList
        temp[index] = !temp[index]

        setRentalReturnList(temp)
        if (index == 0) { // 대여하기라면
            setShow(true)
        }else{ // 반납이라면
            setShow(false)
        }
    }


    const submit = () => {
        (async () => {
            console.log('notifi', notifiData)
            var notifyN = 0;
            notifiData.map((item) => {
                if (item.id.split('_')[0] == 'RR' && item.id.split('_')[1] == id) { // scan한 station id와 동일하고
                    // station관련 신고의 번호와 달라야하니까 
                    notifyN = parseInt(item.id.split('_')[2])
                  
                }
            })
            // 현재 날짜
            let todayData = new Date();
            let today = todayData.toLocaleDateString()
            // 데이터 베이스 저장 키 값
            let dbid = "RR_" + id + "_" + (notifyN + 1)
            console.log(dbid) // data id

            var okaysubmit = false
            var errormessage = ""
            console.log('rentalReturnList',rentalReturnList)
            console.log('checked',checked)
            console.log('sentence',sentence)

            if (rentalReturnList[0] == true) { // 대여 신고라면
                if (checked == 'forth') { //기타를 선택하면
                    if (sentence == '' || sentence.length<8) { // 빈칸 x, 8자 이상
                        errormessage = "8자 이상 구체적인 신고 내용을 입력해주세요"
                    } else{
                        okaysubmit = true
                    }
                } else {
                    okaysubmit = true
                }

            } else if (rentalReturnList[1] == true) { // 반납 신고라면
                if ( checked=='first' || checked=='second'){
                    errormessage= "문제원인을 선택해주세요"
                } else if (checked == 'forth') { //기타를 선택하면
                    if (sentence == '' || sentence.length<8) { // 빈칸 x, 8자 이상
                        errormessage = "8자 이상 구체적인 신고 내용을 입력해주세요"
                    } else{
                        okaysubmit = true
                    }
                } else if (checked == 'third'){
                    okaysubmit = true
                }

            } else if(checked == 'fourth' && sentence.length>=8) { // 아무것도 체크 안하고 기타를 선택하면 그리고 8자 이상이면
                okaysubmit = true
            } else {
                errormessage = "문제원인을 선택해주세요"
            }

            if (rentalReturnList[0] == true && rentalReturnList[1] == true) { // 대여, 반납 버튼 둘 다 눌렀으면
                okaysubmit=false
                errormessage = "대여/반납 중 하나를 선택해주세요"
            } 
            console.log('errormessage', errormessage)
            console.log('okaysubmit', okaysubmit)

            // 데이터 베이스에 삽입
            if (okaysubmit) {
                const docRef = await setDoc(doc(db, "StationNotification", dbid), {
                    a_id: "",
                    a_state: false,
                    answer: "",
                    no_additional: sentence,
                    no_date: today,
                    no_num: notifyN + 1,
                    no_radio: checked,
                    no_type: rentalReturnList, // first / second / third
                    no_category: "RR",

                    u_id: id
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

        })();
    }



    return (
        <>
            {
                report != undefined ?
                    (
                        <KeyboardAvoidingView
                            style={styles.container}
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        >
                            <View style={{padding:10,height:'95%', }}>
                                <ScrollView >

                                    <View style={[styles.problemView, { height: 80}]}>
                                        <GraySmallButton title="대여가 안돼요" height='80%' width='45%' disabled={true} color={route.params.checkReport.no_type[0]} />
                                        <GraySmallButton title="반납이 안돼요" height='80%' width='45%' disabled={true} color={report.no_type[1]} />
                                    </View>


                                    <View style={[styles.radioView,{height:200, }]}>
                                        <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#6699FF' }}>문제 원인 선택하기</Text>
                                        <View style={styles.radio}>
                                            <RadioButton
                                                color='#6699FF'
                                                value="first"
                                                status={report.no_radio === 'first' ? 'checked' : 'unchecked'}

                                            />
                                            <Text style={{ fontSize: 17 }}>대여했는데 우산을 잃어버렸어요</Text>
                                        </View>
                                        <View style={styles.radio}>
                                            <RadioButton
                                                color='#6699FF'
                                                value="second"
                                                status={report.no_radio === 'second' ? 'checked' : 'unchecked'}

                                            />
                                            <Text style={{ fontSize: 17 }}>대여하지 않았는데 대여중이라고 나와있어요</Text>
                                        </View>
                                        <View style={styles.radio}>
                                            <RadioButton
                                                color='#6699FF'
                                                value="third"
                                                status={report.no_radio === 'third' ? 'checked' : 'unchecked'}

                                            />
                                            <Text style={{ fontSize: 17 }}>반납 하기가 안돼요</Text>
                                        </View>
                                        <View style={styles.radio}>
                                            <RadioButton
                                                color='#6699FF'
                                                value="fourth"
                                                status={report.no_radio === 'fourth' ? 'checked' : 'unchecked'}

                                            />
                                            <Text style={{ fontSize: 17 }}>기타(하단에 구체적인 신고 내용을 적어주세요)</Text>
                                        </View>
                                    </View>


                                    <View style={[styles.sentence,{ height:250,}]}>
                                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                            <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#6699FF' }}>구체적인 신고 내용</Text>
                                            <View style={{ marginTop: 10, }}>
                                                <View style={styles.sentenceInputView}>
                                                    <Text style={{ fontSize: 18 }}>{report.no_additional}</Text>
                                                </View>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>

                                    <View style={{ width: '100%',  padding: 10, flexDirection: 'row', marginBottom: 20,  }}>
                                        <Image style={{ width: 30, height: 30, marginTop: 10 }} source={require('../../assets/answer_arrow.gif')} />

                                        <View style={{ backgroundColor: '#CEEBE9', width: '85%', borderRadius: 10, padding: 5, }}>
                                            <View style={{ borderBottomColor: '#6699FF', borderBottomWidth: 2, }}>
                                                <Text style={{ fontSize: 20, marginLeft: 10, marginTop: 5 }}>Answer</Text>
                                                <Text style={{ fontSize: 15, marginLeft: 10, marginTop: 5, marginBottom: 10 }}>관리자 : {report.a_id}</Text>
                                            </View>
                                            <View style={{ padding: 5 }}>
                                                <Text style={{ fontSize: 15, marginLeft: 10, marginTop: 5, marginBottom: 10 }}>{report.answer}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </ScrollView>

                            </View>

                        </KeyboardAvoidingView>
                    )




                    :




                    (
                        <KeyboardAvoidingView
                            style={styles.container}
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        >

                            <View style={styles.rentalReportView}>

                                <View style={styles.problemView}>
                                    <GraySmallButton title="대여가 안돼요" func={() => rentalReport(0)} height='80%' width='45%' />
                                    <GraySmallButton title="반납이 안돼요" func={() => rentalReport(1)} height='80%' width='45%' />
                                </View>
                                

                                <View style={styles.radioView}>
                                    <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#6699FF' }}>문제 원인 선택하기</Text>
                                    {
                                        isButton ? // 버튼을 클릭했고 대여 신고면
                                            (
                                                show ?
                                                    <>
                                                        <View style={styles.radio}>
                                                            <RadioButton
                                                                color='#6699FF'
                                                                value="first"
                                                                status={checked === 'first' ? 'checked' : 'unchecked'}
                                                                onPress={() => setChecked('first')}
                                                            />
                                                            <Text style={{ fontSize: 17 }}>대여했는데 우산을 잃어버렸어요</Text>
                                                        </View>
                                                        <View style={styles.radio}>
                                                            <RadioButton
                                                                color='#6699FF'
                                                                value="second"
                                                                status={checked === 'second' ? 'checked' : 'unchecked'}
                                                                onPress={() => setChecked('second')}
                                                            />
                                                            <Text style={{ fontSize: 17 }}>대여하지 않았는데 대여중이라고 나와있어요</Text>
                                                        </View>
                                                    </>

                                                    :
                                                    <>
                                                        <View style={styles.radio}>
                                                            <RadioButton
                                                                color='#6699FF'
                                                                value="third"
                                                                status={checked === 'third' ? 'checked' : 'unchecked'}
                                                                onPress={() => setChecked('third')}
                                                            />
                                                            <Text style={{ fontSize: 17 }}>반납해야하는데 안돼요</Text>
                                                        </View>

                                                    </>
                                            )
                                    : null

                                    }


                                            




                                    <View style={styles.radio}>
                                        <RadioButton
                                            color='#6699FF'
                                                value="forth"
                                                status={checked === 'forth' ? 'checked' : 'unchecked'}
                                                onPress={() => setChecked('forth')}
                                            />
                                            <Text style={{ fontSize: 17 }}>기타(하단에 구체적인 신고 내용을 적어주세요)</Text>
                                        </View>
                                    </View>


                                    <View style={styles.sentence}>
                                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                            <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#6699FF' }}>구체적인 신고 내용</Text>
                                            <View style={{ marginTop: 10, }}>
                                                <View style={styles.sentenceInputView}>
                                                    <TextInput
                                                        value={sentence}
                                                        onChangeText={text => setSentence(text)}
                                                        placeholder="구체적인 신고 내용을 적어주세요"
                                                        multiline={true}
                                                    />
                                                </View>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                            </View>
                            <View style={styles.submitView}>
                                <TouchableOpacity
                                    style={styles.submit}
                                    onPress={() => {
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

export default RentalReturnReport;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    rentalReportView: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 0.75,
        padding: 10,
        marginTop: 10,
    },
    problemView: {
        width: '100%',
        height: 80,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 5,
    },
    radioView: {
        height: 180,
        padding: 8,
    },
    radio: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sentence: {
        height:250,
        padding: 8,
        marginTop: 10,
    },
    sentenceInputView: {
        height: '90%',
        width: '100%',
        backgroundColor: '#F2F2F2',
        borderRadius: 10,
        padding: 10,
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
    },
});