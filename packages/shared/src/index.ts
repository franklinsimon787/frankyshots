export type SpeciesCategory = 'Animals' | 'Birds' | 'Snakes' | 'Fish' | 'Insects';

export interface SpeciesRecord {
  id: string;
  slug: string;
  name: string;
  category: SpeciesCategory;
  location: string;
  summary: string;
  featuredImage: string;
  isFeatured: boolean;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  description: string;
  year: number;
  image: string;
  isFeatured: boolean;
}
