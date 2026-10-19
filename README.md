# Inventory Optimization — clickable HTML prototype

A static, clickable prototype of **Inventory Optimization Recommendations**, built from Figma file
*300 Inventory Optimization Recommendations INV-PO*. Open [`index.html`](index.html) (the Setup page)
to start, or use the **Prototype ▾** menu in the bottom-left corner to jump to any screen.

No build step: plain HTML, CSS and JavaScript. Data is kept in the browser's `localStorage`, so jobs,
saved settings and adopted recommendations persist between pages. Use **Prototype ▾ → Reset sample
data** to start over.

## Flows

### 1. Optimization Settings — Figma [`108:4929`](https://www.figma.com/design/WbRoOsjbmB06SH2KSb5PDM/300-Inventory-Optimization-Recommendations-INV-PO?node-id=108-4929)

| Page | What you can do |
| --- | --- |
| [`settings.html`](settings.html) | Edit the three cards one at a time: **Item Warehouse Revenue Range** (ABC; must total 100%), **Demand Variance Range** (XYZ), and **SLA Targets & Replenishment Types**. Each card has Cancel / Revert to Default / Save. Leaving a card with unsaved edits opens the *"You have edits in process"* dialog. |

### 2. Optimization Scheduler — Figma [`191:6526`](https://www.figma.com/design/WbRoOsjbmB06SH2KSb5PDM/300-Inventory-Optimization-Recommendations-INV-PO?node-id=191-6526)

| Page | What you can do |
| --- | --- |
| [`index.html`](index.html) | Setup page; **Optimization Settings** and **Optimization Scheduler** are the new entries under Inventory. |
| [`scheduler.html`](scheduler.html) | List of scheduled jobs with status chips. The `+N` warehouse badges open the full list. The send icon runs a job (*Processing* → *Completed* after ~6 s, which adds a report). There's also an empty state. |
| [`job.html`](job.html) | Create or edit (`?id=`) a job: multi-select warehouses (a warehouse already used by another job is flagged), job owner, and a Repeat schedule. Run Optimization is hidden for repeating jobs. |
| [`reports.html`](reports.html) | Item Warehouse Optimization Reports list. |
| [`report.html`](report.html) | Report detail with collapsible Report Details and the AI **Recommendation** popover. |

### 3. On-Hand Balances — Figma [`108:33694`](https://www.figma.com/design/WbRoOsjbmB06SH2KSb5PDM/300-Inventory-Optimization-Recommendations-INV-PO?node-id=108-33694)

| Page | What you can do |
| --- | --- |
| [`ohb.html`](ohb.html) | On-Hand Balances. Select rows to enable *Send to Cycle Count*; the gear icon opens Setup Preferences. |
| [`iwo.html`](iwo.html) | Item Warehouse Optimization. The sparkle opens the recommendation; *See Details* or the pencil opens Setup Preferences. After saving, a success banner shows and fades after 5 s. |
| [`prefs.html`](prefs.html) | Setup Preferences (classic page). **Adopt** applies the Min/Max recommendation; **Revert to Previous** undoes it. Fields change with the replenishment type. |

## Design-system notes

- Colours, spacing, radius, type and shadows use **Clarity** token values
  ([`css/clarity-tokens.css`](css/clarity-tokens.css)). Clarity's React components can't run in a
  static page, so their look is rebuilt on those tokens.
- The Coupa global header, the classic Setup Preferences page and the green flash banner use older,
  non-Clarity colours and fonts; those values are hardcoded and labelled in the CSS.
- Icons are the Figma assets in [`assets/`](assets/), except a few that weren't exported (building,
  caret, calendar, info, checkbox tick, more-options), which are inline SVGs in [`js/app.js`](js/app.js).

## Where the prototype fills gaps in the design

- Links outside these flows show a *"Not part of this prototype flow"* message.
- Recommendation copy for *Imager, Thermal*, the Demand Variance help text (the design says *"Range help
  text TBD"*) and two validation rules (Variable > Stable; service levels 0–100%) were written for the
  prototype.
