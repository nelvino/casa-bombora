// Curated local guides. Every place listed is a real, well-known spot on the
// Bukit. Drive times are approximate from the villas in Pecatu.

export interface GuidePlace {
  name: string
  /** Approximate drive time from Casa Bombora Villas, e.g. "~7 min" */
  distance?: string
  text: string
  /** Google Maps search query. Shows a "Directions" link on the place card */
  mapsQuery?: string
}

export interface GuideImage {
  src: string
  alt: string
  credit: string
  creditUrl?: string
}

export interface GuideSection {
  heading: string
  paragraphs?: string[]
  places?: GuidePlace[]
  image?: GuideImage
}

export interface Guide {
  slug: string
  title: string
  excerpt: string
  metaDescription: string
  readTime: string
  intro: string
  image: GuideImage
  sections: GuideSection[]
}

export const GUIDES: Guide[] = [
  {
    slug: 'uluwatu-temple',
    title: 'Uluwatu Temple: the clifftop sunset guide',
    excerpt:
      'The Bukit\u2019s most famous landmark: a sea temple on a 70-metre cliff, cheeky monkeys, and the sunset kecak fire dance.',
    metaDescription:
      'How to visit Uluwatu Temple (Pura Luhur Uluwatu): sunset kecak dance, monkey etiquette, dress code and timing. About 7 minutes from Casa Bombora Villas.',
    readTime: '4 min read',
    intro:
      'Pura Luhur Uluwatu is one of Bali\u2019s six key sea temples, perched on the edge of a sheer limestone cliff about 70 metres above the Indian Ocean. It\u2019s about 7 minutes by scooter from the villas, close enough that sunset there can be a spur-of-the-moment decision.',
    image: {
      src: '/images/guides/temple.webp',
      alt: 'Carved stone gateway of Pura Luhur Uluwatu temple, Bali',
      credit: 'Jakub Hałun, CC BY-SA 4.0',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Luhur_Uluwatu_Temple,_Bali,_20220826_0953_1016.jpg',
    },
    sections: [
      {
        heading: 'When to go',
        paragraphs: [
          'Late afternoon is the classic move: arrive around 4:30\u20135:00 PM, walk the cliff paths while it\u2019s still light, then stay for the kecak fire dance at sunset. The temple grounds open during the day, but the golden light and the dance make early evening the best time.',
          'Kecak performances run twice nightly in an open-air amphitheatre on the cliff edge, at 6:00 PM for sunset and again at 7:00 PM. Seats fill up fast in high season, so ask us to help you get tickets in advance.',
        ],
        image: {
          src: '/images/guides/kecak.webp',
          alt: 'Kecak fire dancers performing at Uluwatu Temple amphitheatre at dusk',
          credit: 'Cindy Chen, CC BY 3.0',
          creditUrl: 'https://commons.wikimedia.org/wiki/File:Kecak_Dance_(52116626).jpeg',
        },
      },
      {
        heading: 'Good to know',
        paragraphs: [
          'There\u2019s a small entrance fee at the gate, and sarongs and sashes are provided with entry. Shoulders and knees should be covered. The resident monkeys are famous for snatching sunglasses, phones, and hats: keep loose items zipped away and don\u2019t feed them.',
          'Kecak tickets are sold separately from temple entry, and in high season they can sell out. Book ahead where possible, and wear shoes you can walk in because the cliff path has uneven steps.',
        ],
      },
      {
        heading: 'Pair it with',
        places: [
          {
            name: 'Single Fin',
            distance: '~9 min',
            text: 'Clifftop bar above the Suluban surf break. Perfect for a post-temple drink, especially on a Sunday.',
            mapsQuery: 'Single Fin Uluwatu, Bali',
          },
          {
            name: 'Suluban Beach',
            distance: '~9 min',
            text: 'The cave beach below the cliffs. Go at low tide to explore.',
            mapsQuery: 'Suluban Beach, Bali',
          },
        ],
      },
    ],
  },
  {
    slug: 'best-surf-breaks-uluwatu',
    title: 'Uluwatu surf breaks, by level',
    excerpt:
      'From first green waves at Baby Padang to the legendary reefs at Suluban. Where to surf on the Bukit, honestly graded.',
    metaDescription:
      'The Uluwatu surf guide: Baby Padang for beginners, Bingin and Dreamland for intermediates, Uluwatu and Padang Padang for advanced surfers. All under 15 minutes from Casa Bombora Villas.',
    readTime: '5 min read',
    intro:
      'The Bukit Peninsula packs some of the most consistent surf on the planet into a few kilometres of reef and beach. The honest caveat: Uluwatu\u2019s fame comes from its heavy reef breaks, so beginners need to pick their spots carefully. The good ones do exist though. All of these are within ~15 minutes of the villas.',
    image: {
      src: '/images/guides/surf.webp',
      alt: 'Uluwatu limestone cliff with waves peeling along the reef below',
      credit: 'Wokshots, CC BY-SA 4.0',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Uluwatu_bingin_balangan_bali_travel_photos_wokshots-8813.jpg',
    },
    sections: [
      {
        heading: 'Starting out',
        places: [
          {
            name: 'Baby Padang (Padang Padang Right)',
            distance: '~6 min',
            text: 'The Bukit\u2019s favourite beginner wave: a soft, consistent right-hander across the channel from the famous left. Board rentals and lessons right on the sand, plus beach warungs and showers at the top of the stairs. Best on small to medium swell at mid-to-high tide.',
            mapsQuery: 'Padang Padang Beach, Bali',
          },
          {
            name: 'Thomas Beach',
            distance: '~12 min',
            text: 'Quieter alternative with mellow waves on smaller days and far fewer people.',
            mapsQuery: 'Thomas Beach, Bali',
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
            mapsQuery: 'Bingin Beach, Bali',
          },
          {
            name: 'Dreamland Beach',
            distance: '~15 min',
            text: 'Sandy-bottom beach break that\u2019s friendly at low tide, when the waves soften and there\u2019s room to learn. At high tide it turns powerful fast, with a heavy shorebreak and rips that catch people out. Check the tide before you paddle out, and expect a lively sunset scene on the sand.',
            mapsQuery: 'Dreamland Beach, Bali',
          },
          {
            name: 'Nyang Nyang',
            distance: '~10 min',
            text: 'Long, uncrowded beach break with shifting peaks. More forgiving than the famous reefs and a good option when they\u2019re packed, though it still gets heavy on bigger swells.',
            mapsQuery: 'Nyang Nyang Beach, Bali',
          },
          {
            name: 'Impossibles',
            distance: '~6 min (via Padang Padang)',
            text: 'Long, fast down-the-line walls that can link up for huge rides when tide and swell align.',
            mapsQuery: 'Impossibles surf spot, Bali',
          },
        ],
      },
      {
        heading: 'Experienced surfers',
        places: [
          {
            name: 'Uluwatu (Suluban)',
            distance: '~9 min',
            text: 'Bali\u2019s most famous wave, a powerful left-hand reef break with multiple sections that work on different tides. Entry is through the cave at Suluban Beach. You\u2019ll see surf lessons advertised around Suluban. Don\u2019t take them. This is a serious wave and no place to learn. Respect the reef, the currents, and the crowd.',
            mapsQuery: 'Suluban Beach, Bali',
          },
          {
            name: 'Padang Padang Left',
            distance: '~6 min',
            text: 'The "Balinese Pipeline": a hollow, barreling left that only works on solid swell. Home of the Rip Curl Cup. Experts only.',
            mapsQuery: 'Padang Padang Beach, Bali',
          },
        ],
      },
      {
        heading: 'Practical notes',
        paragraphs: [
          'Reef boots are worth having since most breaks here are shallow reef rather than sand. Check tide charts before paddling out, because conditions change completely between low and high tide. Board rental is easy at Padang Padang and Dreamland, and we can help arrange lessons with local instructors we trust.',
        ],
      },
    ],
  },
  {
    slug: 'best-cafes-uluwatu',
    title: 'The best cafés and brunch around Pecatu & Bingin',
    excerpt:
      'Post-surf breakfasts, proper coffee, and the spots locals actually return to. All within about ten minutes of the villas.',
    metaDescription:
      'A curated list of the best cafés in Uluwatu, Pecatu and Bingin: Alchemy, The Cashew Tree, Suka Espresso and more, all a short drive from Casa Bombora Villas.',
    readTime: '4 min read',
    intro:
      'The Bukit\u2019s café scene has grown up fast, with smoothie bowls and third-wave coffee around every corner. These are the places we send guests to most, all roughly 5\u201312 minutes from the villas. Every villa has a full kitchen too, so a slow breakfast on your own terrace is always an option.',
    image: {
      src: '/images/guides/cafes.webp',
      alt: 'Berry smoothie bowl with banana, coconut and chia on a breakfast tray',
      credit: 'Berries.com, CC BY 2.0',
      creditUrl: 'https://www.flickr.com/photos/126560659@N06/33343287432',
    },
    sections: [
      {
        heading: 'The regulars',
        places: [
          {
            name: 'Suka Espresso',
            distance: '~7 min',
            text: 'A Bukit institution on Jl. Labuansait. Reliable espresso, big breakfasts, and a garden setting. Busy from opening.',
            mapsQuery: 'Suka Espresso Uluwatu, Bali',
          },
          {
            name: 'The Cashew Tree Collective',
            distance: '~10 min',
            text: 'Garden café near Bingin famous for healthy bowls, salads, and its long-running Thursday live-music nights.',
            mapsQuery: 'The Cashew Tree Bingin, Bali',
          },
          {
            name: 'Alchemy Uluwatu',
            distance: '~10 min',
            text: 'Plant-based spot on the Bingin road doing raw desserts, smoothie bowls, and a good all-day menu in a pretty setting.',
            mapsQuery: 'Alchemy Uluwatu, Bali',
          },
        ],
      },
      {
        heading: 'Worth a detour',
        places: [
          {
            name: 'Drifter Surf Shop & Café',
            distance: '~9 min',
            text: 'Surf shop, gallery and garden café on Jl. Labuansait. Good coffee and the best surf-retail browsing on the peninsula.',
            mapsQuery: 'Drifter Uluwatu, Bali',
          },
          {
            name: 'Bukit Café',
            distance: '~8 min',
            text: 'Big menu of everything from smoothie bowls to burgers. Easy crowd-pleaser for groups with mixed tastes.',
            mapsQuery: 'Bukit Cafe Uluwatu, Bali',
          },
          {
            name: 'The Place With No Name',
            distance: '~8 min',
            text: 'Quirky little spot on Jl. Labuansait doing pescatarian and vegetarian fusion plates, with live music every night. A good low-key dinner option.',
            mapsQuery: 'The Place With No Name Uluwatu, Bali',
          },
        ],
      },
      {
        heading: 'A note on timing',
        paragraphs: [
          'Weekend mornings get busy everywhere. Going before 9 AM or after noon beats the rush. Most places are on or just off Jl. Labuansait, the main road that runs from our lane toward the beaches, so café-hopping by scooter is easy.',
        ],
      },
    ],
  },
  {
    slug: 'gyms-and-wellness-uluwatu',
    title: 'Gyms, yoga and recovery in Uluwatu',
    excerpt:
      'Keep your routine on holiday: proper gyms, ice baths, yoga decks and surf-friendly recovery, all minutes away.',
    metaDescription:
      'Where to train in Uluwatu: Bambu Fitness, Uluwatu Collective, ELEMNT and yoga options. Gyms, saunas, ice baths and recovery near Casa Bombora Villas.',
    readTime: '4 min read',
    intro:
      'A few years ago you had to drive to Canggu for a serious session. Not anymore. The Bukit now has proper gyms with day passes, recovery facilities, and morning yoga decks. All of these are roughly 8\u201315 minutes from the villas.',
    image: {
      src: '/images/guides/wellness.webp',
      alt: 'Woman practising yoga on coastal rocks at sunset',
      credit: 'bady qb, CC0',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Yoga_in_the_beach_(Unsplash).jpg',
    },
    sections: [
      {
        heading: 'Gyms',
        places: [
          {
            name: 'Bambu Fitness Bali',
            distance: '~8 min',
            text: 'The most complete setup on the Bukit: open-air rigs, air-conditioned lifting rooms, group classes from CrossFit to mobility, plus a pool, sauna, ice bath and a good café. Day and week passes available.',
            mapsQuery: 'Bambu Fitness Bali',
          },
          {
            name: 'Uluwatu Collective',
            distance: '~12 min',
            text: 'Friendly community gym on Jl. Raya Uluwatu with classes, open gym and personal training. Good for a week-long pass.',
            mapsQuery: 'Uluwatu Collective, Bali',
          },
          {
            name: 'ELEMNT',
            distance: '~10 min',
            text: 'Newer training space combining a gym floor, classes, yoga studio, co-working, sauna and cold plunge.',
            mapsQuery: 'ELEMNT Uluwatu, Bali',
          },
        ],
      },
      {
        heading: 'Yoga & recovery',
        places: [
          {
            name: 'Morning Light Yoga',
            distance: '~12 min',
            text: 'Long-running studio in the Uluwatu Surf Villas area. Open-air morning flow classes with jungle views.',
            mapsQuery: 'Morning Light Yoga Uluwatu, Bali',
          },
          {
            name: 'Ulu Active',
            distance: '~10 min',
            text: 'Design-led gym at ULU Tribe on Jl. Labuansait with one of the best recovery rooms on the peninsula: sauna, steam, hot tub and ice baths.',
            mapsQuery: 'Ulu Active, Jl. Labuansait, Bali',
          },
        ],
      },
      {
        heading: 'The guest routine',
        paragraphs: [
          'The classic day here: early surf or gym session, breakfast back at the villa, pool time, then beach or temple in the late afternoon. If you\u2019re training seriously, Bambu\u2019s week passes are the best value. Tell us your routine and we\u2019ll point you at the right option.',
        ],
      },
    ],
  },
  {
    slug: 'uluwatu-nightlife',
    title: 'Uluwatu after dark: where to go out',
    excerpt:
      'Cliff-top sunset sessions, beach clubs and the odd superclub. The Bukit\u2019s nightlife, without the Canggu crowds.',
    metaDescription:
      'Uluwatu nightlife guide: Single Fin\u2019s Sunday Session, Savaya, Hatch, El Kabron and more. The best sunset spots and clubs, minutes from Casa Bombora Villas.',
    readTime: '4 min read',
    intro:
      'Uluwatu\u2019s nightlife is smaller than Canggu\u2019s, and most people here prefer it that way. The format is simple: sunset drinks on a cliff, dinner, then either bed for the dawn surf or one of the area\u2019s growing list of venues. Everything below is within ~15 minutes of the villas.',
    image: {
      src: '/images/guides/nightlife.webp',
      alt: 'Beach bar umbrellas lit at dusk under a Bali sunset sky',
      credit: 'Christophe95, CC BY-SA 4.0',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Seminyak_Beach_at_sunset.jpg',
    },
    sections: [
      {
        heading: 'The classics',
        places: [
          {
            name: 'Single Fin',
            distance: '~9 min',
            text: 'The Bukit\u2019s most famous night out: a multi-level clifftop bar above the Suluban surf break. The Sunday Session is legendary and packs out early, so arrive before sunset.',
          },
          {
            name: 'Savaya',
            distance: '~10 min',
            text: 'A jaw-dropping club carved into the cliffs of Pecatu, with international DJs and full festival production. Check the lineup for specific nights; it\u2019s priced to match the spectacle.',
            mapsQuery: 'Savaya Bali',
          },
          {
            name: 'El Kabron',
            distance: '~10 min',
            text: 'Spanish-style cliff club above Bingin. Sunset paella, DJs and a pool overlooking the ocean. Book ahead for daybeds.',
            mapsQuery: 'El Kabron Bali',
          },
        ],
      },
      {
        heading: 'More low-key',
        places: [
          {
            name: 'Hatch',
            distance: '~7 min',
            text: 'Colourful, mural-covered bar and club on Jl. Labuansait doing underground electronic nights and salsa events. Genuinely fun crowd.',
            mapsQuery: 'Hatch Uluwatu, Bali',
          },
          {
            name: 'Ulu Cliffhouse',
            distance: '~9 min',
            text: 'Mid-century-styled beach club on the cliff at Padang Padang. Better for sunset cocktails and DJ sessions than a big night.',
            mapsQuery: 'Ulu Cliffhouse, Bali',
          },
          {
            name: 'Mana (Uluwatu Surf Villas)',
            distance: '~9 min',
            text: 'Relaxed clifftop restaurant and bar. The mellow option for sunset drinks with a view over the surf.',
            mapsQuery: 'Mana Uluwatu, Bali',
          },
        ],
      },
      {
        heading: 'Local tips',
        paragraphs: [
          'Most venues get going around sunset rather than late night. This is surf country, and dawn patrol is sacred. Ride-hailing (Gojek/Grab) works in the area, but for a big night out we can arrange a driver so nobody worries about the scooter home.',
        ],
      },
    ],
  },
  {
    slug: 'getting-around-uluwatu',
    title: 'Getting to and around Uluwatu',
    excerpt:
      'Airport transfers, scooters vs drivers, and how long everything actually takes. The practical stuff.',
    metaDescription:
      'Practical guide to Uluwatu transport: airport transfer (~45 min), scooter rental vs drivers, ride-hailing, and real drive times to beaches, temple and restaurants.',
    readTime: '3 min read',
    intro:
      'Uluwatu sits at the southern tip of Bali on the Bukit Peninsula, far enough from the airport crowds to feel calm but close enough that transfers are painless. Here\u2019s the honest rundown on getting here and getting around.',
    image: {
      src: '/images/guides/transport.webp',
      alt: 'Local man waving from a scooter on a Bali road',
      credit: 'Niek van Son, CC BY 2.0',
      creditUrl: 'https://www.flickr.com/photos/niekvanson/29067798142',
    },
    sections: [
      {
        heading: 'From the airport',
        paragraphs: [
          'Ngurah Rai International Airport (DPS) is roughly 45 minutes away by car, depending on traffic, and longer at peak times. We can arrange a trusted local driver to meet you at arrivals; just mention it in your booking request. Ride-hailing apps also work, though pickup zones at the airport can be chaotic.',
        ],
      },
      {
        heading: 'Getting around day to day',
        places: [
          {
            name: 'Scooter',
            text: 'How most guests get around. Everything is within ~15 minutes, parking is easy, and the going rate is about IDR 100k/day. We can arrange rental delivered to the villa. Only rent if you\u2019re a confident rider; the hills and sandy side roads are unforgiving.',
          },
          {
            name: 'Driver',
            text: 'Best for day trips or evenings out. We work with local drivers for half-day or full-day hire, and per-trip rides to dinner.',
          },
          {
            name: 'Gojek / Grab',
            text: 'Ride-hailing works for scooters and cars across the Bukit. Handy for short hops, though coverage thins late at night.',
          },
        ],
      },
      {
        heading: 'Real drive times from the villas',
        places: [
          { name: 'Padang Padang Beach', distance: '~6 min', text: 'Closest major beach for a swim, surf lessons, or a warung lunch.', mapsQuery: 'Padang Padang Beach, Bali' },
          { name: 'Uluwatu Temple', distance: '~7 min', text: 'Sunset kecak and cliff walks.', mapsQuery: 'Uluwatu Temple, Bali' },
          { name: 'Suluban Beach & Single Fin', distance: '~9 min', text: 'Surf access and the famous clifftop bar.', mapsQuery: 'Single Fin Uluwatu, Bali' },
          { name: 'Bingin Beach', distance: '~10 min', text: 'A mechanical left-hand reef break. The cliff-side scene is still rebuilding after 2025\u2019s demolitions.', mapsQuery: 'Bingin Beach, Bali' },
          { name: 'Dreamland Beach', distance: '~15 min', text: 'Beach break that\u2019s friendly at low tide but turns heavy at high tide.', mapsQuery: 'Dreamland Beach, Bali' },
          { name: 'Uluwatu\u2019s main café strip', distance: '~5\u201310 min', text: 'Jl. Labuansait, where most cafés and shops are.', mapsQuery: 'Jl. Labuansait, Pecatu, Bali' },
        ],
      },
      {
        heading: 'One honest caveat',
        paragraphs: [
          'Our lane is quiet and residential, which is part of the appeal, but it means you\u2019ll want wheels for most outings. Scooter plus the occasional driver is the combination most guests settle into, and it keeps everything simple.',
        ],
      },
    ],
  },
]
