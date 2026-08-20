# Beyond the Box Website

## Architecture

This is a TanStack Start marketing site deployed on Netlify. The primary experience is a single, content-rich homepage with a client-side booking preview that links into the business's active live booking calendar.

## Key Directories

- `src/routes/` contains TanStack Start routes. `index.tsx` is the complete public homepage and booking interaction.
- `src/styles.css` contains the global design system, layout, animations, and responsive rules.
- `public/images/` contains optimized local copies of the venue's existing brand and room photography.
- `.netlify/` contains scaffold and task-result metadata used by the Netlify agent workflow.

## Conventions

- Keep the visual language editorial, tactile, and puzzle-inspired: warm paper tones, deep green, rust accents, serif display type, and restrained motion.
- Use semantic HTML, visible focus states, descriptive labels, and reduced-motion support for interactive work.
- Keep business content in the data arrays near the top of `src/routes/index.tsx` so room details and reviews remain easy to update.
- Reuse the CSS custom properties in `src/styles.css` instead of introducing isolated colors or type choices.
- Keep the active external booking URL in the `bookingUrl` constant rather than duplicating it in components.

## Non-Obvious Decisions

The live ticket is deliberately placed above the booking controls on desktop rather than in a side rail. This preserves the user's preferred concert-ticket idea while avoiding the detached sidebar treatment in the previous widget. The local steps collect preferences and explain pricing, while the final action opens the existing live calendar so availability and confirmation remain controlled by the actively developed booking system.

Do not add a second booking backend unless the existing booking system is being intentionally replaced. If direct availability is added later, integrate through an approved server-side endpoint and never expose private credentials in browser code.
