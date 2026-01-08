"use client";

import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import RecommendationCard from "../components/RecommendationCard";
import PublicHeader from "../components/PublicHeader";

export default function Home() {
  const recommendations = useQuery(api.recommendations.list, { limit: 50 });
  const genresData = useQuery(api.genres.list);
  const genres = genresData?.map(g => g.name) || [];
  const [filterType, setFilterType] = useState<string | null>(null);

  // Filter logic
  const filteredRecs = recommendations?.filter((rec) => {
    if (!filterType) return true;
    return rec.type === filterType;
  });

  return (
    <div className="container">
      <PublicHeader />

      <main>
        <section style={{ textAlign: "center", padding: "4rem 0", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "1rem", lineHeight: 1.1 }}>
            Collect and share the stuff<br />
            <span style={{ color: "var(--primary)" }}>you're hyped about</span>
          </h1>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ marginBottom: "2rem" }}>Latest Hype</h2>

          <div className="filter-bar">
            <button
              className={`filter-chip ${filterType === null ? "active" : ""}`}
              onClick={() => setFilterType(null)}
            >
              All
            </button>
            {genres.map(g => (
              <button
                key={g}
                className={`filter-chip ${filterType === g ? "active" : ""}`}
                onClick={() => setFilterType(g)}
              >
                {g}
              </button>
            ))}
          </div>

          {filteredRecs === undefined ? (
            <div style={{ color: "var(--text-muted)" }}>Loading hype...</div>
          ) : filteredRecs.length === 0 ? (
            <div style={{ color: "var(--text-muted)" }}>No recommendations yet. Be the first!</div>
          ) : (
            <div className="grid">
              {filteredRecs.map((rec) => (
                <RecommendationCard
                  key={rec._id}
                  id={rec._id}
                  title={rec.title}
                  type={rec.type}
                  link={rec.link}
                  blurb={rec.blurb}
                  authorName={rec.authorName}
                  authorId={rec.userId}
                  isStaffPick={rec.isStaffPick}
                  imageUrl={rec.imageUrl}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
