
import { CalculatorDef } from './index';

export type FolderCoverType = 'photo' | 'color' | 'grid';

export interface FolderCover {
  type: FolderCoverType;
  value: string; // Hex code for color, Image URL for photo, or ignored for grid
  icon?: string; // For 'color' type
}

export interface ProjectFolder {
  id: string;
  name: string;
  description?: string;
  cover: FolderCover;
  calculatorIds: string[];
  createdAt: number;
  updatedAt: number;
  isShared: boolean;
  itemCount: number;
  colorTheme?: string; // For UI accents
}
