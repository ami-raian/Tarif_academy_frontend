import { z } from "zod";

// Bangladesh phone number regex
const bdPhoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;

// Blood groups in Bangladesh
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

// Education boards
const boards = [
  "dhaka",
  "rajshahi",
  "chittagong",
  "comilla",
  "sylhet",
  "jessore",
  "barishal",
  "dinajpur",
  "mymensingh",
  "madrasa",
  "technical",
] as const;

// Groups
const groups = ["science", "commerce", "arts"] as const;

// Guardian types
const guardianTypes = ["father", "mother", "brother", "sister", "uncle", "aunt", "other"] as const;

// Gender
const genders = ["male", "female", "other"] as const;

// SSC Schema
const sscSchema = z.object({
  roll: z
    .string()
    .min(1, "SSC রোল নম্বর আবশ্যক")
    .regex(/^\d+$/, "শুধুমাত্র সংখ্যা দিন"),
  registration: z
    .string()
    .min(1, "SSC রেজিস্ট্রেশন নম্বর আবশ্যক")
    .regex(/^\d+$/, "শুধুমাত্র সংখ্যা দিন"),
  schoolName: z
    .string()
    .min(2, "স্কুলের নাম কমপক্ষে ২ অক্ষর হতে হবে")
    .max(100, "স্কুলের নাম সর্বোচ্চ ১০০ অক্ষর হতে পারে"),
  board: z.enum(boards, { errorMap: () => ({ message: "বোর্ড নির্বাচন করুন" }) }),
  passingYear: z
    .number({ invalid_type_error: "পাশের সাল আবশ্যক" })
    .min(2000, "পাশের সাল ২০০০ এর পরে হতে হবে")
    .max(new Date().getFullYear() + 1, "ভবিষ্যতের সাল দেওয়া যাবে না"),
  group: z.enum(groups, { errorMap: () => ({ message: "বিভাগ নির্বাচন করুন" }) }),
  gpa: z
    .number({ invalid_type_error: "GPA আবশ্যক" })
    .min(1.0, "GPA কমপক্ষে ১.০০ হতে হবে")
    .max(5.0, "GPA সর্বোচ্চ ৫.০০ হতে পারে"),
});

// HSC Schema
const hscSchema = z.object({
  roll: z
    .string()
    .min(1, "HSC রোল নম্বর আবশ্যক")
    .regex(/^\d+$/, "শুধুমাত্র সংখ্যা দিন"),
  registration: z
    .string()
    .min(1, "HSC রেজিস্ট্রেশন নম্বর আবশ্যক")
    .regex(/^\d+$/, "শুধুমাত্র সংখ্যা দিন"),
  collegeName: z
    .string()
    .min(2, "কলেজের নাম কমপক্ষে ২ অক্ষর হতে হবে")
    .max(100, "কলেজের নাম সর্বোচ্চ ১০০ অক্ষর হতে পারে"),
  board: z.enum(boards, { errorMap: () => ({ message: "বোর্ড নির্বাচন করুন" }) }),
  passingYear: z
    .number({ invalid_type_error: "পাশের সাল আবশ্যক" })
    .min(2000, "পাশের সাল ২০০০ এর পরে হতে হবে")
    .max(new Date().getFullYear() + 5, "পাশের সাল সঠিক নয়"),
  group: z.enum(groups, { errorMap: () => ({ message: "বিভাগ নির্বাচন করুন" }) }),
  gpa: z
    .number({ invalid_type_error: "GPA আবশ্যক" })
    .min(1.0, "GPA কমপক্ষে ১.০০ হতে হবে")
    .max(5.0, "GPA সর্বোচ্চ ৫.০০ হতে পারে"),
});

// Guardian Schema
const guardianSchema = z.object({
  type: z.enum(guardianTypes, { errorMap: () => ({ message: "অভিভাবকের ধরন নির্বাচন করুন" }) }),
  name: z
    .string()
    .min(2, "অভিভাবকের নাম কমপক্ষে ২ অক্ষর হতে হবে")
    .max(100, "অভিভাবকের নাম সর্বোচ্চ ১০০ অক্ষর হতে পারে"),
  mobile: z
    .string()
    .min(1, "অভিভাবকের মোবাইল নম্বর আবশ্যক")
    .regex(bdPhoneRegex, "সঠিক বাংলাদেশি মোবাইল নম্বর দিন"),
  occupation: z
    .string()
    .min(2, "পেশা কমপক্ষে ২ অক্ষর হতে হবে")
    .max(50, "পেশা সর্বোচ্চ ৫০ অক্ষর হতে পারে"),
});

