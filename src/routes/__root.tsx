import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Beyond the Box Escape Rooms | Hastings, Hawke’s Bay' },
      {
        name: 'description',
        content:
          'Escape rooms, escape rooms in a box, VR chairs and board games for sale (new & secondhand) in Hastings, Hawke’s Bay. Friendly for first-timers, challenging for experienced players.',
      },
      { name: 'theme-color', content: import.meta.env.VITE_THEME === 'fun' ? '#1e2350' : '#1f3029' },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href:
          import.meta.env.VITE_THEME === 'fun'
            ? 'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap'
            : 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NZ">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  )
}
