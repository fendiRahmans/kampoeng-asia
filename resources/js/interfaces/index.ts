
export interface HomeContent {
  id: string;
  title: string;
  description: string;
  image?: string;
}

export interface RTInfo {
  name: string;
  address: string;
  description: string;
  highlights: HighlightItem[];
  sections: {
    agamis: HomeContent;
    sehat: HomeContent;
    indah: HomeContent;
    aman: HomeContent;
  };
}

export interface HighlightItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'achievement' | 'activity' | 'news';
}