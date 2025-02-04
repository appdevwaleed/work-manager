import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import passport from "../lib/passport"; // Import passport instance
import { NextResponse } from "next/server";
passport.initialize();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const isSubset = (subsetArray, mainArray) => {
  return subsetArray.every((item) => mainArray.includes(item));
};
export const generateAccessToken = async (user) => {
  return jwt.sign(
    { id: user._id, phonenumber: user.phonenumber }, //email: user.email,
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: "7d", // Access token expires in 15 minutes
    }
  );
};

export const generateRefreshToken = async (user) => {
  return jwt.sign(
    { id: user._id, phonenumber: user.phonenumber }, // email: user.email,
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d", // Refresh token expires in 7 days
    }
  );
};

export const authenticateUser = async (req) => {
  return new Promise((resolve, reject) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err) {
        reject({
          status: 500,
          error: "Internal server error",
          details: err.message,
          message: "Internal server error",
        });
      }
      if (!user) {
        reject({
          status: 401,
          error: info?.message || "Token invalid",
          message: "Authentification failed",
        });
      }
      if (user?.userStatus !== "Active") {
        reject({
          status: 401,
          error: info?.message || "User is not an active user",
          message: "Authentification failed",
        });
      }
      resolve(user);
    })(req);
  });
};
export const authUsrWithoutActiveCheck = async (req) => {
  return new Promise((resolve, reject) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err) {
        reject({
          status: 500,
          error: "Internal server error",
          details: err.message,
          message: "Internal server error",
        });
      }
      if (!user) {
        reject({
          status: 401,
          error: info?.message || "Token invalid",
          message: "Authentification failed",
        });
      }
      resolve(user);
    })(req);
  });
};

export const corsAndHeadersVerification = async (req) => {
  return new Promise((resolve, reject) => {
    try {
      const authHeader = req.headers.get("Authorization");
      const headers = new Headers();
      headers.set("Access-Control-Allow-Origin", "*");
      headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
      headers.set(
        "Access-Control-Allow-Headers",
        "Authorization, Content-Type"
      );
      if (req.method === "OPTIONS") {
        resolve({
          status: 200,
          message: "Token is valid, continue working",
        });
      }
      if (!authHeader) {
        reject({
          status: 401,
          message: "No auth token provided",
        });
      }
      const token = authHeader?.split(" ")[1];
      if (!token) {
        reject({
          status: 401,
          message: "Invalid Authorization header format",
        });
      }
      resolve({
        status: 200,
        message: "Token is valid, continue working",
      });
    } catch (error) {
      reject({
        status: 401,
        message: error.message,
      });
    }
  });
};

///..........................Jwt Auth Creation Section ............................

export function generateRandomId(length = 16) {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
}
export const customJwtExtractor = (req) => {
  try {
    const authHeader = req.headers.get("Authorization");
    if (authHeader && authHeader?.startsWith("Bearer ")) {
      return authHeader?.split(" ")[1]; // Extract the token part
    }
    return null; // Return null if no token is present
  } catch (e) {
    return null; // Return null if no token is present
  }
};
export const apiResponse = async (_status, _message, _obj = null) => {
  return NextResponse.json(
    _obj === null
      ? {
          message: _message,
          status: _status,
        }
      : { message: _message, status: _status, data: _obj },
    {
      status: _status,
      message: _message,
    }
  );
};
export const buildTree = (data, parentId = null) => {
  return data
    .filter((item) => item.parentId === parentId && item.status == "active")
    .map((item) => ({
      ...item,
      children: buildTree(data, item.randomId), // Recursively find children
    }));
};

export const generateRandomCode = async () => {
  return Math.floor(100000 + Math.random() * 900000);
};

export const excludeKeys = async (object, keysToExclude) => {
  const result = { ...object };
  keysToExclude.forEach((key) => delete result[key]);
  return result;
};
export const includeKeys = async (data, keys) => {
  const result = {};
  keys.forEach((key) => {
    if (key in data) {
      result[key] = data[key];
    }
  });
  return result;
};

export async function verifyPassword(inputPassword, storedHash) {
  return await bcrypt.compare(inputPassword, storedHash);
}

export async function hashPassword(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}
