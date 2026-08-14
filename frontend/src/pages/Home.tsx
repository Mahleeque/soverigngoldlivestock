import { ArrowRight, BadgeCheck, CheckCircle2, MapPin, MessageCircle, Search, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AnimalCard, AnimalCardSkeleton } from '@/components/AnimalCard'
import { Reveal } from '@/components/Reveal'
import { ButtonLink } from '@/components/ui/Button'
import { Badge, SectionHeading } from '@/components/ui'
import { CATEGORY_META, CTA_IMAGE, HERO_IMAGE, STORY_IMAGE } from '@/lib/media'
import { useAnimals } from '@/lib/queries'
import type { AnimalCategory } from '@/types'

const STEPS = [
  {
    icon: Search,
    title: 'Browse verified stock',
    copy: 'Every listing carries live weight, age, breed and vaccination history — no guesswork.',
  },
  {
    icon: CheckCircle2,
    title: 'Reserve or buy outright',
    copy: 'Hold your animal with a 30% deposit for 48 hours, or check out immediately.',
  },
  {
    icon: MapPin,
    title: 'Delivered to your gate',
    copy: 'Zone-based logistics across Nigeria with status updates at every step.',
  },
]

const TESTIMONIALS = [
  {
    quote:
      'We ordered three Yankasa rams for Sallah and they arrived a day early, exactly the weight advertised. The health certificates were in the crate.',
    name: 'Aisha Bello',
    role: 'Lagos',
  },
  {
    quote:
      'The reservation deposit saved us. We locked in the price two weeks before the festival and paid the balance on delivery.',
    name: 'Chinedu Okafor',
    role: 'Abuja',
  },
  {
    quote:
      'As a restaurant we buy weekly. The dashboard makes reordering painless and the birds are consistently clean and healthy.',
    name: 'Tunde Adeyemi',
    role: 'Ibadan',
  },
]

