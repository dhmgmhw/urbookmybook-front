import React, { useEffect, useState } from "react"
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  TextInput,
  Image,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
} from "react-native"
import { getStatusBarHeight } from "react-native-status-bar-height"
import { Header, Overlay } from "react-native-elements"
import { Item } from "native-base"

import DropDownPicker from "react-native-dropdown-picker"

import { Ionicons } from "@expo/vector-icons"
import { getSearchBook } from "../../config/KakaoApi"
import KakaoResultCardComponent from "../../components/home/KakaoResultCardComponent"
import { uploadImg, postBook } from "../../config/PostingApi"

const diviceWidth = Dimensions.get("window").width
const diviceHeight = Dimensions.get("window").height

export default function AddPage({ navigation }) {
  const [text, setText] = useState()
  const [uploader, setUploader] = useState(false)

  // upload datas
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState()
  const [bookImg, setBookImg] = useState()
  const [story, setStory] = useState()
  const [publisher, setPublisher] = useState()
  const [imageUri, setImageUri] = useState([])
  const [genreInfo, setGenreInfo] = useState("")
  const [stateInfo, setStateInfo] = useState("")
  const [publishedInfo, setPublishedInfo] = useState()
  const [contentInfo, setContentInfo] = useState("")
  const [priceInfo, setPriceInfo] = useState()
  const [webUrl, setWebUrl] = useState("")

  const [switcher, setSwitcher] = useState(false)
  const [finderOpen, setFinderOpen] = useState(false)
  const [finderHeight, setFinderHeight] = useState(false)

  const [books, setBooks] = useState(["blank"])

  const makePerfectSentence = (str = "") =>
    str.slice(0, str.lastIndexOf(".") + 1) || "작품 소개가 없습니다."

  const toggleFinder = () => {
    setFinderOpen(!finderOpen)
  }

  const dateChagner = date => {
    const year = date.slice(0, 4)
    const month = date.slice(5, 7)
    return `${year}년 ${month}월`
  }

  const bookTitleSearch = async () => {
    const result = await getSearchBook(text)
    setBooks(result.documents)
    setFinderHeight(true)
    Keyboard.dismiss()
  }

  const upload = async () => {
    console.log("업로드 준비중!")
    setUploader(true)
    if (title == "") {
      Alert.alert("등록할 책을 선택해 주세요")
      setUploader(false)
      return
    } else if (genreInfo == "") {
      Alert.alert("해쉬태그를 선택해 주세요")
      setUploader(false)
      return
    } else if (stateInfo == "") {
      Alert.alert("책의 상태를 선택해 주세요")
      setUploader(false)
      return
    } else if (imageUri == "") {
      Alert.alert("사진을 최소 한 장 선택해 주세요")
      setUploader(false)
      return
    } else if (contentInfo == "") {
      Alert.alert("책을 간단히 소개해 주세요")
      setUploader(false)
      return
    } else {
      let data = {
        title: title,
        image: bookImg,
        publisher: publisher,
        webUrl: webUrl,
        author: author,
        description: story,
        category: genreInfo,
        status: stateInfo,
        price: priceInfo,
        contentInfo: contentInfo,
      }
      const formData = new FormData()
      for (let i = 0; i < imageUri.length; i++) {
        formData.append("files", {
          uri: imageUri[i].uri,
          name: "image" + i + ".jpg",
        })
      }
      const imgList = await uploadImg(formData)
      data.captureImages = imgList
      await postBook(data)
      navigation.pop()
    }
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss()
      }}>
      <View style={{ backgroundColor: "white", height: diviceHeight }}>
        <View style={styles.statusAvoid}></View>
        <View style={styles.mainHeader}>
          <View style={styles.headerLComp}>
            <Text
              onPress={() => {
                navigation.pop()
              }}
              style={styles.headerTitle}>
              취소
            </Text>
          </View>
          <View style={styles.headerCComp}>
            <Text style={[styles.headerTitle, { textAlign: "center" }]}>
              도서 등록
            </Text>
          </View>
          <View style={styles.headerRComp}>
            <Text
              onPress={upload}
              style={[styles.headerTitle, { color: "#757575" }]}>
              등록
            </Text>
          </View>
        </View>
        {switcher ? (
          <View style={styles.bookResBox}>
            <View style={styles.bookResImgBox}>
              <Image
                style={styles.bookResImg}
                resizeMode="cover"
                source={
                  bookImg
                    ? { uri: bookImg }
                    : require("../../assets/nodata.png")
                }
              />
            </View>
            <View style={{ width: diviceWidth * 0.65 }}>
              <View style={styles.bookResTitleBox}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                  style={styles.bookResText}>
                  {title}
                </Text>
                <Ionicons
                  active
                  onPress={toggleFinder}
                  name="close-circle-outline"
                  size={20}
                  style={{ paddingRight: 5, color: "grey" }}
                />
              </View>
              <View style={styles.bookResBorder}></View>
              <View style={styles.bookResDescBox}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                  style={styles.bookResText}>
                  {author} 저 | {publisher} | {dateChagner(publishedInfo)}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <>
            <Text style={styles.bookSearchTitle}>도서 제목</Text>
            <Pressable style={styles.bookSearchOpener} onPress={toggleFinder}>
              <Text
                style={{
                  fontFamily: "SansMedium",
                  color: "#757575",
                  fontSize: 13,
                }}>
                | 도서명 검색하기
              </Text>
              <Ionicons
                active
                onPress={bookTitleSearch}
                name="search"
                size={20}
                style={{ marginHorizontal: 10, color: "grey" }}
              />
            </Pressable>
          </>
        )}
        <DropDownPicker
          items={[
            { label: "#소설", value: "소설" },
            { label: "#시/에세이", value: "시/에세이" },
            { label: "#인문", value: "인문" },
            { label: "#경제/경영", value: "경제/경영" },
            { label: "#정치/사회", value: "정치/사회" },
            { label: "#언어", value: "언어" },
            { label: "#과학", value: "과학" },
            { label: "#예술", value: "예술" },
            { label: "#역사", value: "역사" },
            { label: "#철학", value: "철학" },
            { label: "#종교", value: "종교" },
            { label: "#해외도서", value: "해외도서" },
            { label: "#어린이", value: "어린이" },
            { label: "#청소년", value: "청소년" },
            { label: "#취업/수험서", value: "취업/수험서" },
            { label: "#기타", value: "기타" },
          ]}
          showArrow={false}
          labelStyle={{ fontFamily: "SansMedium" }}
          placeholder="해쉬태그"
          containerStyle={styles.dropBox}
          onChangeItem={item => {
            setGenreInfo(item.value)
          }}
        />
        <DropDownPicker
          items={[
            { label: "S", value: "S" },
            { label: "A", value: "A" },
            { label: "B", value: "B" },
            { label: "C", value: "C" },
          ]}
          showArrow={false}
          zIndex={4000}
          labelStyle={{ fontFamily: "SansMedium" }}
          placeholder="상품상태"
          containerStyle={styles.dropBox}
          onChangeItem={item => {
            setStateInfo(item.value)
          }}
        />
        <View style={styles.addPicsBox}>
          {imageUri == "" ? (
            <>
              <Pressable
                style={[styles.userPicBox, { marginHorizontal: 20 }]}
                onPress={() => {
                  navigation.navigate("MultiAddPage", setImageUri)
                }}>
                <Text style={{ fontFamily: "SCDream4" }}>카메라</Text>
                <Ionicons
                  name="image-outline"
                  size={30}
                  style={{ alignSelf: "center", color: "#4CB73B" }}
                />
              </Pressable>
              <View style={{ justifyContent: "center" }}>
                <View>
                  <Text style={styles.photoGuidanceText}>
                    상품의 상태가 잘 보이게 찍어주세요
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 10 }}>
              {imageUri.map((image, i) => {
                return (
                  <Pressable
                    key={i}
                    onPress={() => {
                      navigation.navigate("MultiAddPage", setImageUri)
                    }}>
                    <Image
                      source={{ uri: image.uri }}
                      style={styles.userPicBox}
                    />
                  </Pressable>
                )
              })}
            </ScrollView>
          )}
        </View>
        <KeyboardAvoidingView>
          <TextInput
            multiline
            style={styles.bookDescBox}
            onChangeText={setContentInfo}
            value={contentInfo}
            placeholder="| 도서내용과 상태를 작성해주세요"
            placeholderTextColor={"#757575"}
          />
        </KeyboardAvoidingView>
        <Overlay
          overlayStyle={
            finderHeight ? styles.overlayBoxWith : styles.overlayBoxWithout
          }
          isVisible={finderOpen}
          onBackdropPress={toggleFinder}>
          <View
            style={{
              borderWidth: 2,
              borderColor: "#4CB73B",
              marginBottom: 20,
            }}>
            <Item>
              <TextInput
                style={styles.bookTitleBox}
                onChangeText={setText}
                value={text}
                placeholder="도서명 입력하기"
              />
              <View style={styles.bookSearchBtn}>
                <Ionicons
                  active
                  onPress={bookTitleSearch}
                  name="search"
                  size={20}
                  style={{ alignSelf: "center" }}
                />
              </View>
            </Item>
          </View>
          <View style={{ height: "90%" }}>
            {books == "" ? (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Image
                  style={styles.foundImg}
                  resizeMode="contain"
                  source={require("../../assets/nodata.png")}
                />
              </View>
            ) : (
              <ScrollView>
                {books.map((book, i) => {
                  return (
                    <Pressable
                      key={i}
                      onPress={() => {
                        setTitle(book.title)
                        setAuthor(book.authors.join(" "))
                        setBookImg(book.thumbnail)
                        setStory(makePerfectSentence(book.contents))
                        setPublisher(book.publisher)
                        setPublishedInfo(book.datetime)
                        setPriceInfo(book.price)
                        setFinderOpen(false)
                        setSwitcher(true)
                        setWebUrl(book.url)
                      }}>
                      <KakaoResultCardComponent book={book} />
                    </Pressable>
                  )
                })}
              </ScrollView>
            )}
          </View>
        </Overlay>
        {uploader ? (
          <ActivityIndicator
            style={{ position: "absolute", alignSelf: "center", top: "50%" }}
            size="large"
            color="grey"
          />
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  statusAvoid: {
    height: getStatusBarHeight(),
    backgroundColor: "white",
  },
  mainHeader: {
    width: diviceWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    height: 45,
  },
  headerLComp: {
    height: 45,
    width: diviceWidth / 3,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  headerCComp: {
    width: diviceWidth / 3,
    height: 45,
    justifyContent: "center",
  },
  headerRComp: {
    width: diviceWidth / 3,
    height: 45,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 18,
    paddingHorizontal: 10,
    fontFamily: "SansMedium",
  },
  container: { backgroundColor: "white" },
  addPicsBox: {
    width: diviceWidth,
    borderColor: "lightgrey",
    borderBottomWidth: 1,
    flexDirection: "row",
  },
  bookResBox: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  bookResImgBox: {
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  bookResImg: {
    width: 80,
    height: 110,
    margin: 20,
    borderRadius: 5,
  },
  bookResTitleBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F2F2F2",
    borderRadius: 5,
    paddingLeft: 10,
    paddingVertical: 2,
  },
  bookResDescBox: {
    backgroundColor: "#F2F2F2",
    borderRadius: 5,
    paddingLeft: 10,
    paddingVertical: 3,
  },
  bookResText: {
    width: diviceWidth * 0.55,
    fontSize: 13,
    fontFamily: "SansMedium",
    color: "grey",
  },
  bookResBorder: {
    backgroundColor: "#F2F2F2",
    height: 2,
    marginVertical: 5,
  },
  userPicBox: {
    width: 80,
    height: 80,
    marginVertical: 20,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: "#efefef",
    alignItems: "center",
    justifyContent: "center",
  },
  photoGuidanceText: {
    fontFamily: "SansMedium",
    fontSize: 13,
    color: "grey",
  },
  bookSearchTitle: {
    fontSize: 18,
    fontFamily: "SansMedium",
    padding: 15,
    paddingVertical: 10,
  },
  bookSearchOpener: {
    backgroundColor: "#efefef",
    width: diviceWidth,
    height: 45,
    paddingLeft: 15,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  overlayBoxWith: {
    width: diviceWidth * 0.9,
    height: diviceHeight * 0.7,
    padding: 30,
  },
  overlayBoxWithout: {
    width: diviceWidth * 0.9,
    height: diviceHeight * 0.4,
    padding: 30,
  },
  dropBox: { height: 50, width: diviceWidth },
  bookTitleBox: {
    paddingLeft: 20,
    height: 50,
    width: "85%",
  },
  bookDescBox: {
    padding: 10,
    height: 100,
    marginHorizontal: 20,
    marginTop: 20,
    fontSize: 14,
  },
  bookSearchBtn: {
    width: "15%",
  },
  foundImg: { width: 200, height: 200, top: 120, opacity: 0.2 },
})
