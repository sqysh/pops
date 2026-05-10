export const COL = 'grid-cols-[3rem_minmax(0,1fr)_10rem_minmax(0,1fr)_5rem_4rem]'

export const EMPTY_VENUE_FORM = {
  name: '',
  capacity: '',
  accessibility: '',
  immersiveEnvironment: '',
  parking: '',
  address: '',
  city: ''
}

export const COLUMNS = [
  { key: null, label: 'Image' },
  { key: 'name', label: 'Name' },
  { key: 'city', label: 'City' },
  { key: 'address', label: 'Address' },
  { key: 'capacity', label: 'Capacity' },
  { key: null, label: '', alignRight: true }
]
