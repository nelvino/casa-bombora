// Curated local guides — every place listed is a real, well-known spot on the
// Bukit. Drive times are approximate from the villas in Pecatu.

export interface GuidePlace {
  name: string
  /** Approximate drive time from Casa Bombora Villas, e.g. "~7 min" */
  distance?: string
  text: string
}

export interface GuideSection {
  heading: string
  paragraphs?: string[]
  places?: GuidePlace[]
}

export interface Guide {
  slug: string
  title: string
  excerpt: string
  metaDescription: string
  readTime: string
  intro: string
  sections: GuideSection[]
}

export const GUIDES: Guide[] = [
  {
    slug: 'uluwatu-temple',
    title: 'Uluwatu Temple: the clifftop sunset guide',
    excerpt:
      'The Bukit\u2019s most famous landmark — a sea temple on a 70-metre cliff, cheeky monkeys, and the sunset kecak fire dance.',
    metaDescription:
      'How to visit Uluwatu Temple (Pura Luhur Uluwatu): sunset kecak dance, monkey etiquette, dress code and timing — about 7 minutes from Casa Bombora Villas.',
    readTime: '4 min read',
    intro:
      'Pura Luhur Uluwatu is one of Bali\u2019s six key sea temples, perched on the edge of a sheer limestone cliff about 70 metres above the Indian Ocean. It\u2019s about 7 minutes by scooter from the villas — close enough that sunset there can be a spur-of-the-moment decision.',
    sections: [
      {
        heading: 'When to go',
        paragraphs: [
          'Late afternoon is the classic move: arrive around 4:30\u20135:00 PM, walk the cliff paths while it\u2019s still light, then stay for the kecak fire dance at sunset. The temple grounds open during the day, but the golden light and the dance make early evening the best time.',
          'Kecak performances run daily around sunset (typically 6:00 PM) in an open-air amphitheatre on the cliff edge. Seats fill up fast in high season — arrive early or ask us to help you get tickets in advance.',
        ],
      },
      {
        heading: 'Good to know',
        paragraphs: [
          'There\u2019s a small entrance fee at the gate, and sarongs and sashes are provided with entry — shoulders and knees should be covered. The resident monkeys are famous for snatching sunglasses, phones, and hats: keep loose items zipped away and don\u2019t feed them.',
          'Kecak tickets are sold separately from temple entry — buy them at the gate when you arrive, before the show area fills. Wear shoes you can walk in; the cliff path has uneven steps.',
        ],
      },
      {
        heading: 'Pair it with',
        places: [
          {
            name: 'Single Fin',
            distance: '~9 min',
            text: 'Clifftop bar above the Suluban surf break — perfect for a post-temple drink, especially on a Sunday.',
          },
          {
            name: 'Suluban Beach',
            distance: '~9 min',
            text: 'The cave beach below the cliffs — go at low tide to explore.',
          },
        ],
      },
    ],
  },
  {
    slug: 'best-surf-breaks-uluwatu',
    title: 'Uluwatu surf breaks, by level',
    excerpt:
      'From first green waves at Baby Padang to the legendary reefs at Suluban — where to surf on the Bukit, honestly graded.',
    metaDescription:
      'The Uluwatu surf guide: Baby Padang and Dreamland for beginners, Bingin for intermediates, Uluwatu and Padang Padang for advanced surfers — all under 15 minutes from Casa Bombora Villas.',
    readTime: '5 min read',
    intro:
      'The Bukit Peninsula packs some of the most consistent surf on the planet into a few kilometres of reef and beach. The honest caveat: Uluwatu\u2019s fame comes from its heavy reef breaks, so beginners should pick their spots — and they exist. All of these are within ~15 minutes of the villas.',
    sections: [
      {
        heading: 'Starting out',
        places: [
          {
            name: 'Baby Padang (Padang Padang Right)',
            distance: '~6 min',
            text: 'The Bukit\u2019s favourite beginner wave — a soft, consistent right-hander across the channel from the famous left. Board rentals and lessons right on the sand, plus beach warungs and showers at the top of the stairs. Best on small to medium swell at mid-to-high tide.',
          },
          {
            name: 'Dreamland Beach',
            distance: '~15 min',
            text: 'Sandy-bottom beach break with forgiving whitewater — great for first green waves, and the sunset scene is lively.',
          },
          {
            name: 'Thomas Beach',
            distance: '~12 min',
            text: 'Quieter alternative with mellow waves on smaller days and far fewer people.',
          },
        ],
      },
      {
        heading: 'Stepping up',
        places: [
          {
            name: 'Bingin',
            distance: '~10 min',
            text: 'A mechanical left that offers short, perfect rides. Works best at mid tide; the reef is shallow at low tide. The cliff walk down is part of the experience.',
          },
          {
            name: 'Impossibles',
            distance: '~6 min (via Padang Padang)',
            text: 'Long, fast down-the-line walls that can link up for huge rides when tide and swell align.',
          },
        ],
      },
      {
        heading: 'Experienced surfers',
        places: [
          {
            name: 'Uluwatu (Suluban)',
            distance: '~9 min',
            text: 'Bali\u2019s most famous wave — a powerful left-hand reef break with multiple sections that work on different tides. Entry is through the cave at Suluban Beach. Advanced only; respect the reef, the currents, and the crowd.',
          },
          {
            name: 'Padang Padang Left',
            distance: '~6 min',
            text: 'The "Balinese Pipeline" — a hollow, barreling left that only works on solid swell. Home of the Rip Curl Cup. Experts only.',
          },
          {
            name: 'Nyang Nyang',
            distance: '~10 min',
            text: 'Long, uncrowded beach with shifting peaks — a good option when the famous reefs are packed.',
          },
        ],
      },
      {
        heading: 'Practical notes',
        paragraphs: [
          'Reef boots are worth having — most breaks here are shallow reef, not sand. Check tide charts before paddling out; conditions change completely between low and high tide. Board rental is easy at Padang Padang and Dreamland, and we can help arrange lessons with local instructors.',
        ],
      },
    ],
  },
  {
    slug: 'best-cafes-uluwatu',
    title: 'The best cafés and brunch around Pecatu & Bingin',
    excerpt:
      'Post-surf breakfasts, proper coffee, and the spots locals actually return to — all within about ten minutes of the villas.',
    metaDescription:
      'A curated list of the best cafés in Uluwatu, Pecatu and Bingin: Alchemy, The Cashew Tree, Suka Espresso and more — all a short drive from Casa Bombora Villas.',
    readTime: '4 min read',
    intro:
      'The Bukit\u2019s café scene has grown up fast — smoothie bowls and third-wave coffee around every corner. These are the places we send guests to most, all roughly 5\u201312 minutes from the villas. Every villa has a full kitchen too, so a slow breakfast on your own terrace is always an option.',
    sections: [
      {
        heading: 'The regulars',
        places: [
          {
            name: 'Suka Espresso',
            distance: '~7 min',
            text: 'A Bukit institution on Jl. Labuansait — reliable espresso, big breakfasts, and a garden setting. Busy from opening.',
          },
          {
            name: 'The Cashew Tree Collective',
            distance: '~10 min',
            text: 'Garden café near Bingin famous for healthy bowls and salads — and its long-running Thursday open-mic nights.',
          },
          {
            name: 'Alchemy Uluwatu',
            distance: '~10 min',
            text: 'Plant-based spot on the Bingin road — raw desserts, smoothie bowls, and a good all-day menu in a pretty setting.',
          },
        ],
      },
      {
        heading: 'Worth a detour',
        places: [
          {
            name: 'Drifter Surf Shop & Café',
            distance: '~9 min',
            text: 'Surf shop, gallery and garden café on Jl. Labuansait — good coffee and the best surf-retail browsing on the peninsula.',
          },
          {
            name: 'Bukit Café',
            distance: '~8 min',
            text: 'Big menu of everything from smoothie bowls to burgers — easy crowd-pleaser for groups with mixed tastes.',
          },
          {
            name: 'The Place With No Name',
            distance: '~8 min',
            text: 'Quirky little spot on Jl. Labuansait doing wood-fired pizza and sharing plates — good low-key dinner option.',
          },
        ],
      },
      {
        heading: 'A note on timing',
        paragraphs: [
          'Weekend mornings get busy everywhere — going before 9 AM or after noon beats the rush. Most places are on or just off Jl. Labuansait, the main road that runs from our lane toward the beaches, so café-hopping by scooter is easy.',
        ],
      },
    ],
  },
  {
    slug: 'gyms-and-wellness-uluwatu',
    title: 'Gyms, yoga and recovery in Uluwatu',
    excerpt:
      'Keep your routine on holiday: proper gyms, ice baths, yoga decks and surf-friendly recovery — all minutes away.',
    metaDescription:
      'Where to train in Uluwatu: Bambu Fitness, Uluwatu Collective, ELEMNT and yoga options — gyms, saunas, ice baths and recovery near Casa Bombora Villas.',
    readTime: '4 min read',
    intro:
      'A few years ago you had to drive to Canggu for a serious session. Not anymore — the Bukit now has proper gyms with day passes, recovery facilities, and morning yoga decks. All of these are roughly 8\u201315 minutes from the villas.',
    sections: [
      {
        heading: 'Gyms',
        places: [
          {
            name: 'Bambu Fitness Bali',
            distance: '~8 min',
            text: 'The most complete setup on the Bukit — open-air rigs, air-conditioned lifting rooms, group classes from CrossFit to mobility, plus a pool, sauna, ice bath and a good café. Day and week passes available.',
          },
          {
            name: 'Uluwatu Collective',
            distance: '~12 min',
            text: 'Friendly community gym on Jl. Raya Uluwatu — classes, open gym and personal training, good for a week-long pass.',
          },
          {
            name: 'ELEMNT',
            distance: '~10 min',
            text: 'Newer training space combining a gym floor, classes, yoga studio, co-working, sauna and cold plunge.',
          },
        ],
      },
      {
        heading: 'Yoga & recovery',
        places: [
          {
            name: 'Morning Light Yoga',
            distance: '~12 min',
            text: 'Long-running studio in the Uluwatu Surf Villas area — open-air morning flow classes with jungle views.',
          },
          {
            name: 'Ulu Active',
            distance: '~15 min',
            text: 'Design-led gym in Ungasan with one of the best recovery rooms on the peninsula — sauna, steam, hot tub and ice baths.',
          },
        ],
      },
      {
        heading: 'The guest routine',
        paragraphs: [
          'The classic day here: early surf or gym session, breakfast back at the villa, pool time, then beach or temple in the late afternoon. If you\u2019re training seriously, Bambu\u2019s week passes are the best value — tell us your routine and we\u2019ll point you at the right option.',
        ],
      },
    ],
  },
  {
    slug: 'uluwatu-nightlife',
    title: 'Uluwatu after dark: where to go out',
    excerpt:
      'Cliff-top sunset sessions, beach clubs and the odd superclub — the Bukit\u2019s nightlife, without the Canggu crowds.',
    metaDescription:
      'Uluwatu nightlife guide: Single Fin\u2019s Sunday Session, Savaya, Hatch, El Kabron and more — the best sunset spots and clubs, minutes from Casa Bombora Villas.',
    readTime: '4 min read',
    intro:
      'Uluwatu\u2019s nightlife is smaller than Canggu\u2019s — and most people here prefer it that way. The format is simple: sunset drinks on a cliff, dinner, then either bed (dawn surf) or one of the area\u2019s growing list of venues. Everything below is within ~15 minutes of the villas.',
    sections: [
      {
        heading: 'The classics',
        places: [
          {
            name: 'Single Fin',
            distance: '~9 min',
            text: 'The Bukit\u2019s most famous night out — a multi-level clifftop bar above the Suluban surf break. The Sunday Session is legendary and packs out early; arrive before sunset.',
          },
          {
            name: 'Savaya',
            distance: '~10 min',
            text: 'A jaw-dropping club carved into the cliffs of Pecatu — international DJs and full festival production. Check the lineup for specific nights; it\u2019s priced to match the spectacle.',
          },
          {
            name: 'El Kabron',
            distance: '~10 min',
            text: 'Spanish-style cliff club above Bingin — sunset paella, DJs and a pool overlooking the ocean. Book ahead for daybeds.',
          },
        ],
      },
      {
        heading: 'More low-key',
        places: [
          {
            name: 'Hatch',
            distance: '~7 min',
            text: 'Colourful, mural-covered bar and club on Jl. Labuansait — underground electronic nights, salsa events and a genuinely fun crowd.',
          },
          {
            name: 'Ulu Cliffhouse',
            distance: '~9 min',
            text: 'Mid-century-styled beach club on the cliff at Padang Padang — better for sunset cocktails and DJ sessions than a big night.',
          },
          {
            name: 'Mana (Uluwatu Surf Villas)',
            distance: '~9 min',
            text: 'Relaxed clifftop restaurant and bar — the mellow option for sunset drinks with a view over the surf.',
          },
        ],
      },
      {
        heading: 'Local tips',
        paragraphs: [
          'Most venues get going around sunset rather than late night — this is surf country, and dawn patrol is sacred. Ride-hailing (Gojek/Grab) works in the area, but for a big night out we can arrange a driver so nobody worries about the scooter home.',
        ],
      },
    ],
  },
  {
    slug: 'getting-around-uluwatu',
    title: 'Getting to and around Uluwatu',
    excerpt:
      'Airport transfers, scooters vs drivers, and how long everything actually takes — the practical stuff.',
    metaDescription:
      'Practical guide to Uluwatu transport: airport transfer (~45 min), scooter rental vs drivers, ride-hailing, and real drive times to beaches, temple and restaurants.',
    readTime: '3 min read',
    intro:
      'Uluwatu sits at the southern tip of Bali on the Bukit Peninsula — far enough from the airport crowds to feel calm, close enough that transfers are painless. Here\u2019s the honest rundown on getting here and getting around.',
    sections: [
      {
        heading: 'From the airport',
        paragraphs: [
          'Ngurah Rai International Airport (DPS) is roughly 45 minutes away by car, depending on traffic — longer at peak times. We can arrange a trusted local driver to meet you at arrivals; just mention it in your booking request. Ride-hailing apps also work, though pickup zones at the airport can be chaotic.',
        ],
      },
      {
        heading: 'Getting around day to day',
        places: [
          {
            name: 'Scooter',
            text: 'How most guests get around — everything within ~15 minutes, easy parking, ~IDR 100k/day market rate. We can arrange rental delivered to the villa. Only rent if you\u2019re a confident rider; the hills and sandy side roads are unforgiving.',
          },
          {
            name: 'Driver',
            text: 'Best for day trips or evenings out — we work with local drivers for half-day or full-day hire, and per-trip rides to dinner.',
          },
          {
            name: 'Gojek / Grab',
            text: 'Ride-hailing works for scooters and cars across the Bukit — handy for short hops, though coverage thins late at night.',
          },
        ],
      },
      {
        heading: 'Real drive times from the villas',
        places: [
          { name: 'Padang Padang Beach', distance: '~6 min', text: 'Closest major beach — swim, surf lessons, warungs.' },
          { name: 'Uluwatu Temple', distance: '~7 min', text: 'Sunset kecak and cliff walks.' },
          { name: 'Suluban Beach & Single Fin', distance: '~9 min', text: 'Surf access and the famous clifftop bar.' },
          { name: 'Bingin Beach', distance: '~10 min', text: 'Cafés, cliff stairs and a mechanical left.' },
          { name: 'Dreamland Beach', distance: '~15 min', text: 'Beginner-friendly beach break.' },
          { name: 'Uluwatu\u2019s main café strip', distance: '~5\u201310 min', text: 'Jl. Labuansait — most cafés and shops are on or near it.' },
        ],
      },
      {
        heading: 'One honest caveat',
        paragraphs: [
          'Our lane is quiet and residential — that\u2019s the appeal — but it means you\u2019ll want wheels for most outings. Scooter + occasional driver is the combination most guests settle into, and it keeps everything simple.',
        ],
      },
    ],
  },
]
