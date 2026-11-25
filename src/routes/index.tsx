import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Dices,
  Facebook,
  Gamepad2,
  Heart,
  MapPin,
  Menu,
  Phone,
  Puzzle,
  Search,
  ShieldCheck,
  Key,
  Lightbulb,
  Lock,
  LockOpen,
  Hourglass,
  Compass,
  Flashlight,
  Gem,
  Anchor,
  Crown,
  Ghost,
  Map as MapIcon,
  Rocket,
  Bell,
  Briefcase,
  PartyPopper,
  ShoppingBag,
  Star,
  Ticket,
  Users,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import '../fun.css'

// Two looks from one set of content: the default (editorial) and FUN (bright, quirky).
// Build the fun one with VITE_THEME=fun (see vite.config.ts).
const FUN = import.meta.env.VITE_THEME === 'fun'
const t = <T,>(fun: T, plain: T): T => (FUN ? fun : plain)

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
  kicker: 'Ahoy, treasure hunters',
  description:
    'A locked pirate treasure chest packed with puzzles. Play it here at BtB, or hire it for a pirate party at your own house and let the crew race to claim the treasure.',
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
// Uses the public (anon) key that the booking widget already uses.
const SB_URL = 'https://dcksohetvlonijtcbjwe.supabase.co'
const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRja3NvaGV0dmxvbmlqdGNiandlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NTQ1NzgsImV4cCI6MjA5NjQzMDU3OH0.M_oDB2e0upZUYZijNmigsmXtcKaAFx8iF-nn5FZUkzk'
type ShopGame = { name: string; sell_price: number }

// ---- Crack the code: a weekly escape-room warm-up puzzle ----
// A new puzzle every Monday (NZ time), generated from the week number so everyone sees the same one
// all week and nothing needs updating by hand. The TYPE of puzzle rotates each week too:
// symbol sums → riddle cipher → number patterns → clock code → count it up → (repeat).
// Every puzzle ends in a 4-digit code with exactly one answer.
type LockIcon = typeof Key
type Sym = { icon: LockIcon; name: string }
const ICON_POOL: Sym[] = [
  { icon: Dices, name: 'dice' }, { icon: Key, name: 'key' }, { icon: Puzzle, name: 'puzzle piece' },
  { icon: Clock3, name: 'clock' }, { icon: Hourglass, name: 'hourglass' }, { icon: Compass, name: 'compass' },
  { icon: Flashlight, name: 'torch' }, { icon: Gem, name: 'gem' }, { icon: Anchor, name: 'anchor' },
  { icon: Crown, name: 'crown' }, { icon: Ghost, name: 'ghost' }, { icon: Search, name: 'magnifying glass' },
  { icon: MapIcon, name: 'map' }, { icon: Star, name: 'star' }, { icon: Rocket, name: 'rocket' }, { icon: Bell, name: 'bell' },
]
// Riddle answers use only the letters A–I, so each letter is one digit (A=1 … I=9)
const RIDDLES: { word: string; riddle: string; topic: string }[] = [
  { word: 'DICE', riddle: 'You roll us to find out how far to move.', topic: 'board games' },
  { word: 'HIDE', riddle: 'What you do in hide-and-seek when you’re not the seeker.', topic: 'a playground game' },
  { word: 'FACE', riddle: 'Every clock has one, and so do you.', topic: 'something with eyes, or hands' },
  { word: 'CAFE', riddle: 'A cosy place to grab a coffee and a slice of cake.', topic: 'somewhere to eat' },
  { word: 'BEAD', riddle: 'A tiny ball with a hole through it, threaded onto a necklace.', topic: 'jewellery' },
  { word: 'HEAD', riddle: 'It sits on top of your shoulders and does all your thinking.', topic: 'your body' },
  { word: 'IDEA', riddle: 'A light-bulb moment, when you suddenly know what to do.', topic: 'thinking' },
  { word: 'CAGE', riddle: 'A locked room for a bird. No escape for this one!', topic: 'pets' },
  { word: 'CHEF', riddle: 'The boss of a restaurant kitchen, often in a tall white hat.', topic: 'jobs' },
  { word: 'EDGE', riddle: 'The very outside of a coin, a table or a cliff.', topic: 'shapes' },
  { word: 'FADE', riddle: 'What bright colours slowly do when left in the sun.', topic: 'colours' },
  { word: 'ACHE', riddle: 'A dull pain, like a tummy ___ after too much chocolate.', topic: 'feeling unwell' },
  { word: 'HIGH', riddle: 'The opposite of low.', topic: 'opposites' },
]
type Clue = { parts: number[]; ops: string[]; total: number }
type DialLabel = { sym?: Sym; text?: string; name: string }
type WeeklyPuzzle = {
  week: number
  kind: 'sums' | 'cipher' | 'sequence' | 'clocks' | 'count'
  title: string
  intro: string
  answer: number[]
  hints: string[]
  dials: DialLabel[]
  syms: Sym[]
  clues: Clue[]
  riddle?: (typeof RIDDLES)[number]
  sequences?: number[][]
  hours?: number[]
  grid?: { sym: number; tilt: number }[] // sym index: 0–3 = targets, 4+ = decoys
}
const LETTERS = ['A', 'B', 'C', 'D']

