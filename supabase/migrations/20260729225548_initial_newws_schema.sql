-- Kept in sync with ../schema.sql. Generated migration filename via Supabase CLI.
create table if not exists public.sources (
  id uuid primary key default gen_random_uuid(), name text not null unique, listing_url text not null unique, parser_strategy text, logo_url text, is_active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), constraint sources_listing_url_is_http check (listing_url ~ '^https?://')
);
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(), source_id uuid not null references public.sources(id) on delete restrict, original_url text not null unique, canonical_url text unique, slug text not null unique, title text not null, image_url text not null, published_at timestamptz not null, raw_text text not null, scraped_at timestamptz not null default now(), analyzed_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), constraint articles_original_url_is_http check (original_url ~ '^https?://'), constraint articles_canonical_url_is_http check (canonical_url is null or canonical_url ~ '^https?://'), constraint articles_image_url_is_http check (image_url ~ '^https?://'), constraint articles_raw_text_not_blank check (length(btrim(raw_text)) > 0)
);
create table if not exists public.article_analyses (
  id uuid primary key default gen_random_uuid(), article_id uuid not null unique references public.articles(id) on delete restrict, summary text not null, sentiment_score numeric(4,3) not null check (sentiment_score between -1 and 1), sentiment_label text not null check (sentiment_label in ('positive', 'neutral', 'negative')), bias_score numeric(4,3) generated always as ((right_percentage - left_percentage) / 100.0) stored, bias_label text not null check (bias_label in ('left', 'center', 'right', 'mixed', 'unclear')), left_percentage integer not null check (left_percentage between 0 and 100), center_percentage integer not null check (center_percentage between 0 and 100), right_percentage integer not null check (right_percentage between 0 and 100), confidence numeric(4,3) not null check (confidence between 0 and 1), framing_notes text not null, loaded_terms text[] not null default '{}', disclaimer text not null, model text not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), constraint article_analyses_percentages_total check (left_percentage + center_percentage + right_percentage = 100)
);
create table if not exists public.logs (id uuid primary key default gen_random_uuid(), level text not null check (level in ('debug', 'info', 'warn', 'error')), event text not null, message text not null, source_id uuid references public.sources(id) on delete set null, article_id uuid references public.articles(id) on delete set null, run_id uuid, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now());
create table if not exists public.oxylabs_schedules (id uuid primary key default gen_random_uuid(), source_id uuid not null unique references public.sources(id) on delete restrict, schedule_id text not null unique, is_active boolean not null default true, schedule_config jsonb not null default '{}'::jsonb, provider_metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), constraint oxylabs_schedules_schedule_id_digits check (schedule_id ~ '^[0-9]+$'));
create table if not exists public.oxylabs_schedule_runs (id uuid primary key default gen_random_uuid(), schedule_id uuid not null references public.oxylabs_schedules(id) on delete cascade, provider_run_id text not null, provider_job_id text, status text not null check (status in ('pending', 'running', 'done', 'faulted', 'processed', 'failed')), result_status text, provider_payload jsonb not null default '{}'::jsonb, error_message text, started_at timestamptz, completed_at timestamptz, processed_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), constraint oxylabs_schedule_runs_provider_run_id_digits check (provider_run_id ~ '^[0-9]+$'), constraint oxylabs_schedule_runs_provider_job_id_digits check (provider_job_id is null or provider_job_id ~ '^[0-9]+$'), constraint oxylabs_schedule_runs_schedule_provider_run_unique unique (schedule_id, provider_run_id));
create index if not exists sources_active_idx on public.sources (name) where is_active;
create index if not exists articles_source_id_idx on public.articles (source_id);
create index if not exists articles_published_at_idx on public.articles (published_at desc);
create index if not exists articles_pending_analysis_idx on public.articles (scraped_at asc) where analyzed_at is null;
create index if not exists article_analyses_article_id_idx on public.article_analyses (article_id);
create index if not exists logs_created_at_idx on public.logs (created_at desc);
create index if not exists logs_source_id_idx on public.logs (source_id);
create index if not exists logs_article_id_idx on public.logs (article_id);
create index if not exists oxylabs_schedules_source_id_idx on public.oxylabs_schedules (source_id);
create index if not exists oxylabs_schedule_runs_schedule_created_idx on public.oxylabs_schedule_runs (schedule_id, created_at desc);
create index if not exists oxylabs_schedule_runs_job_id_idx on public.oxylabs_schedule_runs (provider_job_id);
alter table public.sources enable row level security;
alter table public.articles enable row level security;
alter table public.article_analyses enable row level security;
alter table public.logs enable row level security;
alter table public.oxylabs_schedules enable row level security;
alter table public.oxylabs_schedule_runs enable row level security;
revoke all on table public.sources, public.articles, public.article_analyses, public.logs, public.oxylabs_schedules, public.oxylabs_schedule_runs from anon, authenticated;
