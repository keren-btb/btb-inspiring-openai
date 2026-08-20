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
          'Original escape rooms, VR experiences and board games in Hastings, Hawke’s Bay. Gather your crew and book your next adventure.',
      },
      { name: 'theme-color', content: '#1f3029' },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap',
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
