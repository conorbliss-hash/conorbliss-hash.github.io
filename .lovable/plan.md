## Plan — executive polish pass

Ordered by impact, per your priority list.

### 1. Add senior-operator signal to portfolio cards (`ProjectsSection.tsx`)

**AI Strategy card** — append to outcome/description block:
> Developed AI Governance Operating Model ratified by SteerCo. Rolled out AI enablement programme across 4 countries (70% attendance, 6.3/7 satisfaction). Prioritised 23 use cases and governed the pilot programme from concept to production.

Also update the metric lede to: **"Seven-figure annual savings pipeline across 10+ departments"** (replaces "opportunity identified").

**ISO 42001 card** — append to outcome/description block:
> Named primary interviewee across 38 audit criteria alongside CCRO. Zero major non-conformities. Brought Technology, Legal, and Compliance into a unified audit position.

### 2. Delete bottom tag rows on portfolio cards

Remove the trailing tag/chip row from every `ProjectCard` in `ProjectsSection.tsx`. Keep the metric lede, outcome paragraph, and the metrics/governance grid. Drop the `tags` rendering block (data field can stay unused or be removed).

### 3. Add Contact section

New component `src/components/portfolio/ContactSection.tsx`:
- Heading: **"Get in touch"**
- One line: *"Open to AI leadership roles — Stockholm or remote within CET ±2."*
- Two buttons:
  - `mailto:conor.bliss.henaghan@gmail.com` — "Email"
  - LinkedIn link (reuse the existing URL already in the site) — "LinkedIn"
- Email shown as visible text next to the button (recruiters copy-paste).

Wire it into `src/pages/Index.tsx` as the **last** section.

### 4. Reorder sections in `src/pages/Index.tsx`

New order:
```text
Hero → Projects → About → Principles → Writing → Open Source (Health Coach) → Contact
```
Moves About above Open Source. Keeps Hero → Portfolio → About as you specified.

### 5. Demote Health Coach / Open Source

In whichever section currently renders Health Coach (likely a dedicated `ProjectsSection` variant or its own block):
- Remove the standalone section heading + intro copy.
- Render as a single compact card under a small heading **"Open source"** — one-line description + GitHub link. No metrics grid, no expand/collapse, no tag row.
- If it currently lives inside `ProjectsSection`, extract it into a lightweight `OpenSourceSection.tsx` so the main portfolio stays purely professional.

### Out of scope
- Subtitle stays as-is (your pushback noted — compliance-narrow rewrite rejected).
- No visual/theme changes.
- No copy changes to Hero, About, Principles, Writing.

### Files touched
- `src/components/portfolio/ProjectsSection.tsx` — copy adds, tag-row removal, Health Coach extraction
- `src/components/portfolio/ContactSection.tsx` — new
- `src/components/portfolio/OpenSourceSection.tsx` — new (compact Health Coach)
- `src/pages/Index.tsx` — section order + new imports
