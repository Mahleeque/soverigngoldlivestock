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
  // ==================== RAMS / SHEEP (10 Unique) ====================
  {
    name: 'Giant Yankasa Sallah Ram',
    category: AnimalCategory.Ram,
    breed: 'Yankasa',
    description:
      'A powerful, pasture-finished Yankasa ram raised in Kaduna. Prime choice for Eid-el-Kabir, naming ceremonies, weddings, and premium family celebrations.',
    price: 340000,
    weightKg: 88,
    ageMonths: 22,
    gender: 'male',
    size: 'large',
    vaccinationStatus: 'PPR, Anthrax, FMD, Dewormed',
    images: [image('ram', 1), image('ram', 3), image('ram', 4)],
    quantity: 4,
    featured: true,
    tags: ['sallah', 'premium', 'ram', 'yankasa']
  },
  {
    name: 'Balami Royal Grand Champion Ram',
    category: AnimalCategory.Ram,
    breed: 'Balami',
    description:
      'Stately, tall, pure-white Balami ram with extensive horn spread and massive body frame. Inspected and vet-certified for immediate ceremonial slaughter.',
    price: 495000,
    weightKg: 115,
    ageMonths: 28,
    gender: 'male',
    size: 'large',
    vaccinationStatus: 'PPR, Anthrax, Blackleg, CCPP',
    images: [image('ram', 2), image('ram', 5), image('ram', 1)],
    quantity: 2,
    featured: true,
    tags: ['balami', 'sallah', 'champion', 'grade-a']
  },
  {
    name: 'Uda Two-Tone Festive Ram',
    category: AnimalCategory.Ram,
    breed: 'Uda',
    description:
      'Hardy Uda ram with distinct two-tone coat (brown front, white rear). Excellent lean meat-to-bone ratio, ideal for family feasting.',
    price: 235000,
    weightKg: 68,
    ageMonths: 16,
    gender: 'male',
    size: 'medium',
    vaccinationStatus: 'PPR, Dewormed',
    images: [image('ram', 4), image('ram', 1), image('ram', 3)],
    quantity: 6,
    featured: false,
    tags: ['uda', 'sallah', 'festive']
  },
  {
    name: 'Ouda Spotted Grass-Fed Ram',
    category: AnimalCategory.Ram,
    breed: 'Ouda Cross',
    description:
      'Well-muscled spotted Ouda ram raised on natural pasture and supplemented with grain feed. Healthy, active, and fully ready for delivery.',
    price: 260000,
    weightKg: 74,
    ageMonths: 18,
    gender: 'male',
    size: 'medium',
    vaccinationStatus: 'PPR, Anthrax',
    images: [image('ram', 3), image('ram', 2)],
    quantity: 3,
    featured: false,
    tags: ['ouda', 'grass-fed', 'ram']
  },
  {
    name: 'Kano White Purebred Ram',
    category: AnimalCategory.Ram,
    breed: 'Kano White',
    description:
      'Compact, deep-chested Kano White ram. Excellent temperament, clean fleece, and high carcass yield.',
    price: 195000,
    weightKg: 58,
    ageMonths: 14,
    gender: 'male',
    size: 'medium',
    vaccinationStatus: 'PPR, Dewormed',
    images: [image('ram', 5), image('ram', 4)],
    quantity: 5,
    featured: false,
    tags: ['kano-white', 'ram', 'value']
  },
  {
    name: 'Sahel Long-Legged Desert Ram',
    category: AnimalCategory.Ram,
    breed: 'Sahelian',
    description:
      'Tall, drought-hardy Sahel ram with long legs and robust frame. Highly resilient breed with tender, flavourful meat.',
    price: 280000,
    weightKg: 78,
    ageMonths: 20,
    gender: 'male',
    size: 'large',
    vaccinationStatus: 'PPR, Anthrax, FMD',
    images: [image('ram', 1), image('ram', 2)],
    quantity: 3,
    featured: false,
    tags: ['sahel', 'ram', 'desert-breed']
  },
  {
    name: 'Borno Horned Heavyweight Ram',
    category: AnimalCategory.Ram,
    breed: 'Borno White',
    description:
      'Thick-necked Borno ram with solid bone structure and dense muscle mass. Excellent for high-end banquets and community feasts.',
    price: 380000,
    weightKg: 95,
    ageMonths: 24,
    gender: 'male',
    size: 'large',
    vaccinationStatus: 'PPR, Anthrax, Dewormed',
    images: [image('ram', 2), image('ram', 4)],
    quantity: 3,
    featured: true,
    tags: ['borno', 'ram', 'heavyweight']
  },
  {
    name: 'Yankasa Proven Breeding Ewe',
    category: AnimalCategory.Ram,
    breed: 'Yankasa',
    description:
      'Healthy, fertile breeding ewe with excellent maternal instincts and proven multiple-birth history. Sold with complete vaccination certificate.',
    price: 150000,
    weightKg: 52,
    ageMonths: 24,
    gender: 'female',
    size: 'medium',
    vaccinationStatus: 'PPR, Anthrax, Multivitamins',
    images: [image('ram', 5), image('ram', 3)],
    quantity: 4,
    featured: false,
    tags: ['breeding', 'ewe', 'livestock-starter']
  },
  {
    name: 'West African Long-Tail Ram',
    category: AnimalCategory.Ram,
    breed: 'Fulani Sheep',
    description:
      'Agile and energetic long-tailed Fulani ram. Acclimatized to southern climate, well-suited for family gatherings and celebrations.',
    price: 215000,
    weightKg: 62,
    ageMonths: 15,
    gender: 'male',
    size: 'medium',
    vaccinationStatus: 'PPR, Dewormed',
    images: [image('ram', 3), image('ram', 5)],
    quantity: 5,
    featured: false,
    tags: ['fulani-sheep', 'ram', 'ceremony']
  },
  {
    name: 'Sokoto Spotted Pasture Ram',
    category: AnimalCategory.Ram,
    breed: 'Sokoto Cross',
    description:
      'Evenly proportioned spotted ram with calm temperament and high lean meat content. Pasture-grazed on natural grasses.',
    price: 245000,
    weightKg: 70,
    ageMonths: 17,
    gender: 'male',
    size: 'medium',
    vaccinationStatus: 'PPR, Anthrax',
    images: [image('ram', 4), image('ram', 2)],
    quantity: 4,
    featured: false,
    tags: ['sokoto', 'spotted', 'pasture-fed']
  },

  // ==================== GOATS (9 Unique) ====================
  {
    name: 'Boer Stud Buck — Grade A',
    category: AnimalCategory.Goat,
    breed: 'South African Boer',
    description:
      'Pedigree Boer buck with thick muscular build, broad chest and docile temperament. Benchmark choice for commercial meat breeding or upgrading local herds.',
    price: 275000,
    weightKg: 72,
    ageMonths: 18,
    gender: 'male',
    size: 'large',
    vaccinationStatus: 'PPR, CCPP, Enterotoxaemia',
    images: [image('goat', 2), image('goat', 1), image('goat', 3)],
    quantity: 3,
    featured: true,
    tags: ['boer', 'stud', 'breeding', 'grade-a']
  },
  {
    name: 'Red Sokoto (Maradi) Meat Goat',
    category: AnimalCategory.Goat,
    breed: 'Red Sokoto (Maradi)',
    description:
      'Renowned for its fine skin and succulent, flavourful meat. Raised on high-protein browse and clean grains in northern Nigeria.',
    price: 85000,
    weightKg: 32,
    ageMonths: 12,
    gender: 'male',
    size: 'small',
    vaccinationStatus: 'PPR, Dewormed',
    images: [image('goat', 1), image('goat', 4)],
    quantity: 8,
    featured: true,
    tags: ['red-sokoto', 'maradi', 'pepper-soup']
  },
  {
    name: 'Kalahari Red Prime Doe',
    category: AnimalCategory.Goat,
    breed: 'Kalahari Red',
    description:
      'Heavy-milking Kalahari Red female goat. Exceptional heat tolerance and strong disease resistance, ideal for farm foundation stock.',
    price: 190000,
    weightKg: 55,
    ageMonths: 16,
    gender: 'female',
    size: 'medium',
    vaccinationStatus: 'PPR, CCPP',
    images: [image('goat', 3), image('goat', 5)],
    quantity: 4,
    featured: false,
    tags: ['kalahari', 'breeding', 'doe']
  },
  {
    name: 'West African Dwarf (WAD) Family Goat',
    category: AnimalCategory.Goat,
    breed: 'WAD Indigenous',
    description:
      'Extremely hardy, trypanotolerant dwarf goat adapted to southern humid zones. Great for backyard raising and family weekend celebrations.',
    price: 75000,
    weightKg: 24,
    ageMonths: 10,
    gender: 'female',
    size: 'small',
    vaccinationStatus: 'PPR, Multivitamins',
    images: [image('goat', 4), image('goat', 2)],
    quantity: 10,
    featured: false,
    tags: ['wad', 'dwarf', 'hardy']
  },
  {
    name: 'Kano Brown Heavy Doe',
    category: AnimalCategory.Goat,
    breed: 'Kano Brown',
    description:
      'Well-nourished Kano Brown goat with rich coat and strong frame. Prolific breeder suited for semi-intensive management.',
    price: 115000,
    weightKg: 42,
    ageMonths: 15,
    gender: 'female',
    size: 'medium',
    vaccinationStatus: 'PPR, CCPP',
    images: [image('goat', 5), image('goat', 3)],
    quantity: 5,
    featured: false,
    tags: ['kano-brown', 'doe', 'meat']
  },
  {
    name: 'Alpine Cross Dairy & Meat Buck',
    category: AnimalCategory.Goat,
    breed: 'Alpine x Sahel Cross',
    description:
      'Fast-growing crossbred buck combining dairy genetics with African climate adaptability. High daily weight gain.',
    price: 165000,
    weightKg: 58,
    ageMonths: 17,
    gender: 'male',
    size: 'medium',
    vaccinationStatus: 'PPR, CCPP, Anthrax',
    images: [image('goat', 1), image('goat', 5)],
    quantity: 3,
    featured: false,
    tags: ['alpine', 'crossbreed', 'buck']
  },
  {
    name: 'Saanen High-Yield Dairy Doe',
    category: AnimalCategory.Goat,
    breed: 'Saanen Cross',
    description:
      'Gentle white dairy doe bred for commercial goat milk production. Calm temperament and proven 3.5L/day yield potential.',
    price: 210000,
    weightKg: 52,
    ageMonths: 20,
    gender: 'female',
    size: 'medium',
    vaccinationStatus: 'PPR, CCPP, Brucella Clean',
    images: [image('goat', 2), image('goat', 4)],
    quantity: 3,
    featured: false,
    tags: ['saanen', 'dairy', 'goat-milk']
  },
  {
    name: 'Anglo-Nubian Dual Purpose Buck',
    category: AnimalCategory.Goat,
    breed: 'Anglo-Nubian',
    description:
      'Distinguished buck with convex roman nose and long pendulous ears. Excellent sire for boosting herd size and milk butterfat.',
    price: 240000,
    weightKg: 65,
    ageMonths: 19,
    gender: 'male',
    size: 'large',
    vaccinationStatus: 'PPR, CCPP, Dewormed',
    images: [image('goat', 3), image('goat', 1)],
    quantity: 2,
    featured: true,
    tags: ['anglo-nubian', 'stud', 'dual-purpose']
  },
  {
    name: 'Borno White Meat He-Goat',
    category: AnimalCategory.Goat,
    breed: 'Borno White',
    description:
      'Sturdy white billy goat with dense meat frame. Clean, healthy, and ready for weekend barbecues and asun preparations.',
    price: 95000,
    weightKg: 36,
    ageMonths: 13,
    gender: 'male',
    size: 'small',
    vaccinationStatus: 'PPR, Dewormed',
    images: [image('goat', 5), image('goat', 2)],
    quantity: 6,
    featured: false,
    tags: ['borno-white', 'asun', 'barbecue']
  },

  // ==================== CATTLE / COWS (9 Unique) ====================
  {
    name: 'White Fulani (Bunaji) Ceremonial Bull',
    category: AnimalCategory.Cow,
    breed: 'White Fulani (Bunaji)',
    description:
      'Massive, majestic White Fulani bull in prime ceremonial condition with symmetrical lyre horns. The gold standard for grand weddings, coronations and corporate gifting.',
    price: 1550000,
    weightKg: 445,
    ageMonths: 42,
    gender: 'male',
    size: 'large',
    vaccinationStatus: 'CBPP, FMD, Anthrax, Blackleg, Dewormed',
    images: [image('cow', 2), image('cow', 1), image('cow', 5)],
    quantity: 2,
    featured: true,
    tags: ['bull', 'ceremony', 'white-fulani', 'premium']
  },
  {
    name: 'Sokoto Gudali Prime Stud Bull',
    category: AnimalCategory.Cow,
    breed: 'Sokoto Gudali',
    description:
      'Deep-bodied, short-horned Gudali bull with heavy muscling and peaceful temperament. High carcass yield with low bone-to-meat ratio.',
    price: 1380000,
    weightKg: 410,
    ageMonths: 38,
    gender: 'male',
    size: 'large',
    vaccinationStatus: 'CBPP, FMD, Anthrax',
    images: [image('cow', 3), image('cow', 4)],
    quantity: 2,
    featured: true,
    tags: ['gudali', 'stud-bull', 'meat']
  },
  {
    name: 'Red Bororo Grain-Finished Steer',
    category: AnimalCategory.Cow,
    breed: 'Red Bororo',
    description:
      'Distinctive reddish-brown steer with prominent hump and sweeping horns. Pasture-raised in Adamawa and grain-finished for four weeks for optimal marbling.',
    price: 1220000,
    weightKg: 375,
    ageMonths: 36,
    gender: 'male',
    size: 'large',
    vaccinationStatus: 'CBPP, Anthrax, FMD',
    images: [image('cow', 5), image('cow', 2)],
    quantity: 2,
    featured: false,
    tags: ['red-bororo', 'steer', 'grain-finished']
  },
  {
    name: 'Adamawa Gudali Dairy Cow',
    category: AnimalCategory.Cow,
    breed: 'Adamawa Gudali',
    description:
      'Docile Gudali cow with strong milk yield capacity. Vet health check completed, perfect for smallholder dairy or ceremonial use.',
    price: 1050000,
    weightKg: 330,
    ageMonths: 32,
    gender: 'female',
    size: 'large',
    vaccinationStatus: 'CBPP, FMD, Brucellosis-free',
    images: [image('cow', 4), image('cow', 3)],
    quantity: 2,
    featured: false,
    tags: ['dairy', 'heifer', 'gudali']
  },
  {
    name: 'Muturu Heritage Pasture Cow',
    category: AnimalCategory.Cow,
    breed: 'Muturu (Forest Cattle)',
    description:
      'Indigenous Nigerian humpless dwarf cattle naturally immune to trypanosomiasis (tsetse fly). High meat density, highly valued in traditional ceremonies.',
    price: 780000,
    weightKg: 220,
    ageMonths: 28,
    gender: 'female',
    size: 'medium',
    vaccinationStatus: 'CBPP, Anthrax',
    images: [image('cow', 1), image('cow', 5)],
    quantity: 3,
    featured: false,
    tags: ['muturu', 'indigenous', 'heritage']
  },
  {
    name: 'Ndama Disease-Resistant Heifer',
    category: AnimalCategory.Cow,
    breed: 'Ndama',
    description:
      'Hardy West African Ndama heifer. Outstanding disease tolerance and pasture conversion efficiency on low-input farms.',
    price: 890000,
    weightKg: 260,
    ageMonths: 26,
    gender: 'female',
    size: 'medium',
    vaccinationStatus: 'CBPP, FMD',
    images: [image('cow', 3), image('cow', 1)],
    quantity: 2,
    featured: false,
    tags: ['ndama', 'heifer', 'hardy']
  },
  {
    name: 'Kuri Lake Chad Heavyweight Bull',
    category: AnimalCategory.Cow,
    breed: 'Kuri Cattle',
    description:
      'Unique bulbous-horned giant Kuri bull from the Lake Chad basin. Enormous carcass weight and tender meat quality.',
    price: 1680000,
    weightKg: 490,
    ageMonths: 44,
    gender: 'male',
    size: 'large',
    vaccinationStatus: 'CBPP, FMD, Anthrax, Dewormed',
    images: [image('cow', 2), image('cow', 4)],
    quantity: 1,
    featured: true,
    tags: ['kuri', 'lake-chad', 'giant-bull']
  },
  {
    name: 'Wadara High-Milk Zebu Cow',
    category: AnimalCategory.Cow,
    breed: 'Wadara (Shuwa Arab)',
    description:
      'Medium-sized black/dark brown Shuwa Arab zebu cow known for docile milking behavior and reliable fertility.',
    price: 980000,
    weightKg: 310,
    ageMonths: 30,
    gender: 'female',
    size: 'medium',
    vaccinationStatus: 'CBPP, Anthrax',
    images: [image('cow', 5), image('cow', 3)],
    quantity: 2,
    featured: false,
    tags: ['wadara', 'shuwa', 'dairy-cow']
  },
  {
    name: 'Azawak Beef Finished Steer',
    category: AnimalCategory.Cow,
    breed: 'Azawak',
    description:
      'Fine-boned, well-muscled Azawak steer with smooth fawn coat. Exceptional beef tenderness and marbling.',
    price: 1150000,
    weightKg: 350,
    ageMonths: 34,
    gender: 'male',
    size: 'large',
    vaccinationStatus: 'CBPP, FMD, Dewormed',
    images: [image('cow', 1), image('cow', 2)],
    quantity: 2,
    featured: false,
    tags: ['azawak', 'beef-steer', 'tender']
  },

  // ==================== PIGS (8 Unique) ====================
  {
    name: 'Large White Commercial Breeder Sow',
    category: AnimalCategory.Pig,
    breed: 'Large White',
    description:
      'Biosecure-raised Large White sow from our Ogun breeding unit. Excellent parity record averaging 11 piglets per litter.',
    price: 250000,
    weightKg: 150,
    ageMonths: 20,
    gender: 'female',
    size: 'large',
    vaccinationStatus: 'Erysipelas, Parvovirus, Iron, Dewormed',
    images: [image('pig', 1), image('pig', 2)],
    quantity: 4,
    featured: true,
    tags: ['large-white', 'sow', 'breeding', 'commercial']
  },
  {
    name: 'Landrace Fattening Weaners (Lot of 10)',
    category: AnimalCategory.Pig,
    breed: 'Landrace',
    description:
      'Eight-week-old weaned piglets raised on balanced starter feed. Strong appetite, rapid growth curve, sold in healthy batches of 10.',
    price: 680000,
    weightKg: 190,
    ageMonths: 2,
    gender: 'male',
    size: 'small',
    vaccinationStatus: 'Iron Injected, Dewormed, Multivitamins',
    images: [image('pig', 3), image('pig', 4)],
    quantity: 6,
    featured: true,
    tags: ['landrace', 'weaners', 'bulk', 'piggery']
  },
  {
    name: 'Duroc Purebred Sire Boar',
    category: AnimalCategory.Pig,
    breed: 'Duroc',
    description:
      'Heavy-hammed Duroc boar with proven fertility and calm demeanor. Essential for producing high-growth terminal market crosses.',
    price: 325000,
    weightKg: 175,
    ageMonths: 24,
    gender: 'male',
    size: 'large',
    vaccinationStatus: 'Erysipelas, Parvovirus, Mycoplasma',
    images: [image('pig', 5), image('pig', 1)],
    quantity: 2,
    featured: false,
    tags: ['duroc', 'boar', 'sire']
  },
  {
    name: 'Camborough High-Prolificacy Gilt',
    category: AnimalCategory.Pig,
    breed: 'Camborough (PIC)',
    description:
      'Commercial hybrid gilt bred for maximum reproductive efficiency, high milk yield and longevity in confinement housing.',
    price: 210000,
    weightKg: 115,
    ageMonths: 12,
    gender: 'female',
    size: 'large',
    vaccinationStatus: 'Parvovirus, Leptospira, Erysipelas',
    images: [image('pig', 2), image('pig', 3)],
    quantity: 5,
    featured: false,
    tags: ['camborough', 'gilt', 'commercial']
  },
  {
    name: 'Hampshire Cross Grower Pig',
    category: AnimalCategory.Pig,
    breed: 'Hampshire Cross',
    description:
      'Fast-growing, lean meat grower pig with black coat and white saddle belt. Perfect for pork processing or barbecue events.',
    price: 135000,
    weightKg: 65,
    ageMonths: 6,
    gender: 'male',
    size: 'medium',
    vaccinationStatus: 'Erysipelas, Dewormed',
    images: [image('pig', 4), image('pig', 5)],
    quantity: 8,
    featured: false,
    tags: ['hampshire', 'grower', 'pork']
  },
  {
    name: 'Pietrain Ultra-Lean Terminal Boar',
    category: AnimalCategory.Pig,
    breed: 'Pietrain',
    description:
      'Spotted European breed noted for high lean-meat percentage, massive eye-muscle depth, and superior primal cuts.',
    price: 310000,
    weightKg: 160,
    ageMonths: 22,
    gender: 'male',
    size: 'large',
    vaccinationStatus: 'Erysipelas, Parvo, Circo',
    images: [image('pig', 1), image('pig', 4)],
    quantity: 2,
    featured: false,
    tags: ['pietrain', 'boar', 'lean-meat']
  },
  {
    name: 'Yorkshire Robust Grower Pig',
    category: AnimalCategory.Pig,
    breed: 'Yorkshire',
    description:
      'Vigorous, erect-eared white grower pig fed on premium grain-soy feed. Steady growth rate and robust immunity.',
    price: 145000,
    weightKg: 75,
    ageMonths: 7,
    gender: 'male',
    size: 'medium',
    vaccinationStatus: 'Erysipelas, Dewormed',
    images: [image('pig', 3), image('pig', 2)],
    quantity: 7,
    featured: false,
    tags: ['yorkshire', 'grower', 'meat']
  },
  {
    name: 'Berkshire Heritage Gilt',
    category: AnimalCategory.Pig,
    breed: 'Berkshire',
    description:
      'Prized black heritage pig famous for producing intensely flavorful, dark marbled Berkshire pork (Kurobuta).',
    price: 225000,
    weightKg: 120,
    ageMonths: 14,
    gender: 'female',
    size: 'medium',
    vaccinationStatus: 'Erysipelas, Parvovirus',
    images: [image('pig', 5), image('pig', 3)],
    quantity: 4,
    featured: false,
    tags: ['berkshire', 'kurobuta', 'gilt', 'marbled']
  },

  // ==================== BROILER CHICKENS (8 Unique) ====================
  {
    name: 'Ross 308 Jumbo Table Broilers (Crate of 10)',
    category: AnimalCategory.Chicken,
    breed: 'Ross 308',
    description:
      'Fully matured 7-week table broilers averaging 2.6kg live weight. Raised without antibiotic growth promoters, dressed on request.',
    price: 105000,
    weightKg: 26,
    ageMonths: 2,
    gender: 'male',
    size: 'small',
    vaccinationStatus: 'Newcastle, Gumboro, Lasota',
    images: [image('chicken', 2), image('chicken', 3), image('chicken', 1)],
    quantity: 35,
    featured: true,
    tags: ['broiler', 'jumbo', 'crate', 'table-meat']
  },
  {
    name: 'Cobb 500 Fast-Growth Farm Broilers',
    category: AnimalCategory.Chicken,
    breed: 'Cobb 500',
    description:
      'Broad-breasted Cobb 500 broilers known for excellent feed conversion and tender breast meat. Sold individually or in crates.',
    price: 9800,
    weightKg: 2.4,
    ageMonths: 2,
    gender: 'male',
    size: 'small',
    vaccinationStatus: 'Newcastle, IBD (Gumboro)',
    images: [image('chicken', 1), image('chicken', 5)],
    quantity: 120,
    featured: false,
    tags: ['cobb-500', 'broiler', 'poultry']
  },
  {
    name: 'Noiler Dual-Purpose Heavy Cockerel',
    category: AnimalCategory.Chicken,
    breed: 'Noiler',
    description:
      'Hardy cockerel suitable for backyard free-range rearing or festive family cooking. Meat has rich firmness and natural gamey flavor.',
    price: 7500,
    weightKg: 2.1,
    ageMonths: 3,
    gender: 'male',
    size: 'small',
    vaccinationStatus: 'Newcastle, Fowl Pox, Dewormed',
    images: [image('chicken', 4), image('chicken', 1)],
    quantity: 80,
    featured: true,
    tags: ['noiler', 'cockerel', 'free-range']
  },
  {
    name: 'Nigerian Indigenous Free-Range Cockerel',
    category: AnimalCategory.Chicken,
    breed: 'Local Indigenous',
    description:
      'True organic free-range local cockerel, prized for deep aromatic chicken pepper soup and authentic African cuisine.',
    price: 12500,
    weightKg: 1.7,
    ageMonths: 6,
    gender: 'male',
    size: 'small',
    vaccinationStatus: 'Newcastle NDV-I2',
    images: [image('chicken', 3), image('chicken', 4)],
    quantity: 45,
    featured: false,
    tags: ['indigenous', 'organic', 'pepper-soup']
  },
  {
    name: 'Kuroiler Organic Rooster',
    category: AnimalCategory.Chicken,
    breed: 'Kuroiler',
    description:
      'Vigorous, heavy Kuroiler rooster reared in open pasture runs. High meat yield with low fat content.',
    price: 11000,
    weightKg: 2.8,
    ageMonths: 4,
    gender: 'male',
    size: 'small',
    vaccinationStatus: 'Newcastle, Fowl Cholera',
    images: [image('chicken', 5), image('chicken', 2)],
    quantity: 60,
    featured: false,
    tags: ['kuroiler', 'rooster', 'pasture-raised']
  },
  {
    name: 'Hubbard Classic Farm Broilers',
    category: AnimalCategory.Chicken,
    breed: 'Hubbard Classic',
    description:
      'Healthy 8-week broilers with balanced growth rate, strong legs, and juicy tender meat for roasting and grilling.',
    price: 9500,
    weightKg: 2.5,
    ageMonths: 2,
    gender: 'male',
    size: 'small',
    vaccinationStatus: 'Newcastle, Gumboro',
    images: [image('chicken', 2), image('chicken', 4)],
    quantity: 90,
    featured: false,
    tags: ['hubbard', 'broiler', 'roasting']
  },
  {
    name: 'Sasso French Heritage Free-Range Bird',
    category: AnimalCategory.Chicken,
    breed: 'Sasso Color',
    description:
      'Rustic slow-growing French broiler line adapted to Nigerian free-range environments. Firm, savory red-tinted meat.',
    price: 13000,
    weightKg: 2.6,
    ageMonths: 3,
    gender: 'male',
    size: 'small',
    vaccinationStatus: 'Newcastle, Fowl Pox, Lasota',
    images: [image('chicken', 1), image('chicken', 3)],
    quantity: 50,
    featured: false,
    tags: ['sasso', 'free-range', 'gourmet']
  },
  {
    name: 'Cornish Cross Heavy Meat Cockerel',
    category: AnimalCategory.Chicken,
    breed: 'Cornish Cross',
    description:
      'Heavyweight meat chicken with massive drumsticks and breast portions. Farm-fed on grains and mineral supplements.',
    price: 10000,
    weightKg: 2.7,
    ageMonths: 2,
    gender: 'male',
    size: 'small',
    vaccinationStatus: 'Newcastle, Gumboro',
    images: [image('chicken', 4), image('chicken', 5)],
    quantity: 75,
    featured: false,
    tags: ['cornish', 'heavyweight', 'cockerel']
  },

  // ==================== LAYERS (8 Unique) ====================
  {
    name: 'Isa Brown Point-of-Lay Pullets (Crate of 25)',
    category: AnimalCategory.Layer,
    breed: 'Isa Brown',
    description:
      '18-week point-of-lay pullets ready to commence 95%+ peak egg production. Fully vaccinated, debeaked, and boxed in transport crates.',
    price: 180000,
    weightKg: 40,
    ageMonths: 4,
    gender: 'female',
    size: 'small',
    vaccinationStatus: 'Marek, Newcastle, Gumboro, EDS, Coryza, Fowl Pox, Debeaked',
    images: [image('layer', 2), image('layer', 1), image('layer', 3)],
    quantity: 25,
    featured: true,
    tags: ['point-of-lay', 'isa-brown', 'crate-25', 'egg-production']
  },
  {
    name: 'Nera Black Brown-Egg Production Layers',
    category: AnimalCategory.Layer,
    breed: 'Nera Black',
    description:
      'Extremely resilient black layer breed producing large, thick-shelled brown eggs with high persistence over 80 weeks of lay.',
    price: 7600,
    weightKg: 1.8,
    ageMonths: 5,
    gender: 'female',
    size: 'small',
    vaccinationStatus: 'Newcastle, Gumboro, EDS, Dewormed',
    images: [image('layer', 5), image('layer', 3)],
    quantity: 200,
    featured: true,
    tags: ['nera-black', 'layer', 'eggs', 'hardy']
  },
  {
    name: 'Dominant Black Heritage Pullets',
    category: AnimalCategory.Layer,
    breed: 'Dominant Black',
    description:
      'Adaptable dual-purpose layer hen that thrives in hot climates and backyard pens while laying 280+ tinted eggs annually.',
    price: 8400,
    weightKg: 1.9,
    ageMonths: 5,
    gender: 'female',
    size: 'small',
    vaccinationStatus: 'Newcastle, Fowl Pox',
    images: [image('layer', 3), image('layer', 4)],
    quantity: 110,
    featured: false,
    tags: ['dominant-black', 'heritage', 'eggs']
  },
  {
    name: 'Shika Brown High-Production Pullet',
    category: AnimalCategory.Layer,
    breed: 'Shika Brown (NAPRI)',
    description:
      'Locally developed Nigerian hybrid layer with high tolerance for ambient tropical heat and exceptional feed-to-egg ratio.',
    price: 6900,
    weightKg: 1.5,
    ageMonths: 4,
    gender: 'female',
    size: 'small',
    vaccinationStatus: 'Newcastle, Gumboro, Lasota',
    images: [image('layer', 1), image('layer', 5)],
    quantity: 150,
    featured: false,
    tags: ['shika-brown', 'napri', 'pullet']
  },
  {
    name: 'Barred Plymouth Rock Heritage Hen',
    category: AnimalCategory.Layer,
    breed: 'Plymouth Rock',
    description:
      'Classic heritage breed known for docile nature, continuous egg production, and good foraging ability in free-range systems.',
    price: 10000,
    weightKg: 2.2,
    ageMonths: 7,
    gender: 'female',
    size: 'small',
    vaccinationStatus: 'Newcastle, Fowl Pox, Dewormed',
    images: [image('layer', 4), image('layer', 2)],
    quantity: 50,
    featured: false,
    tags: ['plymouth-rock', 'heritage', 'layer']
  },
  {
    name: 'Lohmann Brown Layer Pullet',
    category: AnimalCategory.Layer,
    breed: 'Lohmann Brown',
    description:
      'World-class egg layer boasting exceptional feed efficiency, shell strength, and over 320 high-grade brown eggs per cycle.',
    price: 7800,
    weightKg: 1.7,
    ageMonths: 5,
    gender: 'female',
    size: 'small',
    vaccinationStatus: 'Newcastle, Marek, EDS, Lasota',
    images: [image('layer', 2), image('layer', 4)],
    quantity: 130,
    featured: false,
    tags: ['lohmann-brown', 'pullet', 'high-yield']
  },
  {
    name: 'Bovans Black High-Laying Hen',
    category: AnimalCategory.Layer,
    breed: 'Bovans Black',
    description:
      'Robust and feather-dense black layer hen with gentle behavior. Well-suited to floor and deep litter systems in hot climates.',
    price: 7400,
    weightKg: 1.8,
    ageMonths: 6,
    gender: 'female',
    size: 'small',
    vaccinationStatus: 'Newcastle, Gumboro, Dewormed',
    images: [image('layer', 5), image('layer', 1)],
    quantity: 100,
    featured: false,
    tags: ['bovans', 'layer', 'eggs']
  },
  {
    name: 'White Leghorn White-Egg Pullet',
    category: AnimalCategory.Layer,
    breed: 'White Leghorn',
    description:
      'Active, compact white hen capable of laying 300+ large white eggs per year with minimal daily feed consumption.',
    price: 7000,
    weightKg: 1.4,
    ageMonths: 5,
    gender: 'female',
    size: 'small',
    vaccinationStatus: 'Newcastle, Marek, EDS',
    images: [image('layer', 3), image('layer', 5)],
    quantity: 80,
    featured: false,
    tags: ['white-leghorn', 'white-eggs', 'pullet']
  }
];

