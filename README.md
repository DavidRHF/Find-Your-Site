# Find-Your-Site — Games & Spinner (drop-in files)

Everything goes in the **root** of your repo (same folder as index.html).

## leads-game.html  → replace the existing one
Fishing game in a compact scene sized to fit on screen with its button.
- Hand-drawn SVG boat, an older angler in a bucket hat slouched on a chair with
  his rod running to the reel, and a corked message-in-a-bottle.
- **Cast** drops the line; the button becomes **Reel**. Hold Reel (or spacebar)
  to raise the line; release to sink it. Line only moves vertically.
- Hook a fish 🐟 = a lead; touching garbage (🥤🛍️🥫) fails the cast.
- 3 slow fish, 3 faster garbage. 15 sec per cast, 5 casts, scored out of 5.
- Big countdown sits ABOVE the sidebar. Time out = failed cast.
- No replay without a page refresh (tab-switching does NOT restart it).

## discount-spinner.html  → replace the existing one
- Fresh RANDOM code every spin (letters+numbers, e.g. K7MQ-P9X4).
- One spin per page load; only a refresh unlocks it (tab-switch won't reset).

## inquiry-discount.js  → NEW file + ONE line on custom-inquiry.html
Add this file, then add before </body> of custom-inquiry.html:

    <script src="inquiry-discount.js" defer></script>

It shows the won discount in a banner AND inside your form, and attaches the code
to the submission. TEST with:
    custom-inquiry.html?discount=TEST-1234&reward=10%25%20Off
If nothing shows, the <script> line above isn't on the page (or the path is wrong).

## Note
Static site = honor-system discounts: the code reaches you with the inquiry and
you apply it. Edit the `:root` colors at the top of each HTML file to rebrand.
