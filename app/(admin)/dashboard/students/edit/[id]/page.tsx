"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
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
import { getStudent, updateStudent } from "@/lib/api";
import type { Student } from "@/types";
import { ArrowLeft, Save } from "lucide-react";

export default function EditStudentPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    whatsapp: "",
    bloodGroup: "",
    dateOfBirth: "",
    gender: "",
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
    guardianRelation: "",
    // Address
    presentAddress: "",
    district: "",
    permanentAddress: "",
  });

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const response = await getStudent(studentId);
        if (response.success) {
          const s = response.data;
          setStudent(s);

          // Populate form with existing data
          setFormData({
            fullName: s.fullName || "",
            mobile: s.mobile || "",
            whatsapp: s.whatsapp || "",
            bloodGroup: s.bloodGroup || "",
            dateOfBirth: s.dateOfBirth
              ? new Date(s.dateOfBirth).toISOString().split("T")[0]
              : "",
            gender: s.gender || "",
            nidOrBirthCert: s.nidOrBirthCert || "",
            // SSC
            sscRoll: s.educationalInfo?.ssc?.roll || "",
            sscRegistration: s.educationalInfo?.ssc?.registration || "",
            sscSchoolName: s.educationalInfo?.ssc?.schoolName || "",
            sscBoard: s.educationalInfo?.ssc?.board || "",
            sscPassingYear:
              s.educationalInfo?.ssc?.passingYear?.toString() || "",
            sscGroup: s.educationalInfo?.ssc?.group || "",
            sscGpa: s.educationalInfo?.ssc?.gpa?.toString() || "",
            // HSC
            hscRoll: s.educationalInfo?.hsc?.roll || "",
            hscRegistration: s.educationalInfo?.hsc?.registration || "",
            hscCollegeName: s.educationalInfo?.hsc?.collegeName || "",
            hscBoard: s.educationalInfo?.hsc?.board || "",
            hscPassingYear:
              s.educationalInfo?.hsc?.passingYear?.toString() || "",
            hscGroup: s.educationalInfo?.hsc?.group || "",
            hscGpa: s.educationalInfo?.hsc?.gpa?.toString() || "",
            // Guardian
            guardianType: s.guardian?.type || "",
            guardianName: s.guardian?.name || "",
            guardianMobile: s.guardian?.mobile || "",
            guardianOccupation: s.guardian?.occupation || "",
            guardianRelation: s.guardian?.relation || "",
            // Address
            presentAddress: s.address?.present || "",
            district: s.address?.district || "",
            permanentAddress: s.address?.permanent || "",
          });
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
              relation: formData.guardianRelation || undefined,
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

      const response = await updateStudent(studentId, updateData);

      if (response.success) {
        alert("শিক্ষার্থীর তথ্য সফলভাবে আপডেট করা হয়েছে");
        router.push(`/dashboard/students/${studentId}`);
      } else {
        alert(response.message || "তথ্য আপডেট করতে সমস্যা হয়েছে");
      }
    } catch (error) {
      console.error("Error updating student:", error);
      alert("তথ্য আপডেট করতে সমস্যা হয়েছে");
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
          <div className="flex items-center gap-4">
            <Link href={`/dashboard/students/${student._id}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                ফিরে যান
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                শিক্ষার্থীর তথ্য সম্পাদনা
              </h1>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                {student.fullName} (রোল: {student.roll})
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle>ব্যক্তিগত তথ্য</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
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
                    setFormData({ ...formData, nidOrBirthCert: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* SSC Info */}
          <Card>
            <CardHeader>
              <CardTitle>এসএসসি তথ্য</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
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
                    setFormData({ ...formData, sscSchoolName: e.target.value })
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
                    setFormData({ ...formData, sscPassingYear: e.target.value })
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
            </CardContent>
          </Card>

          {/* HSC Info */}
          <Card>
            <CardHeader>
              <CardTitle>এইচএসসি তথ্য</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
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
                    setFormData({ ...formData, hscCollegeName: e.target.value })
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
                    setFormData({ ...formData, hscPassingYear: e.target.value })
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
            </CardContent>
          </Card>

          {/* Guardian Info */}
          <Card>
            <CardHeader>
              <CardTitle>অভিভাবক তথ্য</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
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
                    setFormData({ ...formData, guardianName: e.target.value })
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
                    setFormData({ ...formData, guardianMobile: e.target.value })
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
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle>ঠিকানা</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="presentAddress">বর্তমান ঠিকানা</Label>
                <Textarea
                  id="presentAddress"
                  value={formData.presentAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, presentAddress: e.target.value })
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
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <Link href={`/dashboard/students/${student._id}`}>
              <Button type="button" variant="outline">
                বাতিল
              </Button>
            </Link>
            <Button type="submit" disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
