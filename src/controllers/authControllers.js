import { authRepository } from "../repositories/authRepository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function SignUp(req, res) {
    const body = req.body;
    const passwordHash = bcrypt.hashSync(body.password, 10); 
    try {
        await authRepository.SignUp(body.email, passwordHash, body.username, body.pictureUrl)
        res.sendStatus(201);
    } catch (error) {
       res.status(500).send(error); 
    }
   
}

export async function SignIn(req, res) {
    const id = res.locals.id;
    const pictureUrl = res.locals.pictureUrl;
    try {
        const token = jwt.sign({ id }, process.env.PRIVATE_KEY_JWT, {
            expiresIn: '7d' // expires in 7 days
        });
        const info = {
            id,
            token,
            pictureUrl
        }
        res.status(200).send(info);
    } catch (error) {
        res.status(500).send(error);
    }
    
}