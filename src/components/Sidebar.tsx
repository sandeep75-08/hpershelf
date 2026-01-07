"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { LayoutDashboard, Users, PlusCircle, LogOut, Tags } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

interface SidebarProps {
    currentView: "recs" | "users" | "genres";
    onChangeView: (view: "recs" | "users" | "genres") => void;
    isAdmin: boolean;
    onOpenForm: () => void;
}

export default function Sidebar({ currentView, onChangeView, isAdmin, onOpenForm }: SidebarProps) {
    const { user } = useUser();

    return (
        <div className="sidebar">
            <div style={{ marginBottom: "2rem" }}>
                <Link href="/" className="logo">HypeShelf</Link>
            </div>

            <div className="sidebar-nav">
                <button
                    className={`nav-item ${currentView === "recs" ? "active" : ""}`}
                    onClick={() => onChangeView("recs")}
                >
                    <LayoutDashboard size={20} />
                    <span>Manage Hype</span>
                </button>

                {isAdmin && (
                    <>
                        <button
                            className={`nav-item ${currentView === "genres" ? "active" : ""}`}
                            onClick={() => onChangeView("genres")}
                        >
                            <Tags size={20} />
                            <span>Manage Genres</span>
                        </button>
                        <button
                            className={`nav-item ${currentView === "users" ? "active" : ""}`}
                            onClick={() => onChangeView("users")}
                        >
                            <Users size={20} />
                            <span>Manage Users</span>
                        </button>
                    </>
                )}
            </div>

            <div style={{ marginTop: "2rem", padding: "0 0.5rem" }}>
                <button
                    className="btn btn-primary"
                    style={{ width: "100%" }}
                    onClick={onOpenForm}
                >
                    <PlusCircle size={18} /> Add Hype
                </button>
            </div>

            <div style={{ marginTop: "auto", borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0 0.5rem" }}>
                    <UserButton afterSignOutUrl="/" />
                    <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                        <span style={{ fontWeight: 600, fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {user?.fullName || user?.username}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "capitalize" }}>
                            {isAdmin ? "Admin" : "User"}
                        </span>
                    </div>
                    <ThemeToggle />
                </div>
            </div>
        </div>
    );
}
