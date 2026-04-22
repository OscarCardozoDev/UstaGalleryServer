export interface CreateClassUseCase {
  groupId: string;
  date: Date;
  startTime: string;
  endTime: string;
  topic?: string;
}

export interface UpdateTopicUseCase {
  classId: string;
  topic?: string;
  review?: string;
}

export interface AttendUseCase {
  classId: string;
  userId: string;
}

export interface CurrentClassResult {
  active: boolean;
  classId?: string;
}
