/**
 * Food Rescue MVP - Data Management & LocalStorage
 * No AI/ML used - Simple deterministic data storage
 */

const STORAGE_KEY = 'food_rescue_items_v2';
const USER_KEY = 'food_rescue_user';

// Initial Demo Data matching the exact specifications
const INITIAL_FOOD_ITEMS = [
  {
    id: 'fr-001',
    name: 'Vegetable Biryani',
    description: 'Fragrant long-grain basmati rice cooked with fresh seasonal farm vegetables, aromatic herbs, and mild Indian spices. Freshly packed in insulated warm containers.',
    quantity: '20 meals',
    quantityNumber: 20,
    mealsCount: 20,
    foodType: 'Vegetarian',
    dietary: 'Vegetarian',
    location: 'Manjeri',
    pickupLocation: 'Manjeri Community Hall, Main Road',
    pickupInstructions: 'Enter through the main reception. Collect from community food counter #1.',
    availableUntil: '7:00 PM',
    availableUntilRaw: new Date(Date.now() + 5 * 3600000).toISOString(),
    donorName: 'Community Kitchen',
    donorOrg: 'Community Kitchen',
    donorContact: '+91 98460 12345',
    donorEmail: 'contact@communitykitchen.org',
    status: 'Available', // 'Available' or 'Claimed'
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    claimedAt: null,
    claimedBy: null,
    claimId: null
  },
  {
    id: 'fr-002',
    name: 'Chapati & Curry',
    description: 'Soft, freshly made whole wheat chapatis served with homestyle mixed vegetable curry and spiced dal. Packed hygienically in food-grade containers.',
    quantity: '15 meals',
    quantityNumber: 15,
    mealsCount: 15,
    foodType: 'Vegetarian',
    dietary: 'Vegetarian',
    location: 'Downtown',
    pickupLocation: 'Green Garden Banquet Hall, 5th Avenue, Downtown',
    pickupInstructions: 'Rear service entrance gate. Staff is informed of Food Rescue pickup.',
    availableUntil: '7:30 PM',
    availableUntilRaw: new Date(Date.now() + 5.5 * 3600000).toISOString(),
    donorName: 'Green Garden Restaurant',
    donorOrg: 'Green Garden Events',
    donorContact: '+91 98460 23456',
    donorEmail: 'catering@greengarden.org',
    status: 'Available',
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    claimedAt: null,
    claimedBy: null,
    claimId: null
  },
  {
    id: 'fr-003',
    name: 'Rice & Chicken Curry',
    description: 'Steamed premium rice paired with savory, slow-simmered chicken curry in aromatic onion-tomato gravy. Kept warm under safe food storage conditions.',
    quantity: '25 meals',
    quantityNumber: 25,
    mealsCount: 25,
    foodType: 'Non-Vegetarian',
    dietary: 'Non-Vegetarian',
    location: 'University Campus',
    pickupLocation: 'Metro Campus Dining Hall, Block B, University Road',
    pickupInstructions: 'Kitchen loading dock near Parking Lot 3. Call supervisor upon arrival.',
    availableUntil: '9:00 PM',
    availableUntilRaw: new Date(Date.now() + 7 * 3600000).toISOString(),
    donorName: 'Campus Dining Services',
    donorOrg: 'Metro State University',
    donorContact: '+91 98460 34567',
    donorEmail: 'dining@campus.edu',
    status: 'Available',
    imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date(Date.now() - 1 * 3600000).toISOString(),
    claimedAt: null,
    claimedBy: null,
    claimId: null
  },
  {
    id: 'fr-004',
    name: 'Fresh Bread & Pastries',
    description: 'Freshly baked artisan sourdough loaves, baguettes, and assorted rolls. Baked fresh this morning with wholesome ingredients.',
    quantity: '12 meals',
    quantityNumber: 12,
    mealsCount: 12,
    foodType: 'Vegetarian',
    dietary: 'Vegetarian',
    location: 'Westside',
    pickupLocation: 'Golden Crust Artisan Bakery, Main Market Square, Westside',
    pickupInstructions: 'Front counter. Show Food Rescue screen to collect package.',
    availableUntil: '6:30 PM',
    availableUntilRaw: new Date(Date.now() + 4.5 * 3600000).toISOString(),
    donorName: 'Golden Crust Bakery',
    donorOrg: 'Golden Crust Bakery',
    donorContact: '+91 98460 45678',
    donorEmail: 'hello@goldencrustbakery.com',
    status: 'Available',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    claimedAt: null,
    claimedBy: null,
    claimId: null
  },
  {
    id: 'fr-005',
    name: 'Dal Tadka & Steamed Rice',
    description: 'Nutritious yellow lentil curry tempered with cumin, garlic, and fresh coriander, served with piping hot steamed rice.',
    quantity: '30 meals',
    quantityNumber: 30,
    mealsCount: 30,
    foodType: 'Vegetarian',
    dietary: 'Vegetarian',
    location: 'Central Market',
    pickupLocation: 'Central Relief Center, 88 Elm Street, Central Market',
    pickupInstructions: 'Side pickup door. Staff is available to help load boxes.',
    availableUntil: '8:00 PM',
    availableUntilRaw: new Date(Date.now() + 6 * 3600000).toISOString(),
    donorName: 'Harmony Relief Kitchen',
    donorOrg: 'Harmony Relief Kitchen',
    donorContact: '+91 98460 56789',
    donorEmail: 'relief@harmonycenter.org',
    status: 'Available',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date(Date.now() - 2.5 * 3600000).toISOString(),
    claimedAt: null,
    claimedBy: null,
    claimId: null
  },
  {
    id: 'fr-006',
    name: 'Assorted Bakery Rolls & Muffins',
    description: 'Sealed bakery boxes of freshly baked blueberry muffins, whole wheat rolls, and breakfast croissants from morning buffet.',
    quantity: '18 meals',
    quantityNumber: 18,
    mealsCount: 18,
    foodType: 'Vegetarian',
    dietary: 'Vegetarian',
    location: 'North Gate',
    pickupLocation: 'Sunrise Cafe, North Gate Shopping Plaza',
    pickupInstructions: 'Side takeout window facing North Gate parking.',
    availableUntil: '7:00 PM',
    availableUntilRaw: new Date(Date.now() + 5 * 3600000).toISOString(),
    donorName: 'Sunrise Cafe',
    donorOrg: 'Sunrise Cafe',
    donorContact: '+91 98460 67890',
    donorEmail: 'manager@sunrisecafe.com',
    status: 'Available',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date(Date.now() - 3.5 * 3600000).toISOString(),
    claimedAt: null,
    claimedBy: null,
    claimId: null
  }
];

