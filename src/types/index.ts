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
