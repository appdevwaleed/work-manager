import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { findUserById } from "./user"; // This function will fetch user by ID
import { connectDb } from "../lib/dbConnect";
import { customJwtExtractor } from "../lib/common";
connectDb();
const options = {
  jwtFromRequest: (req) => customJwtExtractor(req),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET,
};

passport.use(
  new JwtStrategy(options, async (jwtPayload, done) => {
    console.log("JWT Payload:", jwtPayload); // Debug the payload
    console.log("JWT ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET); // Debug the payload
    try {
      const user = await findUserById(jwtPayload.id);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;
