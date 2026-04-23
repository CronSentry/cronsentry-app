import api from "./axios";

export const getMonitorsApi = async () => {
    const response = await api.get("/cronAlertService/monitors");
    return response.data;
}

export const getMonitorByIdApi = async (monitorId) => {
    const response = await api.get(`/cronAlertService/monitor/${monitorId}`);
    return response.data;
}

export const createMonitorApi = async (data) => {
    const response = await api.post("/cronAlertService/monitor", data);
    return response.data;
}

export const updateMonitorApi = async (monitorId, data) => {
    const response = await api.put(`/cronAlertService/monitor/${monitorId}`, data);
    return response.data;
}

export const deleteMonitorApi = async (monitorId) => {
    await api.delete(`/cronAlertService/monitor/${monitorId}`);
}

export const regenerateKeyApi = async (monitorId) => {
    const response = await api.patch(`/cronAlertService/monitor/${monitorId}/regenerate-key`);
    return response.data;
}