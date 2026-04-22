export interface CreateScheduleUseCase {
  groupId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface UpdateScheduleUseCase {
  scheduleId: string;
  data: Partial<Pick<CreateScheduleUseCase, 'dayOfWeek' | 'startTime' | 'endTime'>>;
}
