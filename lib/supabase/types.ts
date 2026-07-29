export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Table<Row, Insert, Update> = { Row: Row; Insert: Insert; Update: Update; Relationships: [] };
type Timestamp = string;

export type Source = { id: string; name: string; listing_url: string; parser_strategy: string | null; logo_url: string | null; is_active: boolean; created_at: Timestamp; updated_at: Timestamp };
export type Article = { id: string; source_id: string; original_url: string; canonical_url: string | null; slug: string; title: string; image_url: string; published_at: Timestamp; raw_text: string; scraped_at: Timestamp; analyzed_at: Timestamp | null; created_at: Timestamp; updated_at: Timestamp };
export type ArticleAnalysis = { id: string; article_id: string; summary: string; sentiment_score: number; sentiment_label: "positive" | "neutral" | "negative"; bias_score: number; bias_label: "left" | "center" | "right" | "mixed" | "unclear"; left_percentage: number; center_percentage: number; right_percentage: number; confidence: number; framing_notes: string; loaded_terms: string[]; disclaimer: string; model: string; created_at: Timestamp; updated_at: Timestamp };
export type Log = { id: string; level: "debug" | "info" | "warn" | "error"; event: string; message: string; source_id: string | null; article_id: string | null; run_id: string | null; metadata: Json; created_at: Timestamp };
export type OxylabsSchedule = { id: string; source_id: string; schedule_id: string; is_active: boolean; schedule_config: Json; provider_metadata: Json; created_at: Timestamp; updated_at: Timestamp };
export type OxylabsScheduleRun = { id: string; schedule_id: string; provider_run_id: string; provider_job_id: string | null; status: "pending" | "running" | "done" | "faulted" | "processed" | "failed"; result_status: string | null; provider_payload: Json; error_message: string | null; started_at: Timestamp | null; completed_at: Timestamp | null; processed_at: Timestamp | null; created_at: Timestamp; updated_at: Timestamp };

export type Database = { public: { Tables: {
  sources: Table<Source, Omit<Source, "id" | "created_at" | "updated_at"> & Partial<Pick<Source, "parser_strategy" | "logo_url" | "is_active">>, Partial<Omit<Source, "id" | "created_at">>>;
  articles: Table<Article, Omit<Article, "id" | "scraped_at" | "analyzed_at" | "created_at" | "updated_at"> & Partial<Pick<Article, "canonical_url" | "scraped_at">>, Partial<Omit<Article, "id" | "source_id" | "original_url" | "created_at">>>;
  article_analyses: Table<ArticleAnalysis, Omit<ArticleAnalysis, "id" | "bias_score" | "created_at" | "updated_at">, Partial<Omit<ArticleAnalysis, "id" | "article_id" | "bias_score" | "created_at">>>;
  logs: Table<Log, Omit<Log, "id" | "created_at"> & Partial<Pick<Log, "source_id" | "article_id" | "run_id" | "metadata">>, never>;
  oxylabs_schedules: Table<OxylabsSchedule, Omit<OxylabsSchedule, "id" | "created_at" | "updated_at"> & Partial<Pick<OxylabsSchedule, "is_active" | "schedule_config" | "provider_metadata" | "updated_at">>, Partial<Omit<OxylabsSchedule, "id" | "source_id" | "schedule_id" | "created_at">>>;
  oxylabs_schedule_runs: Table<OxylabsScheduleRun, Omit<OxylabsScheduleRun, "id" | "created_at" | "updated_at"> & Partial<Pick<OxylabsScheduleRun, "provider_job_id" | "result_status" | "provider_payload" | "error_message" | "started_at" | "completed_at" | "processed_at" | "updated_at">>, Partial<Omit<OxylabsScheduleRun, "id" | "schedule_id" | "provider_run_id" | "created_at">>>;
}; Views: Record<string, never>; Functions: Record<string, never>; Enums: Record<string, never>; CompositeTypes: Record<string, never> } };

export type PublicArticleDto = Pick<Article, "id" | "slug" | "title" | "image_url" | "published_at"> & { source: Pick<Source, "id" | "name" | "logo_url">; analysis: Pick<ArticleAnalysis, "sentiment_label" | "bias_label" | "left_percentage" | "center_percentage" | "right_percentage" | "confidence"> };
export type PublicArticleDetailDto = PublicArticleDto & Pick<Article, "original_url" | "canonical_url" | "raw_text"> & { analysis: Pick<ArticleAnalysis, "summary" | "sentiment_score" | "sentiment_label" | "bias_score" | "bias_label" | "left_percentage" | "center_percentage" | "right_percentage" | "confidence" | "framing_notes" | "loaded_terms" | "disclaimer"> };
