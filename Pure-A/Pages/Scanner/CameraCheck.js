import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, ScrollView } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

// firestorage
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


export default function Play(navigation) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [firebaseImage, setFirebaseImage] = useState(null);


  useEffect(() => {
    (async () => {
      console.log('CameraCheck useEffect') 
      const cameraStatus = await Camera.requestCameraPermissionsAsync(); // 카메라 접근 허가
      setHasCameraPermission(cameraStatus.status === 'granted');
    })();
  }, []);


  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null)
      console.log('data.uri===========',data.uri)
      setImage(data.uri);
      
      const storage = getStorage();
      const storageRef = ref(storage, 'images/check3.jpg');

      const responce = await fetch(image);
      const blob = await responce.blob();

      const response = await uploadBytes(storageRef, blob, {
          contentType: 'image/jpeg',
      });

      const imageset = await getDownloadURL(storageRef)
      console.log(imageset)
      
    }
  }



  const _handlePhotoBtnPress = async () => {
    
    // image library 접근에 대한 허가 필요 없음
    // ImagePicker를 이용해 Image형식의 파일을 가져온다
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
 
    console.log('ImagePicker result', result)

    // cancelled가 아닐 때 가져온 사진의 주소로 onChangePhoto
    if (!result.canceled) {
      console.log('result.uri------> ', result.assets[0].uri)
      setImage(result.assets[0].uri);

      const storage = getStorage(); // firebase storage 가져오기
      const storageRef = ref(storage, 'images/checkImagePicker.jpg'); // storage에 저장할 위치 지정 (이미지 이름)

      const responce = await fetch(result.assets[0].uri); // file 형태나 blob 형태로 가져올 수 있음
      const blob = await responce.blob(); // blob 형태로 가져오기

      const response = await uploadBytes(storageRef, blob, {
          contentType: 'image/jpeg',
      }); // storage에 저장하기, content type은 이미지 형식으로 지정

      const imageset = await getDownloadURL(storageRef) // storage에 저장된 이미지의 url 가져오기
      setFirebaseImage(imageset)
      console.log(imageset)
    }
  };



  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }



  return (
    <View style={{ flex: 1, padding:30 }}>
      <View style={styles.cameraContainer}>
        <Camera
          ref={ref => setCamera(ref)}
          style={styles.fixedRatio}
          type={type}
          ratio={'1:1'} />
      </View>
      <Button
        title="Flip Image"
        onPress={() => {
          setType(
            type === Camera.Constants.Type.back
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back
          );
        }}>
      </Button>
      <Button title="Take Picture" onPress={() => takePicture()} />
      <Button title='앨범' onPress={_handlePhotoBtnPress} />

        {image && <Image source={{ uri: firebaseImage }} style={{ flex:1 }} />}

  
    </View>
  );
}
const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1
  }
})