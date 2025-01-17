import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { findUserById } from "../utils/user"; // This function will fetch user by ID
import { connectDb } from "../lib/dbConnect";
import { customJwtExtractor } from "../utils/common";
connectDb();
const options = {
  jwtFromRequest: (req) => customJwtExtractor(req),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET,
  passReqToCallback: true, // Enable passing req to the callback
};

passport.use(
  new JwtStrategy(options, async (req, jwtPayload, done) => {
    try {
      const user = await findUserById(jwtPayload.id);
      if (user && user?.accessToken === customJwtExtractor(req)) {
        return done(null, user);
      }

      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;
