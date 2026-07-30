---
version: alpha
name: FadeMemo Android
description: FadeMemo Flutter application design language for the Android product surface.
colors:
  background: "#FBF8F3"
  surface: "#FFFFFF"
  ink: "#2C2A26"
  ink-soft: "#6B6660"
  primary: "#756684"
  divider: "#00000014"
  on-primary: "#FBF8F3"
  error: "#B5575C"
  on-error: "#FFFFFF"
typography:
  body-large:
    fontFamily: Noto Serif SC
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.7
  body-medium:
    fontFamily: Noto Serif SC
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.6
  title-large:
    fontFamily: Noto Serif SC
    fontSize: 22px
    fontWeight: 500
    letterSpacing: 1.2px
  app-bar-title:
    fontFamily: Noto Serif SC
    fontSize: 18px
    fontWeight: 500
    letterSpacing: 2.5px
  label-small:
    fontFamily: Noto Serif SC
    letterSpacing: 1.5px
  button-label:
    fontFamily: Noto Serif SC
    fontSize: 14px
    fontWeight: 400
    letterSpacing: 1.2px
  metadata:
    fontFamily: Noto Serif SC
    fontSize: 12px
    fontWeight: 400
rounded:
  button: 10px
  input: 12px
  card: 16px
  panel: 20px
spacing:
  mobile-horizontal-padding: 16px
  tablet-horizontal-padding: 28px
  desktop-horizontal-padding: 48px
  library-width: 280px
  tablet-content-max: 720px
  desktop-content-max: 880px
  mobile-breakpoint: 600px
  tablet-breakpoint: 900px
  desktop-breakpoint: 1200px
components:
  app-bar:
    backgroundColor: "{colors.background}"
    textColor: "{colors.ink}"
    typography: "{typography.app-bar-title}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
  divider:
    backgroundColor: "{colors.divider}"
  metadata:
    textColor: "{colors.ink-soft}"
    typography: "{typography.metadata}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.input}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-label}"
    rounded: "{rounded.button}"
---

## Overview

FadeMemo is a local-first learning tool whose notes visibly decay until the learner actively recalls them. The Android interface is quiet, literary, and low-saturation: warm paper-like surfaces hold ink-toned content, while a restrained mist-violet accent marks selection and the primary recovery action. Visual damage is a reversible presentation of memory state; the stored source remains intact.

## Scope and Status

This document separates the current alpha interface from the intended product flow so visual prototypes do not silently become domain rules.

| Status | Included behavior |
| --- | --- |
| Implemented alpha | Local memo editing and persistence, a memory library, elapsed-time and strength display, four visual renderer states, theme controls, and simulator controls used to inspect decay. |
| Product target | Note-level damage from 0–10, five challenge modes, and a recovery loop consisting of prompt, active response, feedback, and a recorded strength update. |
| Future optional | AI assistance that may help generate prompts or feedback but never replaces deterministic forgetting rules or becomes necessary for the offline core loop. |

The four renderer states (`clear`, `blurry`, `garbled`, and `disappeared`) are not a one-to-one mapping to the product target's 0–10 note-level damage. That mapping remains undefined until the domain model and challenge modes are implemented and tested.

## Colors

The light theme uses warm paper, white writing surfaces, ink, and softened ink for a calm reading environment. Mist violet is the single interaction accent. The dark theme shifts the same hierarchy to ink-cyan surfaces, rice-white content, and a muted ghost-blue accent rather than introducing a second visual language.

The alpha design.md schema cannot encode theme modes, so frontmatter exports the light theme as the default `colors` set and the table below preserves the exact dark-theme values for implementation. Component references resolve against the exported light tokens. The light primary token is darkened from the alpha prototype so paper-colored text reaches a WCAG AA contrast ratio of approximately 4.97:1.

## Themes

