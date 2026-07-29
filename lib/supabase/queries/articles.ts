import "server-only";
import { getSupabaseServerClient } from "../server";
import type { Article, ArticleAnalysis, PublicArticleDetailDto, PublicArticleDto } from "../types";
import { requireData } from "./shared";

const URL_CHECK_CHUNK_SIZE = 15;
export async function findExistingArticleUrls(urls: string[]): Promise<Set<string>> {
  const found = new Set<string>(); const client = getSupabaseServerClient();
  for (let start = 0; start < urls.length; start += URL_CHECK_CHUNK_SIZE) {
    const chunk = urls.slice(start, start + URL_CHECK_CHUNK_SIZE);
    const [original, canonical] = await Promise.all([client.from("articles").select("original_url").in("original_url", chunk), client.from("articles").select("canonical_url").in("canonical_url", chunk)]);
    const originalRows = requireData(original.data, original.error); const canonicalRows = requireData(canonical.data, canonical.error);
    originalRows.forEach((row) => found.add(row.original_url)); canonicalRows.forEach((row) => { if (row.canonical_url) found.add(row.canonical_url); });
  } return found;
}
export async function insertArticle(article: Omit<Article, "id" | "analyzed_at" | "created_at" | "updated_at">): Promise<{ article: Article | null; duplicate: boolean }> {
  const { data, error } = await getSupabaseServerClient().from("articles").insert(article).select("*").maybeSingle();
  if (error?.code === "23505") return { article: null, duplicate: true };
  return { article: requireData(data, error), duplicate: false };
}
export async function listPendingAnalysisArticles(limit?: number): Promise<Article[]> {
  const client = getSupabaseServerClient(); const [articles, analyses] = await Promise.all([client.from("articles").select("*").order("scraped_at"), client.from("article_analyses").select("article_id")]);
  const rows = requireData(articles.data, articles.error); const existing = new Set(requireData(analyses.data, analyses.error).map((analysis) => analysis.article_id));
  const pending = rows.filter((article) => !existing.has(article.id)); return limit ? pending.slice(0, limit) : pending;
}
export async function saveAnalysisAndMarkArticle(articleId: string, analysis: Omit<ArticleAnalysis, "id" | "article_id" | "bias_score" | "created_at" | "updated_at">): Promise<ArticleAnalysis> {
  const client = getSupabaseServerClient(); const { data, error } = await client.from("article_analyses").upsert({ article_id: articleId, ...analysis }, { onConflict: "article_id" }).select("*").single();
  const saved = requireData(data, error); const updated = await client.from("articles").update({ analyzed_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", articleId);
  if (updated.error) throw new Error(updated.error.message); return saved;
}
export async function listPublicArticles(limit = 24): Promise<PublicArticleDto[]> {
  const client = getSupabaseServerClient(); const { data, error } = await client.from("articles").select("*").not("analyzed_at", "is", null).order("published_at", { ascending: false }).limit(limit); const articles = requireData(data, error); return hydratePublicArticles(articles);
}
export async function getPublicArticleBySlug(slug: string): Promise<PublicArticleDetailDto | null> {
  const { data, error } = await getSupabaseServerClient().from("articles").select("*").eq("slug", slug).maybeSingle(); const article = requireData(data, error); if (!article) return null;
  const entries = await hydratePublicArticles([article]); const dto = entries[0]; if (!dto) return null;
  const { data: analysis, error: analysisError } = await getSupabaseServerClient().from("article_analyses").select("*").eq("article_id", article.id).maybeSingle(); const full = requireData(analysis, analysisError); if (!full) return null;
  return { ...dto, original_url: article.original_url, canonical_url: article.canonical_url, raw_text: article.raw_text, analysis: { summary: full.summary, sentiment_score: full.sentiment_score, sentiment_label: full.sentiment_label, bias_score: full.bias_score, bias_label: full.bias_label, left_percentage: full.left_percentage, center_percentage: full.center_percentage, right_percentage: full.right_percentage, confidence: full.confidence, framing_notes: full.framing_notes, loaded_terms: full.loaded_terms, disclaimer: full.disclaimer } };
}
async function hydratePublicArticles(articles: Article[]): Promise<PublicArticleDto[]> {
  if (!articles.length) return []; const client = getSupabaseServerClient(); const ids = articles.map((article) => article.id); const sourceIds = [...new Set(articles.map((article) => article.source_id))];
  const [sourcesResult, analysesResult] = await Promise.all([client.from("sources").select("id,name,logo_url").in("id", sourceIds), client.from("article_analyses").select("*").in("article_id", ids)]);
  const sources = requireData(sourcesResult.data, sourcesResult.error); const analyses = requireData(analysesResult.data, analysesResult.error); const sourceById = new Map(sources.map((source) => [source.id, source])); const analysisByArticleId = new Map(analyses.map((analysis) => [analysis.article_id, analysis]));
  return articles.flatMap((article) => { const source = sourceById.get(article.source_id); const analysis = analysisByArticleId.get(article.id); return source && analysis ? [{ id: article.id, slug: article.slug, title: article.title, image_url: article.image_url, published_at: article.published_at, source: { id: source.id, name: source.name, logo_url: source.logo_url }, analysis: { sentiment_label: analysis.sentiment_label, bias_label: analysis.bias_label, left_percentage: analysis.left_percentage, center_percentage: analysis.center_percentage, right_percentage: analysis.right_percentage, confidence: analysis.confidence } }] : []; });
}
