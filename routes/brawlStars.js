import express from "express";
import { getPlayerInfo, getBrawlers, getClubInfo } from "../brawlAPI/brawlStarsApi.js";

const router = express.Router();

router.get("/players/:playerTag", async (req, res) => {
  const { playerTag } = req.params;

  try {
    const playerInfo = await getPlayerInfo(playerTag);
    res.status(200).json(playerInfo);
  } catch (error) {
    console.error("Error fetching player info:", error);
    res.status(500).json({ message: "Failed to fetch player info", error });
  }
});

router.get("/brawlers", async (req, res) => {
  try {
    const brawlers = await getBrawlers();
    res.status(200).json(brawlers);
  } catch (error) {
    console.error("Error fetching brawlers:", error);
    res.status(500).json({ message: "Failed to fetch brawlers", error });
  }
});

router.get("/clubs/:clubTag", async (req, res) => {
  const { clubTag } = req.params;

  try {
    const clubInfo = await getClubInfo(clubTag);
    res.status(200).json(clubInfo);
  } catch (error) {
    console.error("Error fetching club info:", error);
    res.status(500).json({ message: "Failed to fetch club info", error });
  }
});

export default router;