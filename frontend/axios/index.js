import axios from "axios";

function axiosWithAuth(){
    const token = localStorage.getItem('token');
    axios.create({
        headers: {
            authorization: token,
        },
    });

}

export default axiosWithAuth;