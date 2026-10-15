# CivicTrack — Design system & screen specification

Use this to build the Figma file: create the color/type/spacing styles first (section 1–3), build the component library (section 4), then assemble the screens (section 5) by dragging components in.

---

## 1. Color palette

Define as Figma color styles. Each role needs a light-mode value (dark mode optional for v1).

| Style name | Hex | Usage |
|---|---|---|
| `surface/page` | #FAFAF8 | App background |
| `surface/card` | #FFFFFF | Card backgrounds |
| `surface/muted` | #F1EFE8 | Metric cards, input fills |
| `text/primary` | #14140F | Body text, headings |
| `text/secondary` | #5F5E5A | Supporting text, labels |
| `text/muted` | #888780 | Placeholders, timestamps |
| `border/default` | #E4E2DA | Hairline borders |
| `border/strong` | #B4B2A9 | Dividers, dashed upload zones |
| `accent/fill` | #378ADD | Primary buttons, links |
| `accent/bg` | #E6F1FB | Info tint backgrounds |
| `accent/text` | #0C447C | Text on accent/bg |
| `danger/fill` | #E24B4A | Pending status |
| `danger/bg` | #FCEBEB | Pending status chip bg |
| `danger/text` | #791F1F | Pending status chip text |
| `warning/fill` | #EF9F27 | In-progress status |
| `warning/bg` | #FAEEDA | In-progress chip bg |
| `warning/text` | #633806 | In-progress chip text |
| `success/fill` | #1D9E75 | Resolved status |
| `success/bg` | #E1F5EE | Resolved chip bg |
| `success/text` | #085041 | Resolved chip text |
| `category/purple` | #7F77DD | Category tag (pothole) |
| `category/coral` | #D85A30 | Category tag (garbage) |
| `category/teal` | #1D9E75 | Category tag (streetlight) |

---

## 2. Typography

Font: **Inter** (free, close to Anthropic Sans — good Figma substitute).

| Style name | Size | Weight | Line height | Usage |
|---|---|---|---|---|
| `heading/h1` | 24px | Medium (500) | 32px | Page titles |
| `heading/h2` | 18px | Medium (500) | 26px | Section headers |
| `heading/h3` | 16px | Medium (500) | 22px | Card titles |
| `body/regular` | 14px | Regular (400) | 22px | Body copy, form labels |
| `body/small` | 13px | Regular (400) | 18px | Secondary text, metadata |
| `caption` | 12px | Regular (400) | 16px | Timestamps, chip labels |
| `metric/large` | 24px | Medium (500) | 28px | Dashboard stat numbers |

Only two weights across the whole file: 400 and 500. Never bold (700).

---

## 3. Spacing, radius & grid

- **Base spacing unit**: 4px. Use multiples: 4, 8, 12, 16, 24, 32, 48.
- **Corner radius**: 8px for buttons/inputs/chips, 12px for cards.
- **Frame widths**: Mobile 375px, Desktop dashboard 1280px (12-col grid, 24px gutter, 64px margin).
- **Component padding**: Cards 16–20px, buttons 8px vertical / 16px horizontal, inputs 8px vertical / 12px horizontal.
- **Elevation**: no drop shadows on flat cards — use a 0.5px border only, per the flat design direction already established. If you want subtle depth on modals only: `0 8px 24px rgba(0,0,0,0.12)`.

---

## 4. Component library (build these as Figma components first)

### Buttons
- **Primary**: fill `accent/fill`, text white, radius 8px, height 36px. Hover: 10% darker.
- **Secondary**: transparent fill, border `border/strong`, text `text/primary`. Hover: fill `surface/muted`.
- **Icon button**: 32x32px, transparent, icon centered, radius 8px.

### Status chip
- Pill shape, radius 8px, padding 2px 8px, caption text.
- 3 variants: Pending (danger), In progress (warning), Resolved (success). Bg = role/bg, text = role/text.

### Category tag
- Small colored dot (8px circle) + label, 12px caption text. One color per category (see palette).

### Input field
- Height 36px, radius 8px, border `border/default`, padding 8px 12px, fill white.
- Focus state: border `accent/fill` + 2px outer glow `accent/bg`.

