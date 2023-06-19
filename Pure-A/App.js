import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef, } from 'react';
import { View, Text, StyleSheet, Dimensions, Button, Alert, Modal, Pressable, Image, TextInput, Keyboard, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import AppContext from './Appcontext';

import Main from "./Pages/Main/Main"
import Join from  "./Pages/SignUp/Join";
import SignUp from "./Pages/SignUp/SignUp";
import Login from "./Pages/SignUp/Login";
import Map from "./Pages/Map/Map";
import QRCodeScanner from "./Pages/Scanner/QRCodeScanner";
import UserInfo from "./Pages/Info/UserInfo";
import CameraCheck from "./Pages/Scanner/CameraCheck";
import CustMain from "./Pages/Service/CustMain";
import BreakReport from "./Pages/Service/BreakReport";
import MyDonation from "./Pages/Service/MyDonation";
import RentalReturnReport from "./Pages/Service/RentalReturnReport";
import FunctionList from "./Pages/MainFunction/FunctionList";
import Rental from "./Pages/MainFunction/Rental";
import RentalPage from "./Pages/MainFunction/RentalPage";
import ExplainPage from "./Pages/MainFunction/ExplainPage";
import DonationPage from "./Pages/MainFunction/DonationPage";
import ReturnPage from "./Pages/MainFunction/ReturnPage";
import ScanStation from './Pages/Service/ScanStation';  
import Loading from './Component/Loading';
import ReportList from './Pages/Service/ReportList'

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';


const Stack = createStackNavigator();
// expo install react-native-safe-area-context
// npm install @react-navigation/native
// expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-community/masked-view

export default function App() {

const [readData, setReadData] = useState(''); //블루투스 문자열 수신을 위한 변수
const [connectedStation,setConnectedStation] = useState({}); //연결된 해당 스테이션
const [connectedUser, setConnectedUser] = useState(); //연결된 유저
const [selectedUm, setSelectedUm] = useState();
const [connectedDevice, setConnectedDevice] = useState();
const [state, setFlag] = useState(false);


//전송 받은 문자열을
const setState = (state) =>{
  setFlag(state);
}

const setData = (readData) =>{
  setReadData(readData);
}

const setStation = (station) =>{
  setConnectedStation(station);
}

const setUser = (user) =>{
  setConnectedUser(user);
}

const setUmNumber = (umNum) => {
  setSelectedUm(umNum);
}

const setConnectDevice = (device) =>{
  setConnectedDevice(device)
}



const values = {
  readData: readData,
  connectedStation: connectedStation,
  connectedUser: connectedUser,
  selectedUm: selectedUm,
  connectedDevice: connectedDevice,
  state: state, 

  setData,
  setStation,
  setUser,
  setUmNumber,
  setConnectDevice,
  setState

}

  return (
    <AppContext.Provider value={values}>
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen name="Login" component={Login}/>
          <Stack.Screen name="Main" component={Main}/>
          <Stack.Screen name="Join" component={Join}/>
          <Stack.Screen name="SignUp" component={SignUp}/>
          <Stack.Screen name="Map" component={Map}/>
          <Stack.Screen name="QRCodeScanner" component={QRCodeScanner}/>
          <Stack.Screen name="CustMain" component={CustMain} />
          <Stack.Screen name="UserInfo" component={UserInfo}/>
          <Stack.Screen name="CameraCheck" component={CameraCheck}/>
          <Stack.Screen name="BreakReport" component={BreakReport} />
          <Stack.Screen name="MyDonation" component={MyDonation} />
          <Stack.Screen name="RentalReturnReport" component={RentalReturnReport} />
          <Stack.Screen name='Loading' component={Loading}/>
          <Stack.Screen name="FunctionList" component={FunctionList}/>
          <Stack.Screen name="Rental" component={Rental}/>
          <Stack.Screen name="RentalPage" component={RentalPage} />
          <Stack.Screen name="ExplainPage" component={ExplainPage} />
          <Stack.Screen name="DonationPage" component={DonationPage}/>
          <Stack.Screen name="ReturnPage" component={ReturnPage} />
          <Stack.Screen name="ScanStation" component={ScanStation} />
          <Stack.Screen name="ReportList" component={ReportList}/>
        </Stack.Navigator>
      </NavigationContainer>
    </>
    </AppContext.Provider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});