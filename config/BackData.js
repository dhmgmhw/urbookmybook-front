import { Alert } from "react-native"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

const host = "http://13.124.182.223"

export async function register(
  username,
  email,
  password,
  navigation
) {
  try {
    const result = await axios({
      method: "post",
      url: host + "/api/users/signup",
      data: {
        username: username,
        password: password,
        email: email,
        image: 'https://sanggubk2.s3.ap-northeast-2.amazonaws.com/e2e3abdc-4750-423f-89b1-8ab15022fdf1.jpg'
      },
    })
    console.log(result.data)
    if (result.data.ok) {
      navigation.pop()
      Alert.alert("회원가입이 완료되었습니다.")
    } else {
      Alert.alert(result.data.msg)
    }
  } catch (err) {
    console.log(err)
    Alert.alert("회원가입 할 수 없습니다.")
  }
}


export async function login(email, password, navigation) {
  try {
    const result = await axios({
      method: "post",
      url: host + "/api/users/login",
      data: {
        email: email,
        password: password,
      },
    })
    if (result.data.ok) {
      await AsyncStorage.setItem("session", result.data.results.token)
      await AsyncStorage.setItem("email", result.data.results.email)
      navigation.push("SignPlusPage")
    } else {
      Alert.alert(result.data.msg)
    }
  } catch (err) {
    console.log(err)
    Alert.alert('로그인 할 수 없습니다')
  }
}

export async function signdetail(town) {
  try {
    const token = await AsyncStorage.getItem("session")
    const result = await axios({
      method: "Put",
      url: host + "/api/users/profile",
      headers: {
        token: token,
      },
      data: {
        town: town,
      },
    })
    console.log(result.data)
  } catch (err) {
    console.log(err)
    Alert.alert("동네를 설정할 수 없어요:(")
  }
}

export async function getUserProfile() {
  try {
    const token = await AsyncStorage.getItem("session")
    const result = await axios({
      method: "Get",
      url: host + "/api/users/usercheck",
      headers: {
        token: token,
      },
    })
    return result.data
  } catch (err) {
    console.log(err)
    Alert.alert("유저 정보를 받아올 수 없어요 :(")
  }
}

export async function changeUserProfile(username, image) {
  try {
    const token = await AsyncStorage.getItem("session")
    const result = await axios({
      method: "put",
      url: host + "/api/users/profile",
      headers: {
        token: token,
      },
      data: {
        image: image,
        username: username,
      },
    })
    console.log(result.data)
    Alert.alert("변경 완료")
    return result.data
  } catch (err) {
    console.log(err)
    Alert.alert("다시 시도해 보세요.")
  }
}

export async function signOut(navigation) {
  await AsyncStorage.clear()
  Alert.alert("로그아웃합니다")
  navigation.push("SignInPage")
}

export async function deleteAccount(id, navigation) {
  const token = await AsyncStorage.getItem("session")
  try {
    const result = await axios({
      method: "delete",
      url: host + '/api/users/' + id,
      headers: {
        token: token,
      },
    });
    console.log(result.data)
    await AsyncStorage.clear()
    alert('계정 삭제 완료')
    navigation.push("SignInPage")
  } catch (err) {
    console.log(err)
    alert('회원탈퇴 오류가 발생했습니다.')
  }
}


