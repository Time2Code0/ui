---
name: time2code-particles
description: Index of every time2code/ui particle, the working examples for its UI components, charts, marketing components and hooks, each with a short description and the URL of its registry JSON. Use when building UI with time2code/ui and you want a complete, realistic example to start from (a dialog with a form, a select with groups, a stacked bar chart, a marquee) instead of writing the composition from scratch.
---

# time2code/ui particles

Particles are small, complete examples of time2code/ui components: one file each, named `p-<item>-<n>` (`p-dialog-1`, `p-bar-chart-12`). Browse them visually at https://ui.time2code.dev/particles.

This skill is an index. For how to install, compose and style the components, use the `time2code-ui` skill (and `time2code-charts` for charts). If those skills aren't installed, the same rules are in the docs: https://ui.time2code.dev/llms.txt.

## How to use this index

1. Pick the reference file for the kind of item below and find the item's section (sections are named like the registry items: `select`, `bar-chart`, `marquee`).
2. Choose the particles whose descriptions match the task. Several often do; read two or three and combine them.
3. Get the source:
   - Fetch the JSON URL. The code is in `files[].content`; `dependencies` and `registryDependencies` list what it needs.
   - With the `time2code` MCP server, `get_item_examples` returns the same code.
4. Install what the particle uses: `npx time2code add <item> …` for each `@time2code/<item>` in `registryDependencies`.
5. Adapt the code:
   - Particles import from `@/registry/ui/*`, `@/registry/charts/*`, `@/registry/marketing/*` and `@/registry/hooks/*`. In a project these are `@/components/ui/*`, `@/components/charts/*`, `@/components/marketing/*` and `@/hooks/*` (with the project's alias).
   - Particles export `function Particle()`. Rename it and replace the sample data.

Don't install a particle with `time2code add p-…` to reuse it; copy and adapt the code instead.

## Indexes

<!-- particles:start -->
- [references/ui.md](references/ui.md): 372 UI component particles for 58 items: accordion, alert, alert-dialog, autocomplete, avatar, badge, breadcrumb, button, calendar, card, checkbox, checkbox-group, collapsible, color-picker, combobox, command, context-menu, date-picker, dialog, drawer, empty, field, fieldset, form, grid, group, input, input-group, kbd, link, loading, menu, meter, middle-truncate, number-field, otp-field, pagination, popover, portal, preview-card, progress, radio-group, scroll-area, segmented-control, select, separator, sheet, sidebar, skeleton, slider, switch, table, tabs, textarea, toast, toggle, toggle-group, tooltip
- [references/charts.md](references/charts.md): 310 chart particles for 29 items: area-chart, bar-chart, candlestick-chart, chart-axis, chart-background, chart-band, chart-custom-indicator, chart-date-highlights, chart-grid, chart-legend, chart-markers, chart-reference-area, chart-segment, chart-tooltip, chart-trend-line, choropleth-chart, composed-chart, funnel-chart, gauge-chart, heatmap-chart, line-chart, live-line-chart, pie-chart, radar-chart, ring-chart, sankey-chart, scatter-chart, sparkline, sunburst-chart
- [references/marketing.md](references/marketing.md): 47 marketing particles for 46 items: animate, animated-border, animated-size-container, arc-text, beam, confetti, counter, fluid-gradient-text, globe, gradient-text, hero-image, highlight-card, highlight-dots, hover-rotate-text, image-comparison, image-zoom, led-matrix, magic-button, magic-text, magic-text-reveal-card, marquee, mask, mouse, noise, northern-lights, orbit, outlined-text, particles, pattern, pill, pixelated-text, progressive-blur, retro-grid, reveal, rotate-interval, scroll, scroll-reveal, shiny-text, spotlight, spotlight-card, sticky-stacked-card, text-marker, text-scroll-reveal, ticker, tilt-card, typewriter
- [references/hooks.md](references/hooks.md): 8 hook particles for 8 items: use-clock, use-coerce-to-motion-value, use-event-listener, use-interval, use-mouse-position, use-normalize-motion-value, use-resize-observer, use-scroll-accelerated-clock
<!-- particles:end -->

## Updating this index

The reference files and the list above are generated from the particle registries. In the time2code/ui repository, run `pnpm build:skills` after adding, removing or renaming particles.
