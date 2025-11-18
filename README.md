# Reddit Helper Script (Read-Only Reddit Data API Bot)

This is a small, transparent, read-only script that helps me discover Reddit posts
where I may personally provide useful, human-written responses.

The script **does not interact with Reddit**, does **not automate posting**, and does **not**
vote, comment, message, or scrape Reddit.  
It only reads a limited number of recent posts from a few public subreddits and sends
an email alert to me if certain keywords are found.

This helps ensure that users asking about:
- local pickleball questions (courts, where to play, beginner help)
- local housing/relocation questions (neighborhoods, rent, questions about moving)

receive fast, accurate, human replies.

---

## 🔒 API Responsible Use

This script fully complies with Reddit’s Responsible Builder Policy:

- ✔ Read-only  
- ✔ No posting, replying, messaging, or automation  
- ✔ No voting or engagement automation  
- ✔ Low-frequency usage (1–2 runs per hour)  
- ✔ Only uses permitted Reddit API endpoints  
- ✔ Transparent source code  
- ✔ Single end-user (me only)  
- ✔ All replies are written manually by me; never generated or automated  

---

## 📁 Subreddits Monitored

- r/irvine  
- r/orangecounty  
- r/pickleball  
- r/RealEstate  
- r/RealEstateInvesting  
- r/sandiego  
- r/temecula  
- r/murrieta  

The script only reads the newest ~25 posts in each.

---

## ⚙ How it Works

1. The script calls the public Reddit API endpoint:  
   `https://www.reddit.com/r/{subreddit}/new.json?limit=25`

2. It checks each post for keywords (pickleball, paddles, courts, moving to Irvine, etc.)

3. If a post matches, it sends **a private email alert to me only**.

4. I read the alert and **manually** decide whether to respond to the Redditor.

5. The script stores post IDs in a small file (`seen-reddit-posts.json`) so it never
   processes the same post twice.

---

## 📦 Local Setup

Install dependencies:

```bash
npm install
