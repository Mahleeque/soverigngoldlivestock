import { Award, Heart, Leaf, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Reveal } from '@/components/Reveal'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Field, Input, SectionHeading, Select, Textarea } from '@/components/ui'
import { errorMessage } from '@/lib/api'
import { CTA_IMAGE, HERO_IMAGE, STORY_IMAGE } from '@/lib/media'
import { useCreateConversation } from '@/lib/queries'
import { toast } from '@/store/toast'

const ENQUIRY_TOPICS = [
  'Buying livestock',
  'Bulk / corporate order',
  'Delivery & logistics',
  'Farm visit',
  'Something else',
]

const EMPTY_ENQUIRY = { name: '', email: '', phone: '', topic: ENQUIRY_TOPICS[0], message: '' }

const ContactForm = () => {
  const [form, setForm] = useState(EMPTY_ENQUIRY)
  const createConversation = useCreateConversation()

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    try {
      await createConversation.mutateAsync(form)
      toast.success('Thanks — your message is on its way. We reply within the hour on business days.')
      setForm(EMPTY_ENQUIRY)
    } catch (error) {
      toast.error(errorMessage(error, 'We could not send your message. Please call or WhatsApp us instead.'))
    }
  }

  return (
    <form className="mt-7 grid gap-5 sm:grid-cols-2" onSubmit={submit}>
      <Field label="Full name">
        <Input
          required
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          placeholder="Amina Yusuf"
        />
      </Field>
      <Field label="Email address">
        <Input
          required
          type="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          placeholder="you@example.com"
        />
      </Field>
      <Field label="Phone number">
        <Input
          required
          value={form.phone}
          onChange={(event) => setForm({ ...form, phone: event.target.value })}
          placeholder="+234 801 234 5678"
        />
      </Field>
      <Field label="What is it about?">
        <Select value={form.topic} onChange={(event) => setForm({ ...form, topic: event.target.value })}>
          {ENQUIRY_TOPICS.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Message" className="sm:col-span-2">
        <Textarea
          required
          minLength={10}
          className="min-h-40"
          value={form.message}
          onChange={(event) => setForm({ ...form, message: event.target.value })}
          placeholder="Tell us what you need — species, quantity, delivery date and location."
        />
      </Field>
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" loading={createConversation.isPending} icon={<Send className="size-4" />}>
          Send message
        </Button>
      </div>
    </form>
  )
}

const VALUES = [
  { icon: Leaf, title: 'Raised on open pasture', copy: 'Rotational grazing and grain finishing — never confinement-only rearing.' },
  { icon: Award, title: 'Graded before listing', copy: 'Live weight, body condition and dentition checked by our vet team.' },
  { icon: Heart, title: 'Humane handling', copy: 'Low-stress loading and ventilated transport on every delivery.' },
]