// Address Schema
const addressSchema = z.object({
  present: z
    .string()
    .min(5, "বর্তমান ঠিকানা কমপক্ষে ৫ অক্ষর হতে হবে")
    .max(200, "বর্তমান ঠিকানা সর্বোচ্চ ২০০ অক্ষর হতে পারে"),
  district: z
    .string()
    .min(2, "জেলার নাম কমপক্ষে ২ অক্ষর হতে হবে")
    .max(50, "জেলার নাম সর্বোচ্চ ৫০ অক্ষর হতে পারে"),
  permanent: z
    .string()
    .min(5, "স্থায়ী ঠিকানা কমপক্ষে ৫ অক্ষর হতে হবে")
    .max(200, "স্থায়ী ঠিকানা সর্বোচ্চ ২০০ অক্ষর হতে পারে"),
});

// Educational Info Schema
const educationalInfoSchema = z.object({
  ssc: sscSchema,
  hsc: hscSchema,
});

// Main Signup Schema
export const signupSchema = z.object({
  // Basic Info
  fullName: z
    .string()
    .min(2, "নাম কমপক্ষে ২ অক্ষর হতে হবে")
    .max(100, "নাম সর্বোচ্চ ১০০ অক্ষর হতে পারে"),
  email: z
    .string()
    .min(1, "ইমেইল আবশ্যক")
    .email("সঠিক ইমেইল ঠিকানা দিন"),
  password: z
    .string()
    .min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে")
    .max(50, "পাসওয়ার্ড সর্বোচ্চ ৫০ অক্ষর হতে পারে"),
  confirmPassword: z
    .string()
    .min(1, "পাসওয়ার্ড নিশ্চিত করুন"),
  mobile: z
    .string()
    .min(1, "মোবাইল নম্বর আবশ্যক")
    .regex(bdPhoneRegex, "সঠিক বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 01712345678)"),
  whatsapp: z
    .string()
    .min(1, "হোয়াটসঅ্যাপ নম্বর আবশ্যক")
    .regex(bdPhoneRegex, "সঠিক বাংলাদেশি মোবাইল নম্বর দিন"),
  dateOfBirth: z
    .string()
    .min(1, "জন্ম তারিখ আবশ্যক")
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 10 && age <= 50;
    }, "বয়স ১০-৫০ বছরের মধ্যে হতে হবে"),
  gender: z.enum(genders, { errorMap: () => ({ message: "লিঙ্গ নির্বাচন করুন" }) }),
  bloodGroup: z.enum(bloodGroups, { errorMap: () => ({ message: "রক্তের গ্রুপ নির্বাচন করুন" }) }),

  // Nested Objects
  educationalInfo: educationalInfoSchema,
  guardian: guardianSchema,
  address: addressSchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: "পাসওয়ার্ড মিলছে না",
  path: ["confirmPassword"],
});

export type SignupFormData = z.infer<typeof signupSchema>;

// Export constants for dropdowns
export const BLOOD_GROUPS = bloodGroups;
export const BOARDS = boards;
export const GROUPS = groups;
export const GUARDIAN_TYPES = guardianTypes;
export const GENDERS = genders;

// Board names in Bengali
export const BOARD_NAMES: Record<string, string> = {
  dhaka: "ঢাকা",
  rajshahi: "রাজশাহী",
  chittagong: "চট্টগ্রাম",
  comilla: "কুমিল্লা",
  sylhet: "সিলেট",
  jessore: "যশোর",
  barishal: "বরিশাল",
  dinajpur: "দিনাজপুর",
  mymensingh: "ময়মনসিংহ",
  madrasa: "মাদ্রাসা",
  technical: "কারিগরি",
};

// Group names in Bengali
export const GROUP_NAMES: Record<string, string> = {
  science: "বিজ্ঞান",
  commerce: "ব্যবসায় শিক্ষা",
  arts: "মানবিক",
};

// Guardian type names in Bengali
export const GUARDIAN_TYPE_NAMES: Record<string, string> = {
  father: "বাবা",
  mother: "মা",
  brother: "ভাই",
  sister: "বোন",
  uncle: "চাচা/মামা",
  aunt: "চাচি/মামি",
  other: "অন্যান্য",
};

// Gender names in Bengali
export const GENDER_NAMES: Record<string, string> = {
  male: "পুরুষ",
  female: "মহিলা",
  other: "অন্যান্য",
};
