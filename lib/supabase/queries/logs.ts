import "server-only";
import { getSupabaseServerClient } from "../server";
import type { Log } from "../types";
import { requireData } from "./shared";

export async function createLog(log: Omit<Log, "id" | "created_at">): Promise<Log> { const { data, error } = await getSupabaseServerClient().from("logs").insert(log).select("*").single(); return requireData(data, error); }
export async function listLogs(limit = 100): Promise<Log[]> { const { data, error } = await getSupabaseServerClient().from("logs").select("*").order("created_at", { ascending: false }).limit(limit); return requireData(data, error); }
