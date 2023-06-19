//23.06.04 19:16
import { useState, useEffect, useContext } from 'react';
import { 
    View, Text, StyleSheet, 
    TouchableOpacity, Dimensions, Image, Alert
} from 'react-native';
import { db } from '../../firebaseConfig';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import AppContext from '../../Appcontext';

const RentalPage = ({route,navigation}) => {
    const [workcomplete, setWorkcomplete] = useState(false);
    const [stationNum, setStationNum] = useState('');
    const [rental, setRental] = useState('');
    const myContext = useContext(AppContext);

    useEffect(() => {
        setRental(myContext.readData);
        console.log("st "+myContext.connectedStation.st_id);
        console.log("u "+myContext.connectedUser.u_id);
        console.log("state "+myContext.state);
        //데이터 요청
        console.log('RentalPage');
    }, []);

     //대여 성공 시 Update 함수
     const updateState = async(um_num, code) =>{ //매개변수로 사용자가 선택한 번호를 받음
        try{
          console.log("update!");
          console.log("umbrella Number: "+um_num);
          console.log("Return: "+code);
  
          const docStation = doc(db,"Station",myContext.connectedStation.st_id);
          const docUser = doc(db,"User",myContext.connectedUser.u_id);
          const docSnap1 = await getDoc(docStation);
          const docSnap2 = await getDoc(docUser);
          const st_count = docSnap1.get('st_count'); //station 우산 개수 
          
          switch (code){
              case "11": //대여 성공
                    console.log("case 11")
                    await updateDoc(docStation,
                    `um_count_state.${um_num}.state`, false, 
                    "st_count",st_count-1 
                    );
                    await updateDoc(docUser,
                    "u_rent",true 
                    );
                    break;
              case "12": //사용자가 대여하고 우산을 안가져간 경우
                    console.log("case 12");
                    Alert.alert("우산을 대여하지 않았습니다. 다시 대여 해주세요.")
                    navigation.navigate("Main");
                    break;
              case "13": //대여 실패: 공유 우산 존재x     
                    console.log("case 13")     
                    await updateDoc(docStation,
                    `um_count_state.${um_num}.state`, false, 
                    "st_count",st_count-1 );
                    break;
              }
        }catch(error){
          console.log(error);
        }
      }
    const readComplete = () =>{
        if(myContext.state){
            myContext.setState(false);
            return false;
        } else{
            myContext.setState(true);
            return true;
        }
    }

    return (
        
        <View style={styles.container}>

        <View style={styles.explainView}>
            <Text style={styles.text}>Station</Text>
            <Text style={styles.text}>작동 중입니다....</Text>
        </View>

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
                    source={require('../../assets/RentalImage.gif')}
                />
            </View>
        </View>

        <View style={styles.buttonView}>
            
            <TouchableOpacity
                style={
                    myContext.state ? { 
                        width: Dimensions.get('window').width * 0.9,
                        height: Dimensions.get('window').height * 0.1,
                        marginBottom: 40,
                        padding:10,
                        backgroundColor: 'gray'} 
                    :
                     {
                        width: '100%',
                        height: Dimensions.get('window').height * 0.10,
                        backgroundColor: '#6699FF',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 10,
                }}
                //disabled={myContext.state}
                onPress={() => { 
                    console.log(myContext.selectedUm);
                    
                    updateState(myContext.selectedUm,myContext.readData)
                    navigation.navigate('Main')
                }}
            >
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>대여 완료</Text>
            </TouchableOpacity>
          
        </View>
    </View>
    );
};

export default RentalPage;


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