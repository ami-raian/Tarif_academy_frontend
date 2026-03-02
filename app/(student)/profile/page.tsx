"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getStudentProfile, updateStudentProfile } from "@/lib/api";
import type { Student } from "@/types";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Edit2,
  Save,
  X,
  GraduationCap,
  Users,
  MapPin,
  Droplets,
  IdCard,
  ArrowLeft,
} from "lucide-react";

export default function StudentProfilePage() {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    whatsapp: "",
    bloodGroup: "",
    nidOrBirthCert: "",
    // Educational Info - SSC
    sscRoll: "",
    sscRegistration: "",
    sscSchoolName: "",
    sscBoard: "",
    sscPassingYear: "",
    sscGroup: "",
    sscGpa: "",
    // Educational Info - HSC
    hscRoll: "",
    hscRegistration: "",
    hscCollegeName: "",
    hscBoard: "",
    hscPassingYear: "",
    hscGroup: "",
    hscGpa: "",
    // Guardian
    guardianType: "",
    guardianName: "",
    guardianMobile: "",
    guardianOccupation: "",
    // Address
    presentAddress: "",
    district: "",
    permanentAddress: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getStudentProfile();
      if (response.success) {
        const s = response.data;
        setStudent(s);
        populateForm(s);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const populateForm = (s: Student) => {
    setFormData({
      fullName: s.fullName || "",
      mobile: s.mobile || "",
      whatsapp: s.whatsapp || "",
      bloodGroup: s.bloodGroup || "",
      nidOrBirthCert: s.nidOrBirthCert || "",
      // SSC
      sscRoll: s.educationalInfo?.ssc?.roll || "",
      sscRegistration: s.educationalInfo?.ssc?.registration || "",
      sscSchoolName: s.educationalInfo?.ssc?.schoolName || "",
      sscBoard: s.educationalInfo?.ssc?.board || "",
      sscPassingYear: s.educationalInfo?.ssc?.passingYear?.toString() || "",
      sscGroup: s.educationalInfo?.ssc?.group || "",
      sscGpa: s.educationalInfo?.ssc?.gpa?.toString() || "",
      // HSC
      hscRoll: s.educationalInfo?.hsc?.roll || "",
      hscRegistration: s.educationalInfo?.hsc?.registration || "",
      hscCollegeName: s.educationalInfo?.hsc?.collegeName || "",
      hscBoard: s.educationalInfo?.hsc?.board || "",
      hscPassingYear: s.educationalInfo?.hsc?.passingYear?.toString() || "",
      hscGroup: s.educationalInfo?.hsc?.group || "",
      hscGpa: s.educationalInfo?.hsc?.gpa?.toString() || "",
      // Guardian
      guardianType: s.guardian?.type || "",
      guardianName: s.guardian?.name || "",
      guardianMobile: s.guardian?.mobile || "",
      guardianOccupation: s.guardian?.occupation || "",
      // Address
      presentAddress: s.address?.present || "",
      district: s.address?.district || "",
      permanentAddress: s.address?.permanent || "",
    });
  };

  const handleCancel = () => {
    if (student) {
      populateForm(student);
    }
    setEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Educational Info
      const educationalInfo: Record<string, unknown> = {};

      if (formData.sscRoll || formData.sscBoard) {
        educationalInfo.ssc = {
          roll: formData.sscRoll || undefined,
          registration: formData.sscRegistration || undefined,
          schoolName: formData.sscSchoolName || undefined,
          board: formData.sscBoard || undefined,
          passingYear: formData.sscPassingYear
            ? parseInt(formData.sscPassingYear)
            : undefined,
          group: formData.sscGroup || undefined,
          gpa: formData.sscGpa ? parseFloat(formData.sscGpa) : undefined,
        };
      }

      if (formData.hscRoll || formData.hscBoard) {
        educationalInfo.hsc = {
          roll: formData.hscRoll || undefined,
          registration: formData.hscRegistration || undefined,
          collegeName: formData.hscCollegeName || undefined,
          board: formData.hscBoard || undefined,
          passingYear: formData.hscPassingYear
            ? parseInt(formData.hscPassingYear)
            : undefined,
          group: formData.hscGroup || undefined,
          gpa: formData.hscGpa ? parseFloat(formData.hscGpa) : undefined,
        };
      }

      // Guardian
      const guardian =
        formData.guardianName && formData.guardianMobile
          ? {
              type: formData.guardianType || undefined,
              name: formData.guardianName,
              mobile: formData.guardianMobile,
              occupation: formData.guardianOccupation || undefined,
            }
          : undefined;

      // Address
      const address =
        formData.presentAddress && formData.district
          ? {
              present: formData.presentAddress,
              district: formData.district,
              permanent: formData.permanentAddress || undefined,
            }
          : undefined;

      const updateData: Record<string, unknown> = {
        fullName: formData.fullName,
        mobile: formData.mobile,
        whatsapp: formData.whatsapp || undefined,
        bloodGroup: formData.bloodGroup || undefined,
        nidOrBirthCert: formData.nidOrBirthCert || undefined,
        educationalInfo,
        guardian,
        address,
      };

      const response = await updateStudentProfile(updateData);

      if (response.success) {
        setStudent(response.data);
        setEditing(false);
        alert("প্রোফাইল সফলভাবে আপডেট হয়েছে");
      } else {
        alert(response.message || "আপডেট করতে সমস্যা হয়েছে");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("আপডেট করতে সমস্যা হয়েছে");
    } finally {
      setSaving(false);
    }
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
          প্রোফাইল পাওয়া যায়নি
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.back()}
                className="shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="w-16 h-16 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {student.fullName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {student.fullName}
                </h1>
                <p className="text-sm text-slate-500 dark:text-gray-400">
                  রোল নং: {student.roll} | {student.email}
                </p>
              </div>
            </div>
            {!editing && (
              <Button onClick={() => setEditing(true)}>
                <Edit2 className="w-4 h-4 mr-2" />
                সম্পাদনা
              </Button>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                ব্যক্তিগত তথ্য
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editing ? (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">পূর্ণ নাম *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mobile">মোবাইল *</Label>
                    <Input
                      id="mobile"
                      value={formData.mobile}
                      onChange={(e) =>
                        setFormData({ ...formData, mobile: e.target.value })
                      }
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="whatsapp">হোয়াটসঅ্যাপ</Label>
                    <Input
                      id="whatsapp"
                      value={formData.whatsapp}
                      onChange={(e) =>
                        setFormData({ ...formData, whatsapp: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bloodGroup">রক্তের গ্রুপ</Label>
                    <Select
                      value={formData.bloodGroup}
                      onValueChange={(value) =>
                        setFormData({ ...formData, bloodGroup: value })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="nid">NID/জন্ম নিবন্ধন</Label>
                    <Input
                      id="nid"
                      value={formData.nidOrBirthCert}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nidOrBirthCert: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  <InfoRow
                    icon={<User className="w-4 h-4" />}
                    label="পূর্ণ নাম"
                    value={student.fullName}
                  />
                  <InfoRow
                    icon={<Mail className="w-4 h-4" />}
                    label="ইমেইল"
                    value={student.email}
                  />
                  <InfoRow
                    icon={<Phone className="w-4 h-4" />}
                    label="মোবাইল"
                    value={student.mobile}
                  />
                  <InfoRow
                    icon={<Phone className="w-4 h-4" />}
                    label="হোয়াটসঅ্যাপ"
                    value={student.whatsapp || "—"}
                  />
                  <InfoRow
                    icon={<Calendar className="w-4 h-4" />}
                    label="জন্ম তারিখ"
                    value={
                      student.dateOfBirth
                        ? new Date(student.dateOfBirth).toLocaleDateString(
                            "bn-BD",
                          )
                        : "—"
                    }
                  />
                  <InfoRow
                    icon={<Droplets className="w-4 h-4" />}
                    label="রক্তের গ্রুপ"
                    value={student.bloodGroup || "—"}
                  />
                  <InfoRow
                    icon={<IdCard className="w-4 h-4" />}
                    label="NID/জন্ম নিবন্ধন"
                    value={student.nidOrBirthCert || "—"}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* SSC Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                এসএসসি তথ্য
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editing ? (
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="sscRoll">রোল</Label>
                    <Input
                      id="sscRoll"
                      value={formData.sscRoll}
                      onChange={(e) =>
                        setFormData({ ...formData, sscRoll: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sscRegistration">রেজিস্ট্রেশন</Label>
                    <Input
                      id="sscRegistration"
                      value={formData.sscRegistration}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sscRegistration: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sscBoard">বোর্ড</Label>
                    <Select
                      value={formData.sscBoard}
                      onValueChange={(value) =>
                        setFormData({ ...formData, sscBoard: value })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dhaka">ঢাকা</SelectItem>
                        <SelectItem value="rajshahi">রাজশাহী</SelectItem>
                        <SelectItem value="chittagong">চট্টগ্রাম</SelectItem>
                        <SelectItem value="sylhet">সিলেট</SelectItem>
                        <SelectItem value="barishal">বরিশাল</SelectItem>
                        <SelectItem value="khulna">খুলনা</SelectItem>
                        <SelectItem value="dinajpur">দিনাজপুর</SelectItem>
                        <SelectItem value="comilla">কুমিল্লা</SelectItem>
                        <SelectItem value="jessore">যশোর</SelectItem>
                        <SelectItem value="mymensingh">ময়মনসিংহ</SelectItem>
                        <SelectItem value="technical">টেকনিক্যাল</SelectItem>
                        <SelectItem value="madrasah">মাদ্রাসা</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="sscSchoolName">স্কুলের নাম</Label>
                    <Input
                      id="sscSchoolName"
                      value={formData.sscSchoolName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sscSchoolName: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sscPassingYear">পাশের বছর</Label>
                    <Input
                      id="sscPassingYear"
                      type="number"
                      value={formData.sscPassingYear}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sscPassingYear: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sscGroup">বিভাগ</Label>
                    <Select
                      value={formData.sscGroup}
                      onValueChange={(value) =>
                        setFormData({ ...formData, sscGroup: value })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="science">বিজ্ঞান</SelectItem>
                        <SelectItem value="commerce">বাণিজ্য</SelectItem>
                        <SelectItem value="arts">মানবিক</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="sscGpa">GPA</Label>
                    <Input
                      id="sscGpa"
                      type="number"
                      step="0.01"
                      value={formData.sscGpa}
                      onChange={(e) =>
                        setFormData({ ...formData, sscGpa: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-4">
                  <InfoRow
                    label="রোল"
                    value={student.educationalInfo?.ssc?.roll || "—"}
                  />
                  <InfoRow
                    label="রেজিস্ট্রেশন"
                    value={student.educationalInfo?.ssc?.registration || "—"}
                  />
                  <InfoRow
                    label="বোর্ড"
                    value={student.educationalInfo?.ssc?.board || "—"}
                  />
                  <InfoRow
                    label="স্কুলের নাম"
                    value={student.educationalInfo?.ssc?.schoolName || "—"}
                  />
                  <InfoRow
                    label="পাশের বছর"
                    value={
                      student.educationalInfo?.ssc?.passingYear?.toString() ||
                      "—"
                    }
                  />
                  <InfoRow
                    label="বিভাগ"
                    value={student.educationalInfo?.ssc?.group || "—"}
                  />
                  <InfoRow
                    label="GPA"
                    value={student.educationalInfo?.ssc?.gpa?.toString() || "—"}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* HSC Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                এইচএসসি তথ্য
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editing ? (
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="hscRoll">রোল</Label>
                    <Input
                      id="hscRoll"
                      value={formData.hscRoll}
                      onChange={(e) =>
                        setFormData({ ...formData, hscRoll: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hscRegistration">রেজিস্ট্রেশন</Label>
                    <Input
                      id="hscRegistration"
                      value={formData.hscRegistration}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hscRegistration: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hscBoard">বোর্ড</Label>
                    <Select
                      value={formData.hscBoard}
                      onValueChange={(value) =>
                        setFormData({ ...formData, hscBoard: value })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dhaka">ঢাকা</SelectItem>
                        <SelectItem value="rajshahi">রাজশাহী</SelectItem>
                        <SelectItem value="chittagong">চট্টগ্রাম</SelectItem>
                        <SelectItem value="sylhet">সিলেট</SelectItem>
                        <SelectItem value="barishal">বরিশাল</SelectItem>
                        <SelectItem value="khulna">খুলনা</SelectItem>
                        <SelectItem value="dinajpur">দিনাজপুর</SelectItem>
                        <SelectItem value="comilla">কুমিল্লা</SelectItem>
                        <SelectItem value="jessore">যশোর</SelectItem>
                        <SelectItem value="mymensingh">ময়মনসিংহ</SelectItem>
                        <SelectItem value="technical">টেকনিক্যাল</SelectItem>
                        <SelectItem value="madrasah">মাদ্রাসা</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="hscCollegeName">কলেজের নাম</Label>
                    <Input
                      id="hscCollegeName"
                      value={formData.hscCollegeName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hscCollegeName: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hscPassingYear">পাশের বছর</Label>
                    <Input
                      id="hscPassingYear"
                      type="number"
                      value={formData.hscPassingYear}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hscPassingYear: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hscGroup">বিভাগ</Label>
                    <Select
                      value={formData.hscGroup}
                      onValueChange={(value) =>
                        setFormData({ ...formData, hscGroup: value })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="science">বিজ্ঞান</SelectItem>
                        <SelectItem value="commerce">বাণিজ্য</SelectItem>
                        <SelectItem value="arts">মানবিক</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="hscGpa">GPA</Label>
                    <Input
                      id="hscGpa"
                      type="number"
                      step="0.01"
                      value={formData.hscGpa}
                      onChange={(e) =>
                        setFormData({ ...formData, hscGpa: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-4">
                  <InfoRow
                    label="রোল"
                    value={student.educationalInfo?.hsc?.roll || "—"}
                  />
                  <InfoRow
                    label="রেজিস্ট্রেশন"
                    value={student.educationalInfo?.hsc?.registration || "—"}
                  />
                  <InfoRow
                    label="বোর্ড"
                    value={student.educationalInfo?.hsc?.board || "—"}
                  />
                  <InfoRow
                    label="কলেজের নাম"
                    value={student.educationalInfo?.hsc?.collegeName || "—"}
                  />
                  <InfoRow
                    label="পাশের বছর"
                    value={
                      student.educationalInfo?.hsc?.passingYear?.toString() ||
                      "—"
                    }
                  />
                  <InfoRow
                    label="বিভাগ"
                    value={student.educationalInfo?.hsc?.group || "—"}
                  />
                  <InfoRow
                    label="GPA"
                    value={student.educationalInfo?.hsc?.gpa?.toString() || "—"}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Guardian Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                অভিভাবক তথ্য
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editing ? (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="guardianType">অভিভাবকের ধরণ</Label>
                    <Select
                      value={formData.guardianType}
                      onValueChange={(value) =>
                        setFormData({ ...formData, guardianType: value })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="father">পিতা</SelectItem>
                        <SelectItem value="mother">মাতা</SelectItem>
                        <SelectItem value="brother">ভাই</SelectItem>
                        <SelectItem value="sister">বোন</SelectItem>
                        <SelectItem value="uncle">চাচা/মামা</SelectItem>
                        <SelectItem value="aunt">খালা/ফুফু</SelectItem>
                        <SelectItem value="other">অন্যান্য</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="guardianName">নাম</Label>
                    <Input
                      id="guardianName"
                      value={formData.guardianName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          guardianName: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="guardianMobile">মোবাইল</Label>
                    <Input
                      id="guardianMobile"
                      value={formData.guardianMobile}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          guardianMobile: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="guardianOccupation">পেশা</Label>
                    <Input
                      id="guardianOccupation"
                      value={formData.guardianOccupation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          guardianOccupation: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  <InfoRow
                    label="অভিভাবকের ধরণ"
                    value={student.guardian?.type || "—"}
                  />
                  <InfoRow label="নাম" value={student.guardian?.name || "—"} />
                  <InfoRow
                    label="মোবাইল"
                    value={student.guardian?.mobile || "—"}
                  />
                  <InfoRow
                    label="পেশা"
                    value={student.guardian?.occupation || "—"}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                ঠিকানা
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editing ? (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="presentAddress">বর্তমান ঠিকানা</Label>
                    <Textarea
                      id="presentAddress"
                      value={formData.presentAddress}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          presentAddress: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="district">জেলা</Label>
                    <Input
                      id="district"
                      value={formData.district}
                      onChange={(e) =>
                        setFormData({ ...formData, district: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="permanentAddress">স্থায়ী ঠিকানা</Label>
                    <Textarea
                      id="permanentAddress"
                      value={formData.permanentAddress}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          permanentAddress: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  <InfoRow
                    label="বর্তমান ঠিকানা"
                    value={student.address?.present || "—"}
                  />
                  <InfoRow
                    label="জেলা"
                    value={student.address?.district || "—"}
                  />
                  <InfoRow
                    label="স্থায়ী ঠিকানা"
                    value={student.address?.permanent || "—"}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {editing && (
            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                বাতিল
              </Button>
              <Button type="submit" disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
              </Button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      {icon && (
        <span className="text-slate-400 dark:text-gray-500 mt-0.5">{icon}</span>
      )}
      <div>
        <p className="text-xs text-slate-500 dark:text-gray-400">{label}</p>
        <p className="text-sm font-medium text-slate-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}
