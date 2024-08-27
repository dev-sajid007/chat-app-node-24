import jwt from 'jsonwebtoken';

export const verifyToken = (req,res,next) => {
    const token = req.cookies.jwt;
    if(!token) return res.json({success:false,message:"You are not authenticated!"});
    jwt.verify(token,process.env.JWT_SECRET,async (err,payload) => {
        if(err) return res.json({success:false,message:"Token is not valid!"});
        req.userId = payload.userId;
        next();
    });
}