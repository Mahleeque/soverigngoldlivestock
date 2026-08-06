import { connectDatabase, disconnectDatabase } from '../config/database';
import { Animal } from '../models/Animal';
import { slugify as _slugify } from './seedDemo';
import { animals as demoAnimals } from './seedDemo';

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const append = async (count = 70) => {
  await connectDatabase();

  // figure counters per category from existing animals
  const existing = await Animal.find({}).lean();
  const counters: Record<string, number> = {};
  existing.forEach((a: any) => {
    const cat = (a.category || 'other').toString();
    counters[cat] = Math.max(counters[cat] || 0, 0);
    const match = (a.sku || '').match(/SGL-([A-Z]+)-(\d+)/);
    if (match) counters[cat] = Math.max(counters[cat], Number(match[2]));
  });

  const toCreate: any[] = [];
  for (let i = 1; i <= count; i++) {
    const src = demoAnimals[(i - 1) % demoAnimals.length];
    const cat = src.category as string;
    counters[cat] = (counters[cat] || 0) + 1;
    const sku = `SGL-${cat.toUpperCase()}-${String(counters[cat]).padStart(3, '0')}`;
    const name = `${src.name} — Extra ${Date.now().toString().slice(-5)}-${i}`;
    toCreate.push({
      ...src,
      name,
      slug: `${slugify(name)}-${sku.toLowerCase()}`,
      sku,
      depositAmount: Math.round((src.price * 0.3) / 500) * 500,
      healthStatus: 'Vet certified — healthy',
      status: src.status ?? 'available',
      featured: src.featured ?? false,
    });
  }

  await Animal.create(toCreate);
  await disconnectDatabase();
  console.info(`Appended ${toCreate.length} animals`);
};

const n = Number(process.env.APPEND_COUNT || '70');
void append(n).catch(async (err) => {
  console.error(err);
  await disconnectDatabase();
  process.exit(1);
});
