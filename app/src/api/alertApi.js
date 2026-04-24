import api from "./axios.js";

export const getAlertsApi = async () => {
    const response = await api.get("/cronAlertService/alerts");
    return response.data;
};

export const markNotificationsSeenApi = async () => {
    await api.patch("/cronAlertService/user/last-seen-notifications");
};