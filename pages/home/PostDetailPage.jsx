import React, { useLayoutEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  Pressable,
} from 'react-native';
import { Header, Image } from 'react-native-elements';

import { Ionicons } from '@expo/vector-icons';

const diviceWidth = Dimensions.get('window').width;
const diviceHeight = Dimensions.get('window').height;

export default function PostDetailPage({ navigation, route }) {
  const detailData = route.params;

  const [heart, setHeart] = useState(false);
  const [scrap, setScrap] = useState(false);

  const heartToggle = () => {
    heart ? setHeart(false) : setHeart(true);
  };
  const scrapToggle = () => {
    scrap ? setScrap(false) : setScrap(true);
  };

  const image = { uri: detailData.image };

  useLayoutEffect(() => {
    // console.log(detailData);
  }, []);

  return (
    <ImageBackground
      source={image}
      blurRadius={3}
      style={{
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        backgroundColor: 'black',
      }}
      imageStyle={{ opacity: 0.3 }}>
      <ScrollView bounces={false}>
        <Header
          barStyle='light-content'
          containerStyle={{
            backgroundColor: 'transparent',
            borderBottomWidth: 0,
            alignSelf: 'center',
          }}
          leftComponent={
            <Ionicons
              onPress={() => {
                navigation.goBack();
              }}
              name={'chevron-back'}
              size={27}
              color={'white'}
            />
          }
          centerComponent={''}
          rightComponent={
            <View style={{ flexDirection: 'row' }}>
              <Ionicons
                onPress={heartToggle}
                name={heart ? 'heart' : 'heart-outline'}
                size={27}
                color={heart ? 'red' : 'white'}
                style={{ marginHorizontal: 10 }}
              />
              <Ionicons
                onPress={scrapToggle}
                name={scrap ? 'bookmark' : 'bookmark-outline'}
                color={scrap ? '#4C65FF' : 'white'}
                size={27}
              />
            </View>
          }
        />
        <View style={styles.bookImageBox}>
          <Image style={styles.bookImage} resizeMode='cover' source={image} />
        </View>
        <View style={styles.container}>
          <Text style={styles.bookCate}>카테고리 {'>'} 인문</Text>
          <Text style={styles.bookTitle}>{detailData.title}</Text>
          <Text style={styles.bookAuthor}>{detailData.author}</Text>
          <View
            style={{
              width: diviceWidth * 0.95,
              height: 10,
              backgroundColor: '#f3f3f3',
              alignSelf: 'center',
            }}></View>
          <Text style={styles.subTitle}>작품소개</Text>
          <Text style={styles.bookDesc}>{detailData.description}</Text>
          <Text style={styles.subTitle}>도서추천</Text>
          <Text style={styles.bookDesc}>
            여러분 꼭 한번 시간내서 보십쇼 정말 재밌습니다...
          </Text>
        </View>
      </ScrollView>
      <Pressable
        style={styles.chatBox}
        onPress={() => {
          navigation.navigate('ChatPage');
        }}>
        <Text
          style={{
            fontSize: 23,
            fontWeight: '600',
            color: 'white',
            textAlign: 'center',
            padding: 20,
          }}>
          채팅연결하기
        </Text>
      </Pressable>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bookImageBox: {
    height: 250,
    width: diviceWidth / 2.5,
    alignSelf: 'center',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    marginBottom: 15,
  },
  bookImage: {
    height: '100%',
    width: '100%',
    borderRadius: 5,
  },
  container: {
    alignSelf: 'center',
    width: diviceWidth * 0.95,
    height: diviceHeight,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 80,
  },
  bookTitle: {
    fontSize: 25,
    fontWeight: '700',
  },
  subTitle: { fontSize: 20, fontWeight: '700' },
  chatBox: {
    width: diviceWidth,
    height: 70,
    backgroundColor: '#4C65FF',
    position: 'absolute',
    bottom: 0,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
});
