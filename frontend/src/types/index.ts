export interface User {
  id: string;
  email: string;
  username: string;
}
export interface Train {
  id: string;
  number: string;
  route: string;
}

export interface Station {
  id: string;
  name: string;
}

export interface Report {
  id: string;
  name: string;
  user: User;
  user_id: string;
  startDate: Date;
  endDate: Date;
}

export interface Schedule {
  id: string;
  train_id: string;

  station_id: string;

  delay_minutes: number;
  arrivalTime: Date;
  departureTime: Date;
  platform: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ScheduleFull extends Schedule {
  station: Station;
  train?: Train;
}
