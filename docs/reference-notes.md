# Reference notes (layout study)

Observed on 2026-10-11 at 1280px and 360px. These notes describe **structure, proportions and
interaction patterns only**, written in our own words. No text, images, icons, fonts, CSS or markup
from the reference are reused. Coddify uses its own palette (teal), mascot (robot), icons and copy.

## Global

- **Navbar** (~58px tall, white/surface, 1px bottom border, sticky). Left: wordmark logo.
  Next to it four outlined "pill-ish" dropdown triggers (label + chevron, ~36px tall, 10px radius).
  Right: one solid primary CTA (uppercase, compact), a square icon button for theme, a language select.
  - Languages dropdown: wide panel (~780px), 6-column grid of small language tiles
    (icon top-left, name centered underneath), footer strip in primary color with a "see all" line.
  - Resources dropdown: 2-column list, each row = tinted square icon + bold title + 2-line muted description.
  - Mobile (<768px): logo + hamburger square button only; drawer holds everything.
- **Typography**: very large display headings (H1 ~46px hero, section H2 ~56px desktop), body ~20px
  in feature sections, muted secondary color. Generous whitespace (sections ~600px tall at desktop).
- **Buttons**: solid fill, bold uppercase label, darker bottom "lip" (~4px) that disappears on press.
  Secondary = white with grey border and the same bottom lip.
- **Section rhythm**: alternating plain background and a pale tinted band. Feature sections are 2-column
  (copy one side, mock UI card other side) and alternate sides (zig-zag). Content max ~1080–1120px.
- **Mock UI cards**: dark rounded (~24px) "app window" cards with a header bar (pill title chip on the
  left, small action chip on the right), soft large drop shadow.

## Landing page — section order

1. **Hero** (centered, ~840px tall): H1, one-line social-proof subline with a bold number, wide primary
   CTA (~350×52), "already have an account? Log in" text link, small rating line. Mascot peeks over the
   top edge of a large illustration (a dotted globe). Bottom-left floating pill: green "LIVE" dot + count.
   A full-width dark band at the bottom of the hero holds the **language marquee** (white rounded chips
   with icon + name, scrolling horizontally, edge fade).
2. **Roadmaps / "learn for a job"**: left copy + a row of small tab pills (one per career path,
   active = filled). Right: dark card with a numbered step path (icon tiles connected by dotted lines,
   snake layout 3→3→2, final tile = certificate) and a "see the roadmap" button in the header.
3. **Catalog banner**: full-width light rounded box: title + one-line description left, primary button right.
4. **Certificate** (tinted band): stacked paper certificate mock (cream card, corner brackets, name,
   course chip, date, share button) left; heading + paragraph right.
5. **Learn by doing**: copy + tab pills (Code / SQL / Web / AI chat / Terminal) left. Right: dark editor
   card: file chip, line-numbered code, two action buttons (ask AI, run), then a "Test cases | Console"
   tab bar, left list Test #1 ✓, #2 ✓, #3 ✗, right input/output panes.
6. **Streak** (tinted band): calendar card (title "N days streak", flame icon, month grid of circles:
   filled warm = done days, blue = frozen day, outlined = today, faded = future), two small cards
   under it (a challenge with progress, a "freeze" with "N left" chip). Copy on the right.
7. **Code anywhere**: copy + two store buttons left; phone mock with a vertical lesson path and a
   floating rating card on the right.
8. **Not alone / leagues** (tinted band): league card (shield badge, league name, "top N advance"),
   ranked rows (rank medal, avatar with streak badge, name, "7+ days", XP right-aligned), current user
   row highlighted with primary border, "promotion zone" marker with up-arrows. Copy right.
9. **Every way to learn**: tab pills (Audio / Quiz / Ask AI / References) + dark lesson-reader card
   with highlighted current paragraph and audio controls.
10. **FAQ**: centered H2, 6 full-width (~800px) bordered rows (~58px), chevron right, one open at a time.
11. **Final CTA**: big centered heading, secondary (outlined) CTA, then a wave-shaped colored band with
    the mascot celebrating surrounded by floating reward items (chest, gems, flame, check badge).
12. **Footer** (pale grey): logo + social icon row + store buttons left; link columns right; a large
    sitemap grid of link columns below a divider.

Mobile (360px): everything single column, hero H1 wraps to two lines, CTA full width, marquee chips
smaller; zig-zag sections stack (copy first, mock second).

## Auth (/login)

- Full-bleed primary-gradient background, "Back" link top-left.
- Left: white card (~375px wide, 12px radius): top tab switch **Log in | Register** with underline
  indicator, stacked social buttons (outlined, provider icon in a small box on the left), "OR" divider,
  email input with leading icon, full-width primary "Continue", small legal line with links.
- Right: large white heading (2 lines) + list of 5 benefits, each with a line icon.
- Mobile: card only.

## AI tutor page

- Hero split: eyebrow label in accent color, big heading with the tutor's name, muted 2-line subtitle,
  paragraph, primary CTA + underlined secondary link; large mascot illustration right with soft glow.
- "Live demo": split card — code editor on the left, chat panel on the right (tutor avatar + name
  header, messages that point out the bug without giving the fix).

## Onboarding (/onboard)

- **Intro screen**: blank page, centered big heading, 2-line muted subtitle, one primary button.
- **Step screens** (content column ~680px, centered):
  - Top bar: back (undo-arrow) icon left, progress bar (rounded, ~8px) center, close ✕ right.
  - Mascot (~70px) on the left of the question heading (heading ~30px, display font).
  - Options: **2-column grid of tiles** (~330×64): emoji/icon left, label (+ optional muted sub-label),
    a small keyboard-number badge on the right (press 1..9 to choose). Tiles have the same bottom-lip
    style as buttons; selected tile = primary border + tinted fill.
  - **Sticky bottom bar** (border-top) with a right-aligned CONTINUE button, disabled (pale) until a
    choice is made.
  - Steps observed: language (with "help me choose"), personality/goal, preference, then a
    **result screen**: "perfect match" card (language icon + name, three ✓ benefit rows).
- Transitions: content slides/fades between steps; progress bar animates width.

## What Coddify will deliberately do differently

- Own palette (dark-first, teal primary), own robot mascot (Bit), own inline-SVG icons, own copy.
- Hero uses an **editor mock with test-case pills** instead of a globe illustration.
- No app-store section (we are web-first); replaced by the **AI tutor** section from our spec.
- Auth uses email + password forms (spec) inside the reference's card/tab structure.
- Onboarding steps follow our spec (goal, language, experience, daily target) and run after sign-up.
