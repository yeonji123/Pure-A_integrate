import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // 회색 F2F2F2
  // 로고색 D9E5FF
  
  //뷰 스타일
  mainView: {
    flex: 1,
    height: '100%',
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  //이미지
  image: {
    flex: 1,
    width: '100%',
    height: '100%'
  },

  signUpText: {
    color: 'black'
  },


  //관리자 정보 버튼
  infoBTN: {
    position: 'absolute',
    width: '85%',
    height: 215,
    top: -30,

    backgroundColor: '#D9E5FF',

    borderRadius: 15,
    alignItems:'center',
    justifyContent:'center'
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

  //홈 화면 버튼 (Station)
  homeBTN: {
  position: 'absolute',
  width: '85%',
  height: 100,
  top: 200,

  backgroundColor: '#F2F2F2',

  borderRadius: 15,
  alignItems:'center',
  justifyContent:'center'
  },

  //홈 화면 버튼 (User)
  homeBTN2: {
    position: 'absolute',
    width: '40%',
    height: 200,
    left: 25,
    right: 225,
    top: 315,
  
    backgroundColor: '#F2F2F2',
  
    borderRadius: 15,
    alignItems:'center',
    justifyContent:'center'
  },

  //홈 화면 버튼 (폐우산)
  homeBTN3: {
    position: 'absolute',
    width: '40%',
    height: 200,
    right: 30,
    top: 315,

    backgroundColor: '#F2F2F2',

    borderRadius: 15,
    alignItems:'center',
    justifyContent:'center'
  },

  //홈 화면 버튼 (고객센터)
  homeBTN4: {
    position: 'absolute',
    width: '85%',
    height: 100,
    left: 25,
    right: 25,
    top: 530,

    backgroundColor: '#F2F2F2',

    borderRadius: 15,
    alignItems:'center',
    justifyContent:'center'
  },

  //홈 화면 버튼 텍스트
  homeText: {
    fontSize: 50,
    color: 'black',
    fontStyle: 'bold',
    alignContent: 'center',
    justifyContent: 'center'
  },


})