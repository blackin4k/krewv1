🧭 GLOBAL NAV STRUCTURE

Bottom Tab Bar (5 tabs):

Home

Search

Library

Activity

Profile

Mini Player sits above tab bar when playing.

Expanded Player slides from bottom.

🏠 1️⃣ HOME PAGE
📍 Location

Tab 1 (default landing page)

🎯 Purpose

Daily habit engine.

🧱 Layout (Top → Bottom)
1. Header

Greeting (“Good Evening, Amaan”)

Profile avatar (top right)

Subtle gradient header background

2. Today’s Vibe Card (Krew Original)

Large card.
Shows:

Mood insight

Minutes today

Listening streak

Example:
🔥 5 Day Streak
🎧 43 Minutes Today
“Late Night Energy”

3. Jump Back In

Horizontal scroll.
Recently played albums/playlists.

4. Made For You

Algorithm mixes.
Generated playlists.

5. This Week So Far

Small stat preview:

Top artist

Top song

Total minutes

Clickable → Activity tab.

6. Trending in Krew

Top played songs across users (last 7 days).

🔧 Backend Needed
/home

Returns:

recent songs

personalized mix

weekly highlight

trending songs

/stats/today

minutes today

current streak

vibe classification

🔎 2️⃣ SEARCH PAGE
📍 Location

Tab 2

🎯 Purpose

Discovery.

Layout
Top

Large search bar.

Default State

Genre grid

Mood tiles

Trending searches

Search Result State

Tabs:

Songs

Artists

Albums

Playlists

List results with play count.

🔧 Backend

You have /search.

Upgrade:

Add play_count sorting

Add popularity score

Optional:

/trending/searches

📚 3️⃣ LIBRARY PAGE
📍 Location

Tab 3

🎯 Purpose

Ownership & control.

Layout

Top:

Filter chips:

Playlists

Artists

Albums

Songs

Downloaded

Main:
List/grid toggle.

Liked Songs Section

Must exist.
Feels essential.

🔧 Backend

Need:

/me/liked

POST /songs/:id/like

DELETE /songs/:id/like

You already have Like model.

🎵 4️⃣ MINI PLAYER

Persistent bottom bar.

Layout:

Artwork

Title

Artist

Play/Pause

Tap → Expand.

Swipe down on expanded → collapse.

No backend change.

🎛 5️⃣ EXPANDED PLAYER

Slides from bottom.

Layout
Top Bar

Down chevron

“Playing from…”

Lyrics icon

Share icon

More icon

Artwork Section

Large centered.
Diffused glow.

Song Info

Title (bold)
Artist (muted)

Progress Bar

Time left / right.

Controls Row

Shuffle
Back
Play
Forward
Repeat

Secondary Row

Queue
Add to playlist
Device (future)

🔧 Backend

You already have:

Queue

Shuffle

Repeat

Play logging

Add:

/player/queue

/player/reorder

🎤 6️⃣ LYRICS VIEW

Slides over player.

Full screen overlay.
Blur background.

Large scrollable lyrics.
Highlight active line (future).

🔧 Backend

Ensure:
GET /songs/:id/lyrics

📋 7️⃣ QUEUE PAGE

Accessed from player.

List:

Now playing

Up next

Drag reorder

🔧 Backend

Add:
POST /player/reorder

📊 8️⃣ ACTIVITY PAGE (KREW DIFFERENTIATOR)
📍 Location

Tab 4

🎯 Purpose

Identity + retention.

Layout
1. Weekly Summary Card

Minutes listened

Top artist

Top song

2. Listening Heatmap

Grid:
Days × hours.

3. Most Played This Week

Top 5 songs.

4. Mood Breakdown

Pie or bar chart by genre.

5. Streak Tracker

🔥 8 Day Streak

6. Share Card Button

Generates shareable stat image.

🔧 Backend

Critical endpoints:

/stats/weekly

total minutes

top songs

top artist

top genre

/stats/streak

consecutive listening days

/stats/heatmap

grouped by hour/day

You already log plays.
You just need aggregation logic.

👤 9️⃣ PROFILE PAGE
📍 Location

Tab 5

Layout

Top:

Avatar

Username

Bio (optional)

Stats:

Lifetime minutes

Top artist (all time)

Total songs played

Streak record

Public:

Playlists

Recently played (optional)

🔧 Backend

Add:
/me/stats/lifetime

Return:

total_minutes

top_artist

total_plays

🔗 1️⃣0️⃣ DEEP LINK PAGES

/song/:id

/playlist/:id

/artist/:id

Landing page:

OG tags

Open in app button

You mostly have this.