# Dino Ventures Assignment Implementation

Yes — this version uses the dataset you provided (`social-media-ai`, `ai-income`, `ai-essentials`) and renders those exact categories/items.

## What was fixed
- Replaced the mock MP4 dataset with your provided YouTube dataset.
- Feed is grouped by dataset categories and uses dataset thumbnails/icons/titles.
- Player now uses YouTube IFrame API with custom controls (play/pause, ±10s, seek, current/total time).
- Related list is filtered by same category.
- Drag-down + back minimize to bottom mini-player, with restore, pause/play, and close.

## Run
```bash
python3 -m http.server 4173
```
Open `http://localhost:4173`.
