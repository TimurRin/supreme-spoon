export interface Lesson {
  date?: string;
  id?: number;
  status?: number;
  students?: Student[];
  teachers?: Teacher[];
  title?: string;
  visitCount?: number;
}

export interface Student {
  id?: number;
  name?: string;
  visit?: boolean;
}

export interface Teacher {
  id?: number;
  name?: string;
}

export interface GetLessonsQuery {
  date?: string;
  lessonsPerPage?: string;
  page?: string;
  status?: string;
  studentsCount?: string;
  teacherIds?: string;
}

export interface GetLessonsBadRequestApplicationJsonResponse {
  error?: string;
}
