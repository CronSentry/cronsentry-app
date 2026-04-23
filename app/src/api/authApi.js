import api from "./axios";

export const loginApi = async (email, password) => {
    const response = await api.post("/cronAlertService/login", {
        email,
        password
    })
    return response.data
}

export const registerApi = async (email, password, organizationName) => {
    const response = await api.post("/cronAlertService/user", {
        email,
        password,
        organizationName
    })
    return response.data
}