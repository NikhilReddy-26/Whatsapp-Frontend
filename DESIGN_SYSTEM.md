# ColourPlus Design System: "Industrial Command Center"

## 1. Overview & Concept
**ColourPlus Lead Desk** is an enterprise AI qualification CRM and dispatch console for **ColourPlus Polyurethanes Pvt. Ltd.**, a premier Indian manufacturer of industrial polyurethane/epoxy floorings, cleanroom coatings, and heavy-duty waterproofing systems.

The redesign direction, **"Industrial Command Center"**, draws direct tactile inspiration from high-gloss polyurethane and epoxy floor installations:
- **Reflective Depth & Glass:** Clean, specular highlights mimicking smooth high-build polyurethane screeds.
- **Micro-Engineered Precision:** Crisp 1px subtle borders, precise mechanical gauges, and structured tabular typography.
- **Functional Semantics:** Immediate optical recognition across lead qualification states (HOT, WARM, NURTURE, OUT_OF_SCOPE).
- **Physical Motion Physics:** Spring-damped transitions, staggered entrances, and non-blocking interactions.

---

## 2. Brand Color Palette & Semantics

Extracted directly from the **ColourPlus 3-Square Logo**:

| Brand Element | Hex Code | HSL Representation | Design Token | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **ColourPlus Navy** | `#0f3f8a` | `217° 80% 30%` | `var(--brand-navy)` / `bg-brand-navy` | Primary brand accent, primary CTA buttons, active state accents |
| **ColourPlus Green** | `#2f9e5b` | `144° 54% 40%` | `var(--brand-green)` / `bg-brand-green` | WhatsApp brand identity, positive status, verified checks, site visits |
| **ColourPlus Red** | `#e5373b` | `359° 77% 56%` | `var(--brand-red)` / `bg-brand-red` | Hot lead indicator, urgent dispatch badge, high-priority notifications |

### Funnel Semantic Scale
| Funnel Stage | Base Color | Hex | Glow Effect | Meaning |
| :--- | :--- | :--- | :--- | :--- |
| **HOT** | Vibrant Red-Orange | `#f97316` / `#ef4444` | `0 0 16px rgba(249, 115, 22, 0.45)` | High intent & budget, immediate rep dispatch required (<15m SLA) |
| **WARM** | Amber | `#f59e0b` | `0 0 12px rgba(245, 158, 11, 0.35)` | Qualified application inquiry, pending specs or visit booking |
| **NURTURE** | Cyan / Teal | `#06b6d4` | `0 0 12px rgba(6, 182, 212, 0.3)` | Long sales cycle, preliminary BOQ inquiry, automated nurture queue |
| **OUT_OF_SCOPE**| Slate Grey | `#64748b` | None | Below MOQ, non-flooring query, or DIY consumer request |

---

## 3. Dual-Theme Surface Token System

All surfaces are mapped via CSS variables in `src/index.css` and exposed as Tailwind utilities:

### Dark Mode (Default Command Center)
```css
:root, .dark {
  --canvas: #0c1621;            /* Deep industrial night sky */
  --canvas-subtle: #0f1c2b;     /* Subtle elevated backdrop */
  
  --surface: #132235;           /* Card elevation 1 */
  --surface-elevated: #182b42;  /* Card elevation 2 / interactive */
  --surface-floating: #1e3552;  /* Card elevation 3 / modals / dropdowns */
  --surface-subtle: #0f1c2c;    /* Inset containers / inputs */

  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-base: rgba(255, 255, 255, 0.14);
  --border-highlight: rgba(255, 255, 255, 0.28);

  --text-primary: #f8fafc;      /* Crisp high-contrast white */
  --text-secondary: #cbd5e1;    /* Slate-300 readable secondary */
  --text-tertiary: #94a3b8;     /* Slate-400 metadata */
  --text-muted: #64748b;        /* Slate-500 disabled */
}
```

### Light Mode (Clinical Technical Laboratory)
```css
.light {
  --canvas: #f8fafc;            /* Clean light grey */
  --canvas-subtle: #f1f5f9;     /* Soft contrast canvas */
  
  --surface: #ffffff;           /* Crisp white cards */
  --surface-elevated: #f8fafc;  /* Soft elevated card */
  --surface-floating: #ffffff;  /* Modal popup with layered shadows */
  --surface-subtle: #f1f5f9;    /* Subdued input fields */

  --border-subtle: #e2e8f0;
  --border-base: #cbd5e1;
  --border-highlight: #94a3b8;

  --text-primary: #0f172a;      /* Slate-900 high contrast */
  --text-secondary: #334155;    /* Slate-700 */
  --text-tertiary: #64748b;     /* Slate-500 */
  --text-muted: #94a3b8;        /* Slate-400 */
}
```

---

## 4. Typography Scale

Paired via Google Fonts in `index.html`:
- **UI & Display:** `Plus Jakarta Sans`, `-apple-system`, `sans-serif` (Crisp geometric grotesk)
- **Reading & Forms:** `Inter`, `sans-serif` (High readability in small dense tables)
- **Technical & Scores:** `JetBrains Mono`, `monospace` (Tabular numerals, SLA clocks, and coordinates)

