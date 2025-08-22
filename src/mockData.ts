// Types pour les produits
export interface ProductCategory {
  reference: string;
  label: string;
  referencePath: string;
}

export interface ProductBrand {
  reference: string;
  name: string;
}

export interface ProductAttribute {
  reference: string;
  label: string;
  unit: string | null;
  values: string[];
  files: {
    index: number;
    mimeType: string;
    url: string;
    updatedAt: string;
  }[];
}

export interface ProductPicture {
  index: number;
  url: string;
}

export interface Product {
  gtin: string;
  productReference: string;
  title: string;
  language: "fr-FR" | "en-GB" | "es-ES";
  category: ProductCategory;
  brand: ProductBrand;
  attributes: ProductAttribute[];
  pictures: ProductPicture[];
  description: string;
  completeness: number;
  groupReference: string | null;
  createdBySeller: boolean;
  createdAt: string;
  updatedAt: string;
}

// Types pour les commandes
export interface OrderAddress {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
  email?: string;
}

export interface OrderItem {
  id: string;
  gtin: string;
  productReference: string;
  title: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: "pending" | "acknowledged" | "shipped" | "cancelled";
  trackingNumber?: string;
  carrier?: string;
}

export interface Order {
  id: string;
  reference: string;
  status: "pending" | "acknowledged" | "shipped" | "delivered" | "cancelled";
  salesChannel: "cdiscount" | "amazon" | "fnac" | "rakuten";
  customer: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  billingAddress: OrderAddress;
  shippingAddress: OrderAddress;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  totalAmount: number;
  currency: "EUR" | "USD";
  paymentMethod: "card" | "paypal" | "bank_transfer";
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: string;
  updatedAt: string;
  acknowledgedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
}

// Jeu de données en mémoire (déterministe)
export const products: Product[] = [
  {
    gtin: "3543111111111",
    productReference: "IPH13-BLACK-128",
    title: "Smartphone Exemple 128 Go",
    language: "fr-FR",
    category: { 
      reference: "070302", 
      label: "SMARTPHONE", 
      referencePath: "07/0703/070302" 
    },
    brand: { 
      reference: "APL", 
      name: "Apple" 
    },
    attributes: [ 
      { 
        reference: "39635", 
        label: "Mémoire", 
        unit: "Go", 
        values: ["128"],
        files: [
          {
            index: 1,
            mimeType: "application/pdf",
            url: "https://media.pdf",
            updatedAt: "2024-10-01T10:20:30Z"
          }
        ]
      } 
    ],
    pictures: [ 
      { 
        index: 1, 
        url: "https://img.mock/iph13-1.jpg" 
      } 
    ],
    description: "Un super smartphone avec une excellente qualité d'image et une autonomie remarquable.",
    completeness: 92,
    groupReference: "VARI-IPHONE-13",
    createdBySeller: true,
    createdAt: "2024-10-01T10:20:30Z",
    updatedAt: "2025-07-15T09:00:00Z"
  },
  {
    gtin: "4000000000002",
    productReference: "CASE-UNIV-01",
    title: "Coque universelle pour smartphone",
    language: "fr-FR",
    category: { 
      reference: "070304", 
      label: "COQUES", 
      referencePath: "07/0703/070304" 
    },
    brand: { 
      reference: "GEN", 
      name: "Generic" 
    },
    attributes: [ 
      { 
        reference: "12345", 
        label: "Matériau", 
        unit: null, 
        values: ["Silicone", "TPU"],
        files: []
      } 
    ],
    pictures: [ 
      { 
        index: 1, 
        url: "https://img.mock/case-1.jpg" 
      } 
    ],
    description: "Coque universelle de haute qualité, compatible avec la plupart des smartphones.",
    completeness: 85,
    groupReference: null,
    createdBySeller: false,
    createdAt: "2024-09-15T14:30:00Z",
    updatedAt: "2025-07-10T16:45:00Z"
  },
  {
    gtin: "5000000000003",
    productReference: "TROUSERS-BLUE-32",
    title: "Pantalon classique bleu marine",
    language: "fr-FR",
    category: { 
      reference: "030101", 
      label: "PANTALONS", 
      referencePath: "03/0301/030101" 
    },
    brand: { 
      reference: "FASH", 
      name: "FashionBrand" 
    },
    attributes: [ 
      { 
        reference: "67890", 
        label: "Taille", 
        unit: null, 
        values: ["30", "31", "32", "33", "34"],
        files: []
      },
      {
        reference: "67891",
        label: "Couleur",
        unit: null,
        values: ["Bleu marine", "Noir", "Gris"],
        files: []
      }
    ],
    pictures: [ 
      { 
        index: 1, 
        url: "https://img.mock/trousers-1.jpg" 
      },
      {
        index: 2,
        url: "https://img.mock/trousers-2.jpg"
      }
    ],
    description: "Pantalon classique en coton de qualité, parfait pour un usage quotidien ou professionnel.",
    completeness: 95,
    groupReference: "VARI-TROUSERS-123",
    createdBySeller: true,
    createdAt: "2024-08-20T09:15:00Z",
    updatedAt: "2025-07-12T11:30:00Z"
  }
];

