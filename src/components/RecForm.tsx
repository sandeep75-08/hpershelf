"use client";

import { useMutation, useQuery } from "convex/react";
import { useState, useEffect } from "react";
import { api } from "../../convex/_generated/api";
import { Rec } from "../lib/types";

interface RecFormProps {
    initialData?: Rec | null;
    onSuccess?: () => void;
}

export default function RecForm({ initialData, onSuccess }: RecFormProps) {
    const createRec = useMutation(api.recommendations.create);
    const updateRec = useMutation(api.recommendations.update);
    const genresData = useQuery(api.genres.list);

    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const [link, setLink] = useState("");
    const [blurb, setBlurb] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const availableGenres = genresData?.map(g => g.name) || [];

    useEffect(() => {
        if (availableGenres.length > 0 && !initialData) {
            setType(availableGenres[0]);
        }
    }, [availableGenres, initialData]);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setType(initialData.type);
            setLink(initialData.link);
            setBlurb(initialData.blurb);
            setImageUrl(initialData.imageUrl || "");
        } else {
            setTitle("");
            setType("");
            setLink("");
            setBlurb("");
            setImageUrl("");
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                title,
                type,
                link,
                blurb,
                imageUrl: imageUrl.trim() || ""
            };
            if (initialData) {
                await updateRec({ id: initialData._id, ...payload });
            } else {
                await createRec(payload);
                setTitle("");
                setLink("");
                setBlurb("");
                setImageUrl("");
            }

            if (onSuccess) onSuccess();
            else alert(initialData ? "Updated!" : "Example added!");

        } catch (err: any) {
            console.error(err);
            alert("Failed to save. " + (err.message || "Unknown error"));
        } finally {
            setIsSubmitting(false);
        }
    };

    const isEdit = !!initialData;

    return (
        <form onSubmit={handleSubmit} className="text-left form-stack">
            <div className="form-group">
                <label className="form-label">Movie Title</label>
                <input
                    required
                    className="form-input"
                    placeholder="e.g. Inception, The Godfather, Parasite"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label className="form-label">Poster / Image URL (Optional)</label>
                <input
                    type="url"
                    className="form-input"
                    placeholder="https://image.tmdb.org/..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label className="form-label">Genre</label>
                <select
                    className="form-select"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >
                    {availableGenres.map((g) => (
                        <option key={g} value={g}>{g}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label className="form-label">Link (IMDb, Letterboxd...)</label>
                <input
                    required
                    type="url"
                    className="form-input"
                    placeholder="https://..."
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label className="form-label">Why it's Hype?</label>
                <textarea
                    required
                    className="form-textarea"
                    placeholder="No spoilers! Just tell us why it's great."
                    rows={4}
                    value={blurb}
                    onChange={(e) => setBlurb(e.target.value)}
                />
            </div>

            <button
                className="btn btn-primary"
                style={{ width: "100%", padding: "0.8rem", marginTop: "0.5rem" }}
                disabled={isSubmitting}
            >
                {isSubmitting ? "Saving..." : isEdit ? "Update Hype" : "Post Hype"}
            </button>
        </form>
    );
}
