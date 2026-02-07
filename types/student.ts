export interface EducationalInfoSSC {
  roll: string;
  registration: string;
  schoolName: string;
  board: string;
  passingYear: number;
  group: string;
  gpa: number;
}

export interface EducationalInfoHSC {
  roll: string;
  registration: string;
  collegeName: string;
  board?: string;
  passingYear?: number;
  group?: string;
  gpa: number;
}

export interface Student {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
  whatsapp: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  bloodGroup: string;
  photo: string;
  educationalInfo: {
    ssc: EducationalInfoSSC;
    hsc: EducationalInfoHSC;
  };
  guardian?: {
    type: string;
    name: string;
    mobile: string;
    occupation: string;
  };
  address?: {
    present: string;
    district: string;
    permanent: string;
  };
  isVerified: boolean;
  isActive: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentsApiResponse {
  success: boolean;
  message: string;
  data: Student[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
  statusCode: number;
}
