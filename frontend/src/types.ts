export type AnimalCategory = 'ram' | 'goat' | 'cow' | 'pig' | 'chicken' | 'layer'
export type AnimalStatus = 'available' | 'reserved' | 'sold' | 'unavailable'
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'dispatched'
  | 'delivered'
  | 'cancelled'
  | 'reserved'
export type PaymentStatus = 'pending' | 'successful' | 'failed' | 'refunded'
export type DeliveryStatus = 'pending' | 'scheduled' | 'in_transit' | 'delivered' | 'failed'
export type UserRole = 'customer' | 'sales' | 'admin'

export interface ApiMeta {
  page?: number
  limit?: number
  total?: number
  pages?: number
}

export interface ApiEnvelope<T> {
  success: boolean
  message: string
  data?: T
  meta?: ApiMeta
  errors?: unknown[]
}

export interface Animal {
  _id: string
  name: string
  slug: string
  category: AnimalCategory
  breed: string
  description: string
  price: number
  depositAmount: number
  weightKg: number
  ageMonths: number
  gender: 'male' | 'female'
  size: 'small' | 'medium' | 'large'
  healthStatus: string
  vaccinationStatus: string
  images: string[]
  videos: string[]
  healthCertificateUrl?: string
  status: AnimalStatus
  quantity: number
  featured: boolean
  sku: string
  tags: string[]
  averageRating: number
  reviewCount: number
  createdAt: string
  updatedAt: string
}

export interface Address {
  _id?: string
  label: string
  addressLine: string
  city: string
  state: string
  phone?: string
  isDefault: boolean
}

export interface AuthUser {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: UserRole
  avatarUrl?: string
  emailVerified: boolean
}

export interface Profile extends Omit<AuthUser, 'id'> {
  _id: string
  addresses: Address[]
  wishlist: Animal[] | string[]
  notificationSettings: { email: boolean; sms: boolean; whatsapp: boolean }
  createdAt: string
}

export interface AdminUser {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: UserRole
  isBlocked: boolean
  blockedAt?: string | null
  lastLoginAt?: string | null
  emailVerified: boolean
  createdAt: string
}

export interface OrderItem {
  animal: Animal | string
  name: string
  quantity: number
  unitPrice: number
  total: number
  _id?: string
}

export interface DeliveryAddress {
  fullName: string
  phone: string
  addressLine: string
  city: string
  state: string
}

export interface Order {
  _id: string
  orderNumber: string
  customer?: string
  source: 'website' | 'whatsapp' | 'manual'
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  discount: number
  total: number
  depositDue: number
  balanceDue: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  deliveryStatus: DeliveryStatus
  deliveryAddress: DeliveryAddress
  deliveryDate?: string
  statusHistory: { status: OrderStatus; note?: string; changedAt: string }[]
  createdAt: string
  updatedAt: string
}

export interface DeliveryZone {
  _id: string
  name: string
  states: string[]
  baseFee: number
  estimatedDaysMin: number
  estimatedDaysMax: number
  active: boolean
}

export interface Coupon {
  _id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  minOrderAmount: number
  maxDiscountAmount?: number
  startsAt: string
  expiresAt: string
  usageLimit?: number
  usedCount: number
  active: boolean
}

export interface Reservation {
  _id: string
  animal: Animal | string
  depositAmount: number
  expiresAt: string
  status: 'active' | 'expired' | 'converted' | 'cancelled'
  createdAt: string
}

export interface Notification {
  _id: string
  title: string
  message: string
  type: string
  channel: 'email' | 'sms' | 'whatsapp' | 'in_app'
  metadata?: Record<string, unknown>
  readAt?: string
  createdAt: string
}

export interface ConversationMessage {
  _id?: string
  sender?: string
  senderRole: UserRole
  senderName: string
  senderEmail?: string
  body: string
  createdAt: string
}

export interface Conversation {
  _id: string
  customer?: string
  name: string
  email: string
  phone: string
  topic: string
  status: 'open' | 'closed'
  lastMessageAt: string
  messages: ConversationMessage[]
  createdAt: string
  updatedAt: string
}

export interface Payment {
  _id: string
  order: string
  provider: 'paystack' | 'flutterwave' | 'bank_transfer' | 'pay_on_delivery'
  amount: number
  reference: string
  authorizationUrl?: string
  status: PaymentStatus
  createdAt: string
}

export interface Review {
  _id: string
  customer: { firstName: string; lastName: string } | string
  animal: string
  rating: number
  comment: string
  verifiedBuyer: boolean
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

export interface DashboardOverview {
  totalUsers: number
  totalAnimals: number
  availableAnimals: number
  totalOrders: number
  totalPayments: number
  whatsappOrders: number
  revenue: number
}

export interface SalesSummary {
  totalOrders: number
  pendingOrders: number
  totalRevenue: number
}
