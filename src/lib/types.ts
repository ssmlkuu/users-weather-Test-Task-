export type Gender = "male" | "female" | "other";

export interface RandomUser {
  id: string;
  name: string;
  gender: Gender;
  email: string;
  picture: string;
  location: {
    country: string;
    city: string;
    lat: number;
    lon: number;
  };
}

export interface CurrentWeather {
  code: number;
  temp: number;
  min: number;
  max: number;
}
