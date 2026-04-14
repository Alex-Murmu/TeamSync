import { JwtPayload } from "../utils/jwt.utils.js";

declare global{
    namespace express{
        interface Request{
            user:JwtPayload
        }
    }
};

export{};