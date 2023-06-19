import {
    Text, View, StyleSheet,
    Image, ActivityIndicator,
    Modal, TouchableOpacity, Dimensions,
    ScrollView,
} from 'react-native';
import { useEffect, useState, useContext } from 'react'


// Location API
import * as Location from 'expo-location';

// firebase 연동
import { db } from '../../firebaseConfig';
import { addDoc, collection, getDocs } from 'firebase/firestore';
// device에 데이터 저장
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppContext from '../../Appcontext';

//날씨 api키
const API_KEY = "204756a8614d5d5f3d4e6544f1cd8c7d"

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}


const Main = ({ navigation }) => {
    //날씨
    const [weather, setWeather] = useState("");
    const [icon, seticon] = useState("");
    const [address, setAddress] = useState("");
    const [id, setId] = useState("")

    const [users, setUsers] = useState();
    const [donation, setDonation] = useState(); // 폐우산 기부 계산

    const [modalVisible, setModalVisible] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const myContext = useContext(AppContext);

    useEffect(() => {
        (async () => {
            // firebase
            try {
                // 사용자 DB 데이터 가져오기
                const data = await getDocs(collection(db, "User"))
                var id = await AsyncStorage.getItem('id') // device에 저장되어 있는 id
                console.log('id -> ', id)
                setId(id)


                if (id == null) { // device에 저장된 id가 없으면 Login 페이지로 전환
                    navigation.reset({ routes: [{ name: 'Login' }] })
                }


                // DB에서 디바이스 사용자 아이디와 동일한 데이터만 set하기
                data.docs.map(doc => {
                    if (doc.data().u_id == id) {
                        setUsers(doc.data())
                        myContext.setUser(doc.data())
                        console.log(doc.data().u_donation)
                        setDonation(doc.data().u_donation)
                    }
                })


            } catch (error) {
                console.log('eeerror', error.message)
            }

            //위치 수집 허용하는지 물어보기
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            // 사용자의 위치에 맞는 날씨 정보 가져오기
            let location = await Location.getCurrentPositionAsync({});
            let addresscheck = await Location.reverseGeocodeAsync(location.coords);
            var addresstotal = addresscheck[0].region + ' ' + addresscheck[0].city // 충청남도 아산시    
            setAddress(addresstotal)
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude.toFixed(5)}&lon=${location.coords.longitude.toFixed(5)}&appid=${API_KEY}&units=metric`);
            const res = await response.json()
            // console.log('temp -> ',res)
            setWeather(res)
            iconsplit = res.weather[0].icon.split('n')
            seticon(iconsplit[0])
        })();
    }, [])


    return (
        <View style={styles.container}>
            <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <ScrollView
                                style={{ width: '100%', height: '100%', padding: 10, }}
                            >
                                <View style={{ height: 100, width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'orange' }}>
                                    <Text>우산이 없을 땐?</Text>
                                    <Image style={{ width: '100%', height: '100%', resizeMode: 'contain' }} source={require('../../assets/um.png')} />

                                </View>

                                <View style={{ height: 200, width: '100%' }}>

                                </View>

                            </ScrollView>

                            <View style={styles.modalbot}>
                                <TouchableOpacity
                                    style={styles.modalbutton}
                                    onPress={() => {
                                        // station 유무 확인 함수
                                        setModalVisible(!modalVisible)
                                    }}>
                                    <Text style={{ fontSize: 20, color: '#E7E7E7', fontWeight: 'bold' }}>확인</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>





            <View style={styles.explainView}>
                <TouchableOpacity
                    style={styles.explainUMS}
                    onPress={() => {
                        setModalVisible(true)
                        console.log("Dddd")
                    }}
                >
                    <View style={{ flexDirection: 'row', width: '100%' }}>
                        <View style={{ padding: 10, alignItems: 'center', width: '88%' }}>
                            <Text style={{ fontSize: 20, }}>          PURE - A </Text>
                        </View>
                        <View style={styles.arrowicon}>
                            <Image style={{ width: '50%', height: '50%' }} source={require('../../assets/arrow_icon.png')} />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>


            <View style={styles.userinfoView}>
                {
                    id && id != null ?
                        <TouchableOpacity
                            style={styles.userinfo}
                            onPress={() => navigation.navigate('UserInfo', { users: users })}
                        >
                            <View style={styles.weatherView}>
                                <View style={styles.weather}>
                                    {
                                        weather != "" ?
                                            <>
                                                <View style={styles.temperature}>
                                                    <View style={{ width: '40%', height: '100%', backgroundColor: 'white', borderRadius: 100, marginRight: 4 }}>
                                                        <Image style={{ width: '100%', height: '100%' }} source={{ uri: `http://openweathermap.org/img/wn/${icon}d.png` }} />
                                                    </View>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <Text style={{ fontSize: 30 }}> {weather.main.temp.toFixed(0)}</Text>
                                                        <Text style={{ fontSize: 20 }}>  °C </Text>
                                                    </View>
                                                </View>
                                                <View style={styles.location}>
                                                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{address}</Text>
                                                </View>
                                            </>
                                            :
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    width: '100%',
                                                    height: '100%',
                                                    justifyContent: 'center',
                                                    padding: 5,
                                                }}
                                            >
                                                <ActivityIndicator />
                                            </View>
                                    }
                                </View>
                            </View>
                            <View style={styles.userstate}>
                                <View style={{ flexDirection: 'row', height: '100%', alignItems: 'center' }}>
                                    {
                                        users ?
                                            <>
                                                <View style={{ width: '50%', height: '70%', justifyContent: 'center', }}>
                                                    <View style={{ height: '40%', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                        <Text style={{ fontSize: 22, marginBottom: 2 }}>{users.u_name}님은</Text>
                                                    </View>
                                                    <View style={{ height: '50%', justifyContent: 'center', width: '100%', alignItems: 'center' }}>
                                                        {
                                                            users.u_rent ?
                                                                <Text style={{ fontSize: 38, fontWeight: 'bold', color: '#FF7CBB' }}>대여 중</Text> :
                                                                <Text style={{ fontSize: 38, fontWeight: 'bold', color: '#05C19C' }}>대여 가능</Text>
                                                        }
                                                    </View>
                                                </View>
                                            </> :
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    width: '100%',
                                                    height: '100%',
                                                    justifyContent: 'center',
                                                    padding: 5,
                                                }}
                                            >
                                                <ActivityIndicator />
                                            </View>
                                    }
                                    <View style={{ width: '40%', hieght: '70%', justifyContent: 'center', alignItems: 'center', }}>
                                        {
                                            // 이미지 링크 넣기 user DB에 스토리지 링크 넣어서 가져오기
                                            users && users.u_profile != "" ?
                                                <View style={styles.imagestyle}>
                                                    <Image style={{ width: '100%', height: '100%', borderRadius: 100 }} source={{ uri: users.u_profile }}></Image>
                                                </View>
                                                :
                                                <View style={styles.imagestyle}>
                                                    <Image style={{ width: '100%', height: '100%', borderRadius: 100 }} source={{ uri: 'https://cdn-icons-png.flaticon.com/512/6522/6522516.png' }}></Image>
                                                </View>
                                        }
                                        {
                                            id != null ?
                                                <>
                                                    {
                                                        donation ?
                                                            <Text style={{ fontSize: 15 }}>폐우산 기부 횟수 : {donation}</Text>
                                                            :
                                                            <Text style={{ fontSize: 16 }}>폐우산 기부 횟수 : 0</Text>
                                                    }
                                                </> : null

                                        }
                                    </View>
                                </View>
                            </View>

                        </TouchableOpacity> :
                        <TouchableOpacity
                            style={styles.userinfo}
                            onPress={() => navigation.navigate('Join')}

                        >
                            <View style={styles.weatherView}>
                                <View style={styles.weather}>
                                    {
                                        weather != "" ?
                                            <>
                                                <View style={styles.temperature}>
                                                    <View style={{ width: '40%', height: '100%', backgroundColor: 'white', borderRadius: 50, marginRight: 4 }}>
                                                        <Image style={{ width: '100%', height: '100%' }} source={{ uri: `http://openweathermap.org/img/wn/${icon}d.png` }} />
                                                    </View>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <Text style={{ fontSize: 30 }}>{weather.main.temp.toFixed(0)}</Text>
                                                        <Text style={{ fontSize: 20 }}>  °C </Text>
                                                    </View>
                                                </View>
                                                <View style={styles.location}>
                                                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{address}</Text>
                                                </View>
                                            </>
                                            :
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    width: '100%',
                                                    height: '100%',
                                                    justifyContent: 'center',
                                                    padding: 5,
                                                }}
                                            >

                                                <ActivityIndicator />
                                            </View>
                                    }
                                </View>
                            </View>
                            <View style={styles.login}>
                                <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#6699FF' }}> 로그인 / 회원가입 하기</Text>
                            </View>
                        </TouchableOpacity>
                }

            </View>




            <View style={styles.mainfunctionView}>
                <TouchableOpacity
                    style={styles.mapbutton}
                    onPress={() => navigation.navigate('Map')}
                >
                    <View style={styles.shadow}>
                        <Image style={{ width: '100%', height: '70%', borderRadius: 15 }} source={require('../../assets/main_map.gif')}></Image>
                        <View style={{ width: '100%', height: '30%', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 20, marginBottom: 5 }}>우산 station</Text>
                            <Text style={{ fontSize: 25, fontWeight: 'bold' }}>찾아보기</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.scanner}
                    onPress={() => navigation.navigate('QRCodeScanner')}
                >
                    <View style={styles.shadow}>
                        <Image style={{ width: '100%', height: '70%', borderRadius: 15 }} source={require('../../assets/main_qr_1.gif')}></Image>
                        <View style={{ width: '100%', height: '30%', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 20, marginBottom: 5 }}>QR 스캔하고</Text>
                            <Text style={{ fontSize: 25, fontWeight: 'bold' }}>대여하기</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>



            <View style={styles.serviceView}>
                <TouchableOpacity
                    style={styles.service}
                    onPress={() => navigation.navigate('CustMain')}
                >
                    <View style={{ width: '20%', height: '100%', alignItems: 'center', padding: 10, }}>
                        <Image style={{ width: '70%', height: '100%' }} source={require('../../assets/service_icon.png')}></Image>
                    </View>
                    <View style={{ width: '80%', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>고객센터        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>

    );
}

