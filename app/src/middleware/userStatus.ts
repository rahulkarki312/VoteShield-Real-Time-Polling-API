import { Request, Response, NextFunction } from "express";


export const userStatusMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
)=>{
    if(!req.session.userStatus){
        req.session.userStatus = "guest";
    }

    next();
}