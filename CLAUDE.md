# CLAUDE.md — Frontend Website Rules

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Design rules (mandatory before any design work)
Before proposing or building anything visual on a Ghar.tv page, read **every file in [`docs/rules/`](docs/rules/)** in the order specified by [`docs/rules/README.md`](docs/rules/README.md). These are the load-bearing rules accumulated from many design iterations — without them, output reverts to generic AI design. Then read [`design-system.html`](design-system.html) (the catalog) and [`index4.html`](index4.html) (the production reference). For page-specific tasks, also read the matching brief in `docs/` (e.g. [`docs/BRIEF-design-page.md`](docs/BRIEF-design-page.md) for the `/design` redesign). Junior designers using Claude Desktop App should start at [`docs/JUNIOR-HANDOFF.md`](docs/JUNIOR-HANDOFF.md).

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Local Server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server: `node serve.mjs` (serves the project root at `http://localhost:3000`)
- `serve.mjs` lives in the project root. Start it in the background before taking any screenshots.
- If the server is already running, do not start a second instance.

## Browser Inspection Workflow
- **Default to Playwright MCP** (`mcp__playwright__browser_*` tools) for all browser inspection — navigate, hover, evaluate, snapshot, screenshot. Returns images inline (no Read round-trip), supports element-targeted hover/click for interactive states, and lets you inspect computed styles via `browser_evaluate`. Cheaper in tokens than spawning Node scripts.
- Use `browser_navigate` → `browser_evaluate` (scroll into view) → `browser_hover` (if testing hover state) → `browser_take_screenshot` with `target: '#section-id'` for element-bounded shots, or `fullPage: false` for viewport.
- Use `browser_evaluate` to measure positions, computed styles, and DOM state instead of writing diagnostic Node scripts.
- **STRICT — Screenshot output location.** Every screenshot Claude takes (Playwright MCP, Puppeteer fallback, anything else) MUST be written inside `./screenshots/claude-screenshots/`. NEVER write a `.png`/`.jpg`/`.jpeg`/`.webp` to the project root or any other folder. When using `browser_take_screenshot`, always pass `filename: "screenshots/claude-screenshots/<name>.png"`. When reading the PNG back, use the same path. This rule has no exceptions — root must stay free of screenshot crud.
- **Fallback only when MCP is unavailable:** Puppeteer is installed locally (`d:/WORK/ghar-claude/node_modules/puppeteer/`); `node screenshot.mjs http://localhost:3000 [label]` saves to `./screenshots/claude-screenshots/screenshot-N[-label].png`. Read the PNG with the Read tool to view it.
- User-provided reference screenshots go in `./screenshots/` (saved manually as `.png` / `.jpg`).
- The `.gitkeep` files in the screenshot folders are git placeholders — ignore them.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px".
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing.
- The SHELL environment variable is set to `C:\Program Files\Git\usr\bin\bash.exe` in `.claude/settings.json` — required for the Bash tool to work on this Windows machine.

## Output Defaults
- **Split file architecture:** `index.html` (markup), `styles.css` (all CSS), `main.js` (all JS)
- CSS linked in `<head>`, JS loaded with `defer` before `</body>`
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive

## Brand Assets
- Always check the `brand_assets/` folder before designing. It may contain logos, color guides, style guides, or images.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Hard Rules
- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color

---

# Ghar.tv Project Standards

> Single source of truth for all design, development, copy, and architectural standards for the Ghar.tv homepage build. Read this before every session. Follow it without exception.

---

## 1. PROJECT IDENTITY

Ghar.tv is India's Real Estate Discovery, Intelligence, Media and Events Platform.

It is NOT a listing portal. It is an understanding-first platform where people come to discover properties, understand markets, learn through media, connect with professionals, and attend industry events.

**Brand line:** Real Estate. For You.

**Brand tone:** Intelligent, empowering, trustworthy, editorial, premium.

**Core philosophy:** Understanding-first, not transaction-first.

---

## 2. DESIGN SYSTEM

