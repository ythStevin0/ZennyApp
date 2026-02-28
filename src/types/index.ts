export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string; // ISO string
  note?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  photoUri?: string;
}

export const CATEGORIES = {
  income: ['Gaji', 'Hadiah', 'Investasi', 'Lainnya'],
  expense: [
    'Makanan', 'Minuman', 'Transport', 'Belanja',
    'Hiburan', 'Kesehatan', 'Pendidikan', 'Listrik',
    'Air', 'Internet', 'Sewa', 'Gas',
    'Olahraga', 'Kosmetik', 'Hotel', 'Lainnya',
  ],
};

export type ActiveTab =
  | 'home'
  | 'smartview'
  | 'add'
  | 'goals'
  | 'reminder'
  | 'add-reminder'
  | 'profile'
  | 'add-goal'
  | 'edit-profile';
