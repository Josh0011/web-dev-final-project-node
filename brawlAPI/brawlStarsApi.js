import axios from "axios";

const BASE_URL = "https://api.brawlstars.com/v1";
const API_KEY = process.env.BRAWLSTARS_API_KEY;

const brawlStarsApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
  },
});

export const getPlayerInfo = async (playerTag) => {
  try {
    const response = await brawlStarsApi.get(`/players/%23${playerTag}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching player info:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const getBrawlers = async () => {
  try {
    const response = await brawlStarsApi.get(`/brawlers`);
    return response.data;
  } catch (error) {
    console.error("Error fetching brawlers:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const getClubInfo = async (clubTag) => {
  try {
    const response = await brawlStarsApi.get(`/clubs/%23${clubTag}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching club info:", error);
    throw error.response ? error.response.data : error.message;
  }
};
