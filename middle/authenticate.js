import admin from "../firebaseConfig.js";

export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.userId = decodedToken.uid; // Set userId in request
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
