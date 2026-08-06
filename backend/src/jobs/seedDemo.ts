import { connectDatabase, disconnectDatabase } from '../config/database';
import { AnimalCategory, AnimalStatus, UserRole } from '../constants/enums';
import { Animal } from '../models/Animal';
import { Coupon } from '../models/Coupon';
import { DeliveryZone } from '../models/DeliveryZone';
import { User } from '../models/User';

interface DemoAnimal {
  name: string;
  category: AnimalCategory;
  breed: string;
  description: string;
  price: number;
  weightKg: number;
  ageMonths: number;
  gender: 'male' | 'female';
  size: 'small' | 'medium' | 'large';
  vaccinationStatus: string;
  images: string[];
  quantity: number;
  featured?: boolean;
  status?: AnimalStatus;
  tags: string[];
}

export const image = (category: string, index: number): string => `/images/${category}-${index}.jpg`;

export const animals: DemoAnimal[] = [
  {
    name: 'Big Sallah Ram',
    category: AnimalCategory.Ram,
    breed: 'Yankasa',
    description:
      'A powerful, well-fed Yankasa ram raised on open pasture in Kaduna. Ideal for Eid-el-Kabir, naming ceremonies and premium family celebrations.',
    price: 320000,
    weightKg: 85,
    ageMonths: 20,
    gender: 'male',
    size: 'large',
    vaccinationStatus: 'PPR, Anthrax, FMD',
    images: [image('ram', 1), image('ram', 3), image('ram', 4)],
    quantity: 3,
    featured: true,
    tags: ['sallah', 'premium', 'ram']
  },
  {
    name: 'Balami Ram — Grade A',
    category: AnimalCategory.Ram,
    breed: 'Balami',
    description:
      'Tall, long-legged Balami ram with a clean white coat and heavy frame. Vet-inspected, dewormed and ready for immediate delivery.',
    price: 480000,
    weightKg: 110,
    ageMonths: 26,
    gender: 'male',
    size: 'large',
    vaccinationStatus: 'PPR, Anthrax',
    images: [image('ram', 2), image('ram', 5)],
    quantity: 2,
    featured: true,
    tags: ['balami', 'sallah', 'grade-a']
  },
  {
    name: 'Uda Ram — Medium',
    category: AnimalCategory.Ram,
    breed: 'Uda',
    description:
      'A well-proportioned Uda ram with the classic two-tone coat. A great mid-budget pick for family Sallah slaughter.',
    price: 210000,
    weightKg: 62,
    ageMonths: 15,
    gender: 'male',
    size: 'medium',
    vaccinationStatus: 'PPR',
    images: [image('ram', 4), image('ram', 1)],
    quantity: 5,
    tags: ['uda', 'sallah']
  },
  {
    name: 'Yankasa Ewe',
    category: AnimalCategory.Ram,
    breed: 'Yankasa',
    description: 'Healthy breeding ewe with proven lambing record. Sold with full vaccination history.',
    price: 145000,
    weightKg: 48,
    ageMonths: 24,
    gender: 'female',
    size: 'medium',
    vaccinationStatus: 'PPR, Anthrax',
    images: [image('ram', 5), image('ram', 2)],
    quantity: 4,
    tags: ['breeding', 'ewe']
  },
  {
    name: 'Boer Goat Buck',
    category: AnimalCategory.Goat,
    breed: 'Boer',
    description:
      'Imported-line Boer buck with excellent muscling and a calm temperament. Perfect for breeding stock or premium meat.',
    price: 260000,
    weightKg: 68,
    ageMonths: 18,
    gender: 'male',
    size: 'large',
    vaccinationStatus: 'PPR, CCPP',
    images: [image('goat', 2), image('goat', 1), image('goat', 3)],
    quantity: 2,
    featured: true,
    tags: ['boer', 'breeding']
  },
  {
    name: 'West African Dwarf Goat',
    category: AnimalCategory.Goat,
    breed: 'WAD',
    description:
      'Hardy, disease-resistant WAD goat suited to southern Nigeria. Great for small-scale rearing and home celebrations.',
    price: 78000,
    weightKg: 22,
    ageMonths: 10,
    gender: 'female',
    size: 'small',
    vaccinationStatus: 'PPR',
    images: [image('goat', 4), image('goat', 5)],
    quantity: 8,
    tags: ['wad', 'starter']
  },
  {
    name: 'Kalahari Red Goat',
    category: AnimalCategory.Goat,
    breed: 'Kalahari Red',
    description: 'Deep-red Kalahari doe with strong maternal traits and excellent heat tolerance.',
    price: 185000,
    weightKg: 52,
    ageMonths: 16,
    gender: 'female',
    size: 'medium',
    vaccinationStatus: 'PPR, CCPP',
    images: [image('goat', 3), image('goat', 4)],
    quantity: 3,
    tags: ['kalahari', 'breeding']
  },
  {
    name: 'White Fulani Bull',
    category: AnimalCategory.Cow,
    breed: 'White Fulani (Bunaji)',
    description:
      'Mature White Fulani bull in prime condition — the benchmark for large ceremonies, weddings and corporate gifting.',
    price: 1450000,
    weightKg: 420,
    ageMonths: 42,
    gender: 'male',
    size: 'large',
    vaccinationStatus: 'CBPP, FMD, Anthrax, Blackleg',
    images: [image('cow', 2), image('cow', 1), image('cow', 5)],
    quantity: 1,
    featured: true,
    tags: ['bull', 'ceremony', 'premium']
  },
  {
    name: 'Sokoto Gudali Heifer',
    category: AnimalCategory.Cow,
    breed: 'Sokoto Gudali',
    description: 'Docile Gudali heifer with good milk potential. Vet certificate and transport crate included.',
    price: 980000,
    weightKg: 310,
    ageMonths: 30,
    gender: 'female',
    size: 'large',
    vaccinationStatus: 'CBPP, FMD',
    images: [image('cow', 3), image('cow', 4)],
    quantity: 2,
    tags: ['dairy', 'heifer']
  },
  {
    name: 'Red Bororo Steer',
    category: AnimalCategory.Cow,
    breed: 'Red Bororo',
    description: 'Well-finished Red Bororo steer, grass-fed and finished on grain for four weeks.',
    price: 1180000,
    weightKg: 365,
    ageMonths: 36,
    gender: 'male',
    size: 'large',
    vaccinationStatus: 'CBPP, Anthrax',
    images: [image('cow', 5), image('cow', 2)],
    quantity: 1,
    status: AnimalStatus.Reserved,
    tags: ['steer', 'grain-finished']
  },
  {
    name: 'Large White Sow',
    category: AnimalCategory.Pig,
    breed: 'Large White',
    description: 'Clean, biosecure-raised Large White sow from our Ogun unit. Excellent litter history.',
    price: 240000,
    weightKg: 140,
    ageMonths: 20,
    gender: 'female',
    size: 'large',
    vaccinationStatus: 'Erysipelas, Parvovirus',
    images: [image('pig', 1), image('pig', 2)],
    quantity: 3,
    featured: true,
    tags: ['sow', 'breeding']
  },
  {
    name: 'Landrace Weaner Pig',
    category: AnimalCategory.Pig,
    breed: 'Landrace',
    description: 'Eight-week weaners raised on a balanced starter ration. Sold individually or in lots of ten.',
    price: 65000,
    weightKg: 18,
    ageMonths: 2,
    gender: 'male',
    size: 'small',
    vaccinationStatus: 'Iron, Deworming',
    images: [image('pig', 3), image('pig', 4)],
    quantity: 20,
    tags: ['weaner', 'bulk']
  },
  {
    name: 'Duroc Boar',
    category: AnimalCategory.Pig,
    breed: 'Duroc',
    description: 'Strong Duroc boar with heavy hams and proven fertility. Ideal for upgrading a commercial herd.',
    price: 310000,
    weightKg: 165,
    ageMonths: 24,
    gender: 'male',
    size: 'large',
    vaccinationStatus: 'Erysipelas, Parvovirus',
    images: [image('pig', 5), image('pig', 1)],
    quantity: 1,
    tags: ['boar', 'breeding']
  },
  {
    name: 'Broiler Chicken — Live',
    category: AnimalCategory.Chicken,
    breed: 'Ross 308',
    description: 'Six-week broilers raised without growth promoters. Dressed on request at no extra cost.',
    price: 9500,
    weightKg: 2.4,
    ageMonths: 2,
    gender: 'male',
    size: 'small',
    vaccinationStatus: 'Newcastle, Gumboro',
    images: [image('chicken', 2), image('chicken', 3)],
    quantity: 200,
    featured: true,
    tags: ['broiler', 'bulk']
  },
  {
    name: 'Noiler Cockerel',
    category: AnimalCategory.Chicken,
    breed: 'Noiler',
    description: 'Dual-purpose Noiler cockerel — hardy, free-range tolerant and ideal for backyard rearing.',
    price: 7200,
    weightKg: 1.9,
    ageMonths: 3,
    gender: 'male',
    size: 'small',
    vaccinationStatus: 'Newcastle, Fowl pox',
    images: [image('chicken', 1), image('chicken', 5)],
    quantity: 150,
    tags: ['noiler', 'free-range']
  },
  {
    name: 'Local Free-Range Cockerel',
    category: AnimalCategory.Chicken,
    breed: 'Nigerian indigenous',
    description: 'Traditional free-range cockerel with the deep flavour prized for pepper soup and festive cooking.',
    price: 12000,
    weightKg: 1.6,
    ageMonths: 6,
    gender: 'male',
    size: 'small',
    vaccinationStatus: 'Newcastle',
    images: [image('chicken', 4), image('chicken', 1)],
    quantity: 60,
    tags: ['indigenous', 'free-range']
  },
  {
    name: 'Point-of-Lay Isa Brown',
    category: AnimalCategory.Layer,
    breed: 'Isa Brown',
    description: '18-week point-of-lay pullets already coming into production. Sold in crates of 25.',
    price: 6800,
    weightKg: 1.5,
    ageMonths: 4,
    gender: 'female',
    size: 'small',
    vaccinationStatus: 'Newcastle, Gumboro, Debeaked',
    images: [image('layer', 2), image('layer', 1)],
    quantity: 400,
    featured: true,
    tags: ['point-of-lay', 'bulk']
  },
  {
    name: 'Brown Nera Layer',
    category: AnimalCategory.Layer,
    breed: 'Nera Black',
    description: 'Consistent brown-egg layer with strong shell quality and a long production curve.',
    price: 7400,
    weightKg: 1.7,
    ageMonths: 5,
    gender: 'female',
    size: 'small',
    vaccinationStatus: 'Newcastle, Gumboro',
    images: [image('layer', 5), image('layer', 3)],
    quantity: 320,
    tags: ['layer', 'eggs']
  },
  {
    name: 'Barred Plymouth Rock Hen',
    category: AnimalCategory.Layer,
    breed: 'Plymouth Rock',
    description: 'Hardy heritage hen — good layer and excellent forager for open-run systems.',
    price: 9800,
    weightKg: 2.1,
    ageMonths: 7,
    gender: 'female',
    size: 'small',
    vaccinationStatus: 'Newcastle, Fowl pox',
    images: [image('layer', 4), image('layer', 2)],
    quantity: 90,
    tags: ['heritage', 'layer']
  }
];

