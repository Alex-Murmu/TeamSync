import { useNavigate } from "react-router-dom";
import BackForward from "@/assets/left-arrow.png";
import { cn } from "@/lib/utils"


export const GoBackButton = ({className}:{className?:string}) => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className={cn("",className)}>
        <button onClick={handleGoBack} className="flex items-center gap-1 text-sm text-foreground  hover:text-primary transition-colors duration-200">
              <img src={BackForward} alt="" className="" />

        </button>
        </div>
    );
}
