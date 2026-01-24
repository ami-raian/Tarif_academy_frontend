export interface LoginFormData {
  email: string;
  password: string;
}

export interface StudentData {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  photo: string;
  isVerified: boolean;
}

export interface AdminData {
  id: string;
  email: string;
  role: string;
  avatar: string;
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
