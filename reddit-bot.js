/**
 * Reddit Helper Script (Read-Only)
 * --------------------------------
 * This script reads a small number of public subreddit posts using Reddit’s
 * public JSON endpoints. It does NOT authenticate, does NOT use OAuth,
 * does NOT automate actions, and does NOT scrape private data.
 *
 * Purpose: notify the developer (Zack) when posts appear that he may be
 * personally able to answer with a human, non-automated comment.
 */

import fetch from "node-fetch";
import fs from "fs/promises";
import dotenv from "dotenv";
dotenv.config();

const SUBREDDITS = [
  "irvine",
  "orangecounty",
  "sandiego",
  "temecula",
  "RealEstate",
  "RealEstateInvesting",
  "pickleball"
];

// Local file that stores which post IDs we’ve already processed
const SEEN_FILE = "./seen.json";

// Load IDs of posts we’ve already seen
async function loadSeen() {
  try {
    return new Set(JSON.parse(await fs.readFile(SEEN_FILE, "utf8")));
  } catch {
    return new Set();
  }
}

// Save seen post IDs
async function saveSeen(seen) {
  await fs.writeFile(SEEN_FILE, JSON.stringify([...seen], null, 2));
}

// Determine whether we care about a post
function matchesLead(post) {
  const text = (post.title + " " + (post.selftext || "")).toLowerCase();

  const pickleKeywords = [
    "pickleball",
    "court",
    "lessons",
    "paddle"
  ];

  const housingKeywords = [
    "moving to",
    "buying",
    "rent in",
    "neighborhood",
    "property"
  ];

  return (
    pickleKeywords.some((k) => text.includes(k)) ||
    housingKeywords.some((k) => text.includes(k))
  );
}

async function fetchSubreddit(subreddit) {
  const url = `https://www.reddit.com/r/${subreddit}/new.json?limit=20`;

  const res = await fetch(url, {
    headers: { "User-Agent": "read-only-helper-bot/1.0" }
  });

  if (!res.ok) {
    console.error(`Failed to fetch r/${subreddit}:`, res.status);
    return [];
  }

  const json = await res.json();
  return json.data.children.map((c) => c.data);
}

async function main() {
  console.log("Running helper script…");

  const seen = await loadSeen();
  const newLeads = [];

  for (const sub of SUBREDDITS) {
    const posts = await fetchSubreddit(sub);

    for (const p of posts) {
      if (seen.has(p.id)) continue;

      if (matchesLead(p)) {
        newLeads.push({
          subreddit: sub,
          title: p.title,
          url: `https://reddit.com${p.permalink}`
        });
      }

      seen.add(p.id);
    }
  }

  await saveSeen(seen);

  if (newLeads.length === 0) {
    console.log("No new matches.");
    return;
  }

  console.log("New matches found:");
  console.log(newLeads);

  // If desired later: email these results to yourself manually.
}

main();
