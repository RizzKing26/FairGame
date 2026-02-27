# FairGame

A beginner-friendly static website that helps users check hunting season status by either animal or location.

## What is built

- Multi-page flow using plain HTML/CSS/JavaScript:
  - `index.html` (homepage)
  - `choose.html` (selection steps)
  - `season.html` (season status result)
- Modern-rustic visual style inspired by your mockup.
- Scrolling animal cards on homepage (pause on hover + card pop effect).
- Top state chips (Texas, Colorado, Wyoming) plus a `+` option for all U.S. states.
- Demo season logic with simple status output:
  - `In Season — X days left`
  - `Out of Season — opens in Y days`

## Run locally

1. Open a terminal in the project folder.
2. Start a static server:
   ```bash
   python3 -m http.server 4173
   ```
3. Open your browser to:
   `http://localhost:4173/index.html`

## Baby-step edits you can make

1. Open `js/data.js`.
2. Update `animals` to change which animals appear.
3. Update `featuredStates` to change the top 3 state chips.
4. Update `defaultWindows` to adjust demo season windows.
5. Refresh browser to see your changes.
