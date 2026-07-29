"use client";

import { useRef } from "react";
import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Article = { category: string; headline: string; location: string; image: string; left: number; center: number; right: number; };

const stories: Article[] = [
  { category: "Politics", headline: "Diplomats return to the table as talks enter a decisive week", location: "Washington, D.C.", image: "https://picsum.photos/seed/diplomacy/1920/1080", left: 20, center: 31, right: 49 },
  { category: "Climate", headline: "A hotter horizon is reshaping how cities prepare", location: "Global", image: "https://picsum.photos/seed/heatwave/1920/1080", left: 33, center: 34, right: 33 },
  { category: "Science", headline: "A quiet signal from far below the surface", location: "Switzerland", image: "https://picsum.photos/seed/underground-lab/1920/1080", left: 16, center: 62, right: 22 },
  { category: "Economy", headline: "Markets wait for the next turn in the rate cycle", location: "New York", image: "https://picsum.photos/seed/central-bank/1920/1080", left: 30, center: 45, right: 25 },
  { category: "Technology", headline: "The tools changing the shape of everyday work", location: "San Francisco", image: "https://picsum.photos/seed/technology-office/1920/1080", left: 15, center: 40, right: 45 },
  { category: "World", headline: "Inside a city rebuilding its next chapter", location: "Middle East", image: "https://picsum.photos/seed/war-city/1920/1080", left: 22, center: 35, right: 43 },
  { category: "Sport", headline: "A comeback that turned a final on its head", location: "Europe", image: "https://picsum.photos/seed/football-final/1920/1080", left: 10, center: 20, right: 70 },
  { category: "Environment", headline: "Crews hold the line as the landscape burns", location: "Canada", image: "https://picsum.photos/seed/wildfire/1920/1080", left: 27, center: 33, right: 40 },
  { category: "Culture", headline: "The people reimagining a familiar ritual", location: "London", image: "https://picsum.photos/seed/culture/1920/1080", left: 28, center: 44, right: 28 },
];

const topics = ["Global affairs", "Technology", "Climate", "The economy", "Culture"];

function Mark() { return <span className="mark" aria-label="Newws"><b>newws</b><i /></span>; }

function Meter({ story }: { story: Article }) {
  return <div className="meter" aria-label={`AI-estimated framing: left ${story.left} percent, center ${story.center} percent, right ${story.right} percent`}><span className="meter-left" style={{ width: `${story.left}%` }}>L {story.left}</span><span className="meter-center" style={{ width: `${story.center}%` }}>C {story.center}</span><span className="meter-right" style={{ width: `${story.right}%` }}>R {story.right}</span></div>;
}

