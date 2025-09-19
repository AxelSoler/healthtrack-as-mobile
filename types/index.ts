export interface Metric {
  id: string;
  user_id: string;
  created_at: string;
  weight?: number;
  blood_pressure?: string;
  sleep_hours?: number;
}

export interface Profile {
  weight_goal?: number;
}
