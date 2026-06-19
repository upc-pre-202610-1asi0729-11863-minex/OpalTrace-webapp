export type Segment = 'MINING' | 'JEWELRY' | 'CONSUMER';
export type PlanTier = 'SILVER' | 'GOLD' | 'PLATINUM';
export type UserRole = 'SUPERVISOR' | 'ADMIN' | 'CONSUMER';

export interface AuthMockUser {
  id: number;
  username: string;
  email: string;
  token: string;
  segment: Segment;
  role: UserRole;
  planTier: PlanTier;
  companyName: string;
  ruc: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  gender: 'M' | 'F';
  password?: string;
}

export const AUTH_MOCK_MINING_GOLD: AuthMockUser = {
  id: 1,
  username: 'mario.vargas@minassur.com',
  email: 'mario.vargas@minassur.com',
  token: 'mock-jwt-mining-gold-aabbccdd',
  segment: 'MINING',
  role: 'SUPERVISOR',
  planTier: 'GOLD',
  companyName: 'Minas del Sur S.A.C.',
  ruc: '20512345678',
  firstName: 'Mario',
  lastName: 'Vargas',
  gender: 'M',
};

export const AUTH_MOCK_MINING_PLATINUM: AuthMockUser = {
  ...AUTH_MOCK_MINING_GOLD,
  token: 'mock-jwt-mining-platinum-eeffgghh',
  planTier: 'PLATINUM',
};

export const AUTH_MOCK_JEWELRY_GOLD: AuthMockUser = {
  id: 3,
  username: 'carmen.lopez@joyeriaelite.com',
  email: 'carmen.lopez@joyeriaelite.com',
  token: 'mock-jwt-jewelry-gold-iijjkkll',
  segment: 'JEWELRY',
  role: 'ADMIN',
  planTier: 'GOLD',
  companyName: 'Joyería Elite S.A.C.',
  ruc: '20567891234',
  firstName: 'Carmen',
  lastName: 'López',
  gender: 'F',
};

export const AUTH_MOCK_CONSUMER: AuthMockUser = {
  id: 5,
  username: 'ana.perez@gmail.com',
  email: 'ana.perez@gmail.com',
  token: 'mock-jwt-consumer-silver-mmnnoopp',
  segment: 'CONSUMER',
  role: 'CONSUMER',
  planTier: 'SILVER',
  companyName: '',
  ruc: '',
  firstName: 'Ana',
  lastName: 'Pérez',
  gender: 'F',
};

export const AUTH_MOCK_MINING_PLATINUM_ROBERTO: AuthMockUser = {
  ...AUTH_MOCK_MINING_GOLD,
  id: 2,
  username: 'roberto.quispe@minassur.com',
  email: 'roberto.quispe@minassur.com',
  token: 'mock-jwt-mining-platinum-roberto',
  planTier: 'PLATINUM',
  firstName: 'Roberto',
  lastName: 'Quispe',
  gender: 'M',
  password: 'Demo1234!',
};

export const AUTH_MOCK_JEWELRY_GOLD_SOFIA: AuthMockUser = {
  ...AUTH_MOCK_JEWELRY_GOLD,
  id: 4,
  username: 'sofia.mamani@artesaniassur.com',
  email: 'sofia.mamani@artesaniassur.com',
  token: 'mock-jwt-jewelry-gold-sofia',
  companyName: 'Artesanías del Sur E.I.R.L.',
  ruc: '20601112222',
  firstName: 'Sofía',
  lastName: 'Mamani',
  gender: 'F',
  password: 'Demo1234!',
};

export const AUTH_MOCK_CONSUMER_LUIS: AuthMockUser = {
  ...AUTH_MOCK_CONSUMER,
  id: 6,
  username: 'luis.flores@gmail.com',
  email: 'luis.flores@gmail.com',
  token: 'mock-jwt-consumer-luis',
  firstName: 'Luis',
  lastName: 'Flores',
  gender: 'M',
  password: 'Demo1234!',
};

export const ACTIVE_AUTH_MOCK = AUTH_MOCK_MINING_GOLD;