### 2.1 Color System

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#ffffff` | Primary background — WHITE always |
| `--ink` | `#111111` | Primary text, headings, labels |
| `--ink2` | `#374151` | Secondary text / dark grey |
| `--muted` | `#6a6a6a` | Body text, descriptions, secondary copy (Airbnb-matched) |
| `--faint` | `#6a6a6a` | Tertiary text, eyebrow labels, meta text (same as muted — unified) |
| `--rule` | `#e8e8e8` | Borders, dividers, structural lines |
| `--accent` | `#ee324b` | Brand red — STRICTLY limited |

**CRITICAL — Accent Color Discipline:**

- `#ee324b` is the ONLY brand red.
- Red appears on ~5% of any given page view maximum — same discipline as Airbnb's coral.
- Red is ONLY used for: logo/brand identity, primary CTA buttons, active/hover states, action links.
- Red is NEVER used on: eyebrow labels, category tags, date labels, decorative dots, quote marks, borders, list bullets, or any non-interactive element.
- Decorative elements (quote marks, borders, dividers, list dots, label prefixes) use `var(--rule)` `#e8e8e8` or `var(--muted)` `#6a6a6a` — never the red accent.
- Quote `border-left` uses `var(--rule)`.
- Large typographic decorative characters (quotation marks etc.) use `var(--ink)` at 10% opacity maximum.

### 2.2 Typography

| Role | Font | Details |
|------|------|---------|
| Primary (everything) | **Inter** | Body, UI labels, navigation, CTAs, supporting copy |
| Display (sparingly) | **Gazpacho Bold** | Large display headings and hero-scale text ONLY |

**Typography Rules (resolved values):**

- Display headings: Gazpacho Bold, `letter-spacing: -.025em`, `line-height: 1.08`
- Hero H1: `line-height: 1.08`
- Lead/body text: `line-height: 1.8–1.82`
- Body small: `line-height: 1.7`
- Section description text: `line-height: 1.75` minimum
- Eyebrow labels: Inter, `10px`, `font-weight: 600`, `letter-spacing: .1em`, uppercase, `color: var(--faint)` `#6a6a6a` — NEVER red
- Button labels: `font-weight: 600`, `letter-spacing: .01em`

### 2.3 Spacing & Grid

**These rules apply to the entire website — every page, every section, not just the homepage.**

#### CSS Variables (defined in `:root`)

| Token | Value | Purpose |
|-------|-------|---------|
| `--max-w` | `1600px` | Max content width for all sections |
| `--pad-h` | `clamp(24px, 3vw, 80px)` | Horizontal padding — scales with viewport |
| `--pad-v` | `clamp(80px, 9vw, 120px)` | Vertical section padding |
| `--r` | `20px` | Card border-radius |
| `--rs` | `12px` | Small border-radius |

#### How `--pad-h` resolves

| Viewport | Resolved |
|----------|----------|
| 390px (mobile) | 24px (min floor) |
| 768px (tablet) | 24px (min floor) |
| 1024px | ~31px |
| 1440px | ~43px |
| 1920px | ~58px |
| 2667px+ | 80px (max cap) |

#### Section wrapper pattern (mandatory for every section/page)

```css
max-width: var(--max-w);   /* 1600px */
margin: 0 auto;
padding: var(--pad-v) var(--pad-h);
```

Every section and page wrapper must use this pattern. Do not invent custom max-widths or padding values.

#### Grid gaps

- All grids use **24px** gaps — cards, columns, rows, everywhere
- Do not use other gap values unless the design explicitly requires it

#### Spacing scale

- 8px base: 8, 16, 24, 32, 48, 64, 96
- Cards are the core UI element
- Generous breathing space in every section — avoid visual fatigue

### 2.4 Image Aspect Ratios

- Property cards: 4:3
- Hero sections: 16:9
- Discovery grids: 1:1
- Card image containers must have proper `aspect-ratio` — never fixed pixel heights that cause stretching

---

## 3. UX PRINCIPLES

### 3.1 Primary Reference: Airbnb

The platform adopts Airbnb's core UX principles:

