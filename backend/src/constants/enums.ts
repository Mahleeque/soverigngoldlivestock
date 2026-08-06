export enum UserRole {
  Customer = 'customer',
  Sales = 'sales',
  Admin = 'admin'
}

export enum AnimalStatus {
  Available = 'available',
  Reserved = 'reserved',
  Sold = 'sold',
  Unavailable = 'unavailable'
}

export enum AnimalCategory {
  Ram = 'ram',
  Goat = 'goat',
  Cow = 'cow',
  Pig = 'pig',
  Chicken = 'chicken',
  Layer = 'layer'
}

export enum OrderStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Processing = 'processing',
  Dispatched = 'dispatched',
  Delivered = 'delivered',
  Cancelled = 'cancelled',
  Reserved = 'reserved'
}

export enum PaymentProvider {
  Paystack = 'paystack',
  Flutterwave = 'flutterwave',
  BankTransfer = 'bank_transfer',
  PayOnDelivery = 'pay_on_delivery'
}

export enum PaymentStatus {
  Pending = 'pending',
  Successful = 'successful',
  Failed = 'failed',
  Refunded = 'refunded'
}

export enum DeliveryStatus {
  Pending = 'pending',
  Scheduled = 'scheduled',
  InTransit = 'in_transit',
  Delivered = 'delivered',
  Failed = 'failed'
}
