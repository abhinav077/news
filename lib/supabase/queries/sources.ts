import "server-only";
import { getSupabaseServerClient } from "../server";
import type { Source } from "../types";
import { requireData } from "./shared";

export async function listActiveSources(): Promise<Source[]> { const { data, error } = await getSupabaseServerClient().from("sources").select("*").eq("is_active", true).order("name"); return requireData(data, error); }
export async function getSourceById(id: string): Promise<Source | null> { const { data, error } = await getSupabaseServerClient().from("sources").select("*").eq("id", id).maybeSingle(); return requireData(data, error); }
export async function updateSource(id: string, values: Pick<Source, "is_active" | "parser_strategy" | "logo_url">): Promise<Source> { const { data, error } = await getSupabaseServerClient().from("sources").update({ ...values, updated_at: new Date().toISOString() }).eq("id", id).select("*").single(); return requireData(data, error); }