const zones = [
  { name: 'Lagos Metro', states: ['Lagos'], baseFee: 15000, estimatedDaysMin: 1, estimatedDaysMax: 2 },
  { name: 'South West', states: ['Ogun', 'Oyo', 'Osun', 'Ondo', 'Ekiti'], baseFee: 25000, estimatedDaysMin: 2, estimatedDaysMax: 3 },
  { name: 'Abuja & North Central', states: ['FCT', 'Niger', 'Nasarawa', 'Kwara', 'Kogi'], baseFee: 40000, estimatedDaysMin: 2, estimatedDaysMax: 4 },
  { name: 'South East & South South', states: ['Enugu', 'Anambra', 'Imo', 'Abia', 'Rivers', 'Delta', 'Edo'], baseFee: 45000, estimatedDaysMin: 3, estimatedDaysMax: 5 },
  { name: 'Northern Nigeria', states: ['Kaduna', 'Kano', 'Katsina', 'Sokoto', 'Bauchi', 'Borno'], baseFee: 55000, estimatedDaysMin: 3, estimatedDaysMax: 6 }
];

// Programmatically generate extra demo animals to reach ~90 total when needed
const EXTRA_ANIMALS = 70
if (EXTRA_ANIMALS > 0) {
  const base = animals.slice()
  for (let i = 1; i <= EXTRA_ANIMALS; i++) {
    const src = base[(i - 1) % base.length]
    animals.push({
      ...src,
      name: `${src.name} — Demo ${i}`,
      price: Math.max(1000, Math.round(src.price * (1 + ((i % 5) + 1) * 0.03))),
      quantity: Math.max(1, Math.min(10, Math.floor((src.quantity || 1) / ((i % 3) + 1)))),
      images: src.images,
      tags: Array.from(new Set([...(src.tags || []), 'demo'])),
    })
  }
}

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const seed = async (): Promise<void> => {
  await connectDatabase();
  await Promise.all([Animal.deleteMany({}), DeliveryZone.deleteMany({}), Coupon.deleteMany({}), User.deleteMany({})]);

  await User.create([
    {
      firstName: 'Sovereign',
      lastName: 'Admin',
      email: 'admin@sovereigngoldlivestock.com',
      phone: '+2348000000001',
      password: 'AdminPass123',
      role: UserRole.Admin,
      emailVerified: true
    },
    {
      firstName: 'Amina',
      lastName: 'Bello',
      email: 'customer@sovereigngoldlivestock.com',
      phone: '+2348000000002',
      password: 'CustomerPass123',
      role: UserRole.Customer,
      emailVerified: true,
      addresses: [
        {
          label: 'Home',
          addressLine: '14 Adeola Odeku Street, Victoria Island',
          city: 'Lagos',
          state: 'Lagos',
          phone: '+2348000000002',
          isDefault: true
        }
      ]
    }
  ]);

  await DeliveryZone.create(zones);

  await Coupon.create([
    {
      code: 'SALLAH10',
      type: 'percentage',
      value: 10,
      minOrderAmount: 200000,
      maxDiscountAmount: 75000,
      startsAt: new Date(Date.now() - 86400000),
      expiresAt: new Date(Date.now() + 90 * 86400000),
      active: true
    },
    {
      code: 'FREIGHT5K',
      type: 'fixed',
      value: 5000,
      minOrderAmount: 100000,
      startsAt: new Date(Date.now() - 86400000),
      expiresAt: new Date(Date.now() + 90 * 86400000),
      active: true
    }
  ]);

  const counters: Record<string, number> = {};
  await Animal.create(
    animals.map((animal) => {
      counters[animal.category] = (counters[animal.category] || 0) + 1;
      const sku = `SGL-${animal.category.toUpperCase()}-${String(counters[animal.category]).padStart(3, '0')}`;
      return {
        ...animal,
        slug: `${slugify(animal.name)}-${sku.toLowerCase()}`,
        sku,
        depositAmount: Math.round((animal.price * 0.3) / 500) * 500,
        healthStatus: 'Vet certified — healthy',
        status: animal.status ?? AnimalStatus.Available,
        featured: animal.featured ?? false
      };
    })
  );

  await disconnectDatabase();
  console.info(`Demo seed completed: ${animals.length} animals, ${zones.length} delivery zones`);
};

// Only auto-run when executed directly (so importing this file doesn't run the seed twice)
if (require.main === module) {
  void seed().catch(async (error) => {
    console.error(error);
    await disconnectDatabase();
    process.exit(1);
  });
}
