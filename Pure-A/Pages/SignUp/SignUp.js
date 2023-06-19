import { useState } from "react";
import { Text, View, TextInput, TouchableOpacity, ImageBackground } from "react-native";
import { styles } from "../../Component/style";

/* SignUpScreen - 관리자 회원가입 화면 */
const SignUp = (props) => {
  const [nameTextInput, setNameTextInput] = useState(""); //회원가입 관리자 이름
  const [idTextInput, setIdTextInput] = useState(""); //회원가입 관리자 ID
  const [pwTextInput, setPwTextInput] = useState(""); //회원가입 관리자 PW

  //회원가입 입력값을 useState에 저장
  const nameChangeInput = (event) =>{
    console.log("Input Name", event)
    setNameTextInput(event)
  }
  const idChangeInput = (event) =>{
    console.log("Input ID", event)
    setIdTextInput(event)
  }
  const pwChangeInput = (event) =>{
    console.log("Input PW", event)
    setPwTextInput(event)
  }

  //관리자 정보 추가하기(회원가입)
  const addManager = async() => {
    try{

    }catch(error){console.log(error.message)}
  }

  return(
    <ImageBackground style={styles.image} source={require('../../assets/LoginScreen.png')} resizeMode="cover">
    <View style = {styles.mainView}>

    <Text style = {styles.signUpText}>Name</Text>
    <TextInput
      value = {nameTextInput}
      onChangeText = {nameTextInput}
      placeholder= "User Name"
      style = {styles.loginputText}
    />
    <Text style = {styles.signUpText}>ID</Text>
    <TextInput
      value = {idTextInput}
      onChangeText = {idTextInput}
      placeholder= "User ID"
      style = {styles.loginputText}
    />
    <Text style = {styles.signUpText}>PassWord</Text>
    <TextInput
      value = {pwTextInput}
      onChangeText = {pwTextInput}
      placeholder= "Password"
      style = {styles.loginputText}
    />

    {/* signup 시 회원가입 정보 전달 */}
    <TouchableOpacity style={styles.loginBTN} onPress={addManager}>
      <Text style={styles.loginText}>Sign Up</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.loginBTN}
      onPress={()=>{
      props.navigation.navigate("Login")
      }}
    >
    <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

    </View>
    </ImageBackground>

  )
}
export default SignUp;