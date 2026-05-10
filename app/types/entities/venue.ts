export interface IVenue {
  city?: string
  id: string
  name: string
  capacity?: string
  accessibility?: string
  immersiveEnvironment?: string
  parking: string
  imageUrl?: string
  imageFilename?: string
  address?: string
  latitude?: string
  longitude?: string
  createdAt: Date
  updatedAt: Date
}

// For create operations
export interface CreateVenueInput {
  name: string
  city: string
  capacity?: string
  accessibility?: string
  immersiveEnvironment?: string
  parking?: string
  imageUrl: string
  imageFilename: string
  address?: string
}

export interface UpdateVenueInput {
  name?: string
  city?: string
  capacity?: string
  accessibility?: string
  immersiveEnvironment?: string
  parking?: string
  imageUrl?: string
  imageFilename?: string
  address?: string
}
