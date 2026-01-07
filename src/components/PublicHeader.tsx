import Link from "next/link";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import ThemeToggle from "./ThemeToggle";

export default function PublicHeader() {
    const { isSignedIn, user } = useUser();
    const viewer = useQuery(api.users.viewer);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="header">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Link href="/" className="logo">HypeShelf</Link>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <button
                        className="btn btn-ghost hamburger-btn"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle Menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            <nav className={`nav-container ${isMenuOpen ? "open" : ""}`}>
                {isSignedIn && user ? (
                    <div className="user-nav">
                        <Link href="/dashboard" style={{ width: "100%" }}>
                            <button className="btn btn-primary" style={{ width: "100%" }}>
                                Dashboard
                            </button>
                        </Link>
                        <div className="user-info">
                            <UserButton afterSignOutUrl="/" />
                            <div className="user-details">
                                <span className="user-name">{user.fullName}</span>
                                <span className={`user-role ${viewer?.role === "admin" ? "admin" : ""}`}>
                                    {viewer?.role === "admin" ? "Admin" : "User"}
                                </span>


                            </div>
                            <ThemeToggle />
                        </div>
                    </div>
                ) : (
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <ThemeToggle />
                        <div style={{ width: "100%" }}>
                            <SignInButton mode="modal">
                                <button className="btn btn-primary" style={{ width: "100%" }}>Sign In</button>
                            </SignInButton>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