export default Main;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        width: Dimensions.get('screen').width * 0.85,
        height: Dimensions.get('screen').height * 0.7,
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTop: {
        width: '100%',
        height: '15%',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 10,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
    },
    modalMid: {
        width: '100%',
        height: '70%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    modalbot: {
        width: '100%',
        height: '15%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    modalbutton: {
        width: '30%',
        height: '80%',
        backgroundColor: "#B2CCFF",
        borderRadius: 10,
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
    },
    explainView: {
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height * 0.1,
        padding: 15,
        justifyContent: 'center',
        flexDirection: 'row'
    },
    explainUMS: {
        width: '100%',
        height: '100%',
        backgroundColor: '#D9E5FF',
        justifyContent: 'center',
        alignContent: 'center',
        borderRadius: 15,
    },
    arrowicon: {
        width: '12%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    login: {
        width: '90%',
        height: '65%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userinfoView: { //사용자 정보 첫 레이아웃
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height * 0.28,
        padding: 15,
        justifyContent: 'center',
        alignContent: 'center',
    },
    userinfo: { // 사용자의 정보 radius
        width: '100%',
        height: '100%',
        backgroundColor: '#F2F2F2',
        borderRadius: 15,
        padding: 5,
        alignItems: 'center',
    },
    weatherView: {
        width: '90%',
        height: '35%',
        borderBottomColor: '#848484',
        borderBottomWidth: 2,
    },
    weather: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 3,
    },
    temperature: {
        flexDirection: 'row',
        width: '50%',
        height: '100%',
        justifyContent: 'flex-end',
        padding: 5,
    },
    location: {
        width: '50%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userstate: {
        width: '100%',
        height: '65%',
        paddingTop: 5,
        alignItems: 'center',
        paddingBottom: 10,
    },
    donation: {
        width: '100%',
        height: '20%',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingRight: 15,
    },
    mainfunctionView: {
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height * 0.35,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    mapbutton: {
        width: '48%',
        height: '100%',
        marginRight: 7,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    shadow: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        elevation: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3.84,
        backgroundColor: 'white',
        borderRadius: 10
    },
    scanner: {
        width: '48%',
        height: '100%',
        marginLeft: 7,
        borderRadius: 15,
    },
    serviceView: {
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height * 0.1,
        padding: 15,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    service: {
        width: '100%',
        height: '100%',
        backgroundColor: '#F2F2F2',
        justifyContent: 'center',
        alignContent: 'center',
        borderRadius: 15,
        flexDirection: 'row'
    },
    imagestyle: {
        width: '55%',
        height: '70%',
        borderRadius: 100,
        borderWidth: 3,
        borderColor: '#6699FF',
        marginBottom: 10
    },
});