// Jeu de données des commandes (cohérent avec les produits)
export const orders: Order[] = [
  {
    id: "ORD-001",
    reference: "CDS-2025-001",
    status: "pending",
    salesChannel: "cdiscount",
    customer: {
      id: "CUST-001",
      email: "jean.dupont@email.com",
      firstName: "Jean",
      lastName: "Dupont"
    },
    billingAddress: {
      firstName: "Jean",
      lastName: "Dupont",
      address1: "123 Rue de la Paix",
      city: "Paris",
      postalCode: "75001",
      country: "FR",
      phone: "+33123456789",
      email: "jean.dupont@email.com"
    },
    shippingAddress: {
      firstName: "Jean",
      lastName: "Dupont",
      address1: "123 Rue de la Paix",
      city: "Paris",
      postalCode: "75001",
      country: "FR",
      phone: "+33123456789",
      email: "jean.dupont@email.com"
    },
    items: [
      {
        id: "ITEM-001",
        gtin: "3543111111111",
        productReference: "IPH13-BLACK-128",
        title: "Smartphone Exemple 128 Go",
        quantity: 1,
        unitPrice: 899.99,
        totalPrice: 899.99,
        status: "pending"
      }
    ],
    subtotal: 899.99,
    shippingCost: 0,
    taxAmount: 179.99,
    totalAmount: 1079.98,
    currency: "EUR",
    paymentMethod: "card",
    paymentStatus: "paid",
    createdAt: "2025-07-15T10:00:00Z",
    updatedAt: "2025-07-15T10:00:00Z"
  },
  {
    id: "ORD-002",
    reference: "CDS-2025-002",
    status: "acknowledged",
    salesChannel: "cdiscount",
    customer: {
      id: "CUST-002",
      email: "marie.martin@email.com",
      firstName: "Marie",
      lastName: "Martin"
    },
    billingAddress: {
      firstName: "Marie",
      lastName: "Martin",
      address1: "456 Avenue des Champs",
      city: "Lyon",
      postalCode: "69001",
      country: "FR",
      phone: "+33456789012",
      email: "marie.martin@email.com"
    },
    shippingAddress: {
      firstName: "Marie",
      lastName: "Martin",
      address1: "456 Avenue des Champs",
      city: "Lyon",
      postalCode: "69001",
      country: "FR",
      phone: "+33456789012",
      email: "marie.martin@email.com"
    },
    items: [
      {
        id: "ITEM-002",
        gtin: "4000000000002",
        productReference: "CASE-UNIV-01",
        title: "Coque universelle pour smartphone",
        quantity: 2,
        unitPrice: 19.99,
        totalPrice: 39.98,
        status: "acknowledged"
      }
    ],
    subtotal: 39.98,
    shippingCost: 4.99,
    taxAmount: 8.99,
    totalAmount: 53.96,
    currency: "EUR",
    paymentMethod: "paypal",
    paymentStatus: "paid",
    createdAt: "2025-07-14T14:30:00Z",
    updatedAt: "2025-07-14T16:00:00Z",
    acknowledgedAt: "2025-07-14T16:00:00Z"
  },
  {
    id: "ORD-003",
    reference: "CDS-2025-003",
    status: "shipped",
    salesChannel: "cdiscount",
    customer: {
      id: "CUST-003",
      email: "pierre.durand@email.com",
      firstName: "Pierre",
      lastName: "Durand"
    },
    billingAddress: {
      firstName: "Pierre",
      lastName: "Durand",
      address1: "789 Boulevard Central",
      city: "Marseille",
      postalCode: "13001",
      country: "FR",
      phone: "+33412345678",
      email: "pierre.durand@email.com"
    },
    shippingAddress: {
      firstName: "Pierre",
      lastName: "Durand",
      address1: "789 Boulevard Central",
      city: "Marseille",
      postalCode: "13001",
      country: "FR",
      phone: "+33412345678",
      email: "pierre.durand@email.com"
    },
    items: [
      {
        id: "ITEM-003",
        gtin: "5000000000003",
        productReference: "TROUSERS-BLUE-32",
        title: "Pantalon classique bleu marine",
        quantity: 1,
        unitPrice: 79.99,
        totalPrice: 79.99,
        status: "shipped",
        trackingNumber: "TRK123456789",
        carrier: "Colissimo"
      }
    ],
    subtotal: 79.99,
    shippingCost: 5.99,
    taxAmount: 16.00,
    totalAmount: 101.98,
    currency: "EUR",
    paymentMethod: "card",
    paymentStatus: "paid",
    createdAt: "2025-07-13T09:15:00Z",
    updatedAt: "2025-07-14T11:00:00Z",
    acknowledgedAt: "2025-07-13T15:00:00Z",
    shippedAt: "2025-07-14T11:00:00Z"
  },
  {
    id: "ORD-004",
    reference: "CDS-2025-004",
    status: "cancelled",
    salesChannel: "cdiscount",
    customer: {
      id: "CUST-004",
      email: "sophie.leroy@email.com",
      firstName: "Sophie",
      lastName: "Leroy"
    },
    billingAddress: {
      firstName: "Sophie",
      lastName: "Leroy",
      address1: "321 Rue du Commerce",
      city: "Toulouse",
      postalCode: "31000",
      country: "FR",
      phone: "+33567890123",
      email: "sophie.leroy@email.com"
    },
    shippingAddress: {
      firstName: "Sophie",
      lastName: "Leroy",
      address1: "321 Rue du Commerce",
      city: "Toulouse",
      postalCode: "31000",
      country: "FR",
      phone: "+33567890123",
      email: "sophie.leroy@email.com"
    },
    items: [
      {
        id: "ITEM-004",
        gtin: "3543111111111",
        productReference: "IPH13-BLACK-128",
        title: "Smartphone Exemple 128 Go",
        quantity: 1,
        unitPrice: 899.99,
        totalPrice: 899.99,
        status: "cancelled"
      }
    ],
    subtotal: 899.99,
    shippingCost: 0,
    taxAmount: 179.99,
    totalAmount: 1079.98,
    currency: "EUR",
    paymentMethod: "card",
    paymentStatus: "paid",
    createdAt: "2025-07-12T16:45:00Z",
    updatedAt: "2025-07-13T10:30:00Z",
    cancelledAt: "2025-07-13T10:30:00Z",
    cancellationReason: "Demande client"
  }
];

