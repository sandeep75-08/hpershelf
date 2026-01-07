import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("genres").order("asc").collect();
    },
});

export const create = mutation({
    args: { name: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (user?.role !== "admin") throw new Error("Admin only");

        const existing = await ctx.db
            .query("genres")
            .withIndex("by_name", (q) => q.eq("name", args.name))
            .unique();

        if (existing) throw new Error("Genre already exists");

        await ctx.db.insert("genres", { name: args.name });
    },
});

export const update = mutation({
    args: { id: v.id("genres"), name: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (user?.role !== "admin") throw new Error("Admin only");

        await ctx.db.patch(args.id, { name: args.name });
    },
});

export const remove = mutation({
    args: { id: v.id("genres") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (user?.role !== "admin") throw new Error("Admin only");

        await ctx.db.delete(args.id);
    },
});
