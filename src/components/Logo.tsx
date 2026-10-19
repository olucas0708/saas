import { Link } from "@tanstack/react-router";

export function Logo() {
  return (
    <Link to="/" className="font-display text-xl font-bold tracking-tight text-foreground">
      nextage<span className="text-primary">.ai</span>
    </Link>
  );
}
