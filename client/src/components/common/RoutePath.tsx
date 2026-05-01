import { Link, useLocation } from "react-router-dom";

function formatSegment(segment: string): string {
  if (!segment) return "home";
  return segment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function RoutePath() {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="breadcrumb" className="px-4 py-3 text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
        </li>
        {segments.map((segment, index) => {
          const to = `/${segments.slice(0, index + 1).join("/")}`;
          const isLast = index === segments.length - 1;

          return (
            <li key={to} className="flex items-center gap-2">
              <span>/</span>
              {isLast ? (
                <span className="text-foreground">{formatSegment(segment)}</span>
              ) : (
                <Link to={to} className="hover:text-foreground">
                  {formatSegment(segment)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