- Calm interfaces
- Strong whitespace usage
- Intuitive search
- Modular cards
- Discovery-driven browsing

**The platform must feel:** Calm, elegant, intuitive, trustworthy.

### 3.2 Homepage Experience References

The homepage is storytelling-first with unique, experience-driven sections and well-thought animations. Apply these references per section — not as a blanket style:

| Reference | What to learn from it |
|-----------|----------------------|
| **Apple** | Scroll-driven storytelling, cinematic reveals, product-quality transitions |
| **Freepik** | Scroll-linked animation sequences |
| **Squarespace** | Editorial section design, layout confidence |
| **Stripe** | Typography-led hierarchy, purposeful clean motion |
| **Linear** | Precision, speed, micro-detail craftsmanship |

**Key principle:** The foundation stays light and calm (Airbnb/Apple), while the storytelling and motion layer (Freepik/Squarespace/Stripe/Linear) elevates specific sections without breaking the overall calm. Dark moments, if any, are deliberate and contained — never a blanket theme.

### 3.3 Design Quality Standard

Each section must be genuinely designed — not just competently coded. The standard is award-worthy design: distinct layout personality per section, visual tension, typographic confidence, and craft that separates a real product from a template.

---

## 4. DEVELOPMENT RULES

### 4.1 Mobile-First — Non-Negotiable

- Default CSS styles target mobile (≤743px) first
- Desktop styles via `@media(min-width:744px)` — never the reverse
- Every layout validated at 390px wide before desktop
- Touch targets minimum 44px height
- No feature or content on desktop can be hidden or broken on mobile
- No heavy assets that aren't lazy-loaded on mobile

### 4.2 Build Process

- Incremental patching accumulates duplicate JS declarations that silently kill GSAP — clean rebuilds preferred over patching when multiple features are affected
- Always read source files before making changes
- Work one section at a time, get approval before proceeding
- CSS goes in `styles.css`, JS goes in `main.js` — never inline `<style>` or `<script>` blocks in index.html
- GSAP ScrollSmoother is active on desktop (≥744px) — never use `position:fixed` on `<body>` to lock scroll. Use event-based scroll blocking instead.

### 4.3 Navigation Architecture

**Universal navigation (every page across the portal):**

Desktop navbar: `Logo | Search Bar (center) | Post Property (outline button) | Profile icon (circle) | Menu (hamburger)`

Mobile bottom bar: `Ghar | Post Property | Account | Menu`

**Key CTA decisions:**
- **Post Property** is the primary CTA — always visible in nav and bottom bar
- **"Join Now" does NOT exist** — account creation happens contextually through Post Property, Post Requirement, or SuperPro application
- **Sign In modal** = phone + password (no OTP cost). Fallbacks: "Login with OTP" and "Forgot Password"
- **Sign Up** only happens during Post Property / Post Requirement flows (requires OTP for new accounts)
- Country code: searchable dropdown with 20+ countries (not a toggle)

**Off-canvas menu structure:**
- Prominent links: Post Property, Post Requirement, Property Leads
- Expandable: For Buyers & Owners, For Allied Businesses, Content, Media & Events, Services, Tools
- Direct links: For Brokers (SuperPro), For Developers (Mandate)
- Footer: Sign In, About Us, Contact Us, Careers, Q&A + social icons

### 4.4 User Account Model

| User Type | How they join | Dashboard? |
|-----------|--------------|------------|
| Buyer / Owner / General User | Post Property or Post Requirement (OTP signup) | Yes |
| Broker | SuperPro application (OTP signup) | Yes |
| Developer | Enquiry form (no login) | No |
| Allied Business | Enquiry form (no login) | No |
| Content consumer | Subscribe (email only, no account) | No |

### 4.5 Scroll & Overlay Behavior

- Off-canvas menu and modals block page scroll via `wheel`/`touchmove` event prevention — NOT `position:fixed` on body
- Allow scrolling inside `#ocMenu` and `#joinModal` via `event.target.closest()` check
- Use `overscroll-behavior: contain` on all scrollable panels to prevent scroll chaining
- Off-canvas: each L1/L2 panel is its own scroll container (independent scroll, no position bleed)
- Menu resets scroll to top on every open

