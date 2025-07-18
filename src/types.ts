export interface Player {
  tag: string;
  image: File | null;
  imagePreview: string;
  position: string;
}

export interface GenerateTop8ImageParams {
  canvas: HTMLCanvasElement;
  title: string;
  date: string;
  backgroundImagePreview: string;
  primaryColor: string;
  secondaryColor: string;
  players: Player[];
}

export interface FormData {
  title: string;
  date: string;
  backgroundImage: File | null;
  backgroundImagePreview: string;
  primaryColor: string;
  secondaryColor: string;
  players: Player[];
}
