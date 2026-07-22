export interface Notification {
  id: string;
  name: string;
  username: string;
  fullName?: string;
  pixKey: string;
  months: number;
  participationCount: number;
  value: number;
  photo: string;
  followingCount?: number;
  followerCount?: number;
  timestamp: Date;
  confirmed?: boolean;
  gender: 'male' | 'female';
  alerta?: boolean;
  contributionAmount: number;
}

export interface Testimonial {
  id: string;
  name: string;
  username?: string;
  text: string;
  rating: number;
  gender: 'male' | 'female';
  photo: string;
  months?: number;
  timestamp?: Date;
}

export type PaymentMethod = 'nubank' | 'classic';

export interface RewardedUser {
  id: string;
  name: string;
  username: string;
  photo: string;
  gender: 'male' | 'female';
  months: number;
  value: number;
  contributionAmount: number;
  followingCount?: number;
  followerCount?: number;
  fullName?: string;
  message: string;
  timestamp: Date;
}