### Issue card (feed)
- Card container: white, 12px radius, 0.5px border, 12px padding.
- Layout: 56x56 thumbnail (left) + content (right) = title (h3) + status chip (top-right, same row) + ward/category (body/small, secondary) + upvote count with icon (caption).

### Metric card (analytics)
- Fill `surface/muted`, radius 8px, padding 16px.
- Label (body/small, secondary) above, value (metric/large) below.

### Nav bar
- Height 56px, white bg, bottom border `border/default`.
- Logo/wordmark left, role-based nav links center, avatar + role badge right.

### Table row (official dashboard)
- Height 44px, 0.5px bottom border, 13px text.
- Columns: issue title (flex), upvotes (fixed 80px), status chip (fixed 100px), action button (fixed 90px).

### Timeline item (issue detail)
- 8px dot on a 2px vertical line, 16px left padding for text.
- Dot color = status role color. Title (body/regular, medium) + timestamp/note (caption, muted) below.

---

## 5. Screens to build (in this order)

1. **Auth — Login**
   Centered card, 340px wide, on `surface/page`. Email + password inputs, primary button "Log in", secondary button "Create account" below it.

2. **Auth — Register**
   Same layout + Name, Email, Password, Confirm password, Ward (dropdown) fields, role locked to "citizen".

3. **Report issue (citizen)**
   Centered form card, 420px wide. Fields top to bottom: Category (select) → Description (textarea) → Photo upload (dashed drop zone, camera icon) → Location (map preview placeholder, pin icon + address string) → Submit button (full width, primary).

4. **Public feed (citizen/public)**
   Full-width desktop layout. Top: filter row (category, ward, sort — 3 selects inline). Below: map preview panel (full width, ~180px tall placeholder with pin icons). Below: vertical stack of issue cards, newest/most-upvoted first.

5. **Issue detail**
   Full-width photo banner (16:9) at top. Title + status chip row. Ward/category/reporter metadata line. Upvote button. "Status timeline" section header, then vertical timeline component (3–5 entries depending on current status).

6. **Official dashboard**
   Full-width desktop layout. Header shows department name + jurisdiction wards. Filter row (status, category, ward — officials only see their own wards though, so ward filter may be omitted). Data table using the table row component. Row action button: "Update" opens a status-change modal (dropdown for new status + required text note + optional "after" photo upload).

7. **Status update modal** (triggered from official dashboard)
   Centered modal, 400px wide, on a dimmed overlay. Current status → new status dropdown, required note textarea, photo upload (only shown when new status = Resolved), Cancel/Save buttons.

8. **Admin panel — departments**
   List of department cards (name, jurisdiction wards, official count, edit button) + "Add department" primary button. Clicking edit/add opens a form: name, category multi-select, ward multi-select.

9. **Admin panel — officials**
   Same pattern as departments: table of official accounts (name, email, assigned department, ward) + "Add official" button.

10. **Analytics dashboard**
    Top row: 3–4 metric cards (Total issues, Resolved, Avg resolution time, Pending > 7 days / SLA breach count).
    Below: two charts side by side on desktop, stacked on mobile — bar chart (issues by category) and line chart (reported vs resolved trend over time).
    Optional third section: ward-wise table or horizontal bar chart of avg resolution time per ward.

---

## 6. Responsive notes

- Mobile (375px): single column everywhere. Filter row on feed becomes a horizontal scroll or a "Filters" button opening a bottom sheet. Official dashboard table becomes stacked cards (same issue-card pattern as citizen feed, with an added action button).
- Desktop (1280px): feed and dashboard use the full 12-col grid — map/filters can sit in a sidebar (4 cols) with the list/table in the remaining 8 cols, instead of stacking.

---

## 7. Suggested Figma file structure

```
Pages:
├── 🎨 Design system      (color styles, type styles, components from section 4)
├── 📱 Mobile screens      (screens 1–5, 375px frames)
├── 🖥️ Desktop screens     (screens 4, 6, 8–10, 1280px frames)
└── 🧩 Flows                (connect screens with prototype arrows: login → feed → report → detail → confirmation)
```

Prototype flow to wire up first (most important for a demo video):
`Login → Public feed → Report issue → Success toast → back to feed → Issue detail → (switch role) → Official dashboard → Status update modal → Analytics`
