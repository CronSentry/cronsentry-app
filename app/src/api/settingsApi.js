import api from "./axios.js";

export const updateSettingsApi = async (data) => {
    const response = await api.put("/cronAlertService/organization", data);
    return response.data;
};