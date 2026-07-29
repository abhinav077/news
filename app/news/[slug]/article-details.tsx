"use client";

import { useRef } from "react";
import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const image = "https://picsum.photos/seed/diplomatic-talks/1920/1080";
const related = [
  ["Iran says it will not negotiate under pressure", "World · Middle East", "May 29, 2026 · 8 min read", "iran-flag"],
  ["Bipartisan group urges diplomacy with Iran", "Politics · United States", "May 26, 2026 · 5 min read", "capitol"],
  ["US sanctions more Iranian entities over nuclear program", "Politics · United States", "May 28, 2026 · 6 min read", "white-house"],
  ["What’s in the 2025 Iran nuclear deal?", "Science · Nuclear policy", "May 25, 2026 · 10 min read", "nuclear"],
] as const;
const sources = [["Fox News", "Right"], ["The Wall Street Journal", "Center"], ["Reuters", "Center"], ["BBC", "Center"], ["CNN", "Left"], ["The New York Times", "Center"], ["The Washington Post", "Center"], ["Newsmax", "Right"]] as const;

function Mark() { return <span className="mark" aria-label="Newws"><b>newws</b><i /></span>; }
function Arrow() { return <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M3 10h13m-4-4 4 4-4 4" /></svg>; }
function Icon({ name }: { name: "bookmark" | "share" | "more" | "arrow" }) { const paths = { bookmark: <path d="M6 4v16l6-4 6 4V4z" />, share: <><circle cx="6" cy="12" r="2" /><circle cx="17" cy="6" r="2" /><circle cx="17" cy="18" r="2" /><path d="m8 11 7-4m-7 6 7 4" /></>, more: <><circle cx="5" cy="10" r="1" fill="currentColor" /><circle cx="10" cy="10" r="1" fill="currentColor" /><circle cx="15" cy="10" r="1" fill="currentColor" /></>, arrow: <path d="M3 10h13m-4-4 4 4-4 4" /> }; return <svg aria-hidden="true" viewBox="0 0 20 20">{paths[name]}</svg>; }
function Meter() { return <div className="detail-meter"><span className="detail-left">Left 20%</span><span className="detail-center">Center 31%</span><span className="detail-right">Right 49%</span></div>; }

export default function ArticleDetails() {
  const page = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const media = gsap.matchMedia();
    media.add("(min-width: 1024px)", () => {
      ScrollTrigger.create({ trigger: ".detail-main", start: "top 104px", end: "bottom bottom", pin: ".analysis-rail", pinSpacing: false });
      gsap.fromTo(".analysis-statement", { opacity: 0.14 }, { opacity: 1, ease: "none", scrollTrigger: { trigger: ".analysis-statement", start: "top 88%", end: "bottom 55%", scrub: true } });
    });
    return () => media.revert();
  }, { scope: page });

  return <main ref={page} className="detail-page">
    <div className="detail-ambient" aria-hidden="true" />
    <header className="detail-header"><div className="detail-topline"><span>Wednesday · May 31, 2026</span><span>Newws · International edition</span></div><nav className="detail-nav" aria-label="Main navigation"><Mark /><div><Link href="/">Today</Link><Link href="/#perspectives">Perspectives</Link><Link href="/#brief">The brief</Link></div><Show when="signed-out"><Link className="detail-subscribe" href="/sign-in">Sign in</Link></Show><Show when="signed-in"><UserButton /></Show></nav></header>
    <section className="article-hero"><div className="article-heading"><Link className="back-link" href="/">← Back to today</Link><p className="eyebrow">Politics · United States</p><h1>Trump Sends Iran Revised Peace Proposal With <span className="headline-capsule" style={{ backgroundImage: `url(${image})` }} aria-hidden="true" /> Tougher Terms: Report</h1><div className="byline"><span>By David Morgan</span><i /> <span>May 31, 2026</span><i /> <span>12 min read</span></div><div className="article-tools"><button>Save <Icon name="bookmark" /></button><button>Share <Icon name="share" /></button><button aria-label="More article options"><Icon name="more" /></button></div></div><figure className="article-hero-image"><div style={{ backgroundImage: `url(${image})` }} /><figcaption>President Trump in the Cabinet Room at the White House, Washington, D.C., May 30, 2026.</figcaption></figure></section>
    <section className="distribution"><div><p>AI-estimated bias distribution</p><strong>12 balanced sources</strong></div><Meter /></section>
    <div className="detail-main"><article className="article-copy"><p>The Trump administration has sent Iran a revised nuclear deal proposal that includes tougher terms on uranium enrichment and stronger verification measures, according to a report published Saturday.</p><p>The new proposal, delivered through intermediaries in Oman, requires Iran to halt all uranium enrichment on its soil and ship its stockpile of enriched uranium out of the country. It also demands unrestricted access for international inspectors to all Iranian nuclear facilities, including military sites.</p><p>“This is a take-it-or-leave-it proposal,” a senior administration official told the Wall Street Journal. “The President wants a deal, but he will not accept a weak agreement that puts America or our allies at risk.”</p><p>Iran has not yet officially responded to the proposal. However, Iranian Foreign Minister Hossein Amir-Abdollahian said last week that any deal must respect Iran&apos;s right to peaceful nuclear energy and include the lifting of all U.S. sanctions.</p><p>The revised proposal comes after several rounds of indirect talks between U.S. and Iranian officials failed to produce a breakthrough. The Trump administration has warned that if diplomacy fails, it is prepared to take other action to prevent Iran from obtaining a nuclear weapon.</p><p>European allies have urged both sides to continue negotiations. “We believe diplomacy is still the best path forward,” said a spokesperson for the EU&apos;s foreign policy chief.</p><p>Israel, which has long opposed the 2015 nuclear deal with Iran, praised the Trump administration&apos;s tougher stance. The fate of the proposal now rests with Iran, as global attention remains focused on whether a new nuclear agreement can be reached.</p></article><aside className="analysis-rail"><section className="analysis-card"><p className="eyebrow">Bias analysis</p><h2>Right 49%</h2><span>AI-estimated framing · 12 sources</span><div className="analysis-bars"><p><b>Left</b><i><em style={{ width: "20%" }} /></i><strong>20%</strong></p><p><b>Center</b><i><em style={{ width: "31%" }} /></i><strong>31%</strong></p><p><b>Right</b><i><em style={{ width: "49%" }} /></i><strong>49%</strong></p></div><p className="analysis-statement">Our analysis reflects political framing in the coverage, not an objective truth. Source reliability and language choices are weighed together.</p></section><section className="analysis-card summary-card"><p className="eyebrow">AI summary</p><ul><li>The proposal calls for a complete halt to uranium enrichment and enhanced verification.</li><li>It also seeks unrestricted access to nuclear and military facilities.</li><li>Iran has not responded officially, while insisting on peaceful nuclear rights.</li><li>European allies continue to urge diplomacy as the preferred path.</li></ul><small>AI summaries can make mistakes.</small></section><section className="analysis-card source-card"><p className="eyebrow">Source breakdown</p><h3>12 total sources</h3><div className="source-meter"><span>Left 2</span><span>Center 4</span><span>Right 6</span></div>{sources.map(([source, bias]) => <p className="source-row" key={source}><span>{source}</span><b className={bias.toLowerCase()}>{bias}</b></p>)}<button className="all-sources">View all sources</button></section></aside></div>
    <section className="related-section"><div className="related-heading"><p className="eyebrow">Keep reading</p><h2>Related stories</h2></div><div className="related-grid">{related.map(([headline, category, meta, seed]) => <a className="related-card" href="#newsletter" key={headline}><span className="related-image" style={{ backgroundImage: `url(https://picsum.photos/seed/${seed}/800/600)` }} /><p>{category}</p><h3>{headline}</h3><small>{meta}</small></a>)}</div></section>
    <section className="detail-newsletter" id="newsletter"><div><p className="eyebrow">A clearer daily read</p><h2>Stay informed. Stay balanced.</h2><span>Get the top stories and analysis delivered to your inbox.</span></div><form><label className="sr-only" htmlFor="email">Email address</label><input id="email" type="email" placeholder="Your email address" /><button type="button">Subscribe <Arrow /></button></form></section>
    <footer className="detail-footer"><div><Mark /><p>Every story is bigger than one perspective.</p></div><span>© 2026 Newws</span><Link href="/">Back to today</Link></footer>
  </main>;
}