| Token | Light | Dark |
| --- | --- | --- |
| `background` | `#FBF8F3` | `#14171C` |
| `surface` | `#FFFFFF` | `#1B2027` |
| `ink` | `#2C2A26` | `#E8E2D5` |
| `ink-soft` | `#6B6660` | `#9A9385` |
| `primary` | `#756684` | `#A6B4D0` |
| `divider` | `#00000014` | `#FFFFFF22` |
| `on-primary` | `#FBF8F3` | `#14171C` |
| `error` | `#B5575C` | `#B5575C` |
| `on-error` | `#FFFFFF` | `#FFFFFF` |

## Typography

Noto Serif SC governs the application theme so notes, headings, controls, and metadata share the same literary voice. Weight, color, and tracking separate hierarchy: note content carries the strongest ink, supporting information uses softened ink, and compact labels use deliberate spacing rather than additional color.

Production Android builds must bundle the selected 400 and 500 font weights as application assets. If the existing `google_fonts` integration remains, runtime font fetching must be disabled; the app must fall back to a bundled system-compatible serif rather than require network access.

## Layout

The mobile home surface follows a vertical editor, memory-status and fading-canvas, then control-panel sequence. The fading canvas owns the expandable reading area. Compact layouts place the memory library in a drawer; wider layouts keep the library beside a centered, width-constrained content column. All application chrome and content remain inside platform safe areas, and the shared responsive roles in frontmatter govern gutters, breakpoints, library width, and content limits.

## Elevation & Depth

Hierarchy is primarily flat and tonal. The app bar and cards do not rely on visible elevation; surfaces separate from the page through a quiet background shift and the low-alpha divider token. The current alpha uses an app-bar creation action and does not define a floating action button.

## Shapes

Inputs, buttons, cards, and control panels use the role-specific rounded tokens in frontmatter. Large reading and editing surfaces use the card shape; compact actions use the tighter button shape.

## Components

- **Fading canvas:** The implemented alpha surface renders intact source data through four visual states: clear, blurry, garbled, and disappeared. These states describe the current renderer, not the complete future challenge model or the product document's note-level severity scale.
- **Memo editor:** Keep editing and saving inside one writing surface. Saving feedback belongs in the editor header so it does not compete with the note content.
- **Memory library:** Show a content preview and relative update time for each memo. Use the accent only for the selected memo and its selection marker.
- **Memory clock:** Pair elapsed time with average memory strength and use tabular figures so changing values do not shift the layout.
- **Control panel:** Treat acceleration, reset, and direct strength boosts as alpha simulator controls. They must not replace the production learning flow, where recovery follows a prompt, an active answer, corrective feedback, and a recorded strength update.
- **Buttons and fields:** Use shared theme variants rather than local colors or radii. The accent-filled button is reserved for the primary action in its group.

## Android Accessibility and Adaptation

- Keep normal-size text and essential icons at a contrast ratio of at least 4.5:1 in both themes; verify disabled, focused, selected, and error states separately.
- Give every interactive target a minimum 48 × 48 logical-pixel hit area. Do not expose each rendered character as an independent accessibility target; describe the canvas as one state-aware region and provide accessible prompt and answer controls without revealing hidden source text.
- Provide a visible, focusable delete action with confirmation or undo. Long press may remain a shortcut but cannot be the only way to delete a memo.
- At large font scales, allow control labels to wrap and stack compact button groups vertically rather than clip or shrink text.
- Honor reduced-motion preferences and avoid using blur, scrambling, animation, or color alone to communicate memory state.
- Test portrait and landscape layouts with the keyboard open, system bars and display cutouts, narrow screens, and text scaling up to 200%.

## Do's and Don'ts

- Do preserve complete original memo content in local storage and apply decay only while rendering.
- Do keep clear, blurry, garbled, and disappeared treatments consistent wherever memory state is shown.
- Do require an active response before recovery in the user-facing learning flow; keep direct strength boosts inside simulator or debugging contexts.
- Do persist theme, animation, typography, and forgetting settings locally.
- Don't require an account, network connection, or remote service for the core write-and-recall loop.
- Don't imply that visible decay means the user's original content has been deleted.
- Don't replace the deterministic forgetting rules with AI-generated damage; rules remain authoritative and any future AI assistance stays optional.
