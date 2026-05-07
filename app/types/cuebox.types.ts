export interface CueBoxVenueAddress {
  line1: string
  line2: string
  city: string
  region: string
  postalCode: string
  countryCode?: string
}

export interface CueBoxVenue {
  name: string
  address: CueBoxVenueAddress
}

export interface CueBoxEvent {
  id: string
  name: string
  status: 'ON_SALE' | 'PRESALE' | 'NOT_ON_SALE' | 'SOLD_OUT' | 'CANCELED'
  isVisibleOnline: boolean
  firstInstanceDatetime: string
  lastInstanceDatetime: string
  publicTicketsUrl: string
  publicImageUrl: string
  tags: string[]
  venues: CueBoxVenue[]
  descriptionHtml?: string
  descriptionPlaintext?: string
}

export interface CueBoxEventInstance {
  id: string
  eventId: string
  eventName: string
  startsAt: string
  endsAt: string
  status: 'ON_SALE' | 'PRESALE' | 'NOT_ON_SALE' | 'SOLD_OUT' | 'CANCELED'
  isVisibleOnline: boolean
  publicTicketsUrl: string
  venue: CueBoxVenue
}
