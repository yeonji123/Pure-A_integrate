import { useState, useEffect, useContext } from 'react';
import { 
    View, Text, StyleSheet, 
    TouchableOpacity, Dimensions, Image, Alert
} from 'react-native';
import AppContext from '../../Appcontext';

//fire store
//npx expo install firebase
import { db } from '../../firebaseConfig';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import base64 from 'react-native-base64';


const ReturnPage = ({route, navigation}) => {
    const [workcomplete, setWorkcomplete] = useState(false);
    const [empty,setEmpty] = useState(0); //빈 자리 번호
    const [manager, setManager] = useState();
    const [returnState, setReturn] = useState();
    const myContext = useContext(AppContext);
    const [numberData, setNumberData] = useState();
    const [reload, setReload] = useState(false);


    useEffect(() => {
        (async () => {
            setManager(route.params.device);
            // if(myContext.connectedStation.st_state && myContext.connectedUser.u_rent){ //스테이션 상태(true) and 사용자 대여 상태(true)
            //     send();
            // } else if(myContext.connectedUser.u_rent == false){
            //     Alert.alert("현재 대여중인 우산이 없습니다.");
            // }
        })();
    }, [manager,reload]);

 
    const send = async(num) =>{ 
        try{
            const docStation = doc(db,"Station",myContext.connectedStation.st_id);
            const docSnap = await getDoc(docStation);
            for(let i=1;i<9;i++){
                const state = docSnap.get(`um_count_state.${String(i)}.state`);
                if(state == false){ 
                    console.log("false 우산 번호: "+i+"\n");
                    const angle = docSnap.get(`um_count_state.${String(i)}.angle`)
                    setNumberData(String(i));
                    console.log("angle: "+angle+"\n");

                    if(String(angle).length == 1){ 
                        await manager.writeCharacteristicWithResponseForDevice(
                            `${route.params.data.st_mac}`,
                            '0000ffe0-0000-1000-8000-00805f9b34fb', //serviceUUID
                            '0000ffe1-0000-1000-8000-00805f9b34fb', //characterUUID
                            base64.encode('0000002')
                        )
                        console.log('전송 값: 0000002')
                    }
                    if(String(angle).length == 2){ //각도가 2자리 수이면 0000각도1
                        console.log('Send Function Start');
                        await manager.writeCharacteristicWithResponseForDevice(
                            `${route.params.data.st_mac}`,
                            '0000ffe0-0000-1000-8000-00805f9b34fb', //serviceUUID
                            '0000ffe1-0000-1000-8000-00805f9b34fb', //characterUUID
                            base64.encode(`0000${angle}2`)
                        )
                        console.log(`전송 값: 0000${angle}2`)
                    }
                    else if(String(angle).length == 3){ //각도가 3자리 수이면 000각도1
                        console.log('Send Function Start');
                        await manager.writeCharacteristicWithResponseForDevice(
                            `${route.params.data.st_mac}`,
                            '0000ffe0-0000-1000-8000-00805f9b34fb', //serviceUUID
                            '0000ffe1-0000-1000-8000-00805f9b34fb', //characterUUID
                            base64.encode(`000${angle}2`)
                        )
                        console.log(`전송 값: 000${angle}2`)
                    }
                    break;
                }
            }
          
        }catch(error){
            console.log(error);
        }
      }

    
      const updateState = async(um_num, code) =>{ //매개변수로 사용자가 선택한 번호를 받음
        try{
          console.log("update!");
          console.log("umbrella Number: "+um_num);
          console.log("전송받은 데이터: "+code);

          const docStation = doc(db,"Station",myContext.connectedStation.st_id);
          const docUser = doc(db,"User", myContext.connectedUser.u_id);
          const docSnap1 = await getDoc(docStation);
          const docSnap2 = await getDoc(docUser);
          const st_count = docSnap1.get('st_count'); //station 우산 개수 
  
          switch (code){
                case "24": //반납 성공
                    console.log("case 24");
                    await updateDoc(docStation,
                    `um_count_state.${um_num}.state`, true, 
                    "st_count",st_count+1 
                    );
                    await updateDoc(docUser,
                    "u_rent",false 
                    );
                    break;
                case "25": //사용자가 반납안함
                    console.log("case 25");
                    break;
                case "26": //반납 실패: 공유 우산 존재o
                    console.log("case 26");
                    await updateDoc(docStation,
                      `um_count_state.${um_num}.state`, true, 
                      "st_count",st_count+1 
                    );        
                    break;
          
              }
        }catch(error){
          console.log(error);
        }
      }



    return (
        <View style={styles.container}>
            {
                reload?
                    <View style={styles.explainView}>
                        <Text style={styles.text}>Station</Text>
                        <Text style={styles.text}>작동 중입니다....</Text>
                    </View>
                    :
                    <View style={styles.explainView}>
                        <Text style={styles.text}>Station</Text>
                        <Text style={styles.text}>반납하기 버튼을 눌러주세요</Text>
                    </View>
            }
            


            <View style={{ padding: 10 }}>
                <View style={styles.pictureView}>
                <Image
                    style={{ width:  Dimensions.get('window').width * 0.9, //pictureViewd = 크기에 맞춰서 style
                            height: Dimensions.get('window').height * 0.5, 
                            justifyContent:'center',
                            alignItems:'center',
                            padding:10,
                            backgroundColor:'gray',
                           }}
                    source={require('../../assets/ReturnImage.gif')}
                />
                </View>
            </View>

            <View style={styles.buttonView}>
                {
                    reload ?
                        <TouchableOpacity
                            //disabled={(myContext.readData != "24")&&(myContext.readData != "25")&&(myContext.readData != "26")} //받은 문자열이 11,12,13가 아니면 비활성화
                            style={styles.buttonstyle}
                            onPress={() => {
                                updateState(numberData, myContext.readData)
                                navigation.navigate('Main')
                            }}
                        >
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>반납 완료</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            //disabled={(myContext.readData != "24")&&(myContext.readData != "25")&&(myContext.readData != "26")} //받은 문자열이 11,12,13가 아니면 비활성화
                            style={styles.buttonstyle}
                            onPress={() => {
                                send();
                                setReload(true);
                            }}
                        >
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>반납 하기</Text>
                        </TouchableOpacity>
                }
                
            </View>
        </View>
    );
};

export default ReturnPage;


const styles=StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    explainView: {
        width: Dimensions.get('window').width * 0.9,
        height: Dimensions.get('window').height * 0.1,
        padding:10,
    },
    pictureView:{
        width: Dimensions.get('window').width * 0.9,
        height: Dimensions.get('window').height * 0.5,
        justifyContent:'center',
        alignItems:'center',
        padding:10,
        backgroundColor:'gray',
    },
    text:{
        fontSize:30,
        fontWeight:'bold',
        color:'black',
        textAlign:'center',
    },
    buttonView: {
        width: Dimensions.get('window').width * 0.9,
        height: Dimensions.get('window').height * 0.1,
        marginBottom: 40,
        padding:10,
    },
    buttonstyle: {
        width: '100%',
        height: Dimensions.get('window').height * 0.10,
        backgroundColor: '#6699FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    }


})