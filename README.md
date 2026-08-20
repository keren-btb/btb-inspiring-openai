# Beyond the Box Escape Rooms

A modern marketing and booking-preview website for Beyond the Box Escape Rooms in Hastings, Hawke's Bay. The site presents the venue's three original rooms, supporting experiences, reviews, pricing, hours, and contact details in a responsive editorial design.

## Key Technologies

- TanStack Start and React 19
- TypeScript
- Tailwind CSS 4 tooling with a custom global CSS design system
- Lucide React icons
- Netlify deployment via the TanStack Start Netlify adapter

## Booking Experience

The homepage includes a four-step ticket builder for choosing a room, preferred date and time, group size, and reviewing the selection. A concert-style ticket updates throughout the flow and sits above the form instead of in a separate side panel. The final action opens the active Beyond the Box booking calendar to check live availability and confirm the booking.

## Local Development

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

The application runs on the port reported by Vite. For Netlify platform emulation, use:

```bash
netlify dev --port 8889
```

## Main Files

- `src/routes/index.tsx` — homepage content and booking interaction
- `src/routes/__root.tsx` — document metadata and font loading
- `src/styles.css` — complete visual system and responsive behavior
- `public/images/` — brand and venue photography
