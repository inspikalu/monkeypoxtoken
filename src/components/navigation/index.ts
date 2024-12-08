import { createContext } from 'react';

type PageId = 'home' | 'nfts' | 'swap' | 'lock' | 'roadmap';

interface NavigationContextType {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
}

export const NavigationContext = createContext<NavigationContextType>({
  currentPage: 'home',
  setCurrentPage: () => {},
});