import { useEffect, useState, useContext } from 'react';
import { 
    View, Text, StyleSheet, Dimensions, 
    Alert, TouchableOpacity, ScrollView,
    Image
} from 'react-native';

import TitleName from '../../Component/TitleName';
import Detail from '../../Component/Detail';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppContext from '../../Appcontext';
import * as ImagePicker from 'expo-image-picker';
// firebase 연동
import { db } from '../../firebaseConfig';
import { doc, collection, getDocs, addDoc, updateDoc } from 'firebase/firestore';

const UserInfo = (props) => {
    const [data, setData] = useState(props.route.params.users);
    const [editMode, setEditMode] = useState(false); // 이미지 수정 모드이면 true, 아니면 false
    const [profileImage, setProfileImage] = useState(''); // 프로필 이미지 URI
    const myContext = useContext(AppContext);

    useEffect(() => {
        console.log('UserInfo')
        console.log(props.route.params)

    }, [])

    const logoutButton = () => {
        (async () => {
            try {
                Alert.alert('LogOut', '정말 로그아웃하시겠습니까?', [
                    {
                      text: '취소',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    {
                        text: '확인',
                        onPress: () => {
                            AsyncStorage.removeItem('id')
                            props.navigation.reset({routes:[{name:'Login'}]})
                        }
                    },
                ]);

            } catch (error) {
                console.log('eerror', error.message)
            }
        })();

    }


    const profileDBinsert = async (image) => {
        try {
            const id = await AsyncStorage.getItem('id')
            console.log('profileDBinsert --- id', id)
            
            await updateDoc(doc(db, "User", id), {
                u_profile: image
            })

        } catch (e) {
            console.log(e)
        }
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setEditMode(true)

            profileDBinsert(result.assets[0].uri)

            setProfileImage(result.assets[0].uri); // 선택한 이미지의 URI를 상태로 설정
        }
    };

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('이미지 라이브러리 접근 권한이 없습니다.');
                }
            }
        })();
    }, []);




    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollview}>
                <View style={styles.titleView}>
                    <TitleName title="프로필"></TitleName>
                    <View style={{ width: '100%', height: 120, justifyContent:'center', alignItems:'center', }}>
                        {
                            editMode && profileImage ?
                                <TouchableOpacity
                                    style={styles.imagestyle}
                                    onPress={() => {
                                        pickImage()
                                    }}
                                >
                                    <Image source={{uri:profileImage}} style={{width:'100%', height:'100%', borderRadius:100 }} />
                                    
                                </TouchableOpacity>
                                :
                                <>
                                    {
                                        data.u_profile != "" ? (
                                            <TouchableOpacity
                                                style={styles.imagestyle}
                                                onPress={() => {
                                                    
                                                    pickImage()
                                                }}
                                            >
                                                <Image source={{ uri: data.u_profile }} style={{width:'100%', height:'100%', borderRadius:100}} />
                                            </TouchableOpacity>)
                                            :
                                            (<TouchableOpacity
                                                style={styles.imagestyle}
                                                onPress={() => {
                                                    
                                                    pickImage()
                                                }}
                                            >
                                                <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/6522/6522516.png' }} style={{width:'100%', height:'100%', borderRadius:100}} />

                                            </TouchableOpacity>)

                                    }
                                </>
                        }
                        <Text style={{marginTop:5}}>* 프로필을 클릭하여 수정해보세요*</Text>
                    </View>

                    <Detail title="닉네임" value={myContext.connectedUser.u_name} icon="false"/>
                    <Detail title="ID" value={myContext.connectedUser.u_id}  icon="false"/>
                    <Detail title="PW" value="*****"  icon="false"/>
                    <Detail title="번호" value={myContext.connectedUser.u_phone} icon="false" />
                    <Detail title="이메일" value={myContext.connectedUser.u_email}  icon="false"/>
                </View>


                <View style={styles.titleView}>
                    <TitleName title="이용 내역"></TitleName>
                    <TouchableOpacity
                        onPress={() => {
                            props.navigation.navigate("MyDonation")
                        }}>
                        <Detail title="폐우산 기부 정보" icon="true" changePage="MyDonation" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            props.navigation.navigate("CustMain")
                        }}>
                        <Detail title="신고 및 접수" icon="true" changePage="CustMain" />
                    </TouchableOpacity>
                </View>

                <View style={{ padding: 10 }}>
                    <TouchableOpacity
                        style={styles.logoutView}
                        onPress={() => { logoutButton() }}
                    >
                        <Text style={{ fontSize: 20, }}>로그아웃</Text>
                    </TouchableOpacity>
                </View>


            </ScrollView>
        </View>
    );
};

export default UserInfo;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        paddingTop: 20,
        paddingBottom: 30,
        alignItems: 'center',
    },
    scrollview: {
        width: '100%',
        height: '100%',
    },
    titleView: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
    },
    logoutView: {
        width: '100%',
        height: Dimensions.get('window').height * 0.08,
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D9E5FF',
        borderRadius: 15,
        marginTop: 20,
    },
    imagestyle:{
        width: 100,  
        borderRadius:100, 
        borderWidth:3, 
        borderColor:'#6699FF', 
        marginTop:20,
    }
});