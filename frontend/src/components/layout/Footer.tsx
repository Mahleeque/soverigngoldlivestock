import { CreditCard, Globe, Mail, MapPin, Phone, Stethoscope } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/Logo'

const ASSURANCES = [
  { icon: Stethoscope, title: 'Vet-certified stock', copy: 'Every animal ships with health and vaccination records.' },
  { icon: Globe, title: 'Nationwide delivery', copy: 'Zone-based logistics with live delivery tracking.' },
  { icon: CreditCard, title: 'Flexible payment', copy: 'Pay in full, reserve with a deposit, or pay on delivery.' },
]

const NAV = [
  {
    title: 'Livestock',
    links: [
      { label: 'Rams', to: '/animals?category=ram' },
      { label: 'Goats', to: '/animals?category=goat' },
      { label: 'Cattle', to: '/animals?category=cow' },
      { label: 'Poultry', to: '/animals?category=chicken' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Our farm', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'Reserve an animal', to: '/animals' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Sign in', to: '/login' },
      { label: 'Create account', to: '/register' },
      { label: 'My orders', to: '/account/orders' },
      { label: 'Wishlist', to: '/account/wishlist' },
    ],
  },
]

export const Footer = () => (
  <footer className="mt-24 bg-ink-950 text-ink-200">
    <div className="container-page grid gap-6 border-b border-white/10 py-12 sm:grid-cols-3">
      {ASSURANCES.map((item) => (
        <div key={item.title} className="flex gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-gold-300">
            <item.icon className="size-5" />
          </span>
          <div>
            <p className="font-semibold text-white">{item.title}</p>
            <p className="mt-1 text-base leading-relaxed text-ink-300">{item.copy}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="container-page grid gap-10 py-16 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
      <div className="max-w-sm">
        <Logo tone="light" />
        <p className="mt-5 text-lg leading-relaxed text-ink-300">
          Nigeria&apos;s premium livestock marketplace — ethically raised rams, goats, cattle and poultry delivered
          from our farms to your doorstep.
        </p>
        <div className="mt-6 space-y-2.5 text-base text-ink-300">
          <p className="flex items-center gap-2.5">
            <MapPin className="size-4 text-gold-300" /> 13 Sovereign Street, Ikorodu, Lagos
          </p>
          <a href="tel:+2347050505535" className="flex items-center gap-2.5 hover:text-white">
            <Phone className="size-4 text-gold-300" /> 0705 050 5535
          </a>
          <a href="mailto:sovereigngoldlivestock@gmail.com" className="flex items-center gap-2.5 hover:text-white">
            <Mail className="size-4 text-gold-300" /> sovereigngoldlivestock@gmail.com
          </a>
        </div>
      </div>

      {NAV.map((column) => (
        <div key={column.title}>
          <p className="text-base font-bold uppercase tracking-[0.2em] text-gold-300">{column.title}</p>
          <ul className="mt-4 space-y-2.5 text-lg">
            {column.links.map((link) => (
              <li key={link.label}>
                <Link to={link.to} className="text-ink-300 transition hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    <div className="border-t border-white/10">
      <div className="container-page flex flex-col gap-2 py-6 text-sm text-ink-400 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Sovereign Gold Livestock. All rights reserved.</p>
        <p>Secured payments via Paystack &amp; Flutterwave</p>
      </div>
    </div>
  </footer>
)