// Fonction pour réinitialiser les données des commandes (utile pour les tests)
export function resetOrdersData(): void {
  // Réinitialiser ORD-001 à pending
  const order1 = orders.find(o => o.id === 'ORD-001');
  if (order1) {
    order1.status = 'pending';
    order1.updatedAt = '2025-07-15T10:00:00Z';
    delete order1.cancelledAt;
    delete order1.cancellationReason;
    order1.items.forEach(item => {
      item.status = 'pending';
      delete item.trackingNumber;
      delete item.carrier;
    });
  }

  // Réinitialiser ORD-002 à acknowledged
  const order2 = orders.find(o => o.id === 'ORD-002');
  if (order2) {
    order2.status = 'acknowledged';
    order2.updatedAt = '2025-07-14T16:00:00Z';
    order2.acknowledgedAt = '2025-07-14T16:00:00Z';
    delete order2.cancelledAt;
    delete order2.cancellationReason;
    order2.items.forEach(item => {
      item.status = 'acknowledged';
      delete item.trackingNumber;
      delete item.carrier;
    });
  }

  // Réinitialiser ORD-003 à shipped
  const order3 = orders.find(o => o.id === 'ORD-003');
  if (order3) {
    order3.status = 'shipped';
    order3.updatedAt = '2025-07-14T11:00:00Z';
    order3.acknowledgedAt = '2025-07-13T15:00:00Z';
    order3.shippedAt = '2025-07-14T11:00:00Z';
    delete order3.cancelledAt;
    delete order3.cancellationReason;
    order3.items.forEach(item => {
      item.status = 'shipped';
      item.trackingNumber = 'TRK123456789';
      item.carrier = 'Colissimo';
    });
  }

  // Réinitialiser ORD-004 à cancelled
  const order4 = orders.find(o => o.id === 'ORD-004');
  if (order4) {
    order4.status = 'cancelled';
    order4.updatedAt = '2025-07-13T10:30:00Z';
    order4.cancelledAt = '2025-07-13T10:30:00Z';
    order4.cancellationReason = 'Demande client';
    order4.items.forEach(item => {
      item.status = 'cancelled';
      delete item.trackingNumber;
      delete item.carrier;
    });
  }
}