// Food category preset image helpers
const CATEGORY_IMAGE_PRESETS = {
  'Cooked Meal': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
  'Bakery & Bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
  'Fresh Produce': 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80',
  'Packaged Food': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
  'Dairy & Eggs': 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=800&q=80',
  'Beverages': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80',
  'Other': 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80'
};

class DataStore {
  constructor() {
    this.initStorage();
  }

  initStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        this.saveItems(INITIAL_FOOD_ITEMS);
      }
    } catch (e) {
      console.warn('LocalStorage unavailable or disabled:', e);
    }
  }

  getItems() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading localStorage:', e);
    }
    return INITIAL_FOOD_ITEMS;
  }

  getItemById(id) {
    const items = this.getItems();
    return items.find(item => item.id === id) || null;
  }

  saveItems(items) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }

  addItem(newItem) {
    const items = this.getItems();
    const id = 'fr-' + Date.now().toString().slice(-6);
    
    // Choose image if not provided
    let imageUrl = newItem.imageUrl && newItem.imageUrl.trim() ? newItem.imageUrl.trim() : null;
    if (!imageUrl) {
      imageUrl = CATEGORY_IMAGE_PRESETS[newItem.foodType] || CATEGORY_IMAGE_PRESETS['Cooked Meal'];
    }

    const mealsCount = parseInt(newItem.mealsCount, 10) || parseInt(newItem.quantity, 10) || 1;
    const quantityDisplay = newItem.quantity ? newItem.quantity.trim() : (mealsCount + ' meals');

    let availableDisplay = newItem.availableUntil ? newItem.availableUntil.trim() : 'Today, 8:00 PM';
    if (newItem.availableFrom && newItem.availableFrom.trim()) {
      availableDisplay = `${newItem.availableFrom.trim()} - ${availableDisplay}`;
    }

    const item = {
      id: id,
      name: newItem.name.trim(),
      description: newItem.description.trim(),
      quantity: quantityDisplay,
      quantityNumber: mealsCount,
      mealsCount: mealsCount,
      foodType: newItem.foodType || 'Vegetarian',
      dietary: newItem.foodType === 'Non-Vegetarian' ? 'Non-Vegetarian' : 'Vegetarian',
      location: newItem.location.trim(),
      pickupInstructions: newItem.pickupInstructions ? newItem.pickupInstructions.trim() : 'Call donor upon arrival for coordination.',
      availableFrom: newItem.availableFrom ? newItem.availableFrom.trim() : '',
      availableUntil: availableDisplay,
      availableUntilRaw: newItem.availableUntilRaw || new Date(Date.now() + 6 * 3600000).toISOString(),
      donorName: newItem.donorName.trim(),
      donorOrg: newItem.donorOrg ? newItem.donorOrg.trim() : 'Community Donor',
      donorContact: newItem.donorContact.trim(),
      donorEmail: newItem.donorEmail ? newItem.donorEmail.trim() : '',
      status: 'Available',
      imageUrl: imageUrl,
      createdAt: new Date().toISOString(),
      claimedAt: null,
      claimedBy: null,
      claimId: null
    };

    items.unshift(item);
    this.saveItems(items);
    return item;
  }

  claimItem(id, claimerDetails = {}) {
    const items = this.getItems();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;

    const item = items[index];
    if (item.status === 'Claimed') {
      return item; // already claimed
    }

    const claimId = 'CLAIM-' + Math.floor(100000 + Math.random() * 900000);
    item.status = 'Claimed';
    item.claimedAt = new Date().toISOString();
    item.claimId = claimId;
    item.claimedBy = {
      name: claimerDetails.name || 'Community Recipient',
      contact: claimerDetails.contact || 'Registered Member',
      notes: claimerDetails.notes || 'Direct pickup confirmed'
    };

    items[index] = item;
    this.saveItems(items);
    return item;
  }

  resetDemoData() {
    this.saveItems(INITIAL_FOOD_ITEMS);
    return INITIAL_FOOD_ITEMS;
  }

  // Current session mock user
  getUser() {
    try {
      const user = localStorage.getItem(USER_KEY);
      if (user) return JSON.parse(user);
    } catch (e) {
      console.warn('Error reading user:', e);
    }
    return null;
  }

  setUser(user) {
    try {
      if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_KEY);
      }
    } catch (e) {
      console.warn('Error saving user:', e);
    }
  }
}

// Global store instance
window.foodStore = new DataStore();
