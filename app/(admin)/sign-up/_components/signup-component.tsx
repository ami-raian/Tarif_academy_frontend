"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  Phone,
  Calendar,
  Droplet,
  BookOpen,
  Users,
  MapPin,
  Eye,
  EyeOff,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  signupSchema,
  SignupFormData,
  BLOOD_GROUPS,
  BOARDS,
  GROUPS,
  GUARDIAN_TYPES,
  GENDERS,
  BOARD_NAMES,
  GROUP_NAMES,
  GUARDIAN_TYPE_NAMES,
  GENDER_NAMES,
} from "@/lib/validations/signup";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_TARIFACADEMY_API_URL ||
  "http://localhost:5000/api/v1";

const STEPS = [
  { id: 1, title: "ব্যক্তিগত তথ্য", icon: User },
  { id: 2, title: "SSC তথ্য", icon: BookOpen },
  { id: 3, title: "HSC তথ্য", icon: GraduationCap },
  { id: 4, title: "অভিভাবক ও ঠিকানা", icon: Users },
];

export default function SignUpComponent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    setValue,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      educationalInfo: {
        ssc: { gpa: 0, passingYear: new Date().getFullYear() },
        hsc: { gpa: 0, passingYear: new Date().getFullYear() + 2 },
      },
    },
  });

  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof SignupFormData | string)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = [
          "fullName",
          "email",
          "password",
          "confirmPassword",
          "mobile",
          "whatsapp",
          "dateOfBirth",
          "gender",
          "bloodGroup",
        ];
        break;
      case 2:
        fieldsToValidate = [
          "educationalInfo.ssc.roll",
          "educationalInfo.ssc.registration",
          "educationalInfo.ssc.schoolName",
          "educationalInfo.ssc.board",
          "educationalInfo.ssc.passingYear",
          "educationalInfo.ssc.group",
          "educationalInfo.ssc.gpa",
        ];
        break;
      case 3:
        fieldsToValidate = [
          "educationalInfo.hsc.roll",
          "educationalInfo.hsc.registration",
          "educationalInfo.hsc.collegeName",
          "educationalInfo.hsc.board",
          "educationalInfo.hsc.passingYear",
          "educationalInfo.hsc.group",
          "educationalInfo.hsc.gpa",
        ];
        break;
      case 4:
        fieldsToValidate = [
          "guardian.type",
          "guardian.name",
          "guardian.mobile",
          "guardian.occupation",
          "address.present",
          "address.district",
          "address.permanent",
        ];
        break;
    }

    const result = await trigger(fieldsToValidate as (keyof SignupFormData)[]);
    return result;
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError(null);

    // Remove confirmPassword before sending to API
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...submitData } = data;

    try {
      const response = await fetch(`${API_BASE_URL}/students/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
      } else {
        setError(
          result.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।",
        );
      }
    } catch {
      setError("নেটওয়ার্ক সমস্যা। আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন।");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-gray-100 to-purple-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            রেজিস্ট্রেশন সফল হয়েছে!
          </h2>
          <p className="text-gray-600 mb-6">
            আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে। এখন লগইন করুন।
          </p>
          <Link href="/login">
            <Button className="w-full bg-linear-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white">
              লগইন করুন
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-gray-100 to-purple-100 p-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-4xl">
        {/* Header */}
        <div className="bg-linear-to-r from-purple-600 to-cyan-500 p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Tarif Academy - রেজিস্ট্রেশন</h1>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between items-center mt-6">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex flex-col items-center ${
                    index !== STEPS.length - 1 ? "flex-1" : ""
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      currentStep >= step.id
                        ? "bg-white text-purple-600"
                        : "bg-white/30 text-white"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-xs mt-1 hidden sm:block">
                    {step.title}
                  </span>
                </div>
                {index !== STEPS.length - 1 && (
                  <div
                    className={`h-1 w-12 sm:w-20 mx-2 rounded ${
                      currentStep > step.id ? "bg-white" : "bg-white/30"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-purple-600" />
                ব্যক্তিগত তথ্য
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <Label htmlFor="fullName">পূর্ণ নাম *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="fullName"
                      {...register("fullName")}
                      placeholder="আপনার পূর্ণ নাম"
                      className="pl-10"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-xs text-red-500">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <Label htmlFor="email">ইমেইল *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="example@email.com"
                      className="pl-10"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <Label htmlFor="password">পাসওয়ার্ড *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      placeholder="কমপক্ষে ৬ অক্ষর"
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <Label htmlFor="confirmPassword">
                    পাসওয়ার্ড নিশ্চিত করুন *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword")}
                      placeholder="পাসওয়ার্ড আবার লিখুন"
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Mobile */}
                <div className="space-y-1">
                  <Label htmlFor="mobile">মোবাইল নম্বর *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="mobile"
                      {...register("mobile")}
                      placeholder="01712345678"
                      className="pl-10"
                    />
                  </div>
                  {errors.mobile && (
                    <p className="text-xs text-red-500">
                      {errors.mobile.message}
                    </p>
                  )}
                </div>

                {/* WhatsApp */}
                <div className="space-y-1">
                  <Label htmlFor="whatsapp">হোয়াটসঅ্যাপ নম্বর *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="whatsapp"
                      {...register("whatsapp")}
                      placeholder="01712345678"
                      className="pl-10"
                    />
                  </div>
                  {errors.whatsapp && (
                    <p className="text-xs text-red-500">
                      {errors.whatsapp.message}
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <div className="space-y-1">
                  <Label htmlFor="dateOfBirth">জন্ম তারিখ *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="dateOfBirth"
                      type="date"
                      {...register("dateOfBirth")}
                      className="pl-10"
                    />
                  </div>
                  {errors.dateOfBirth && (
                    <p className="text-xs text-red-500">
                      {errors.dateOfBirth.message}
                    </p>
                  )}
                </div>

                {/* Gender */}
                <div className="space-y-1">
                  <Label htmlFor="gender">লিঙ্গ *</Label>
                  <Select
                    value={watch("gender")}
                    onValueChange={(value) => setValue("gender", value as any)}
                  >
                    <SelectTrigger className="w-full h-10">
                      <SelectValue placeholder="নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENDERS.map((g) => (
                        <SelectItem key={g} value={g}>
                          {GENDER_NAMES[g]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="text-xs text-red-500">
                      {errors.gender.message}
                    </p>
                  )}
                </div>

                {/* Blood Group */}
                <div className="space-y-1">
                  <Label htmlFor="bloodGroup">রক্তের গ্রুপ *</Label>
                  <Select
                    value={watch("bloodGroup")}
                    onValueChange={(value) =>
                      setValue(
                        "bloodGroup",
                        value as (typeof BLOOD_GROUPS)[number],
                      )
                    }
                  >
                    <SelectTrigger className="w-full h-10">
                      <div className="flex items-center gap-2">
                        <Droplet className="w-4 h-4 text-gray-400" />
                        <SelectValue placeholder="নির্বাচন করুন" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {BLOOD_GROUPS.map((bg) => (
                        <SelectItem key={bg} value={bg}>
                          {bg}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.bloodGroup && (
                    <p className="text-xs text-red-500">
                      {errors.bloodGroup.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: SSC Info */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                SSC তথ্য
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>SSC রোল নম্বর *</Label>
                  <Input
                    {...register("educationalInfo.ssc.roll")}
                    placeholder="রোল নম্বর"
                  />
                  {errors.educationalInfo?.ssc?.roll && (
                    <p className="text-xs text-red-500">
                      {errors.educationalInfo.ssc.roll.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label>SSC রেজিস্ট্রেশন নম্বর *</Label>
                  <Input
                    {...register("educationalInfo.ssc.registration")}
                    placeholder="রেজিস্ট্রেশন নম্বর"
                  />
                  {errors.educationalInfo?.ssc?.registration && (
                    <p className="text-xs text-red-500">
                      {errors.educationalInfo.ssc.registration.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1 md:col-span-2">
                  <Label>স্কুলের নাম *</Label>
                  <Input
                    {...register("educationalInfo.ssc.schoolName")}
                    placeholder="আপনার স্কুলের নাম"
                  />
                  {errors.educationalInfo?.ssc?.schoolName && (
                    <p className="text-xs text-red-500">
                      {errors.educationalInfo.ssc.schoolName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label>বোর্ড *</Label>
                  <Select
                    value={watch("educationalInfo.ssc.board")}
                    onValueChange={(value) =>
                      setValue("educationalInfo.ssc.board", value as any)
                    }
                  >
                    <SelectTrigger className="w-full h-10">
                      <SelectValue placeholder="বোর্ড নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {BOARDS.map((b) => (
                        <SelectItem key={b} value={b}>
                          {BOARD_NAMES[b]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.educationalInfo?.ssc?.board && (
                    <p className="text-xs text-red-500">
                      {errors.educationalInfo.ssc.board.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label>বিভাগ *</Label>
                  <Select
                    value={watch("educationalInfo.ssc.group")}
                    onValueChange={(value) =>
                      setValue("educationalInfo.ssc.group", value as any)
                    }
                  >
                    <SelectTrigger className="w-full h-10">
                      <SelectValue placeholder="বিভাগ নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {GROUPS.map((g) => (
                        <SelectItem key={g} value={g}>
                          {GROUP_NAMES[g]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.educationalInfo?.ssc?.group && (
                    <p className="text-xs text-red-500">
                      {errors.educationalInfo.ssc.group.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label>পাশের সাল *</Label>
                  <Input
                    type="number"
                    {...register("educationalInfo.ssc.passingYear", {
                      valueAsNumber: true,
                    })}
                    placeholder="2024"
                  />
                  {errors.educationalInfo?.ssc?.passingYear && (
                    <p className="text-xs text-red-500">
                      {errors.educationalInfo.ssc.passingYear.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label>GPA *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register("educationalInfo.ssc.gpa", {
                      valueAsNumber: true,
                    })}
                    placeholder="5.00"
                  />
                  {errors.educationalInfo?.ssc?.gpa && (
                    <p className="text-xs text-red-500">
                      {errors.educationalInfo.ssc.gpa.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: HSC Info */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                HSC তথ্য
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>HSC রোল নম্বর *</Label>
                  <Input
                    {...register("educationalInfo.hsc.roll")}
                    placeholder="রোল নম্বর"
                  />
                  {errors.educationalInfo?.hsc?.roll && (
                    <p className="text-xs text-red-500">
                      {errors.educationalInfo.hsc.roll.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label>HSC রেজিস্ট্রেশন নম্বর *</Label>
                  <Input
                    {...register("educationalInfo.hsc.registration")}
                    placeholder="রেজিস্ট্রেশন নম্বর"
                  />
                  {errors.educationalInfo?.hsc?.registration && (
                    <p className="text-xs text-red-500">
                      {errors.educationalInfo.hsc.registration.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1 md:col-span-2">
                  <Label>কলেজের নাম *</Label>
                  <Input
                    {...register("educationalInfo.hsc.collegeName")}
                    placeholder="আপনার কলেজের নাম"
                  />
                  {errors.educationalInfo?.hsc?.collegeName && (
                    <p className="text-xs text-red-500">
                      {errors.educationalInfo.hsc.collegeName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label>বোর্ড *</Label>
                  <Select
                    value={watch("educationalInfo.hsc.board")}
                    onValueChange={(value) =>
                      setValue("educationalInfo.hsc.board", value as any)
                    }
                  >
                    <SelectTrigger className="w-full h-10">
                      <SelectValue placeholder="বোর্ড নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {BOARDS.map((b) => (
                        <SelectItem key={b} value={b}>
                          {BOARD_NAMES[b]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.educationalInfo?.hsc?.board && (
                    <p className="text-xs text-red-500">
                      {errors.educationalInfo.hsc.board.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label>বিভাগ *</Label>
                  <Select
                    value={watch("educationalInfo.hsc.group")}
                    onValueChange={(value) =>
                      setValue("educationalInfo.hsc.group", value as any)
                    }
                  >
                    <SelectTrigger className="w-full h-10">
                      <SelectValue placeholder="বিভাগ নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {GROUPS.map((g) => (
                        <SelectItem key={g} value={g}>
                          {GROUP_NAMES[g]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.educationalInfo?.hsc?.group && (
                    <p className="text-xs text-red-500">
                      {errors.educationalInfo.hsc.group.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label>পাশের সাল *</Label>
                  <Input
                    type="number"
                    {...register("educationalInfo.hsc.passingYear", {
                      valueAsNumber: true,
                    })}
                    placeholder="2026"
                  />
                  {errors.educationalInfo?.hsc?.passingYear && (
                    <p className="text-xs text-red-500">
                      {errors.educationalInfo.hsc.passingYear.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label>GPA *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register("educationalInfo.hsc.gpa", {
                      valueAsNumber: true,
                    })}
                    placeholder="5.00"
                  />
                  {errors.educationalInfo?.hsc?.gpa && (
                    <p className="text-xs text-red-500">
                      {errors.educationalInfo.hsc.gpa.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Guardian & Address */}
          {currentStep === 4 && (
            <div className="space-y-6">
              {/* Guardian Info */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  অভিভাবকের তথ্য
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>অভিভাবকের ধরন *</Label>
                    <Select
                      value={watch("guardian.type")}
                      onValueChange={(value) =>
                        setValue("guardian.type", value as any)
                      }
                    >
                      <SelectTrigger className="w-full h-10">
                        <SelectValue placeholder="নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        {GUARDIAN_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {GUARDIAN_TYPE_NAMES[t]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.guardian?.type && (
                      <p className="text-xs text-red-500">
                        {errors.guardian.type.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label>অভিভাবকের নাম *</Label>
                    <Input
                      {...register("guardian.name")}
                      placeholder="অভিভাবকের পূর্ণ নাম"
                    />
                    {errors.guardian?.name && (
                      <p className="text-xs text-red-500">
                        {errors.guardian.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label>অভিভাবকের মোবাইল *</Label>
                    <Input
                      {...register("guardian.mobile")}
                      placeholder="01712345678"
                    />
                    {errors.guardian?.mobile && (
                      <p className="text-xs text-red-500">
                        {errors.guardian.mobile.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label>পেশা *</Label>
                    <Input
                      {...register("guardian.occupation")}
                      placeholder="অভিভাবকের পেশা"
                    />
                    {errors.guardian?.occupation && (
                      <p className="text-xs text-red-500">
                        {errors.guardian.occupation.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Info */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  ঠিকানা
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1 md:col-span-2">
                    <Label>বর্তমান ঠিকানা *</Label>
                    <Input
                      {...register("address.present")}
                      placeholder="বাড়ি নং, রোড নং, এলাকা"
                    />
                    {errors.address?.present && (
                      <p className="text-xs text-red-500">
                        {errors.address.present.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label>জেলা *</Label>
                    <Input
                      {...register("address.district")}
                      placeholder="জেলার নাম"
                    />
                    {errors.address?.district && (
                      <p className="text-xs text-red-500">
                        {errors.address.district.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <Label>স্থায়ী ঠিকানা *</Label>
                    <Input
                      {...register("address.permanent")}
                      placeholder="গ্রাম, উপজেলা, জেলা"
                    />
                    {errors.address?.permanent && (
                      <p className="text-xs text-red-500">
                        {errors.address.permanent.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-100 border border-red-300 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              পেছনে
            </Button>

            {currentStep < 4 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white"
              >
                পরবর্তী
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    রেজিস্ট্রেশন হচ্ছে...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    রেজিস্ট্রেশন করুন
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
              <Link
                href="/login"
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                লগইন করুন
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