### 4.6 Carousel Behavior

- All carousels auto-play ONLY when in viewport (IntersectionObserver, threshold: 0.15)
- Stop auto-play when section leaves viewport
- Touch: `touch-action: pan-y` + direction detection (8px threshold) before capturing horizontal swipe
- Bleed-edge pattern: `margin-left/right: calc(-1 * var(--pad-h))` + `padding-left/right: var(--pad-h))`
- On XXL screens (>1600px), use `min(100vw, var(--max-w))` for card width calculations to prevent stretch

---

## 5. HOMEPAGE FLOW BLUEPRINT (Confirmed Order)

| # | Section | Notes |
|---|---------|-------|
| 1 | Hero + Search | Three-panel layout with B2B side cards (GharTalks, GharEvents, VideoWorks, Brand Connect). Centre = universal consumer entry. Scroll animation transitions into ecoForYou. |
| 2 | ecoForYou | Four verticals: Buyers & Owners, Brokers, Developers, Allied Businesses. Discovery-first, not feature-listing. |
| 3 | Editorial/Blog | Content discovery hub with topic filters |
| 4 | Intelligence | Standalone vertical — research, data, infrastructure as sub-category. NOT part of Media. |
| 5 | Architecture & Design | Premium, aspirational, design-led editorial |
| 6 | GharTalks | India's foremost real estate podcast |
| 7 | Industry Voices | Written expert perspectives — separate identity from GharTalks |
| 8 | GharEvents | Four signature franchise events |
| 9 | SuperPro / For Brokers | Authority-building, not lead generation |
| 10 | Developer Mandate | End-to-end marketing solution for developers |
| 11 | VideoWorks | B2B branded content studio |
| 12 | Brand Connect | B2B advertising and content partnerships |
| 13 | Creator Network | Connects property influencers, journalists, and real estate educators with Ghar.tv's audience and brands |
| 14 | Community / People | Community gateway (Brands + People cards) OR People portrait carousel — under evaluation. Community = two verticals: Brands (companies) and People (individuals). |
| 15 | Ghar Finance + Ghar Design + Ghar Move | Clustered partnership-driven lead-gen services |
| 16 | Tools | Decision-support utilities (EMI, stamp duty, area converter, etc.) |

---

## 6. PRODUCT DEFINITIONS

### 6.1 ecoForYou (Ecosystem Section)

Four verticals — every visitor immediately understands what's in it for them. Each has a dedicated page. Homepage drives exploration, not explanation.

- **Buyers & Owners** — Property discovery, market intelligence, decision support
- **Brokers** — Authority-building, ecosystem presence, premium digital presence. NOT lead generation. "For brokers who want to dominate their market."
- **Developers** — Project marketing, brand storytelling, mandate services
- **Allied Businesses** — B2B advertising and partnership vertical. Brands, financial institutions, and service businesses reaching Ghar.tv's audience. NOT a home services consumer vertical. CTA: "Partner With Us"

### 6.2 B2B Products

B2B products appear in TWO places: (1) contextually embedded within their relevant ecoForYou vertical, and (2) as dedicated standalone sections lower in the homepage.

- **VideoWorks** — Ghar.tv's branded content studio (like BBC Storyworks for Indian real estate). End-to-end video production, brand storytelling, and media distribution. Brands pay Ghar.tv to produce and distribute their story.
- **Brand Connect** — B2B brand partnerships. Advertising, content partnerships, and creator campaigns. Not consumer-facing.
- **Developer Mandate** — Complete end-to-end marketing solution for developers to market their project. Core B2B revenue product. No fabricated project names or invented statistics — no active mandates exist yet.
- **SuperPro** — Invite-only premium platform for serious brokers. Fully branded digital HQ + cinematic video production + media exposure + featured placement. Limited seats per location = exclusivity.

### 6.3 Media & Content Products

