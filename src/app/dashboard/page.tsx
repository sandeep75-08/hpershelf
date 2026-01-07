"use client";

import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import Sidebar from "../../components/Sidebar";
import RecommendationTable from "../../components/RecommendationTable";
import RecForm from "../../components/RecForm";
import UserManagement from "../../components/UserManagement";
import GenresTable from "../../components/GenresTable";
import DashboardHeader from "../../components/DashboardHeader";
import Modal from "../../components/Modal";
import { Rec } from "../../lib/types";

export default function Dashboard() {
    const { user, isLoaded } = useUser();
    const storeUser = useMutation(api.users.store);
    const viewer = useQuery(api.users.viewer);

    const recommendations = useQuery(api.recommendations.list, { limit: 200 });

    const [currentView, setCurrentView] = useState<"recs" | "users" | "genres">("recs");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingRec, setEditingRec] = useState<Rec | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("");

    // Sync user
    useEffect(() => {
        if (user) storeUser();
    }, [user, storeUser]);

    if (!isLoaded || !user) {
        return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "var(--text-muted)" }}>Loading Dashboard...</div>;
    }

    const handleEdit = (rec: Rec) => {
        setEditingRec(rec);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingRec(null);
    };

    const isAdmin = viewer?.role === "admin";
    const safeView = (currentView === "users" && !isAdmin) ? "recs" : currentView;

    // Client-side filtering
    const filteredRecommendations = recommendations?.filter(rec => {
        const matchesSearch = rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            rec.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            rec.blurb.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGenre = selectedGenre ? rec.type === selectedGenre : true;

        return matchesSearch && matchesGenre;
    }) || [];

    return (
        <div className="dashboard-layout">
            <Sidebar
                currentView={safeView}
                onChangeView={setCurrentView}
                isAdmin={isAdmin ?? false}
                onOpenForm={() => {
                    setEditingRec(null);
                    setIsFormOpen(true);
                }}
            />

            <main className="main-content">
                <DashboardHeader
                    currentView={safeView}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedGenre={selectedGenre}
                    setSelectedGenre={setSelectedGenre}
                />

                <Modal
                    isOpen={isFormOpen}
                    onClose={handleCloseForm}
                    title={editingRec ? "Edit Hype" : "Add Hype"}
                >
                    <RecForm initialData={editingRec} onSuccess={handleCloseForm} />
                </Modal>

                {/* Main View */}
                {safeView === "recs" ? (
                    <RecommendationTable
                        recommendations={filteredRecommendations}
                        currentUserId={viewer?.tokenIdentifier}
                        isAdmin={isAdmin ?? false}
                        onEdit={handleEdit}
                    />
                ) : safeView === "users" ? (
                    <UserManagement />
                ) : (
                    <GenresTable />
                )}

            </main>
        </div>
    );
}
