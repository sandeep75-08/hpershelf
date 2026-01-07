import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const roles = v.union(v.literal("admin"), v.literal("user"));

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.string(),
    role: roles,
  }).index("by_token", ["tokenIdentifier"]),

  recommendations: defineTable({
    title: v.string(),
    type: v.string(), // genre: horror, action, etc.
    link: v.string(),
    blurb: v.string(),
    userId: v.string(), // tokenIdentifier of the creator
    authorName: v.string(),
    isStaffPick: v.boolean(),
    imageUrl: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_type", ["type"]),

  genres: defineTable({
    name: v.string(),
  }).index("by_name", ["name"]),
});
