import { userApi } from '../axios/axiosInstance';
import { DASHBOARD_API } from '../constants/apiConstants';

export const getDashboardStatsAPI = async () => {
  const res = await userApi.get(DASHBOARD_API.GET_STATS);
  return res.data.data;
};
