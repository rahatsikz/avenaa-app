export type ImageAsset = {
  id: string;
  assetId: string;
  publicId: string;
  secureUrl: string;
  format: string;
  width: number;
  height: number;
  resourceType: string;
  createdAt: string;
  updatedAt: string;
};

export type IAgreement = {
  aadhaarNumber: string;
  address: string;
  bhk: number;
  bookingPolicy: boolean;
  createdAt: string;
  email: string;
  id: string;
  legalName: string;
  mobileNumber: string;
  panNumber: string;
  patronId: string;
  patronName: string;
  pictureId: string;
  privacyPolicy: boolean;
  propertyAddress: string;
  propertyArea: string;
  propertyId: string;
  propertyTitle: string;
  status: string;
  termsAndConditions: boolean;
  updatedAt: string;
  agreement: ImageAsset;
};

export interface IProperty {
  id: string;
  avenaId: string;
  slug: string;
  title: string;
  description: string;
  thumbnailId: string;
  propertyType: string; // Adjust based on all possible property types
  personCapacity: number;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  price: number;
  discount: number;
  priceWithDiscount: number;
  tax: number;
  language: string | null;
  propertyArea: number;
  monthlyRent: number;
  units: number;
  bestRatedPropertyId: string | null;
  managedBy: string;
  patronId: string;
  status: "PENDING" | "APPROVED" | "DISAPPROVED"; // Adjust based on possible statuses
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
  cityCenterDistance: string;
  cityCenterDurationByWalking: string;
  cityCenterDurationByDriving: string;
  cityCenterDistanceByCycling: string | null;
  cityCenterDurationByTransit: string | null;
  patron: Patron;
  thumbnail: ImageAsset;
  images: ImageAsset[];
  nearByPlaces: NearByPlace[];
  propertyPolicies: PropertyPolicy[];
  rooms?: IRoom[];
  amenityGroup?: AmenityGroup[];
  bookingStats?: BookingStats;
  availabilityCalendar?: Availability[];
  bookings?: Booking[];
  isFavourite?: boolean;
  agreementStatus?: "INITIATED" | "SENT_TO_PATRON" | "SIGNED" | "REJECTED";
  monthlyRentAgreement?: number;
  sellTargetAmount?: number;
  spaces: Space[];
}

export interface Space {
  id: string;
  title: string;
  description: string[];
  features: string[];
  image: ImageAsset;
}

export interface ITicket {
  id: string;
  ticketId: string;
  issue: string;
  name: string;
  email: string;
  contact: string;
  alternativeContact: string | null;
  openedBy: User;
  resolvedBy: User;
  status: "OPEN" | "IN-PRGRESS" | "CLOSED";
  createdAt: string;
  updatedAt: string;
}

interface BookingStats {
  totalBookings: number;
  activeBookings: number;
  upcomingBookings: number;
  occupancyRate: number;
}

interface Availability {
  date: string; // ISO date string
  available: boolean;
  units: number;
}

export interface Patron {
  id: string;
  about: string | null;
  ratingCount: number | null;
  ratingAverage: number | null;
  adharFrontPicture: string | null;
  adharBackPicture: string | null;
  panCardPicture: string | null;
  utilityBillPicture: string | null;
  signature: string | null;
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  userId: string;
  status: string; // Adjust as needed
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
  user: User;
  reviews: any[]; // Adjust if there is a specific structure for ratings
}

export interface NearByPlace {
  id: string;
  category: string; // e.g., "Airports", "Bus Stops", etc.
  distance: string;
  duration: string;
  label: string;
  value: string;
  icon: string;
  propertyId: string;
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
}

interface PropertyPolicy {
  id: string;
  text: string;
  propertyId: string;
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
}

export interface IRoom {
  id: string;
  title: string;
  thumbnailId: string;
  bedType: string;
  roomArea: number;
  pricePerNight: number;
  discount: number;
  pricePerNightWithDiscount: number;
  tax: number;
  propertyId: string;
  images: ImageAsset[];
  thumbnail: ImageAsset;
  amenities: Amenity[];
}

export interface Amenity {
  id: string;
  title: string;
  subtitle: string | null;
  icon: string; // e.g., "wifi", "bath"
  value: string; // e.g., "wi-fi", "pool"
  label: string; // e.g., "Wi-Fi", "Pool"
  available: boolean | null; // true, false, or null if unknown
  amenityGroupId: string | null;
  roomId: string;
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
}

export type AmenityGroup = {
  id: string;
  title: string;
  propertyId: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  amenities: Amenity[];
};

export interface Booking {
  id: string;
  amount: number;
  orderId: string | null;
  propertyId: string;
  checkInDate: string; // ISO Date string
  checkOutDate: string; // ISO Date string or null
  noOfGuests: number;
  bookerTitle: string;
  bookerFirstName: string;
  bookerLastName: string;
  bookerEmail: string;
  bookerContact: string;
  bookerCity: string | null;
  typeOfId: string | null;
  notes: string;
  frontImageId: string | null;
  backImageId: string | null;
  days: number | null;
  status: "PENDING" | "APPROVED" | "CANCELLED";
  paymentStatus: "PAID" | "DUE";
  disapproveReason: string;
  companyGstNumber: string | null;
  companyName: string | null;
  companyAddress: string | null;
  patronId: string | null;
  userId: string;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  user: User;
  property: IProperty;
  patron: Patron;
  review: IReview;
}

export interface IReview {
  id: string;
  authorId: string;
  bookingId: string;
  propertyId: string;
  rating: number;
  reviewText: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string | null;
  referralCode: string | null;
  isVerified: boolean;
  password: string; // hashed password
  isDisabled: boolean;
  imageId: string | null;
  roles: string[]; // Add other roles if applicable
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  image: ImageAsset | null;
  frontImage: ImageAsset | null;
  backImage: ImageAsset | null;
  patron?: Patron;
  BankDetail: BankDetailProps | null;
  bankDetailVerified?: boolean;
  phoneVerified?: boolean;
}

export interface City {
  id: string;
  city: string;
  cityLabel: string;
  pictureId: string;
  createdAt: string;
  updatedAt: string;
  avenaStateId: string;
  cityImage: ImageAsset;
}

export interface State {
  id: string;
  state: string;
  stateLabel: string;
  pictureId: string;
  createdAt: string;
  updatedAt: string;
  cities: City[];
  stateImage: ImageAsset;
}

export interface BookingPaymentStats {
  totalEarning: number;
  thisMonthTotalEarning: number;
  thisMonthPaidEarning: number;
  thisMonthDueEarning: number;
  thisMonthTotalBooking: number;
}

export interface MapData {
  mapUrl: string;
  places: Place[];
}

export interface Place {
  name: string;
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  // Add other fields you need from the Places API
}

export type BookingProps = {
  propertyId: string;
  checkInDate: Date | null;
  checkOutDate: Date | null;
  bookerFirstName: string;
  bookerLastName: string;
  bookerEmail: string;
  bookerContact: string;
  amount: number;
  noOfGuests: number;
  days: number;
  paymentMode: "PAYMENT_ONLINE" | "PAYMENT_ON_ARRIVAL";
};

export interface PropertySpaceProps {
  id: number;
  title: string;
  image: string;
  tag: string;
  description: string[];
}

export type BankDetailProps = {
  accountHolder?: string;
  accountType?: string;
  accountNumber?: string;
  permanentaccountNumber?: string;
  bankName?: string;
  ifscCode?: string;
  userStreetAddress?: string;
  userFlat?: string;
  userCity?: string;
  userState?: string;
  userCountry?: string;
  userPostcode?: string;
};
