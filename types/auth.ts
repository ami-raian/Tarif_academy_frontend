export interface LoginFormData {
  email: string;
  password: string;
}

export interface StudentData {
  _id: string;
  id?: string;
  fullName: string;
  email: string;
  mobile: string;
  photo?: string;
  isVerified: boolean;
  isActive: boolean;
}

export interface AdminData {
  _id: string;
  id?: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    student?: StudentData;
    admin?: AdminData;
    accessToken: string;
    refreshToken: string;
  };
  statusCode: number;
}

export interface StudentProfileResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: StudentData;
}

export interface AdminProfileResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: AdminData;
}