const zones = [
  { name: 'Lagos Metro', states: ['Lagos'], baseFee: 15000, estimatedDaysMin: 1, estimatedDaysMax: 2 },
  { name: 'South West', states: ['Ogun', 'Oyo', 'Osun', 'Ondo', 'Ekiti'], baseFee: 25000, estimatedDaysMin: 2, estimatedDaysMax: 3 },
  { name: 'Abuja & North Central', states: ['FCT', 'Niger', 'Nasarawa', 'Kwara', 'Kogi', 'Benue', 'Plateau'], baseFee: 40000, estimatedDaysMin: 2, estimatedDaysMax: 4 },
  { name: 'South East & South South', states: ['Enugu', 'Anambra', 'Imo', 'Abia', 'Rivers', 'Delta', 'Edo', 'Akwa Ibom', 'Cross River', 'Bayelsa', 'Ebonyi'], baseFee: 45000, estimatedDaysMin: 3, estimatedDaysMax: 5 },
  { name: 'Northern Nigeria', states: ['Kaduna', 'Kano', 'Katsina', 'Sokoto', 'Bauchi', 'Borno', 'Gombe', 'Jigawa', 'Kebbi', 'Zamfara', 'Yobe', 'Taraba', 'Adamawa'], baseFee: 55000, estimatedDaysMin: 3, estimatedDaysMax: 6 }
];

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
      expiresAt: new Date(Date.now() + 180 * 86400000),
      active: true
    },
    {
      code: 'FREIGHT5K',
      type: 'fixed',
      value: 5000,
      minOrderAmount: 100000,
      startsAt: new Date(Date.now() - 86400000),
      expiresAt: new Date(Date.now() + 180 * 86400000),
      active: true
    },
    {
      code: 'WELCOME5',
      type: 'percentage',
      value: 5,
      minOrderAmount: 50000,
      maxDiscountAmount: 25000,
      startsAt: new Date(Date.now() - 86400000),
      expiresAt: new Date(Date.now() + 180 * 86400000),
      active: true
    },
    {
      code: 'FARMDIRECT',
      type: 'fixed',
      value: 10000,
      minOrderAmount: 500000,
      startsAt: new Date(Date.now() - 86400000),
      expiresAt: new Date(Date.now() + 180 * 86400000),
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
        healthStatus: 'Vet certified — healthy & vaccinated',
        status: animal.status ?? AnimalStatus.Available,
        featured: animal.featured ?? false
      };
    })
  );

  await disconnectDatabase();
  console.info(`Demo seed completed: ${animals.length} unique animals, ${zones.length} delivery zones, 4 active coupons`);
};

// Only auto-run when executed directly
if (require.main === module) {
  void seed().catch(async (error) => {
    console.error(error);
    await disconnectDatabase();
    process.exit(1);
  });
}
