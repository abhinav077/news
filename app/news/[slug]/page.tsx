import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ArticleDetails from "./article-details";

export const metadata: Metadata = {
  title: "Iran peace proposal — Newws",
  description: "A multi-perspective article analysis from Newws.",
};

export default async function NewsDetailsPage({ params }: PageProps<"/news/[slug]">) {
  const { slug } = await params;

  if (slug !== "iran-peace-proposal") notFound();

  return <ArticleDetails />;
}
