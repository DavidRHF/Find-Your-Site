# Find-Your-Site — Games & Spinner (drop-in files)

Everything goes in the **root** of your repo (same folder as index.html).

## leads-game.html  → replace the existing one
The fishing game, in a 900x900 scene (boat, fisherman, island, bottle).
- Press **Cast** to drop the line; the button becomes **Reel**.
- **Hold Reel** (or the spacebar) to raise the line; release to let it sink.
- The line only moves up/down. Hook a fish 🐟 to land a lead; hitting garbage
  (🥤 🛍️ 🥫) fails the cast.
- 3 fish (slow) and 3 garbage (faster) drift randomly underwater.
- 15 seconds per cast, 5 casts total, scored out of 5.
- No replay without a page refresh (switching tabs does NOT restart it).

## discount-spinner.html  → replace the existing one
- Every spin now generates a **fresh random code** (letters + numbers, e.g.
  K7MQ-P9X4), so codes can't be reused.
- **One spin per page load** — the button locks after spinning; only a real
  page refresh unlocks it (switching tabs does NOT reset it).
- Spins fast and slows to a natural stop on the prize.
- To change prizes/odds, edit the `SEGMENTS` list at the top of the <script>.

## inquiry-discount.js  → NEW file, add it
Add this file, then add ONE line to custom-inquiry.html before </body>:

    <script src="inquiry-discount.js" defer></script>

When someone clicks "Claim it" after a spin, this shows a banner on the inquiry
page and attaches the (random) code to your form so it arrives with the message.

## Good to know
- Static site, so discounts are honor-system: the code reaches you with the
  inquiry and you apply it when you reply.
- All pages share the warm teal + amber look. To match a different brand, edit
  the `:root` color variables at the top of each HTML file.
