import passport from "../../lib/passport"; // Import passport instance
passport.initialize();

export const authenticateUser = async (req, res) => {
  return new Promise((resolve, reject) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      console.log("authenticate session .....", user);
      if (err) {
        reject({
          status: 500,
          error: "Internal server error",
          details: err.message,
        });
      }

      if (!user) {
        reject({
          status: 401,
          error: info?.message || "Token invalid",
        });
      }
      resolve(user);
    })(req, res);
  });
};
