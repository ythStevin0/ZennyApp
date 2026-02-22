export function getCategoryIcon(category: string): string {
  const map: Record<string, string> = {
    Makanan: '🍽️',
    Food: '🍽️',
    Transport: '🚗',
    Listrik: '⚡',
    Utilities: '⚡',
    Hiburan: '🎬',
    Entertainment: '🎬',
    Belanja: '🛍️',
    Shopping: '🛍️',
    Kesehatan: '💊',
    Health: '💊',
    Pendidikan: '📚',
    Education: '📚',
    Gaji: '💰',
    Salary: '💰',
    Hadiah: '🎁',
    Gift: '🎁',
    Lainnya: '🔹',
    Other: '🔹',
    Minuman: '🥤',
    Buah: '🍌',
    Sayuran: '🥦',
    Camilan: '🍪',
    Sewa: '🏠',
    Housing: '🏠',
    Gas: '⛽',
    Air: '💧',
    Internet: '🌐',
    Pulsa: '📱',
    Olahraga: '🏃',
    Kosmetik: '💄',
    Hotel: '🏨',
    Investasi: '📈',
    Freelance: '💻',
  };
  return map[category] || '🔹';
}

export function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}
