import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Facebook,
  Gamepad2,
  Heart,
  MapPin,
  Menu,
  Phone,
  Puzzle,
  Search,
  ShieldCheck,
  ShoppingBag,
  Star,
  Ticket,
  Users,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

// Prefixes public asset paths with the site's base path (set in vite.config.ts),
// so images resolve correctly whether the site is hosted at a domain root or a subfolder.
const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

const rooms = [
  {
    id: 'sherlock',
    name: 'Sherlock',
    kicker: 'A case left unfinished',
    description:
      'Moriarty is going to strike again. Follow the legendary detective’s trail, connect the clues and finish what Sherlock started.',
    players: '3–7',
    minPlayers: 3,
    maxPlayers: 7,
    duration: 60,
    image: asset('/images/sherlock.jpg'),
    accent: '#d05238',
    code: 'BTB-01',
  },
  {
    id: 'christmas',
    name: 'Saving Christmas',
    kicker: 'Festive chaos awaits',
    description:
      'Granny has mixed up the turkey, lights and stockings. Put everything right before the big day is completely derailed.',
    players: '3–8',
    minPlayers: 3,
    maxPlayers: 8,
    duration: 60,
    image: asset('/images/christmas.jpg'),
    accent: '#55715c',
    code: 'BTB-02',
    badge: 'Designed & built by us',
  },
  {
    id: 'gregg',
    name: 'Gregg in the Box',
    kicker: 'Small box, big mystery',
    description:
      'An unexpected package may contain Daisy’s long-lost robot. Think beyond the box, crack it open and discover what is inside.',
    players: '3–5',
    minPlayers: 3,
    maxPlayers: 5,
    duration: 60,
    image: asset('/images/gregg.jpg'),
    accent: '#b78b3d',
    code: 'BTB-03',
  },
]

type Room = (typeof rooms)[number] & { badge?: string }

// Portable games: The Cube is played here at BtB; Pirate's Cove can also be hired out for parties at home.
const cube = {
  id: 'cube',
  name: 'The Cube',
  kicker: 'The entry test',
  description:
    'An elite task force is being assembled, and The Cube is the test that sorts the best from the rest. Crack every side to prove your team has what it takes.',
  players: '2–4',
  minPlayers: 2,
  maxPlayers: 4,
  duration: 60,
  image: asset('/images/the-cube.jpg'),
  accent: '#07a3b3',
  code: 'BTB-04',
}

const piratesCove = {
  id: 'pirates',
  name: 'Pirate’s Cove',
  kicker: 'Party at your place',
  description:
    'A locked pirate treasure chest packed with puzzles. Hire it for a pirate party at your own house and let the crew race to claim the treasure.',
  durationText: '40–60 min',
  image: asset('/images/pirates-cove.jpg'),
  accent: '#c75539',
}

const bookable: Room[] = [...rooms, cube]

const reviews = [
  {
    quote:
      'Professional and intriguing puzzles. We had a great time as a family and booked another room straight away.',
    name: 'Natasha Macaulay',
    detail: 'Sherlock escapee',
  },
  {
    quote:
      'The staff are friendly and never make you feel silly when you need a clue. We will definitely be back for more.',
    name: 'Kayla Peach',
    detail: 'Gregg in the Box escapee',
  },
  {
    quote:
      'Super friendly, fun and excited about what they do. The puzzles are satisfying and reward out-of-the-box thinking.',
    name: 'Amy Teegan',
    detail: 'Repeat puzzle solver',
  },
]

const slots = ['Afternoon', 'Early evening', 'Evening', 'Holiday daytime']
// Relative to the site, so it works on btbescaperooms.co.nz and on btb-app.pages.dev
const bookingUrl = '/test/booking_widget.html'


// ---- Board games: live list of games for sale, straight from the BtB app's POS products ----
// Uses the public (anon) key that the booking widget already uses; only name + price are requested.
const SB_URL = 'https://dcksohetvlonijtcbjwe.supabase.co'
const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRja3NvaGV0dmxvbmlqdGNiandlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NTQ1NzgsImV4cCI6MjA5NjQzMDU3OH0.M_oDB2e0upZUYZijNmigsmXtcKaAFx8iF-nn5FZUkzk'
type ShopGame = { name: string; sell_price: number }

