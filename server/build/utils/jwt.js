require("dotenv").config();
import {Response} from "express";
import {IUser} from "../models/user.model"

import {redis} from "./redis";

interface ITokenOptions {
    expires:Date ,
    maxAge: number,
    httpOnly: boolean,
    sameSite:'lax' | 'strict' | "none" | undefined,
    secure?: boolean,
    domain:string,
}

 // pare enviroment
 const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || '300',10);
 const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || '1200',10);
 // options for cookie
 export const accessTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
    maxAge: accessTokenExpire * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none", // Hỗ trợ cross-origin
    secure: process.env.NODE_ENV === "production", // Chỉ bật secure khi chạy production
    domain: "455d-171-235-162-224.ngrok-free.app", // Gán domain của frontend
    
};

export const refreshTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
    maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none", // Hỗ trợ cross-origin
    secure: process.env.NODE_ENV === "production", // Chỉ bật secure khi chạy production
    domain: "455d-171-235-162-224.ngrok-free.app", 
   
    // Gán domain của frontend
};



export const sendToken = (user : IUser , statusCode : number,res:Response) => {
    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();
    // upload session to Redis

    redis.set(user._id, JSON.stringify(user) as any);


    // only set secure to true in production
    if(process.env.NODE_ENV ==='production') {
        accessTokenOptions.secure = true;
    }

    res.cookie("access_token",accessToken,accessTokenOptions);
    res.cookie("refresh_token",refreshToken,refreshTokenOptions);

    res.status(statusCode).json({
        success: true,
        user,
        accessToken,
    });

}