export const HomePage = () => {
  const featured = useAnimals({ featured: 'true', status: 'available', limit: 6 })
  const latest = useAnimals({ status: 'available', sort: '-createdAt', limit: 8 })

  return (
    <div>
      <section className="relative overflow-hidden bg-ink-950">
        <img src={HERO_IMAGE} alt="" className="animate-slow-pan absolute inset-0 size-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-linear-to-r from-ink-950 via-ink-950/85 to-ink-950/30" />
        <div className="container-page relative grid gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
          <div className="max-w-2xl">
            <Badge tone="gold" className="mb-6">
              <BadgeCheck className="size-3.5" /> Vet-certified livestock
            </Badge>
            <h1 className="animate-rise text-balance font-display text-4xl font-semibold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
              Premium livestock, raised right and delivered to your gate.
            </h1>
            <p className="animate-rise mt-6 max-w-xl text-lg leading-relaxed text-ink-200">
              Sovereign Gold supplies Nigeria&apos;s homes, butchers and hospitality businesses with rams, goats,
              cattle and poultry — each one weighed, vaccinated and documented before it leaves the farm.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink to="/animals" variant="gold" size="lg" icon={<ArrowRight className="size-4" />}>
                Browse livestock
              </ButtonLink>
              <ButtonLink to="/animals?category=ram" variant="outline" size="lg" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                Shop Sallah rams
              </ButtonLink>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute -left-6 top-8 w-64 rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.16em] text-gold-300">Health record</p>
              <p className="mt-2 text-base text-white">
                PPR, Anthrax &amp; FMD vaccinations logged with every animal, verified by our resident vet.
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-ink-200">
                <ShieldCheck className="size-4 text-gold-300" /> Certificate attached to each order
              </div>
            </div>
            <img
              src={STORY_IMAGE}
              alt="Livestock on the Sovereign Gold farm"
              className="ml-auto h-[26rem] w-[22rem] rounded-4xl object-cover shadow-elevated"
            />
            <div className="absolute -bottom-6 right-6 w-60 rounded-3xl bg-gold-400 p-5 text-ink-900 shadow-elevated">
              <p className="font-display text-lg font-semibold">Reserve with 30%</p>
              <p className="mt-1 text-base">Lock today&apos;s price for 48 hours, pay the balance on delivery.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16 lg:py-20">
        <SectionHeading
          eyebrow="Shop by category"
          title="Find the right animal for the occasion"
          description="From Sallah rams to point-of-lay hens, every category is stocked with graded, farm-raised animals."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(CATEGORY_META) as AnimalCategory[]).map((category) => (
            <Link
              key={category}
              to={`/animals?category=${category}`}
              className="group hover-lift relative overflow-hidden rounded-3xl bg-ink-900"
            >
              <img
                src={CATEGORY_META[category].image}
                alt={CATEGORY_META[category].label}
                loading="lazy"
                className="h-52 w-full object-cover opacity-75 transition duration-700 group-hover:scale-105 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-linear-to-t from-ink-950 via-ink-950/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                <div>
                  <h3 className="font-display text-xl font-semibold text-white">{CATEGORY_META[category].label}</h3>
                  <p className="mt-1 text-base text-ink-200">{CATEGORY_META[category].blurb}</p>
                </div>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gold-400 text-ink-900 transition group-hover:translate-x-1">
                  <ArrowRight className="size-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Handpicked"
            title="Featured livestock"
            description="Our best-conditioned animals, ready for immediate delivery."
            action={
              <ButtonLink to="/animals?featured=true" variant="outline" icon={<ArrowRight className="size-4" />}>
                View all
              </ButtonLink>
            }
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.isLoading
              ? Array.from({ length: 3 }).map((_, index) => <AnimalCardSkeleton key={index} />)
              : featured.data?.items.map((animal) => <AnimalCard key={animal._id} animal={animal} />)}
          </div>
          {!featured.isLoading && !featured.data?.items.length ? (
            <p className="mt-8 rounded-2xl bg-ink-50 px-5 py-8 text-center text-base text-ink-500">
              No featured animals right now — browse the full catalogue for available stock.
            </p>
          ) : null}
        </div>
      </section>

      <section className="container-page py-16 lg:py-20">
        <SectionHeading eyebrow="How it works" title="Three steps from browsing to delivery" align="center" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <Reveal key={step.title} delay={index * 90} className="card-surface hover-lift relative p-7">
              <span className="absolute right-6 top-6 font-display text-4xl font-semibold text-ink-100">
                0{index + 1}
              </span>
              <span className="flex size-12 items-center justify-center rounded-2xl bg-moss-50 text-moss-600">
                <step.icon className="size-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-ink-500">{step.copy}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Fresh arrivals"
            title="Newest on the farm"
            action={
              <ButtonLink to="/animals" variant="outline" icon={<ArrowRight className="size-4" />}>
                Browse catalogue
              </ButtonLink>
            }
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {latest.isLoading
              ? Array.from({ length: 4 }).map((_, index) => <AnimalCardSkeleton key={index} />)
              : latest.data?.items.slice(0, 4).map((animal) => <AnimalCard key={animal._id} animal={animal} />)}
          </div>
        </div>
      </section>

      <section className="container-page py-16 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <figure key={item.name} className="card-surface hover-lift flex flex-col gap-5 p-7">
              <blockquote className="text-base leading-relaxed text-ink-600">“{item.quote}”</blockquote>
              <figcaption className="mt-auto flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-ink-900 text-sm font-bold text-gold-300">
                  {item.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')}
                </span>
                <span>
                  <span className="block text-base font-semibold">{item.name}</span>
                  <span className="block text-sm text-ink-400">{item.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="relative overflow-hidden rounded-4xl bg-ink-950">

          <img src={CTA_IMAGE} alt="" className="absolute inset-0 size-full object-cover opacity-35" />
          <div className="relative grid gap-8 p-10 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:p-14">
            <div>
              <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
                Buying for an event, restaurant or an entire estate?
              </h2>
              <p className="mt-4 max-w-xl text-ink-200">
                Our sales desk arranges bulk pricing, staggered delivery and on-site slaughter services. Send a
                message and we&apos;ll build a quote within the hour.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <ButtonLink to="/contact" variant="gold" size="lg" icon={<MessageCircle className="size-4" />}>
                Talk to sales
              </ButtonLink>
              <ButtonLink
                to="/animals"
                variant="outline"
                size="lg"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10"
              >
                See stock
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