- **GharTalks** — India's foremost real estate podcast. Conversations with anyone relevant to real estate and allied businesses in India. Tagline: "Conversations."
- **Industry Voices** — Standalone editorial section. Written interviews, expert perspectives, market commentary, op-eds. Separate identity from GharTalks but GharTalks episodes can surface contextually within Voices.
- **Intelligence** — Standalone vertical (NOT part of Media). Data, market reports, rankings, price trends, analysis, infrastructure intelligence.
- **Architecture & Design** — Inspired by Architectural Digest. "Homes worth talking about." India's most beautiful residential spaces and the minds that shaped them.

### 6.4 GharEvents

Four signature franchise events defining India's real estate industry calendar:

1. **India Property Show** — Flagship
2. **India Senior Living Show** — Specialist
3. **India PropTech Expo** — Innovation
4. **India Luxury Property Show** — Luxury

Positioned as Industry Platforms, not just events.

### 6.5 Creator Network

Connects property influencers, journalists, and real estate educators with Ghar.tv's audience and the brands that want to reach them. A partnership play for individual creators — content distribution across Ghar.tv's editorial network, brand collaboration opportunities, GharTalks guest access, and revenue share on content and intelligence reports. Sits in the B2B/partnership cluster alongside Brand Connect.

### 6.6 Community (Brands + People)

Community is the directory vertical with two sub-verticals:

- **Brands** — Companies: developers, material brands, PropTech startups, financial institutions. 100+ brands across 6+ categories. Each brand gets a profile page.
- **People** — Individuals: architects, developers, economists, designers, brokers, founders. 200+ profiles across 20 categories. Each person gets a profile page.

Homepage: gateway section with two cards (Brands dark, People light) driving to dedicated pages. OR existing People portrait carousel. Under evaluation — both built for comparison.

The Community hub page (`/community`) links to Brands (`/brands`) and People (`/people`).

### 6.7 Services Cluster

- **Ghar Finance** — Home loan lead generation for banking partners
- **Ghar Design** — Interior design lead generation for design partners
- **Ghar Move** — Relocation lead generation for moving partners

Clustered together on the homepage after B2B sections.

---

## 7. COPY & CONTENT RULES

### 7.1 Reference Brands Are Internal Only

Reference brands (BBC Storyworks, Bloomberg, Architectural Digest, Airbnb, Apple, Stripe, Linear, Freepik, Squarespace, MagicBricks, 99acres etc.) are for Claude's internal understanding only — of positioning, design direction, and product philosophy. They must NEVER appear in user-facing copy or UI. All copy must be original, user-first, and written with intelligence.

### 7.2 Platform URLs Are Internal Only

Platform URLs (ghar.tv/media, ghar.tv/intelligence, ghar.tv/events etc.) are shared for architectural understanding only. Never use them as literal user-facing copy or UI text unless explicitly instructed. Navigation and CTAs should use smart, user-first language — not raw URL strings.

### 7.3 Copy Quality Standards

- All copy must be user-first — written for the person visiting, not describing the business
- Copy should feel intelligent, not salesy
- No fabricated statistics, fake project names, or invented data
- Broker positioning is about authority-building and ecosystem presence — never lead generation language
- Allied Businesses copy must speak to brands/businesses, not consumers
- Copy must not be lifted or adapted from reference brand descriptions

### 7.4 Footer Structure

4 layers:
1. **Subscribe card** — "Stay Updated" email subscription with community orbit illustration (Indian face avatars on trigonometry-positioned orbital rings around G outline). NOT a "Join" CTA.
2. **Brand bar** — Left-aligned: logo, tagline, social icons
3. **6-column link grid** — Discover, Content, Media & Events, For Business, Tools & Services, Company
4. **Bottom bar** — G logomark + copyright/contact | legal links

### 7.5 Imagery Rules

- Use Indian or at least relatable Asian faces when human subjects appear — this is an Indian platform
- If Pexels cannot provide confirmed Indian faces, use no-face alternatives: property photos, city aerials, data imagery — universally readable
- Card image containers must have proper aspect ratios, not fixed pixel heights
