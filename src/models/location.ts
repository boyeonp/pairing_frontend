export interface LocationSnapshot {
  /** FK -> User.id */
  user_id: number;
  lat: number;
  lng: number;
  updated_at: string;          // ISO timestamp
}