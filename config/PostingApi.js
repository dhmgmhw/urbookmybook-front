import { Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const host = "http://13.124.182.223"

export async function uploadImg(data) {
    try {
        const response = await axios({
            method: "post",
            url: host + '/api/images',
            data: data,
        });
        return response.data
    } catch (err) {
        console.log(err)
        alert(err)
    }
}

export async function postBook(data, navigation) {
    const token = await AsyncStorage.getItem("session")
    try {
        const response = await axios({
            method: "post",
            url: host + '/api/townbooks',
            headers: {
                token: token,
            },
            data: data,
        });
        alert('게시글을 업로드했어요!')
        navigation.pop();
    } catch (err) {
        console.log(err)
        alert('게시글을 올릴 수 없어요:(')
    }
}

export async function postBookWithFormData(data, navigation) {
    const token = await AsyncStorage.getItem("session")
    try {
        await axios({
            method: "POST",
            url: host + '/api/townbooks',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                token: token
            },
            data: data,
        });
        alert('게시글을 업로드했어요!')
        navigation.pop();
    } catch (err) {
        console.log(err)
        alert('게시글을 올릴 수 없어요:(')
    }
}


export async function postDetail(id) {
    try {
        const response = await axios({
            method: "get",
            url: host + '/api/townbooks/' + id,
        });
        return response.data
    } catch (err) {
        console.log(err)
        alert('게시글을 조회할 수 없어요:(')
    }
}


export async function updatePost(data, id, navigation) {
    const token = await AsyncStorage.getItem("session")
    try {
        await axios({
            method: "put",
            url: host + '/api/townbooks/' + id,
            headers: {
                token: token,
            },
            data: data,
        });
        alert('게시글 수정 완료!')
        navigation.goBack()
    } catch (err) {
        console.log(err)
        alert('게시글을 수정할 수 없어요:(')
    }
}

export async function deletePost(id, navigation) {
    const token = await AsyncStorage.getItem("session")
    try {
        await axios({
            method: "delete",
            url: host + '/api/townbooks/' + id,
            headers: {
                token: token,
            },
        });
        alert('게시글 삭제 완료')
        navigation.pop();
    } catch (err) {
        console.log(err)
        alert('게시글을 삭제할 수 없습니다.')
    }
}


export async function postComment(data, id) {
    const token = await AsyncStorage.getItem("session")
    try {
        const response = await axios({
            method: "post",
            url: host + '/api/comments/' + id,
            headers: {
                token: token,
            },
            data: { contents: data },
        });
        console.log(response.data)
    } catch (err) {
        console.log(err)
        alert('댓글을 남길 수 없어요:(')
    }
}

export async function changeComment(id, comment) {
    const token = await AsyncStorage.getItem("session")
    try {
        const response = await axios({
            method: "put",
            url: host + '/api/comments/' + id,
            data: {
                contents: comment
            },
            headers: {
                token: token,
            },
        });
        alert('댓글 수정 완료')
    } catch (err) {
        console.log(err)
        alert('댓글을 삭제할 수 없습니다.')
    }
}


export async function deleteComment(id) {
    const token = await AsyncStorage.getItem("session")
    try {
        await axios({
            method: "delete",
            url: host + '/api/comments/' + id,
            headers: {
                token: token,
            },
        });
        alert('댓글 삭제 완료')
    } catch (err) {
        console.log(err)
        alert('댓글을 삭제할 수 없습니다.')
    }
}

export async function getUserPosts(email) {
    try {
        const response = await axios({
            method: "get",
            url: host + '/api/townbooks/users/' + email,
        });
        if (response.data.results.length == 0) {
            return false
        } else {
            return response.data.results
        }
    } catch (err) {
        console.log(err)
        alert('해당 유저의 게시글을 확인할 수 없습니다.')
    }
}
