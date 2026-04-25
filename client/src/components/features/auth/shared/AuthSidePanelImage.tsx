import GridDistortion from "@/components/GridDistortion";
import "@/components/GridDistortion.css";

interface AuthSidePanelImageProps {
  imageSrc: string;
  children?: React.ReactNode;
}

/**
 * Reusable side panel image component for auth forms (SignUp/LogIn)
 * Features: GridDistortion background + customizable overlay content
 * Usage: Pass children for overlay text/content
 */
export function AuthSidePanelImage({
  imageSrc,
  children,
}: AuthSidePanelImageProps) {
  const fallbackImage = "/images/signup-bg.jpg";

  return (
    <div className="relative hidden bg-muted md:block h-full">
      {/* Overlay Content Container */}
      <div className="absolute bottom-5 text-white z-20 w-full flex flex-col pl-10 gap-2">
        {children}
      </div>

      {/* GridDistortion Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden rounded-r-xl">
        <GridDistortion
          imageSrc={imageSrc || fallbackImage}
          grid={15}
          mouse={0.1}
          strength={0.15}
          relaxation={0.9}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}

export default AuthSidePanelImage;