function Arrow() { return <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M3 10h13m-4-4 4 4-4 4" /></svg>; }

export default function Home() {
  const page = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const media = gsap.matchMedia();
    media.add("(min-width: 768px)", () => {
      const cards = gsap.utils.toArray<HTMLElement>(".feature-card");
      cards.forEach((card) => {
        const photo = card.querySelector<HTMLElement>(".card-photo");
        if (!photo) return;
        gsap.fromTo(photo, { scale: 0.88, opacity: 0.35 }, { scale: 1, opacity: 1, ease: "none", scrollTrigger: { trigger: card, start: "top 92%", end: "bottom 25%", scrub: true } });
      });
      gsap.fromTo(".closing-card", { y: 66, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: ".closing-stack", start: "top 78%", once: true } });
    });
    return () => media.revert();
  }, { scope: page });

  const lead = stories[0];
  return <main ref={page} className="premium-page">
    <div className="ambient" aria-hidden="true" />
    <header className="site-header"><div className="editorial-line"><span>Wednesday · July 30, 2026</span><span>Independent perspectives, in context</span><span>International edition</span></div><nav className="floating-nav" aria-label="Main navigation"><Mark /><div className="nav-links"><a href="#stories">Today</a><a href="#perspectives">Perspectives</a><a href="#brief">The brief</a></div><div className="nav-actions"><button className="edition-button">EN <span>⌄</span></button><Show when="signed-out"><Link className="nav-subscribe" href="/sign-in">Sign in</Link><Link className="nav-subscribe" href="/sign-up">Sign up <Arrow /></Link></Show><Show when="signed-in"><UserButton /></Show></div></nav></header>

    <section className="hero" aria-labelledby="hero-title"><div className="hero-copy"><p className="eyebrow">The world, without the echo</p><h1 id="hero-title">See the story <span className="inline-image" style={{ backgroundImage: `url(${lead.image})` }} aria-hidden="true" /> from every side.</h1><div className="hero-details"><span>{lead.category} · {lead.location}</span><Meter story={lead} /></div><Link className="text-link" href="/news/iran-peace-proposal">Read the story <Arrow /></Link></div><div className="hero-image-wrap" aria-hidden="true"><div className="hero-image" style={{ backgroundImage: `url(${lead.image})` }} /><span className="hero-index">01 / 09</span></div></section>

    <section className="topic-section" aria-label="Explore topics"><p>Explore the current conversation</p><div className="topic-accordion">{topics.map((topic, index) => <button className="topic-slice" key={topic}><span>0{index + 1}</span><b>{topic}</b><em>{index === 0 ? "The stories moving fastest today" : "Open the perspective"}</em><Arrow /></button>)}</div></section>

    <section id="stories" className="stories-section" aria-labelledby="stories-title"><div className="section-heading"><div><p className="eyebrow">Editor&apos;s field notes</p><h2 id="stories-title">The stories shaping today.</h2></div><a className="text-link" href="#brief">View all stories <Arrow /></a></div><div className="feature-grid">{stories.slice(1, 9).map((story, index) => <article className={`feature-card feature-${index + 1} ${index > 4 ? "closing-card" : ""}`} key={story.headline}><div className="card-photo" style={{ backgroundImage: `url(${story.image})` }} aria-hidden="true" /><div className="card-shade" /><div className="card-content"><p>{story.category} <span>·</span> {story.location}</p><h3>{story.headline}</h3><div className="card-bottom"><Meter story={story} /><span>Read <Arrow /></span></div></div></article>)}</div></section>

    <section className="signals" id="perspectives" aria-label="Source signals"><div className="signal-track"><span>On the record</span><i>•</i><span>Independent reporting</span><i>•</i><span>Across the spectrum</span><i>•</i><span>Context over outrage</span><i>•</i><span>On the record</span><i>•</i><span>Independent reporting</span><i>•</i></div></section>

    <section className="closing-stack" aria-label="More perspectives"><article className="closing-card closing-copy"><p className="eyebrow">The daily brief</p><h2>Stay curious.<br />Stay in context.</h2><p>Five nuanced stories, delivered each morning.</p><a href="#brief" className="light-button">Get the brief <Arrow /></a></article><article className="closing-card closing-image" style={{ backgroundImage: `url(${stories[6].image})` }} aria-hidden="true" /><article className="closing-card closing-dark"><p>One view is never the full picture.</p><a className="text-link light-link" href="#stories">Explore the archive <Arrow /></a></article></section>

    <section id="brief" className="action-band"><p className="eyebrow">A better news habit starts here</p><h2>Your daily view of the whole story.</h2><div><a className="action-primary" href="#stories">Get the brief <Arrow /></a><a className="action-secondary" href="#stories">Explore the archive</a></div></section>

    <footer><div className="footer-top"><Mark /><p>Newws brings competing perspectives into one clear, calm reading experience.</p><div><a href="#stories">Instagram</a><a href="#stories">LinkedIn</a><a href="#stories">X</a></div></div><div className="footer-bottom"><span>© 2026 Newws</span><span>Made for readers who want more context.</span><a href="#stories">Privacy</a></div></footer>
  </main>;
}
