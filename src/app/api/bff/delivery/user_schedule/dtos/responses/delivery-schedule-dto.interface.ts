export interface DeliveryScheduleDto {
  schedule_options: ScheduleOptionDto[];
  user_schedule: UserScheduleDto;
}

export interface ScheduleOptionDto {
  schedule_time_range: string;
  pickup_start_date: string;
  pickup_end_date: string;
}

export interface UserScheduleDto {
  id: string;
  schedule_time_range: string;
}