function BoardGamesSection() {
  const [games, setGames] = useState<ShopGame[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [query, setQuery] = useState('')
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const url = `${SB_URL}/rest/v1/products?select=name,sell_price&category=eq.Boardgame&active=eq.true&stock_qty=gt.0&sell_price=gt.0&order=name`
    fetch(url, { headers: { apikey: SB_ANON, Authorization: `Bearer ${SB_ANON}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((rows: ShopGame[]) => setGames(rows))
      .catch(() => setFailed(true))
  }, [])

  const q = query.trim().toLowerCase()
  const matches = (games ?? []).filter((g) => !q || g.name.toLowerCase().includes(q))
  const shown = showAll || q ? matches : matches.slice(0, 24)
  const price = (n: number) => `$${Number(n) % 1 ? Number(n).toFixed(2) : Number(n)}`

  return (
    <section className="boardgames-section" id="boardgames">
      <div className="section-heading">
        <div>
          <p className="eyebrow dark"><span /> Board games</p>
          <h2>Roll the dice.<br /><em>Take one home.</em></h2>
        </div>
        <p>Take a game home. We sell board games new and secondhand, and the list below comes straight from our shelves, so it’s always up to date.</p>
      </div>

      <div className="bg-grid">
        <div className="bg-shop">
          <div className="bg-shop-head">
            <div>
              <small>Games for sale</small>
              <h3>{games ? `${games.length} games on our shelves` : 'Games on our shelves'}</h3>
            </div>
            <label className="bg-search">
              <Search size={17} />
              <input type="search" placeholder="Search for a game…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search games for sale" />
            </label>
          </div>

          {failed && <p className="bg-note">We couldn’t load the list just now. Give us a call on 022 053 7365 and we’ll check for you.</p>}
          {!games && !failed && <p className="bg-note">Loading games…</p>}
          {games && (
            <>
              <ul className="bg-list">
                {shown.map((g, i) => (
                  <li key={`${g.name}-${i}`}><span>{g.name}</span><strong>{price(g.sell_price)}</strong></li>
                ))}
              </ul>
              {q && matches.length === 0 && <p className="bg-note">No match for “{query}” right now.</p>}
              {!q && !showAll && matches.length > 24 && (
                <button type="button" className="bg-more" onClick={() => setShowAll(true)}>Show all {matches.length} games <ChevronRight size={16} /></button>
              )}
            </>
          )}
          <div className="bg-wishlist">
            <Heart size={18} />
            <span>Can’t see the game you want? <a href="/test/game_wishlist_form.html" target="_blank" rel="noreferrer">Join our wishlist</a> and we’ll let you know when a copy comes in.</span>
          </div>
          <p className="bg-fineprint">Stock changes daily. Prices in NZD. Come in, call or message us to buy.</p>
        </div>
      </div>
    </section>
  )
}

function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [selectedRoom, setSelectedRoom] = useState<Room>(rooms[0])
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [players, setPlayers] = useState(3)
  const [firstName, setFirstName] = useState('')
  const [frontReview, setFrontReview] = useState<number | null>(null)

  // Keep the nav sitting just below the preview notice, whatever height it wraps to
  useEffect(() => {
    const el = document.querySelector<HTMLElement>('.demo-notice')
    if (!el) return
    const set = () => document.documentElement.style.setProperty('--notice-h', `${el.offsetHeight}px`)
    set()
    window.addEventListener('resize', set)
    return () => window.removeEventListener('resize', set)
  }, [])

  const minDate = useMemo(
    () =>
      new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Pacific/Auckland',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(new Date()),
    [],
  )
  const total = Math.max(players * 35, 105)
  const steps = ['Room', 'When', 'Group', 'Review']

  const formattedDate = date
    ? new Intl.DateTimeFormat('en-NZ', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      }).format(new Date(`${date}T12:00:00`))
    : 'Choose date'

  const canContinue =
    step === 0 || (step === 1 && Boolean(date && time)) || step === 2 || step === 3

  const goToBooking = () => {
    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main>
      <div className="demo-notice" role="status">
        <strong>Preview site:</strong> our main website and email are temporarily down, so this unfinished preview of our new site is standing in.
        Questions? Call <a href="tel:0220537365">022 053 7365</a> or message us on <a href="https://www.facebook.com/btbescaperooms" target="_blank" rel="noreferrer">Facebook</a>.
      </div>
      <nav className="site-nav" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="Beyond the Box home">
          <img src={asset('/images/btb-logo.png')} alt="" />
          <span>
            <strong>Beyond the Box</strong>
            <small>Escape Rooms · Hastings</small>
          </span>
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <a href="#rooms" onClick={() => setMenuOpen(false)}>Rooms</a>
          <a href="#portable" onClick={() => setMenuOpen(false)}>Escape room in a box</a>
          <a href="#vr" onClick={() => setMenuOpen(false)}>VR chairs</a>
          <a href="#boardgames" onClick={() => setMenuOpen(false)}>Board games</a>
          <a href="#visit" onClick={() => setMenuOpen(false)}>Visit</a>
          <button className="nav-book" type="button" onClick={goToBooking}>
            Get tickets <Ticket size={17} />
          </button>
        </div>
      </nav>

      <header className="hero" id="top">
        <div className="hero-photo" aria-hidden="true" />
        <div className="hero-scrim" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />

        <div className="hero-content">
          <div className="eyebrow reveal reveal-1">
            <span /> Hawke’s Bay’s home of curious minds
          </div>
          <h1 className="reveal reveal-2">
            Step inside.
            <em>Think beyond.</em>
          </h1>
          <p className="hero-copy reveal reveal-3">
            Escape rooms built and run right here in Hastings. Friendly for first-timers, and a real challenge for experienced players.
          </p>
          <div className="hero-actions reveal reveal-4">
            <button className="button primary" type="button" onClick={goToBooking}>
              Choose your adventure <ArrowRight size={19} />
            </button>
            <a className="text-link" href="#rooms">Explore the rooms <ChevronRight size={18} /></a>
          </div>
        </div>

        <div className="hero-proof reveal reveal-4">
          <div className="proof-score">
            <strong>5.0</strong>
            <span className="stars" aria-label="5 out of 5 stars">
              {[0, 1, 2, 3, 4].map((star) => <Star key={star} size={13} fill="currentColor" />)}
            </span>
          </div>
          <p>“Professional and intriguing puzzles.”</p>
          <small>Google reviews</small>
        </div>

        <div className="scroll-note" aria-hidden="true"><span /> Scroll to investigate</div>
      </header>

      <section className="intro-strip" aria-label="Experience details">
        <div><Clock3 /><span><strong>60</strong> minute adventures</span></div>
        <div><Users /><span><strong>2–8</strong> players</span></div>
        <div><MapPin /><span><strong>Hastings</strong> Hawke’s Bay</span></div>
        <div><Puzzle /><span><strong>Local</strong> owned & run</span></div>
      </section>

      <section className="rooms-section" id="rooms">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark"><span /> Case files</p>
            <h2>Pick your<br /><em>puzzle.</em></h2>
          </div>
          <p>Our rooms are set up and run by us here in Hastings, including Saving Christmas, which we designed and built from scratch. Expect hands-on puzzles, plenty of “aha!” moments and a friendly game master looking after you.</p>
        </div>

        <div className="room-grid">
          {rooms.map((room, index) => (
            <article className="room-card" key={room.id} style={{ '--room-accent': room.accent } as React.CSSProperties}>
              <div className="room-image-wrap">
                <img src={room.image} alt={`${room.name} escape room`} />
                <span className="case-number">0{index + 1}</span>
                <span className="open-stamp">{(room as Room).badge ?? 'Open now'}</span>
              </div>
              <div className="room-card-body">
                <p>{room.kicker}</p>
                <h3>{room.name}</h3>
                <div className="room-meta">
                  <span><Clock3 size={15} /> {room.duration} min</span>
                  <span><Users size={15} /> {room.players} players</span>
                  <span><Puzzle size={15} /> Challenging</span>
                </div>
                <p className="room-description">{room.description}</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRoom(room)
                    setPlayers(Math.min(Math.max(players, room.minPlayers), room.maxPlayers))
                    setStep(1)
                    goToBooking()
                  }}
                >
                  Book this room <ArrowRight size={17} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rooms-section portable-section" id="portable">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark"><span /> Escape rooms in a box</p>
            <h2>Puzzles in<br /><em>a box.</em></h2>
          </div>
          <p>A whole escape room packed into a single box or chest. Play The Cube here at Beyond the Box, or bring Pirate’s Cove home for a pirate party.</p>
        </div>

        <div className="room-grid two">
          <article className="room-card" style={{ '--room-accent': cube.accent } as React.CSSProperties}>
            <div className="room-image-wrap">
              <img src={cube.image} alt="The Cube portable escape game" />
              <span className="open-stamp">Play at BtB</span>
            </div>
            <div className="room-card-body">
              <p>{cube.kicker}</p>
              <h3>{cube.name}</h3>
              <div className="room-meta">
                <span><Clock3 size={15} /> About an hour</span>
                <span><Users size={15} /> {cube.players} players</span>
                <span><Ticket size={15} /> $35 pp</span>
              </div>
              <p className="room-description">{cube.description} <em>Minimum cost of 3 players.</em></p>
              <button
                type="button"
                onClick={() => {
                  setSelectedRoom(cube)
                  setPlayers(Math.min(Math.max(players, cube.minPlayers), cube.maxPlayers))
                  setStep(1)
                  goToBooking()
                }}
              >
                Book The Cube <ArrowRight size={17} />
              </button>
            </div>
          </article>

          <article className="room-card" style={{ '--room-accent': piratesCove.accent } as React.CSSProperties}>
            <div className="room-image-wrap">
              <img src={piratesCove.image} alt="Pirate’s Cove treasure chest escape game" />
              <span className="open-stamp">Hire it for home</span>
            </div>
            <div className="room-card-body">
              <p>{piratesCove.kicker}</p>
              <h3>{piratesCove.name}</h3>
              <div className="room-meta">
                <span><Clock3 size={15} /> {piratesCove.durationText}</span>
                <span><MapPin size={15} /> At your house</span>
                <span><Puzzle size={15} /> Pirate parties</span>
              </div>
              <p className="room-description">{piratesCove.description}</p>
              <a className="card-link" href="tel:0220537365">
                Call to hire Pirate’s Cove <ArrowRight size={17} />
              </a>
            </div>
          </article>
        </div>
      </section>

      <section className="vr-section" id="vr">
        <div className="vr-copy">
          <p className="eyebrow light"><span /> Virtual reality</p>
          <h2>Strap in.<br /><em>Hold on.</em></h2>
          <p className="lead">Climb into one of our VR chairs and get lost in another world. A quick thrill on its own, or the perfect add-on before or after your escape room.</p>
          <img className="vr-photo" src={asset('/images/vr-chairs.jpg')} alt="Two people riding the VR chairs" />
        </div>
        <div className="vr-prices">
          <div className="vr-price">
            <Gamepad2 />
            <small>Casual</small>
            <strong>from $10</strong>
            <span>per person, per ride</span>
          </div>
          <div className="vr-price featured">
            <Clock3 />
            <small>By the hour</small>
            <strong>$150</strong>
            <span>unlimited rides for your group</span>
          </div>
          <a className="button cream" href="tel:0220537365">Call to book VR <Phone size={18} /></a>
        </div>
      </section>

      <BoardGamesSection />

      <section className="experience-section" id="experience">
        <div className="experience-photo">
          <img src={asset('/images/experience.jpg')} alt="Players enjoying a Beyond the Box experience" />
          <div className="photo-note">
            <Puzzle size={20} />
            <span><strong>Locally run</strong>Local rooms. Friendly faces.</span>
          </div>
        </div>
        <div className="experience-copy">
          <p className="eyebrow light"><span /> More than padlocks</p>
          <h2>A proper<br /><em>brain buzz.</em></h2>
          <p className="lead">The best escape rooms make time disappear. For one hour, the phones go away, the team clicks into gear and every small discovery feels enormous.</p>
          <div className="experience-list">
            <div><span>01</span><p><strong>Gather your crew</strong>Friends, whānau, colleagues or a very confident date.</p></div>
            <div><span>02</span><p><strong>Follow the story</strong>Search, connect, experiment and ask for a hint if you need one.</p></div>
            <div><span>03</span><p><strong>Beat the clock</strong>Make your escape—or leave with a very good story either way.</p></div>
          </div>
          <div className="experience-extras">
            <div><Gamepad2 /><span><strong>Also on site</strong>VR chairs</span></div>
            <div><Puzzle /><span><strong>Grab a box</strong>Escape rooms in a box</span></div>
            <div><ShoppingBag /><span><strong>Board games</strong>For sale, new & secondhand</span></div>
          </div>
        </div>
      </section>

      <section className="booking-section" id="book">
        <div className="booking-heading">
          <p className="eyebrow dark"><span /> Box office</p>
          <h2>Your next great<br /><em>story starts here.</em></h2>
          <p>Build your ticket below, then continue to the live booking calendar to confirm current availability.</p>
        </div>

        <div className="booking-shell">
          <div className="booking-form">
            <div className="stepper" aria-label="Booking progress">
              {steps.map((label, index) => (
                <button
                  type="button"
                  className={index === step ? 'active' : index < step ? 'done' : ''}
                  key={label}
                  onClick={() => index <= step && setStep(index)}
                  disabled={index > step}
                >
                  <span>{index < step ? <Check size={14} /> : index + 1}</span>{label}
                </button>
              ))}
            </div>

            <div className="booking-panel" key={step}>
              {step === 0 && (
                <>
                  <p className="panel-kicker">Step 1 of 4</p>
                  <h3>Which case are you taking?</h3>
                  <div className="booking-room-list">
                    {bookable.map((room) => (
                      <button
                        type="button"
                        className={selectedRoom.id === room.id ? 'selected' : ''}
                        onClick={() => {
                          setSelectedRoom(room)
                          setPlayers(Math.min(Math.max(players, room.minPlayers), room.maxPlayers))
                        }}
                        key={room.id}
                      >
                        <img src={room.image} alt="" />
                        <span><strong>{room.name}</strong><small>{room.duration} min · {room.players} players</small></span>
                        <span className="radio-dot"><Check size={13} /></span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <p className="panel-kicker">Step 2 of 4</p>
                  <h3>When are you escaping?</h3>
                  <label className="field-label" htmlFor="booking-date">Preferred date</label>
                  <div className="date-field">
                    <CalendarDays size={19} />
                    <input id="booking-date" type="date" min={minDate} value={date} onChange={(event) => setDate(event.target.value)} />
                  </div>
                  <label className="field-label">Preferred time</label>
                  <div className="slot-grid">
                    {slots.map((slot) => (
                      <button type="button" className={time === slot ? 'selected' : ''} onClick={() => setTime(slot)} key={slot}>{slot}</button>
                    ))}
                  </div>
                  <p className="availability-note"><ShieldCheck size={16} /> Live availability is confirmed in the final booking calendar.</p>
                </>
              )}

              {step === 2 && (
                <>
                  <p className="panel-kicker">Step 3 of 4</p>
                  <h3>How many are in your crew?</h3>
                  <div className="player-control">
                    <button type="button" aria-label="Remove a player" onClick={() => setPlayers(Math.max(1, players - 1))}>−</button>
                    <div><strong>{players}</strong><span>{players === 1 ? 'player' : 'players'}</span></div>
                    <button type="button" aria-label="Add a player" onClick={() => setPlayers(Math.min(selectedRoom.maxPlayers, players + 1))}>+</button>
                  </div>
                  <div className="price-explainer">
                    <span>Room total</span><strong>${total} NZD</strong>
                    <small>{players < 3 ? 'Room minimum applies' : `$35 × ${players} players`}</small>
                  </div>
                  <label className="field-label" htmlFor="first-name">First name for the ticket <span>optional</span></label>
                  <input className="text-field" id="first-name" type="text" placeholder="Your name" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
                </>
              )}

              {step === 3 && (
                <div className="review-panel">
                  <div className="review-icon"><Check /></div>
                  <p className="panel-kicker">Your ticket is ready</p>
                  <h3>One last step.</h3>
                  <p>Continue to Beyond the Box’s live calendar to check the exact session and securely confirm your booking.</p>
                  <a className="button primary wide" href={bookingUrl} target="_blank" rel="noreferrer">
                    Check live times & book <ArrowRight size={19} />
                  </a>
                  <small className="new-window-note">Opens the active Beyond the Box booking calendar</small>
                </div>
              )}
            </div>

            <div className="booking-controls">
              <button type="button" className="back-button" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
                <ChevronLeft size={18} /> Back
              </button>
              {step < 3 && (
                <button type="button" className="button primary" disabled={!canContinue} onClick={() => setStep(step + 1)}>
                  Continue <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>

          <aside className="live-ticket" aria-label="Live booking ticket">
            <div className="ticket-topline"><span>Beyond the Box</span><span>Admit {players}</span></div>
            <div className="ticket-art" style={{ backgroundImage: `linear-gradient(180deg, transparent, rgba(25, 24, 20, .88)), url(${selectedRoom.image})` }}>
              <span>{selectedRoom.code}</span>
              <h3>{selectedRoom.name}</h3>
            </div>
            <div className="ticket-details">
              <div><span>Date</span><strong>{formattedDate}</strong></div>
              <div><span>Time</span><strong>{time || 'Choose time'}</strong></div>
              <div><span>Players</span><strong>{players}</strong></div>
              <div><span>Duration</span><strong>{selectedRoom.duration} min</strong></div>
            </div>
            <div className="ticket-total">
              <span>{firstName ? `Reserved for ${firstName}` : 'Your adventure'}</span>
              <strong>${total}</strong>
            </div>
            <div className="barcode" aria-hidden="true"><span>BTB · HASTINGS · {selectedRoom.code}</span></div>
          </aside>
        </div>
      </section>

      <section className="reviews-section">
        <div className="reviews-heading">
          <div><strong>5.0</strong><div className="stars">{[0, 1, 2, 3, 4].map((star) => <Star key={star} fill="currentColor" />)}</div></div>
          <h2>Escaped with<br /><em>good stories.</em></h2>
          <p>Based on Google reviews from real players.</p>
        </div>
        <div className="review-stack">
          {reviews.map((review, index) => (
            <blockquote
              key={review.name}
              className={`review-card review-${index + 1}${frontReview === index ? ' review-front' : ''}`}
              onClick={() => setFrontReview(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  setFrontReview(index)
                }
              }}
            >
              <span className="quote-mark">“</span>
              <p>{review.quote}</p>
              <footer><strong>{review.name}</strong><span>{review.detail}</span></footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="visit-section" id="visit">
        <div className="visit-main">
          <p className="eyebrow light"><span /> Plan your visit</p>
          <h2>Ready when<br /><em>you are.</em></h2>
          <p>Sessions run by appointment, so booking ahead is the best way to get the room and time you want.</p>
          <div className="contact-links">
            <a href="tel:0220537365"><Phone /> <span><small>Call us</small>022 053 7365</span></a>
            <a href="https://www.facebook.com/btbescaperooms" target="_blank" rel="noreferrer"><Facebook /> <span><small>Message us</small>Facebook</span></a>
          </div>
        </div>
        <div className="hours-card">
          <div className="hours-title"><Clock3 /><span><small>Opening hours</small>By appointment</span></div>
          <div className="hours-row"><span>Open</span><strong>3:15 pm – 8:30 pm</strong></div>
          <div className="hours-row"><span>School & public holidays</span><strong>10:00 am – 8:30 pm</strong></div>
          <p>Need another time? Give us a call and we’ll see what we can do.</p>
          <button className="button cream" type="button" onClick={goToBooking}>Build your ticket <Ticket size={18} /></button>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-brand"><img src={asset('/images/btb-logo.png')} alt="Beyond the Box" /><p>Escape rooms, escape rooms in a box, VR and board games, run by us in Hastings, New Zealand.</p></div>
        <div><strong>Explore</strong><a href="#rooms">Escape rooms</a><a href="#portable">Escape rooms in a box</a><a href="#vr">VR chairs</a><a href="#boardgames">Board games</a><a href="#book">Book a session</a></div>
        <div><strong>Visit</strong><a href="#visit">Opening hours</a><a href="tel:0220537365">022 053 7365</a><a href="https://www.facebook.com/btbescaperooms" target="_blank" rel="noreferrer">Facebook</a></div>
        <div className="footer-ticket"><Ticket /><span><small>Room entry from</small><strong>$35</strong> per person</span></div>
        <p className="copyright">© {new Date().getFullYear()} Beyond the Box Escape Rooms</p>
      </footer>
    </main>
  )
}