function nzWeekNumber(now = new Date()) {
  const ymd = new Intl.DateTimeFormat('en-CA', { timeZone: 'Pacific/Auckland', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now)
  const days = Math.floor(Date.UTC(+ymd.slice(0, 4), +ymd.slice(5, 7) - 1, +ymd.slice(8, 10)) / 86400000)
  return Math.floor((days - 4) / 7) // 1970-01-05 was a Monday (day 4)
}
function rng(seed: number) {
  let a = seed * 2654435761 + 12345
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const KINDS: WeeklyPuzzle['kind'][] = ['sums', 'cipher', 'sequence', 'clocks', 'count']

function makePuzzle(week: number): WeeklyPuzzle {
  const r = rng(week)
  const pick = (n: number) => Math.floor(r() * n)
  const pool = [...ICON_POOL]
  const syms = Array.from({ length: 8 }, () => pool.splice(pick(pool.length), 1)[0]) // 4 targets + 4 decoys
  const kind = KINDS[((week % KINDS.length) + KINDS.length) % KINDS.length]
  const base = { week, kind, syms, clues: [] as Clue[] }

  if (kind === 'cipher') {
    const rid = RIDDLES[Math.floor(week / KINDS.length) % RIDDLES.length]
    const answer = rid.word.split('').map((ch) => ch.charCodeAt(0) - 64)
    return {
      ...base, riddle: rid, answer, title: 'Riddle cipher',
      intro: 'Solve the riddle to find a 4-letter word, then turn each letter into its number using the key (A=1, B=2 …). Dial the numbers in order.',
      dials: LETTERS.map((_, i) => ({ text: `${i + 1}`, name: `letter ${i + 1}` })),
      hints: [`The answer is to do with ${rid.topic}.`, `The word starts with ${rid.word[0]}.`, `The word is ${rid.word}. Now use the key!`],
    }
  }
  if (kind === 'sequence') {
    const answer = Array.from({ length: 4 }, () => 1 + pick(9))
    const sequences = answer.map((d) => {
      const style = pick(3)
      if (style === 2) { // repeating pair
        let other = 1 + pick(9); if (other === d) other = (d % 9) + 1
        return [d, other, d, other] // next number is d again
      }
      const k = 1 + pick(3)
      const up = style === 0 ? d - 4 * k >= 0 : !(d + 4 * k <= 30)
      return up ? [d - 4 * k, d - 3 * k, d - 2 * k, d - k] : [d + 4 * k, d + 3 * k, d + 2 * k, d + k]
    })
    return {
      ...base, sequences, answer, title: 'What comes next?',
      intro: 'Each row is a number pattern with the next number missing. Work out each missing number and dial them in order, A to D.',
      dials: LETTERS.map((l) => ({ text: l, name: `pattern ${l}` })),
      hints: ['Look at how much each number goes up or down by.', 'Some patterns just repeat. Look for a back-and-forth.', `Pattern A’s missing number is ${answer[0]}.`],
    }
  }
  if (kind === 'clocks') {
    const answer = Array.from({ length: 4 }, () => 1 + pick(9))
    return {
      ...base, hours: answer, answer, title: 'Clock code',
      intro: 'Four clocks, four numbers. What hour is each clock showing? Dial the hours in order, A to D.',
      dials: LETTERS.map((l) => ({ text: l, name: `clock ${l}` })),
      hints: ['The short hand points to the hour.', 'The long hand is on the 12, so each clock shows an exact hour (like 3 o’clock).', `Clock A shows ${answer[0]} o’clock.`],
    }
  }
  if (kind === 'count') {
    const answer = Array.from({ length: 4 }, () => 1 + pick(6))
    const cells: { sym: number; tilt: number }[] = []
    answer.forEach((n, i) => { for (let k = 0; k < n; k++) cells.push({ sym: i, tilt: 0 }) })
    while (cells.length < 32) cells.push({ sym: 4 + pick(4), tilt: 0 })
    for (let i = cells.length - 1; i > 0; i--) { const j = pick(i + 1); [cells[i], cells[j]] = [cells[j], cells[i]] }
    cells.forEach((c) => (c.tilt = pick(41) - 20))
    return {
      ...base, grid: cells, answer, title: 'Count it up',
      intro: 'Count how many of each symbol on the lock are hiding in the jumble. Ignore the others! Dial each count into its matching dial.',
      dials: syms.slice(0, 4).map((sym) => ({ sym, name: sym.name })),
      hints: ['Go row by row and keep a tally for each symbol.', 'Each symbol appears between 1 and 6 times.', `There are ${answer[0]} of the ${syms[0].name}.`],
    }
  }
  // 'sums'
  const v = Array.from({ length: 4 }, () => 1 + pick(9))
  const clues: Clue[] = []
  const hints: string[] = []
  const n = (i: number) => syms[i].name
  if (r() < 0.6) {
    clues.push({ parts: [0, 0], ops: ['+'], total: v[0] * 2 })
    hints.push(`Start with the first clue: two of the ${n(0)} make ${v[0] * 2}, so one ${n(0)} is half of that.`)
  } else {
    clues.push({ parts: [0, 0, 0], ops: ['+', '+'], total: v[0] * 3 })
    hints.push(`Start with the first clue: three of the ${n(0)} make ${v[0] * 3}, so one ${n(0)} is a third of that.`)
  }
  for (let i = 1; i < 4; i++) {
    const a = v[i - 1], b = v[i]
    const choice = r()
    if (choice < 0.5 || (choice < 0.75 && a === b)) clues.push({ parts: [i - 1, i], ops: ['+'], total: a + b })
    else if (choice < 0.75) clues.push(a > b ? { parts: [i - 1, i], ops: ['−'], total: a - b } : { parts: [i, i - 1], ops: ['−'], total: b - a })
    else clues.push({ parts: [i - 1, i], ops: ['×'], total: a * b })
    hints.push(i === 1 ? `Now you know the ${n(0)}, the next clue gives you the ${n(1)}.` : `Keep following the chain: the ${n(i - 1)} unlocks the ${n(i)}.`)
  }
  return {
    ...base, clues, answer: v, title: 'Symbol sums', hints: hints.slice(0, 3),
    intro: 'Every symbol hides a number from 1 to 9. Use the clues to work them out, then dial the code in the order shown on the lock.',
    dials: syms.slice(0, 4).map((sym) => ({ sym, name: sym.name })),
  }
}

function ClockFace({ hour, label }: { hour: number; label: string }) {
  const a = (hour % 12) * 30 * (Math.PI / 180)
  return (
    <figure className="lk-clock">
      <svg viewBox="0 0 100 100" role="img" aria-label={`Clock ${label}`}>
        <circle cx="50" cy="50" r="46" className="face" />
        {Array.from({ length: 12 }, (_, i) => {
          const t = (i * 30 * Math.PI) / 180
          return <line key={i} x1={50 + 38 * Math.sin(t)} y1={50 - 38 * Math.cos(t)} x2={50 + 43 * Math.sin(t)} y2={50 - 43 * Math.cos(t)} className={i % 3 ? 'tick' : 'tick big'} />
        })}
        <line x1="50" y1="50" x2="50" y2="13" className="min" />
        <line x1="50" y1="50" x2={50 + 24 * Math.sin(a)} y2={50 - 24 * Math.cos(a)} className="hr" />
        <circle cx="50" cy="50" r="4" className="pin" />
      </svg>
      <figcaption>{label}</figcaption>
    </figure>
  )
}

function CrackTheCode() {
  // Worked out in the browser (not at build time), so it always matches this week.
  // Add ?puzzleweek=1 (or 2, 3 …) to the address to preview the coming weeks.
  const [puzzle, setPuzzle] = useState<WeeklyPuzzle | null>(null)
  const [digits, setDigits] = useState([0, 0, 0, 0])
  const [status, setStatus] = useState<'idle' | 'wrong' | 'open'>('idle')
  const [hints, setHints] = useState(0)
  useEffect(() => {
    const ahead = parseInt(new URLSearchParams(window.location.search).get('puzzleweek') || '0', 10) || 0
    setPuzzle(makePuzzle(nzWeekNumber() + Math.max(0, Math.min(ahead, 52))))
  }, [])

  const turn = (i: number, d: number) => {
    if (status === 'open') return
    setStatus('idle')
    setDigits((cur) => cur.map((x, j) => (j === i ? (x + d + 10) % 10 : x)))
  }
  const tryOpen = () => puzzle && setStatus(digits.every((x, i) => x === puzzle.answer[i]) ? 'open' : 'wrong')
  const Ico = ({ i }: { i: number }) => {
    const I = puzzle!.syms[i].icon
    return <span className={`lk-ico i${Math.min(i, 4)}`}><I /></span>
  }
  const opWord = (o: string) => (o === '−' ? 'minus' : o === '×' ? 'times' : 'plus')

  const body = () => {
    if (!puzzle) return <p className="lk-loading">Loading this week’s puzzle…</p>
    switch (puzzle.kind) {
      case 'cipher':
        return (
          <div className="lk-cipher">
            <blockquote>“{puzzle.riddle!.riddle}”</blockquote>
            <div className="lk-key" aria-label="Key: A equals 1, B equals 2, and so on up to I equals 9">
              {'ABCDEFGHI'.split('').map((ch, i) => <span key={ch}><b>{ch}</b>{i + 1}</span>)}
            </div>
          </div>
        )
      case 'sequence':
        return (
          <ul className="lk-seq">
            {puzzle.sequences!.map((seq, i) => (
              <li key={i}><em>{LETTERS[i]}</em>{seq.map((x, j) => <span key={j}>{x}</span>)}<strong>?</strong></li>
            ))}
          </ul>
        )
      case 'clocks':
        return <div className="lk-clocks">{puzzle.hours!.map((h, i) => <ClockFace key={i} hour={h} label={LETTERS[i]} />)}</div>
      case 'count':
        return (
          <div className="lk-count" role="img" aria-label="A jumble of symbols to count">
            {puzzle.grid!.map((c, k) => {
              const I = puzzle.syms[c.sym].icon
              return <span key={k} className={c.sym < 4 ? `t i${c.sym}` : 'd'} style={{ transform: `rotate(${c.tilt}deg)` }}><I /></span>
            })}
          </div>
        )
      default:
        return (
          <ul className="lk-clues">
            {puzzle.clues.map((c, k) => (
              <li key={k} aria-label={c.parts.map((pp, j) => (j ? ` ${opWord(c.ops[j - 1])} ` : '') + puzzle.syms[pp].name).join('') + ` equals ${c.total}`}>
                {c.parts.map((pp, j) => <span className="lk-term" key={j}>{j > 0 && <b>{c.ops[j - 1]}</b>}<Ico i={pp} /></span>)}
                <b>=</b><strong>{c.total}</strong>
              </li>
            ))}
          </ul>
        )
    }
  }

  return (
    <section className="lock-section" id="crack-the-code">
      <div className="lock-copy">
        <p className="eyebrow light"><span /> Puzzle of the week{puzzle ? ` · ${puzzle.title}` : ''}</p>
        <h2>Can you<br /><em>crack the code?</em></h2>
        <p className="lead">{puzzle ? puzzle.intro : 'A brand new puzzle every Monday.'}</p>
        {body()}
        {puzzle && (
          <div className="lk-hints">
            {puzzle.hints.slice(0, hints).map((h) => <p key={h}><Lightbulb size={16} /> {h}</p>)}
            {hints < puzzle.hints.length && status !== 'open' && (
              <button type="button" onClick={() => setHints(hints + 1)}>Need a hint? <Lightbulb size={15} /></button>
            )}
          </div>
        )}
      </div>

      <div className={`lk-lock ${status}`}>
        <div className="lk-padlock" aria-hidden="true">{status === 'open' ? <LockOpen /> : <Lock />}</div>
        <div className="lk-dials">
          {digits.map((x, i) => {
            const d = puzzle?.dials[i]
            return (
              <div className="lk-dial" key={i}>
                {d?.sym ? <Ico i={i} /> : <span className="lk-ico lk-txt">{d?.text ?? ''}</span>}
                <button type="button" aria-label={`Increase the ${d?.name ?? 'next'} digit`} onClick={() => turn(i, 1)}>▲</button>
                <output aria-label={`${d?.name ?? 'lock'} digit`}>{x}</output>
                <button type="button" aria-label={`Decrease the ${d?.name ?? 'next'} digit`} onClick={() => turn(i, -1)}>▼</button>
              </div>
            )
          })}
        </div>
        <p className="lk-status" aria-live="polite">
          {status === 'open' && <><strong>You escaped!</strong> Nicely done. Ready for the real thing?</>}
          {status === 'wrong' && <>Not quite. Check your clues and try again.</>}
          {status === 'idle' && <>Dial the code, then try the lock.</>}
        </p>
        {status === 'open' ? (
          <a className="button primary wide" href="#book">Book a real escape room <ArrowRight size={18} /></a>
        ) : (
          <button type="button" className="button primary wide" onClick={tryOpen} disabled={!puzzle}>Try the lock <Key size={18} /></button>
        )}
        <p className="lk-week">A new kind of puzzle every Monday</p>
      </div>
    </section>
  )
}

function BoardGamesSection() {
  const [games, setGames] = useState<ShopGame[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [query, setQuery] = useState('')
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    // public_board_games() returns only name + sell_price of in-stock games (see btb-app/sql)
    fetch(`${SB_URL}/rest/v1/rpc/public_board_games`, { headers: { apikey: SB_ANON, Authorization: `Bearer ${SB_ANON}` } })
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
        <p>Take a game home. We sell board games new and secondhand. Have a browse of what’s on our shelves below.</p>
      </div>

      <img className="bg-banner" src={asset('/images/board-games.svg')} alt="Illustration of board games: dice, meeples, cards and a game board" />

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
          <p className="bg-fineprint">Please note: this list may not always be correct. Games sell quickly and prices can change, so give us a call or message before you come in for a particular game. Prices in NZD.</p>
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
    <main className={FUN ? 'theme-fun' : undefined}>
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
            <span /> {t('Puzzles · Laughs · Teamwork', 'Hawke’s Bay’s home of curious minds')}
          </div>
          <h1 className="reveal reveal-2">
            {t('Get locked in.', 'Step inside.')}
            <em>{t('Have a blast.', 'Think beyond.')}</em>
          </h1>
          <p className="hero-copy reveal reveal-3">
            {t('Escape rooms, VR chairs and board games right here in Hastings. Bring the kids, your mates or the whole office. First-timers welcome, experts challenged.', 'Escape rooms built and run right here in Hastings. Friendly for first-timers, and a real challenge for experienced players.')}
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

        {FUN && <div className="fun-sticker" aria-hidden="true"><strong>60</strong>minutes of<br />brain-buzzing fun</div>}
        <div className="scroll-note" aria-hidden="true"><span /> Scroll to investigate</div>
      </header>

      <section className="intro-strip" aria-label="Experience details">
        <div><Clock3 /><span><strong>60</strong> minute adventures</span></div>
        <div><Users /><span><strong>2–8</strong> players</span></div>
        <div><MapPin /><span><strong>Hastings</strong> Hawke’s Bay</span></div>
        <div><Puzzle /><span><strong>Local</strong> owned & run</span></div>
      </section>


      {FUN && (
        <section className="fun-who" aria-label="Who it’s for">
          <div className="section-heading">
            <div>
              <p className="eyebrow dark"><span /> Who’s it for?</p>
              <h2>Fun for<br /><em>every crew.</em></h2>
            </div>
            <p>Little detectives, big kids, best mates and whole office teams. If you can laugh, talk and think, you’re in.</p>
          </div>
          <div className="fun-who-grid">
            <div className="fun-tile t1"><Users /><h3>Families</h3><p>Kids and grown-ups cracking it together, with a friendly game master and hints whenever you need them.</p></div>
            <div className="fun-tile t2"><Heart /><h3>Friends & dates</h3><p>Catch-ups, celebrations or a very confident date night. Winner picks dinner.</p></div>
            <div className="fun-tile t3"><Briefcase /><h3>Team building</h3><p>Communication, problem-solving and plenty of laughs. Team building people actually enjoy. Call us to plan your group.</p></div>
            <div className="fun-tile t4"><PartyPopper /><h3>Parties</h3><p>Birthdays to remember, here at BtB or with Pirate’s Cove at your place.</p></div>
          </div>
        </section>
      )}

      <section className="rooms-section" id="rooms">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark"><span /> Case files</p>
            <h2>Pick your<br /><em>whole-room escape.</em></h2>
          </div>
          <p>Our rooms are set up and run by us here in Hastings, including Saving Christmas, which we designed and built from scratch. Expect hands-on puzzles, plenty of “aha!” moments and a friendly game master looking after you.</p>
        </div>

        <div className="room-grid two">
          {rooms.filter((r) => r.id !== 'gregg').map((room) => (
            <article className="room-card" key={room.id} style={{ '--room-accent': room.accent } as React.CSSProperties}>
              <div className="room-image-wrap">
                <img src={room.image} alt={`${room.name} escape room`} />
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
            <h2>Real escape rooms.<br /><em>Packed in a box.</em></h2>
          </div>
          <p>These are proper escape rooms, with a story, locks to crack and the clock ticking. The whole game just happens to fit inside a box or chest. Play them here at Beyond the Box, and Pirate’s Cove can come to your place too.</p>
        </div>

        <div className="room-grid">
          {rooms.filter((r) => r.id === 'gregg').map((room) => (
            <article className="room-card" key={room.id} style={{ '--room-accent': room.accent } as React.CSSProperties}>
              <div className="room-image-wrap">
                <img src={room.image} alt={`${room.name} escape room in a box`} />
                <span className="open-stamp">Play at BtB</span>
              </div>
              <div className="room-card-body">
                <p>{room.kicker}</p>
                <h3>{room.name}</h3>
                <div className="room-meta">
                  <span><Clock3 size={15} /> {room.duration} min</span>
                  <span><Users size={15} /> {room.players} players</span>
                  <span><Ticket size={15} /> $35 pp</span>
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
                  Book Gregg in the Box <ArrowRight size={17} />
                </button>
              </div>
            </article>
          ))}
          <article className="room-card" style={{ '--room-accent': cube.accent } as React.CSSProperties}>
            <div className="room-image-wrap">
              <img src={cube.image} alt="The Cube escape room in a box" />
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
              <span className="open-stamp">At BtB or your place</span>
            </div>
            <div className="room-card-body">
              <p>{piratesCove.kicker}</p>
              <h3>{piratesCove.name}</h3>
              <div className="room-meta">
                <span><Clock3 size={15} /> {piratesCove.durationText}</span>
                <span><MapPin size={15} /> BtB or your house</span>
                <span><Puzzle size={15} /> Pirate parties</span>
              </div>
              <p className="room-description">{piratesCove.description}</p>
              <a className="card-link" href="tel:0220537365">
                Call to book Pirate’s Cove <ArrowRight size={17} />
              </a>
            </div>
          </article>
        </div>
      </section>

      <CrackTheCode />

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
          <div className="hours-row"><span>Tuesday – Friday</span><strong>3:15 pm – 8:30 pm</strong></div>
          <div className="hours-row"><span>Saturday</span><strong>10:00 am – 8:30 pm</strong></div>
          <div className="hours-row"><span>School & public holidays</span><strong>10:00 am – 8:30 pm</strong></div>
          <p className="hours-note">On Saturdays and holidays the first escape room starts at 10:30 am.</p>
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
