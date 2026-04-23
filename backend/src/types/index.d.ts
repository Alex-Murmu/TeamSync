import { JwtPayload } from "../utils/jwt.utils.ts";

declare global{
    namespace Express{
        interface Request{
            user:JwtPayload
        }
    }
};

export{};