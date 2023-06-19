import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Dimensions, 
  ScrollView, TextInput, Keyboard, 
  KeyboardAvoidingView, Alert,
  Image, TouchableOpacity, 
  NativeModules, Button, Platform, 
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

// firebase 데이터 추가
import { db } from '../../firebaseConfig';
import { getDocs, collection, setDoc, doc } from 'firebase/firestore';


// 키보드가 가리는 문제 때문에 아마 아이폰에만 있을 듯?
const { StatusBarManager } = NativeModules


const Join = (props) => {
  // DB에 저장된 사용자들의 정보
  const [users, setUsers] = useState();

  // 입력 내용
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [mail, setMail] = useState("");
  const [birth, setBirth] = useState("");

  //회원가입 버튼 활설화
  const [okId, setOkId] = useState(false);
  const [okPw, setOkPw] = useState(false);
  const [okPwEq, setOkPwEq] = useState(false);
  const [okName, setOkName] = useState(false);
  const [okPhone, setOkPhone] = useState(false);
  const [okMail, setOkMail] = useState(false);
  const [okBirth, setOkBirth] = useState(false);

  //정규식 메시지 check
  const [errorMessageid, setErrorMessageID] = useState(""); //id
  const [errorMessagePw, setErrorMessagePw] = useState(""); // pw
  const [errorMessagePwEq, setErrorMessageEq] = useState(""); // pwEq
  const [errorMessageName, setErrorMessageName] = useState(""); // name
  const [errorMessageMail, setErrorMessageMail] = useState(""); // nickname 
  const [errorMessagePhone, setErrorMessagePhone] = useState(""); // phone
  const [errorMessageBirth, setErrorMessageBirth] = useState(""); // birth

  const [statusBarHeight, setStatusBarHeight] = useState(0);


  useEffect(() => {
    Platform.OS == 'ios' ? StatusBarManager.getHeight((statusBarFrameData) => {
      setStatusBarHeight(statusBarFrameData.height)
    }) : null
  }, []);

  
  useEffect(() => {
    // DB에서 사용자의 데이터를 가져옴
    (async () => {
      try {
        const data = await getDocs(collection(db, "User")) // User 데이터 불러옴
        setUsers(data.docs.map(doc => doc.data())) // 데이터를 배열로 저장
        
      } catch (error) {
        console.log('eerror', error.message)
      }
    })();

  }, [])





  // 버튼 활성화 Sign Up
  const regiButton = () => {
    if (okId & okPw & okPwEq & okName & okPhone & okMail & okBirth == true) {
      return false;
    }
    return true;
  }


  //아이디 정규식
  const validateId = id => {
    const regex = /^[a-zA-Z]+[a-zA-Z0-9]{3,12}$/;
    return regex.test(id) && id.length >= 4;
  }

  //패스워드 정규식
  const validatePw = pw => {
    const regex = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,16}$/;
    return regex.test(pw);
  }

  //패드워드 같은지
  const validateEq = eq => {
    if (eq === password) { return true; }
    else { return false; }
  }

  //이름 정규식
  const validateName = name => {
    const regex = /^[a-zA-Zㄱ-힣]{1,20}$/;
    return regex.test(name);
  }

  //전화번호 정규식
  const validatePhone = phone => {
    const regex = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/;
    return regex.test(phone);
  }

  // 이메일 정규식
  const validateMail = mail => {
    const regex = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
    return regex.test(mail);
  }

  // 생년월일 정규식
  const validateBirth = birth => {
    const regex = /^(19[0-9][0-9]|20\d{2})-(0[0-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/
    return regex.test(birth) && birth.length == 10;
  }

  // 띄어쓰기 고로시
  const removespace = text => {
    const regex = /\s/g;
    return text.replace(regex, '');
  }

  // 자동 하이픈 생성
  const autoHyphen = (target) => {
    return target.replace(/[^0-9]/g, '').replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3").replace(/(\-{1,2})$/g, "");
  }

  // 자동 하이픈 생성 생년월일
   const autoHyphenBirth = (target) => {
    return target.replace(/[^0-9]/g, '').replace(/^(\d{0,4})(\d{0,2})(\d{0,2})$/g, "$1-$2-$3").replace(/(\-{1,2})$/g, "");
  }


  //아이디 핸들러
  const handleIdChange = (id) => {
    const changeID = removespace(id)
    setId(changeID)
    setErrorMessageID(
      validateId(changeID) ? "올바른 ID 형식입니다." : "영문로 시작하는 영문자 또는 숫자 4~12자리"
    );

  };

  //비밀번호 핸들러
  const handlePwChange = (pw) => {
    const changedPw = removespace(pw);
    setPassword(changedPw);
    setErrorMessagePw(
      validatePw(changedPw) ? "올바른 비밀번호 형식입니다." : "영문, 숫자 조합 8~16자리"
    );
    setOkPw(validatePw(changedPw));
  }

  //비밀번호 확인 핸들러
  const handlePwEqChange = (eq) => {
    const changedPwEq = removespace(eq);
    setPasswordCheck(changedPwEq);
    setErrorMessageEq(
      validateEq(changedPwEq) ? "비밀번호가 일치합니다." : "비밀번호가 다릅니다!"
    );
    setOkPwEq(validateEq(changedPwEq));
  }
  //이름 핸들러
  const handleNameChange = (name) => {
    const changedName = removespace(name);
    setName(changedName);
    setErrorMessageName(
      validateName(changedName) ? "올바른 이름 형식입니다." : "이름을 올바르게 입력해주세요."
    );
    setOkName(validateName(changedName));
  }

  //전화번호 핸들러
  const handlePhoneChange = (call) => {
    const changedPhone = autoHyphen(call);
    setPhone(changedPhone);
    setErrorMessagePhone(
      validatePhone(changedPhone) ? "올바른 휴대전화 번호입니다" : "올바른 휴대전화 번호가 아닙니다."
    );
    setOkPhone(validatePhone(changedPhone));
  }

  // 이메일 핸들러
  const handleMailChange = (mail) => {
    const changedMail = removespace(mail);
    setMail(changedMail)
    setErrorMessageMail(
      validateMail(changedMail) ? '올바른 이메일 형식입니다.' : '올바른 이메일 형식이 아닙니다.'
    )
    setOkMail(validateMail(changedMail))
  }

  // 생년월일 핸들러
  const handleBirthChange = (birth) => {
    const changeDate = autoHyphenBirth(birth)
    setBirth(changeDate)
    setErrorMessageBirth(
      validateBirth(changeDate) ? '올바른 생년월일 형식입니다.' : '올바른 생년월일 형식이 아닙니다.'
    )
    setOkBirth(validateBirth(changeDate))
  }


  // 아이디 중복 확인
  const checkID = (id) => {
    console.log('checkID')
    var total = users.length // 전체 유저 수
    var count = users.length // 확인 유저 수
    //DB 아이디 중복체크
    users.map((user) => {
      if (user.u_id == id) {
        count-=1
        Alert.alert('중복된 아이디입니다.')
        setId('')
        setErrorMessageID('')
      } 
    })
    if (total == count){ // 중복된 아이디가 없으면
      console.log('중복된 id없음')
      Alert.alert('사용 가능한 아이디입니다.')
      setOkId(true)
    }else{
      Alert.alert('중복된 아이디입니다.')
    }
    console.log('regibutton', regiButton())
  }




  const SignUpButton = () => {
    Alert.alert('회원가입 완료')
    // 회원가입 DB 넣기
    (async () => {
      // 가입 날짜
      let todayData = new Date(); 
      let today = todayData.toLocaleDateString()

      // DB 넣기
      const docRef = await setDoc(doc(db, "User", id), {
        u_date : today,
        u_donation:0,
        u_email : mail,
        u_id : id,
        u_name: name,
        u_phone : phone,
        u_profile: '',
        u_pw : password,
        u_rent : false,
      });
      
      console.log("Document written with ID: ", docRef.id);
      props.navigation.pop() // 회원가입 완료 후 로그인 화면으로 이동
    })();


  }


  return (
    <View style={styles.container}>

      {/* 회원가입 */}
      <View style={styles.title}>
        <Image style={{ width: '100%', height: '100%' }} source={require('../../assets/Logo.png')} />
      </View>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={"padding"}
        keyboardVerticalOffset={statusBarHeight + 44}
      >
        <ScrollView>
          {/* 사용자 필수정보 */}
          <View style={styles.importInfo}>
            <View style={{ width: '80%' }}>
              
              <Text style={styles.titleText}>ID</Text>
              <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                <TextInput
                  style={styles.idloginputText}
                  value={id}
                  placeholder="ID"
                  onChangeText={handleIdChange}
                  maxLength={15}
                ></TextInput>

                <TouchableOpacity
                  style={validateId(id) ? styles.overlapButton : [styles.overlapButton, { opacity: 0.4 }]}
                  disabled={!validateId(id)}
                  onPress={() => { checkID(id) }}
                >
                  <Text style={{ fontSize: 15 }}>
                    중복확인
                  </Text>
                </TouchableOpacity>
              </View>
              <Text>{errorMessageid}</Text>


              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              
                <Text style={styles.titleText}>PW</Text>
                <TextInput
                  style={styles.loginputText}
                  secureTextEntry={true}
                  value={password}
                  placeholder="Password"
                  onChangeText={handlePwChange}
                />
                <Text>{errorMessagePw}</Text>

                <Text style={styles.titleText}>Check PW</Text>
                <TextInput
                  style={styles.loginputText}
                  secureTextEntry={true}
                  value={passwordCheck}
                  placeholder="Check Password"
                  onChangeText={handlePwEqChange}
                ></TextInput>
                <Text>{errorMessagePwEq}</Text>

                <Text style={styles.titleText}>Name</Text>
                <TextInput
                  style={styles.loginputText}
                  value={name}
                  placeholder="Name"
                  onChangeText={handleNameChange}
                ></TextInput>
                <Text>{errorMessageName}</Text>

                <Text style={styles.titleText}>Phone</Text>
                <TextInput
                  style={styles.loginputText}
                  value={phone}
                  placeholder="Phone Number"
                  onChangeText={handlePhoneChange}
                  maxLength={13}
                  numeric
                  keyboardType={'numeric'}
                ></TextInput>
                <Text>{errorMessagePhone}</Text>

                <Text style={styles.titleText}>E-mail</Text>
                <TextInput
                  style={styles.loginputText}
                  value={mail}
                  placeholder="E-mail"
                  keyboardType='email-address'
                  onChangeText={handleMailChange}
                ></TextInput>
                <Text>{errorMessageMail}</Text>

                <Text style={styles.titleText}>BirthDay</Text>
                <TextInput
                  style={styles.loginputText}
                  value={birth}
                  placeholder="BirthDay"
                  maxLength={10}
                  keyboardType={'numeric'}
                  onChangeText={handleBirthChange}
                ></TextInput>
                <Text>{errorMessageBirth}</Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>


      <View style={{ paddingBottom: 50 }}>
        <TouchableOpacity
          style={styles.loginBTN}
          disabled={regiButton()}
          onPress={() => {
            console.log('sign up')
            SignUpButton()
          }}
        >
          <Text style={regiButton() ?  [styles.loginText, { opacity: 0.3 }] : styles.loginText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.loginBTN, { backgroundColor: 'white' }]}
          onPress={() => {
            props.navigation.navigate("Login")
          }}
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default Join;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  title: {
    width: Dimensions.get('window').width * 0.4,
    height: Dimensions.get('window').height * 0.15,
  },
  importInfo: { // 회원가입 필수정보
    width: Dimensions.get('window').width * 0.8,
    height: Dimensions.get('window').height * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitbutton: {
    width: Dimensions.get('window').width * 0.8,
    height: Dimensions.get('window').height * 0.1,
  },
  //로그인 화면 인풋텍스트
  idloginputText: {
    width: '73%',
    height: 35,
    fontSize: 18,
    color: 'black',
    backgroundColor: '#EDEDED',
    borderRadius: 3,
    alignItems: 'center',
    padding: 5,
  },
  loginputText: {
    width: '100%',
    height: 35,
    fontSize: 18,
    color: 'black',
    backgroundColor: '#EDEDED',
    borderRadius: 3,
    alignItems: 'center',
    padding: 5,
  },
  titleText: {
    marginTop: 8,
    marginLeft: 8,
    color: '#6699FF',
    fontWeight: 'bold',
  },
  overlapButton: {
    backgroundColor: '#6699FF',
    justifyContent: 'center',
    alignItems: 'center',
    height: 35,
    width: '25%',
    borderRadius: 5,
    marginLeft: 5,
  },
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
});