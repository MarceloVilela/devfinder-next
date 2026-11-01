export interface VideoData {
  _id: string;
  title: string;
  url: string;
  channel_id: string;
  channel: string;
  channel_url: string;
  thumbnail: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChannelData {
  tags: string[];
  likes: string[];
  deslikes: string[];
  _id: string;
  name: string;
  link: string;
  userGithub: string;
  description: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  avatar: string;
}

// Resposta paginada do backend (`/feed/trending`, `/devs`, `/feed/channel`...) — um único contrato
// usado por Server Components (`fetchListing`) e Client Components (`Trend`/`UserAll`/`Subs`).
export interface ListingFeed<T> {
  docs: T[];
  total: number;
  itemsPerPage: number;
}

export interface UserData {
  likes: string[];
  deslikes: string[];
  follow: string[];
  ignore: string[];
  _id: string;
  name: string;
  user: string;
  bio?: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
}
