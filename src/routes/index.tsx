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
  MapPin,
  Menu,
  Phone,
  Puzzle,
  ShieldCheck,
  Star,
  Ticket,
  Users,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'

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
    duration: 45,
    image: asset('/images/gregg.jpg'),
    accent: '#b78b3d',
    code: 'BTB-03',
  },
]

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

const slots = ['10:00 am', '12:00 pm', '2:30 pm', '4:30 pm', '6:30 pm']
const bookingUrl = 'https://www.btbescaperooms.co.nz/test/booking_widget.html'

function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [selectedRoom, setSelectedRoom] = useState(rooms[0])
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [players, setPlayers] = useState(3)
  const [firstName, setFirstName] = useState('')
  const [frontReview, setFrontReview] = useState<number | null>(null)

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
          <a href="#experience" onClick={() => setMenuOpen(false)}>The experience</a>
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
            Hand-built escape rooms, devious clues and wonderfully unexpected stories—made for teams who like their fun with a little mystery.
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
          <p>“Clever, satisfying and seriously good fun.”</p>
          <small>Google reviews</small>
        </div>

        <div className="scroll-note" aria-hidden="true"><span /> Scroll to investigate</div>
      </header>

      <section className="intro-strip" aria-label="Experience details">
        <div><Clock3 /><span><strong>45–60</strong> minute adventures</span></div>
        <div><Users /><span><strong>3–8</strong> players per room</span></div>
        <div><MapPin /><span><strong>Hastings</strong> Hawke’s Bay</span></div>
        <div><Puzzle /><span><strong>100%</strong> original puzzles</span></div>
      </section>

      <section className="rooms-section" id="rooms">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark"><span /> Case files</p>
            <h2>Pick your<br /><em>puzzle.</em></h2>
          </div>
          <p>Every room is designed and built here in Hastings. No cookie-cutter puzzles—just layered stories, tactile surprises and satisfying breakthroughs.</p>
        </div>

        <div className="room-grid">
          {rooms.map((room, index) => (
            <article className="room-card" key={room.id} style={{ '--room-accent': room.accent } as React.CSSProperties}>
              <div className="room-image-wrap">
                <img src={room.image} alt={`${room.name} escape room`} />
                <span className="case-number">0{index + 1}</span>
                <span className="open-stamp">Open now</span>
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

      <section className="experience-section" id="experience">
        <div className="experience-photo">
          <img src={asset('/images/experience.jpg')} alt="Players enjoying a Beyond the Box experience" />
          <div className="photo-note">
            <Puzzle size={20} />
            <span><strong>Made here</strong>Original rooms. Local minds.</span>
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
            <div><Gamepad2 /><span><strong>Also on site</strong>VR experiences</span></div>
            <div><Puzzle /><span><strong>Take a seat</strong>Board game café</span></div>
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
                    {rooms.map((room) => (
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
          <div className="hours-row"><span>Tuesday – Friday</span><strong>3:00 pm – 8:30 pm</strong></div>
          <div className="hours-row"><span>Saturday</span><strong>10:00 am – 8:30 pm</strong></div>
          <div className="hours-row"><span>School & public holidays</span><strong>9:00 am – 8:30 pm</strong></div>
          <p>Need another time? Give us a call and we’ll see what we can do.</p>
          <button className="button cream" type="button" onClick={goToBooking}>Build your ticket <Ticket size={18} /></button>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-brand"><img src={asset('/images/btb-logo.png')} alt="Beyond the Box" /><p>Original escape rooms, built with curiosity in Hastings, New Zealand.</p></div>
        <div><strong>Explore</strong><a href="#rooms">Escape rooms</a><a href="#experience">How it works</a><a href="#book">Book a session</a></div>
        <div><strong>Visit</strong><a href="#visit">Opening hours</a><a href="tel:0220537365">022 053 7365</a><a href="https://www.facebook.com/btbescaperooms" target="_blank" rel="noreferrer">Facebook</a></div>
        <div className="footer-ticket"><Ticket /><span><small>Room entry from</small><strong>$35</strong> per person</span></div>
        <p className="copyright">© {new Date().getFullYear()} Beyond the Box Escape Rooms</p>
      </footer>
    </main>
  )
}
