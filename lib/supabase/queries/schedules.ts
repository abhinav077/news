import "server-only";
import { getSupabaseServerClient } from "../server";
import type { OxylabsSchedule, OxylabsScheduleRun } from "../types";
import { requireData } from "./shared";

export async function listSchedules(): Promise<OxylabsSchedule[]> { const { data, error } = await getSupabaseServerClient().from("oxylabs_schedules").select("*").order("created_at", { ascending: false }); return requireData(data, error); }
export async function saveSchedule(schedule: Omit<OxylabsSchedule, "id" | "created_at" | "updated_at">): Promise<OxylabsSchedule> { const { data, error } = await getSupabaseServerClient().from("oxylabs_schedules").upsert({ ...schedule, updated_at: new Date().toISOString() }, { onConflict: "source_id" }).select("*").single(); return requireData(data, error); }
export async function listScheduleRuns(scheduleId: string): Promise<OxylabsScheduleRun[]> { const { data, error } = await getSupabaseServerClient().from("oxylabs_schedule_runs").select("*").eq("schedule_id", scheduleId).order("created_at", { ascending: false }); return requireData(data, error); }
export async function saveScheduleRun(run: Omit<OxylabsScheduleRun, "id" | "created_at" | "updated_at">): Promise<OxylabsScheduleRun> { const { data, error } = await getSupabaseServerClient().from("oxylabs_schedule_runs").upsert({ ...run, updated_at: new Date().toISOString() }, { onConflict: "schedule_id,provider_run_id" }).select("*").single(); return requireData(data, error); }
