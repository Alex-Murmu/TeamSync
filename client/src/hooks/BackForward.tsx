import { useNavigate } from "react-router-dom";
import { TiArrowBackOutline } from "react-icons/ti";


export const GoBackButton = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // Navigate back to the previous page
    };

    return (
        // remeber make the parent first then the add this ine
        <div className="absolute left-15 top-3">  
        <button onClick={handleGoBack} className="flex items-center gap-1 text-sm text-foreground hover:text-primary transition-colors duration-200">
            <TiArrowBackOutline size={50} />
        </button>
        </div>
    );
}