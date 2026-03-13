
// User interface representing the logged-in person's profile
export interface User {
  id: string;
  name: string;
  email: string;
  income: number;
  role?: 'admin' | 'user';
}

export interface HouseRatings {
  connectivity: number;
  neighbourhood: number;
  safety: number;
  livability: number;
}

export interface Furnishing {
  name: string;
  count?: number;
}

// House interface representing a property listing
export interface House {
  id: string;
  title: string;
  type: string;
  price: number;
  location: string;
  district: string;
  state: string;
  image: string;
  amenities: string[];
  historicalPrices: { year: number; price: number }[];
  description: string;
  lat: number;
  lng: number;
  isApproved: boolean;
  ownerId?: string;
  is_suspicious?: boolean;
  suspicious_reason?: string;
  is_overpriced?: boolean;
  market_predicted_price?: number;
  ratings?: HouseRatings;
  furnishings?: Furnishing[];
}

// Booking interface representing a scheduled property visit
export interface Booking {
  id: string;
  houseId: string;
  userId: string;
  bookingDate: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
}

// SearchCriteria interface representing user search filters
export interface SearchCriteria {
  income: number;
  maxPrice: number;
  houseType: string;
  district: string;
  state: string;
}
