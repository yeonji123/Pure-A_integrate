import { useEffect, useState } from "react";
import {
    Text, View, TextInput,
    TouchableOpacity, StyleSheet,
    Alert, Keyboard, Image,
    KeyboardAvoidingView
} from "react-native";
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

// firebase 데이터 추가
import { db } from '../../firebaseConfig';
import { getDocs, collection } from 'firebase/firestore';

// device에 데이터 저장
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from "react-native";


/* LoginScreen - 관리자 로그인 화면 DB를 통해 회원 식별, 회원가입 선택 가능 */
const Login = (props) => {
    const [users, setUsers] = useState() //불러온 회원 정보

    const [idTextInput, setIdTextinput] = useState("") //입력받은 id
    const [pwTextInput, setPwTextinput] = useState("") //입력받은 password
    const [statusBarHeight, setStatusBarHeight] = useState(0);


    useEffect(() => {
        // DB에서 사용자의 데이터를 가져옴
        (async () => {
            try {
                const data = await getDocs(collection(db, "User")) // User 데이터 불러옴

                setUsers(data.docs.map(doc => doc.data())) // 데이터를 배열로 저장
                console.log('users', users)
            } catch (error) {
                console.log('eerror', error.message)
            }
        })();
    }, [])


    const login = () => {
        (async () => {
            try {
                console.log('login')
                var total = users.length
                var count = 0
                // 입력받은 id와 password가 DB에 저장된 회원정보와 일치하는지 확인
                users.map((user) => {
                    if (user.u_id == idTextInput && user.u_pw == pwTextInput) {
                        console.log('login success')
                    } else {
                        count += 1
                    }
                })

                if (total == count) {
                    // 동일한 회원정보가 없음
                    Alert.alert("일치한 회원 정보가 없습니다.")
                } else {
                    await AsyncStorage.setItem('id', idTextInput)
                    Alert.alert('로그인 성공')
                    props.navigation.reset({ routes: [{ name: 'Main' }] })
                }
            }
            catch (error) {
                console.log('error', error.message)
            }
        })();
    }




    const idChangeInput = (event) => {
        setIdTextinput(event)
    }

    const pwChangeInput = (event) => {
        setPwTextinput(event)
    }





    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback 
                style={styles.mainView}
                onPress={() => {
                    Keyboard.dismiss()
                }}
            >
                <KeyboardAvoidingView
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={statusBarHeight + 44}
                >
                    <View style={styles.logoImage}>
                        <Image style={{ width: '100%', height: '100%', resizeMode: 'cover', }} source={require('../../assets/um.png')}></Image>
                    </View>

                    
                        <TextInput
                            style={styles.loginputText}
                            value={idTextInput}
                            onChangeText={idChangeInput}
                            placeholder="ID"
                        />
                        <TextInput
                            style={styles.loginputText}
                            secureTextEntry={true}
                            value={pwTextInput}
                            onChangeText={pwChangeInput}
                            placeholder="PASSWORD"
                        />

                    <TouchableOpacity
                        style={styles.loginBTN}
                        onPress={() => {
                            login()
                        }}>
                        <Text style={styles.loginText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.loginBTN}
                        onPress={() => {
                            props.navigation.navigate("Join")
                        }}>
                        <Text style={styles.loginText}>SignUp</Text>
                    </TouchableOpacity>

                </KeyboardAvoidingView>

            </TouchableWithoutFeedback>
        </View>
    )
}

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoImage: {
        width: Dimensions.get('window').width * 0.4,
        height: Dimensions.get('window').height * 0.2,
        justifyContent: 'center',
        alignItems: 'center',
    },

    //뷰 스타일
    mainView: {
        flex: 1,
        height: '100%',
        marginTop: 50,
        alignItems: 'center',
        marginTop: 150,
    },
    //로그인 화면 인풋텍스트
    loginputText: {
        width: 180,
        height: 35,
        fontSize: 18,
        color: 'black',
        backgroundColor: '#EDEDED',
        borderRadius: 3,
        margin: 5,
        alignItems: 'center',
        padding: 5
    },
    //로그인 화면 버튼 (로그인, 회원가입)
    loginBTN: {
        backgroundColor: '#D9E5FF',
        width: 100,
        height: 30,
        marginTop: 5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    //로그인 화면 버튼 텍스트
    loginText: {
        fontSize: 15,
        color: 'black',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold'
    },
})