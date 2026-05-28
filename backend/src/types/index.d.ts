import { JwtPayload } from "../utils/jwt.utils.js";

declare global{
    namespace Express{
        interface Request{
            user: JwtPayload;
            cookies: { [key: string]: string };
        }
    }
};

export {};
