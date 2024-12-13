export const requireAdmin = (req, res, next) => {
    const userRole = req.userRole; // Role extracted by the `authenticate` middleware
  
    if (!userRole) {
      return res.status(401).json({ message: "Unauthorized: Role not found" });
    }
  
    if (userRole !== "admin") {
      return res.status(403).json({ message: "Forbidden: Requires admin role" });
    }
  
    next();
  };
  