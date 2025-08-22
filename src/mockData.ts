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