```css
font-sans: 'Plus Jakarta Sans', Inter, sans-serif;
font-mono: 'JetBrains Mono', monospace;
```

---

## 5. Motion Design Principles & Physics (`src/lib/motion.ts`)

Built using the official **Motion for React** (`motion/react`) package:

### 1. Spring Physics
- **Tight (`SPRINGS.tight`):** `stiffness: 400, damping: 32` — Micro-interactions, button presses, toggle sliders.
- **Gentle (`SPRINGS.gentle`):** `stiffness: 220, damping: 28` — Modal panel entrances, detail view dual-panel split.
- **Snappy (`SPRINGS.snappy`):** `stiffness: 500, damping: 35` — Sticky bulk-assign bottom bar popping up.

### 2. Standard Easing Curves
- `EASINGS.easeOutExpo`: `[0.16, 1, 0.3, 1]` — Enter animations, KPI count-ups, SVG score gauges.
- `EASINGS.easeInOutExpo`: `[0.87, 0, 0.13, 1]` — Full page routing transitions.

### 3. Orchestration
- **Page Transitions:** `<AnimatePresence mode="wait">` fading opacity and sliding 8px along the Y axis over 220ms.
- **List Optimization:** Lists cap stagger delays at `Math.min(idx * 0.04, 0.4)` so long tables with 100+ items never lag or freeze.
- **Reduced Motion:** Fully integrated with `useReducedMotion()` and `@media (prefers-reduced-motion: reduce)`. When enabled, animations cleanly snap to final values without delay or looping.

---

## 6. UI Component Primitives Guide (`src/components/ui/`)

### `Button`
```tsx
import { Button } from './ui/Button';

<Button
  variant="brand"        // 'brand' | 'secondary' | 'ghost' | 'danger' | 'success'
  size="md"              // 'xs' | 'sm' | 'md' | 'lg'
  isLoading={false}
  leftIcon={<Send className="w-4 h-4" />}
  onClick={handleClick}
>
  Dispatch & Assign Lead
</Button>
```

### `Card`
```tsx
import { Card } from './ui/Card';

<Card
  elevation={1}          // 1 (subtle), 2 (elevated), 3 (modal/floating)
  interactive={true}     // enables subtle hover lift & specular border highlight
  epoxyGloss={true}      // adds industrial polyurethane shine reflection
  className="p-5"
>
  {/* Card Content */}
</Card>
```

### `Badge`
```tsx
import { Badge } from './ui/Badge';

<Badge
  variant="hot"          // 'hot' | 'warm' | 'nurture' | 'slate' | 'navy' | 'green'
  size="sm"              // 'xs' | 'sm' | 'md'
  pulse={true}           // live pulsing radar ring
  icon={<Flame className="w-3.5 h-3.5" />}
>
  HOT (94/100)
</Badge>
```

### `AnimatedNumber`
```tsx
import { AnimatedNumber } from './ui/AnimatedNumber';

<AnimatedNumber
  value={87}
  duration={1100}
  prefix="₹"
  suffix=" Cr"
  decimals={1}
  className="text-2xl font-bold"
/>
```

### `ScoreGauge`
```tsx
import { ScoreGauge } from './ui/ScoreGauge';

<ScoreGauge
  score={92}
  funnel="HOT"
  size={120}
  strokeWidth={10}
  showLabel={true}
/>
```

### `ProgressBar`
```tsx
import { ProgressBar } from './ui/ProgressBar';

<ProgressBar
  value={25}
  max={30}
  color="bg-funnel-hot"
  delay={0.2}
  showValue={true}
/>
```

### `Modal`
```tsx
import { Modal } from './ui/Modal';

<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Assign Lead"
  subtitle="Dispatches technical briefing"
  icon={<UserCheck className="w-5 h-5 text-brand-navy" />}
  maxWidth="2xl"
>
  {/* Form or modal body */}
</Modal>
```

### `Skeleton`
```tsx
import { Skeleton } from './ui/Skeleton';

<Skeleton className="h-24 w-full rounded-2xl" />
```

### `ThemeToggle`
```tsx
import { ThemeToggle } from './ui/ThemeToggle';

<ThemeToggle /> // Smooth icon rotation and theme toggle between Dark and Light
```

---

## 7. Accessibility & Compliance (WCAG AA)
1. **Contrast:** Every text pairing complies with minimum 4.5:1 ratio for body copy and 3:1 for large headers.
2. **Focus Rings:** Explicit outline indicators on all interactive inputs: `focus-visible:ring-2 focus-visible:ring-brand-navy focus-visible:outline-none`.
3. **Screen Readers:** ARIA attributes (`aria-label`, `aria-hidden="true"`, `role="status"`) applied to icons, status indicators, and modal dialogs.
4. **Motion Safety:** `prefers-reduced-motion` suppresses transforms, stops background pulses, and displays static gauges immediately.