export const AboutPage = () => (
  <div>
    <section className="relative overflow-hidden bg-ink-950">
      <img src={HERO_IMAGE} alt="" className="animate-slow-pan absolute inset-0 size-full object-cover opacity-40" />
      <div className="container-page relative py-20">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold-300">Our farm</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold text-white sm:text-5xl">
          Twelve years of raising livestock Nigerian families trust.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink-200">
          Sovereign Gold started with forty Yankasa rams outside Ibadan. Today we supply households, butchers and
          hospitality groups across the country — with the same insistence on traceability we began with.
        </p>
      </div>
    </section>

    <section className="container-page grid gap-12 py-16 lg:grid-cols-2 lg:items-center lg:py-20">
      <img src={STORY_IMAGE} alt="Herd on pasture" className="h-96 w-full rounded-4xl object-cover" />
      <div>
        <SectionHeading
          eyebrow="Our approach"
          title="Every animal has a record, not just a price tag"
          description="From the day an animal joins the herd we log its breed line, weight curve, vaccinations and treatment history. That record travels with it to your gate — so you know exactly what you're buying."
        />
        <div className="mt-8 space-y-5">
          {VALUES.map((value) => (
            <div key={value.title} className="flex gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-moss-50 text-moss-600">
                <value.icon className="size-5" />
              </span>
              <div>
                <p className="font-semibold">{value.title}</p>
                <p className="mt-1 text-base text-ink-500">{value.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="container-page pb-20">
      <div className="relative overflow-hidden rounded-4xl bg-ink-950 p-10 lg:p-14">
        <img src={CTA_IMAGE} alt="" className="absolute inset-0 size-full object-cover opacity-30" />
        <div className="relative max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-white">Come and see the herd</h2>
          <p className="mt-4 text-ink-200">
            Farm visits run every Saturday. Book a slot and inspect the animals before you buy.
          </p>
          <ButtonLink to="/contact" variant="gold" size="lg" className="mt-7">
            Arrange a visit
          </ButtonLink>
        </div>
      </div>
    </section>
  </div>
)

export const ContactPage = () => {
  return (
    <div className="bg-ink-50 pb-20">
      <section className="relative isolate overflow-hidden bg-ink-950">
        <img
          src={CTA_IMAGE}
          alt=""
          className="animate-slow-pan absolute inset-0 size-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-linear-to-r from-ink-950 via-ink-950/85 to-ink-950/35" />
        <div className="container-page relative py-20 lg:py-24">
          <p className="animate-fade-in text-base font-bold uppercase tracking-[0.2em] text-gold-300">Contact</p>
          <h1 className="animate-rise mt-3 max-w-3xl font-display text-4xl font-semibold text-white sm:text-5xl">
            Talk to our sales desk
          </h1>
          <p className="animate-rise mt-5 max-w-2xl text-lg text-ink-200">
            Bulk orders, event supply and corporate accounts — we respond within the hour on business days.
          </p>
        </div>
      </section>

      <div className="container-page grid gap-8 py-12 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          <a href="tel:+2347050505535" className="card-surface hover-lift flex items-center gap-4 p-5">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-moss-50 text-moss-600">
              <Phone className="size-5" />
            </span>
            <span>
              <span className="block text-base text-ink-400">Call us</span>
              <span className="block font-semibold">0705 050 5535</span>
            </span>
          </a>
          <a href="https://wa.me/2347069185859" className="card-surface hover-lift flex items-center gap-4 p-5">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-moss-50 text-moss-600">
              <MessageCircle className="size-5" />
            </span>
            <span>
              <span className="block text-base text-ink-400">WhatsApp orders</span>
              <span className="block font-semibold">0706 918 5859</span>
            </span>
          </a>
          <a href="mailto:sovereigngoldlivestock@gmail.com" className="card-surface hover-lift flex items-center gap-4 p-5">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-moss-50 text-moss-600">
              <Mail className="size-5" />
            </span>
            <span>
              <span className="block text-base text-ink-400">Email</span>
              <span className="block font-semibold">sovereigngoldlivestock@gmail.com</span>
            </span>
          </a>
          <div className="card-surface flex items-center gap-4 p-5">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-moss-50 text-moss-600">
              <MapPin className="size-5" />
            </span>
            <span>
              <span className="block text-base text-ink-400">Farm address</span>
              <span className="block font-semibold">13 Sovereign Street, Ikorodu, Lagos</span>
            </span>
          </div>
        </div>

        <div className="space-y-8">
          <Reveal className="card-surface p-7">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <Mail className="size-5 text-ink-400" /> Send us a message
            </h2>
            <p className="mt-2 text-ink-500">
              Fill in the form and it lands directly in our inbox — no account needed.
            </p>
            <ContactForm />
          </Reveal>

          {/* Delivery zones list removed from contact page — admin manages zones in the admin panel. */}
        </div>
      </div>
    </div>
  )
}

export const NotFoundPage = () => (
  <div className="container-page flex flex-col items-center py-28 text-center">
    <p className="font-display text-7xl font-semibold text-ink-200">404</p>
    <h1 className="mt-4 text-3xl font-semibold">We couldn&apos;t find that page</h1>
    <p className="mt-3 max-w-md text-ink-500">
      The link may be broken or the animal may have already been sold.
    </p>
    <div className="mt-8 flex gap-3">
      <ButtonLink to="/">Back home</ButtonLink>
      <ButtonLink to="/animals" variant="outline">
        Browse livestock
      </ButtonLink>
    </div>
  </div>
)
