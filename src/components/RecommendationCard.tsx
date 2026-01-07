"use client";

import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Trash2, Star, ExternalLink } from "lucide-react";
import clsx from "clsx";

interface RecommendationProps {
    id: Id<"recommendations">;
    title: string;
    type: string;
    link: string;
    blurb: string;
    authorName: string;
    authorId: string; // The tokenIdentifier of the author
    isStaffPick: boolean;
    imageUrl?: string;
    currentUserId?: string; // The tokenIdentifier of the current user
    currentUserRole?: "admin" | "user";
}

export default function RecommendationCard({
    id,
    title,
    type,
    link,
    blurb,
    authorName,
    authorId,
    isStaffPick,
    imageUrl,
    currentUserId,
    currentUserRole,
}: RecommendationProps) {
    const deleteRec = useMutation(api.recommendations.deleteRec);
    const toggleStaffPick = useMutation(api.recommendations.toggleStaffPick);

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this recommendation?")) {
            await deleteRec({ id });
        }
    };

    const handleStaffPick = async () => {
        await toggleStaffPick({ id });
    };

    const canDelete =
        currentUserRole === "admin" ||
        (currentUserId && currentUserId === authorId);

    return (
        <div className="card">
            <div style={{ width: "100%", height: "200px", overflow: "hidden", marginBottom: "1rem", borderRadius: "12px", position: "relative" }}>
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                        }}
                    />
                ) : (
                    <div style={{
                        width: "100%",
                        height: "100%",
                        background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(168, 85, 247, 0.1))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--text-muted)",
                        fontSize: "3rem"
                    }}>
                        🎬
                    </div>
                )}
            </div>
            <div className="card-header">
                <span className="card-type">{type}</span>
                {isStaffPick && (
                    <span style={{ color: "gold", fontSize: "1.2rem", textShadow: "0 0 10px rgba(255, 215, 0, 0.5)" }} title="Staff Pick">
                        ★
                    </span>
                )}
            </div>
            <h3 className="card-title">
                <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                    {title}
                    <ExternalLink size={18} style={{ opacity: 0.5 }} />
                </a>
            </h3>
            <p className="card-blurb">{blurb}</p>

            <div className="card-footer">
                <span>Added by {authorName}</span>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    {currentUserRole === "admin" && (
                        <button onClick={handleStaffPick} className="btn btn-outline" style={{ padding: "0.2rem", border: "none" }} title="Toggle Staff Pick">
                            <Star size={16} fill={isStaffPick ? "gold" : "none"} stroke={isStaffPick ? "gold" : "currentColor"} />
                        </button>
                    )}

                    {canDelete && (
                        <button onClick={handleDelete} className="btn btn-danger" title="Delete">
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
