"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getStudent } from "@/lib/api";
import type { Student } from "@/types";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  GraduationCap,
  Users,
  Pencil,
  ShieldCheck,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function StudentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const response = await getStudent(studentId);
        if (response.success) {
          setStudent(response.data);
        } else {
          console.error("Failed to fetch student:", response.message);
          router.push("/dashboard/students");
        }
      } catch (error) {
        console.error("Error fetching student:", error);
        router.push("/dashboard/students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId, router]);

  const genderMap: Record<string, string> = {
    male: "পুরুষ",
    female: "মহিলা",
    other: "অন্যান্য",
  };

  const boardMap: Record<string, string> = {
    dhaka: "ঢাকা",
    rajshahi: "রাজশাহী",
    chittagong: "চট্টগ্রাম",
    sylhet: "সিলেট",
    barishal: "বরিশাল",
    khulna: "খুলনা",
    dinajpur: "দিনাজপুর",
    comilla: "কুমিল্লা",
    jessore: "যশোর",
    mymensingh: "ময়মনসিংহ",
    technical: "টেকনিক্যাল",
    madrasah: "মাদ্রাসা",
  };

  const groupMap: Record<string, string> = {
    science: "বিজ্ঞান",
    commerce: "বাণিজ্য",
    arts: "মানবিক",
  };

  const guardianTypeMap: Record<string, string> = {
    father: "পিতা",
    mother: "মাতা",
    brother: "ভাই",
    sister: "বোন",
    uncle: "চাচা/মামা",
    aunt: "খালা/ফুফু",
    other: "অন্যান্য",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
          <p className="text-slate-600 dark:text-gray-300 font-medium">
            লোড হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-600 dark:text-gray-300">
          শিক্ষার্থী পাওয়া যায়নি
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="sticky top-14 lg:top-0 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/students">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  ফিরে যান
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                  শিক্ষার্থীর বিস্তারিত
                </h1>
                <p className="text-xs text-slate-500 dark:text-gray-400">
                  রোল নং: {student.roll}
                </p>
              </div>
            </div>
            <Link href={`/dashboard/students/edit/${student._id}`}>
              <Button size="sm">
                <Pencil className="w-4 h-4 mr-2" />
                সম্পাদনা
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Personal Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              ব্যক্তিগত তথ্য
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-slate-500 dark:text-gray-400">
                পূর্ণ নাম
              </label>
              <p className="text-lg font-semibold text-slate-900 dark:text-white mt-1">
                {student.fullName}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500 dark:text-gray-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                ইমেইল
              </label>
              <p className="text-slate-900 dark:text-white mt-1">
                {student.email}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500 dark:text-gray-400 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                মোবাইল
              </label>
              <p className="text-slate-900 dark:text-white mt-1">
                {student.mobile}
              </p>
            </div>
            {student.whatsapp && (
              <div>
                <label className="text-sm font-medium text-slate-500 dark:text-gray-400">
                  হোয়াটসঅ্যাপ
                </label>
                <p className="text-slate-900 dark:text-white mt-1">
                  {student.whatsapp}
                </p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-slate-500 dark:text-gray-400 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                জন্ম তারিখ
              </label>
              <p className="text-slate-900 dark:text-white mt-1">
                {new Date(student.dateOfBirth).toLocaleDateString("bn-BD")}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500 dark:text-gray-400">
                লিঙ্গ
              </label>
              <p className="text-slate-900 dark:text-white mt-1">
                {genderMap[student.gender] || student.gender}
              </p>
            </div>
            {student.bloodGroup && (
              <div>
                <label className="text-sm font-medium text-slate-500 dark:text-gray-400">
                  রক্তের গ্রুপ
                </label>
                <p className="text-slate-900 dark:text-white mt-1">
                  {student.bloodGroup}
                </p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-slate-500 dark:text-gray-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                ভেরিফিকেশন স্ট্যাটাস
              </label>
              <div className="mt-1">
                {student.isVerified ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                    <CheckCircle className="w-3 h-3" />
                    ভেরিফাইড
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                    <XCircle className="w-3 h-3" />
                    আনভেরিফাইড
                  </span>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500 dark:text-gray-400">
                অ্যাকাউন্ট স্ট্যাটাস
              </label>
              <div className="mt-1">
                {student.isActive ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                    <CheckCircle className="w-3 h-3" />
                    সক্রিয়
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                    <XCircle className="w-3 h-3" />
                    নিষ্ক্রিয়
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Educational Info */}
        {student.educationalInfo && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                শিক্ষাগত তথ্য
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* SSC Info */}
              {student.educationalInfo.ssc && (
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                    এসএসসি তথ্য
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {student.educationalInfo.ssc.roll && (
                      <div>
                        <label className="text-sm font-medium text-slate-500 dark:text-gray-400">
                          রোল
                        </label>
                        <p className="text-slate-900 dark:text-white mt-1">
                          {student.educationalInfo.ssc.roll}
                        </p>
                      </div>
                    )}
                    {student.educationalInfo.ssc.registration && (
                      <div>
                        <label className="text-sm font-medium text-slate-500 dark:text-gray-400">
                          রেজিস্ট্রেশন
                        </label>
                        <p className="text-slate-900 dark:text-white mt-1">
                          {student.educationalInfo.ssc.registration}
                        </p>
                      </div>
                    )}
                    {student.educationalInfo.ssc.board && (
                      <div>
                        <label className="text-sm font-medium text-slate-500 dark:text-gray-400">
                          বোর্ড
                        </label>
                        <p className="text-slate-900 dark:text-white mt-1">
                          {boardMap[student.educationalInfo.ssc.board] ||
                            student.educationalInfo.ssc.board}
                        </p>
                      </div>
                    )}
                    {student.educationalInfo.ssc.schoolName && (
                      <div>
                        <label className="text-sm font-medium text-slate-500 dark:text-gray-400">
                          স্কুলের নাম
                        </label>
                        <p className="text-slate-900 dark:text-white mt-1">
                          {student.educationalInfo.ssc.schoolName}
                        </p>
                      </div>
                    )}
                    {student.educationalInfo.ssc.passingYear && (
                      <div>
                        <label className="text-sm font-medium text-slate-500 dark:text-gray-400">
                          পাশের বছর
                        </label>
                        <p className="text-slate-900 dark:text-white mt-1">
                          {student.educationalInfo.ssc.passingYear}
                        </p>
                      </div>
                    )}
                    {student.educationalInfo.ssc.group && (
                      <div>
                        <label className="text-sm font-medium text-slate-500 dark:text-gray-400">
                          বিভাগ
                        </label>
                        <p className="text-slate-900 dark:text-white mt-1">
                          {groupMap[student.educationalInfo.ssc.group] ||
                            student.educationalInfo.ssc.group}
                        </p>
                      </div>
                    )}
                    {student.educationalInfo.ssc.gpa && (
                      <div>
                        <label className="text-sm font-medium text-slate-500 dark:text-gray-400">
                          GPA
                        </label>
                        <p className="text-slate-900 dark:text-white mt-1">
                          {student.educationalInfo.ssc.gpa}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* HSC Info */}
              {student.educationalInfo.hsc && (
                <div className="pt-6 border-t dark:border-gray-700">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                    এইচএসসি তথ্য
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {student.educationalInfo.hsc.roll && (
                      <div>
                        <label className="text-sm font-medium text-slate-500 dark:text-gray-400">
                          রোল
                        </label>
                        <p className="text-slate-900 dark:text-white mt-1">
                          {student.educationalInfo.hsc.roll}
                        </p>
                      </div>
                    )}
                    {student.educationalInfo.hsc.registration && (
                      <div>
                        <label className="text-sm font-medium text-slate-500 dark:text-gray-400">
                          রেজিস্ট্রেশন
                        </label>
                        <p className="text-slate-900 dark:text-white mt-1">
                          {student.educationalInfo.hsc.registration}
                        </p>
                      </div>
                    )}
                    {student.educationalInfo.hsc.board && (
                      <div>
                        <label className="text-sm font-medium text-slate-500 dark:text-gray-400">
                          বোর্ড
                        </label>
                        <p className="text-slate-900 dark:text-white mt-1">
                          {boardMap[student.educationalInfo.hsc.board] ||
                            student.educationalInfo.hsc.board}
                        </p>
                      </div>
                    )}
                    {student.educationalInfo.hsc.collegeName && (
                      <div>
                        <label className="text-sm font-medium text-slate-500 dark:text-gray-400">
                          কলেজের নাম
                        </label>
                        <p className="text-slate-900 dark:text-white mt-1">
                          {student.educationalInfo.hsc.collegeName}
                        </p>
                      </div>
                    )}
                    {student.educationalInfo.hsc.passingYear && (
                      <div>
                        <label className="text-sm font-medium text-slate-500 dark:text-gray-400">
                          পাশের বছর
                        </label>
                        <p className="text-slate-900 dark:text-white mt-1">
                          {student.educationalInfo.hsc.passingYear}
                        </p>
                      </div>
                    )}
                    {student.educationalInfo.hsc.group && (
                      <div>
                        <label className="text-sm font-medium text-slate-500 dark:text-gray-400">
                          বিভাগ
                        </label>
                        <p className="text-slate-900 dark:text-white mt-1">
                          {groupMap[student.educationalInfo.hsc.group] ||
                            student.educationalInfo.hsc.group}
                        </p>
                      </div>
                    )}
                    {student.educationalInfo.hsc.gpa && (
                      <div>
                        <label className="text-sm font-medium text-slate-500 dark:text-gray-400">
                          GPA
                        </label>
                        <p className="text-slate-900 dark:text-white mt-1">
                          {student.educationalInfo.hsc.gpa}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Guardian Info */}
        {student.guardian && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                অভিভাবক তথ্য
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-500 dark:text-gray-400">
                  অভিভাবকের ধরণ
                </label>
                <p className="text-slate-900 dark:text-white mt-1">
                  {guardianTypeMap[student.guardian.type] ||
                    student.guardian.type}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500 dark:text-gray-400">
                  নাম
                </label>
                <p className="text-slate-900 dark:text-white mt-1">
                  {student.guardian.name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500 dark:text-gray-400">
                  মোবাইল
                </label>
                <p className="text-slate-900 dark:text-white mt-1">
                  {student.guardian.mobile}
                </p>
              </div>
              {student.guardian.occupation && (
                <div>
                  <label className="text-sm font-medium text-slate-500 dark:text-gray-400">
                    পেশা
                  </label>
                  <p className="text-slate-900 dark:text-white mt-1">
                    {student.guardian.occupation}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Address */}
        {student.address && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                ঠিকানা
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-500 dark:text-gray-400">
                  বর্তমান ঠিকানা
                </label>
                <p className="text-slate-900 dark:text-white mt-1">
                  {student.address.present}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500 dark:text-gray-400">
                  জেলা
                </label>
                <p className="text-slate-900 dark:text-white mt-1">
                  {student.address.district}
                </p>
              </div>
              {student.address.permanent && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-slate-500 dark:text-gray-400">
                    স্থায়ী ঠিকানা
                  </label>
                  <p className="text-slate-900 dark:text-white mt-1">
                    {student.address.permanent}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>অন্যান্য তথ্য</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-500 dark:text-gray-400">
                যোগদানের তারিখ
              </label>
              <p className="text-slate-900 dark:text-white mt-1">
                {new Date(student.createdAt).toLocaleDateString("bn-BD", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500 dark:text-gray-400">
                সর্বশেষ আপডেট
              </label>
              <p className="text-slate-900 dark:text-white mt-1">
                {new Date(student.updatedAt).toLocaleDateString("bn-BD", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
