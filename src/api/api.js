import axios from "axios";

export const imageAPI = {
    getImage(tag) {
        return axios.get(`https://api.giphy.com/v1/gifs/random?api_key=gTJAO48YcpmrADUyo4opy4ES4g7iDBxx&tag=${tag}`)
    }
}