// Approximate drive times from the villas (Pecatu, south Uluwatu).
export interface NearbySpot {
  name: string
  distance: string
  detail: string
}

export const NEARBY_SPOTS: NearbySpot[] = [
  {
    name: 'Padang Padang Beach',
    distance: '~6 min drive',
    detail: 'Iconic white-sand cove — swim, sunbathe, or learn to surf.',
  },
  {
    name: 'Uluwatu Temple',
    distance: '~7 min drive',
    detail: 'Clifftop temple with famous sunset kecak dance performances.',
  },
  {
    name: 'Suluban Beach & Single Fin',
    distance: '~9 min drive',
    detail: 'Cave beach and clifftop bar — Sunday sunsets are legendary.',
  },
  {
    name: 'Bingin Beach',
    distance: '~10 min drive',
    detail: 'Laid-back surf spot lined with barefoot cafés and warungs.',
  },
  {
    name: 'Nyang Nyang Beach',
    distance: '~10 min drive',
    detail: 'A long, uncrowded stretch of sand beneath the cliffs.',
  },
  {
    name: 'Thomas Beach',
    distance: '~12 min drive',
    detail: 'Quiet local favourite with gentle sand and clear water.',
  },
  {
    name: 'Bambu Fitness',
    distance: '~8 min drive',
    detail: 'Open-air gym, ice bath, and sauna for morning routines.',
  },
  {
    name: 'Dreamland Beach',
    distance: '~15 min drive',
    detail: 'Wide golden-sand beach with beach clubs and easy waves.',
  },
]
