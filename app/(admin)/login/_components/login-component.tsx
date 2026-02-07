"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  ShieldCheck,
  Mail,
  Lock,
  Loader2,
  Eye,
  EyeOff,
  Home,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoginFormData, LoginResponse } from "@/types";
import { loginStudent, loginAdmin, setCookie } from "@/lib/api";

export default function LoginComponent() {
  const [isAdminActive, setIsAdminActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [studentForm, setStudentForm] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [adminForm, setAdminForm] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleStudentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStudentForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleAdminInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleLogin = async (e: React.FormEvent, type: "student" | "admin") => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = type === "student" ? studentForm : adminForm;

    try {
      const data: LoginResponse =
        type === "student"
          ? await loginStudent(formData.email, formData.password)
          : await loginAdmin(formData.email, formData.password);
      console.log("Login Response:", data);

      if (data.success) {
        setCookie("accessToken", data.data.accessToken, 7);
        setCookie("refreshToken", data.data.refreshToken, 30);
        setCookie("userType", type, 7);

        if (type === "admin") {
          window.location.href = "/dashboard";
        } else {
          window.location.href = "/";
        }
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePanel = () => {
    setIsAdminActive(!isAdminActive);
    setError(null);
    setShowPassword(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-gray-100 to-purple-100 p-4">
      {/* Main Container */}
      <div
        className={`relative bg-white rounded-[30px] shadow-[0_5px_15px_rgba(0,0,0,0.35)] overflow-hidden w-full max-w-3xl md:min-h-120 min-h-[600px] ${
          isAdminActive ? "admin-active" : ""
        }`}
      >
        {/* Student Sign In Form */}
        <div
          className={`absolute top-0 left-0 flex items-center justify-center transition-all duration-[0.6s] ease-in-out z-2 ${
            isMobile ? "w-full h-1/2" : "w-1/2 h-full"
          } ${
            isAdminActive
              ? isMobile
                ? "translate-y-full"
                : "translate-x-full"
              : ""
          }`}
        >
          <form
            onSubmit={(e) => handleLogin(e, "student")}
            className="bg-white flex flex-col items-center justify-center px-6 md:px-10 h-full w-full"
          >
            <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4 text-xs">
              <Link
                href="/"
                className="text-gray-500 hover:text-purple-600 flex items-center gap-1 transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                Home
              </Link>
              <span className="text-gray-300">|</span>
              <Link
                href="/sign-up"
                className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                Create New Account
              </Link>
            </div>

            <div className="flex items-center gap-2 mb-1 md:mb-2">
              <GraduationCap className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                Student Login
              </h1>
            </div>
            <span className="text-xs text-gray-500 mb-3 md:mb-4">
              Sign in to access your courses
            </span>

            <div className="relative w-full mb-1.5 md:mb-2">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={studentForm.email}
                onChange={handleStudentInputChange}
                required
                className="w-full bg-gray-100 dark:bg-gray-800 border-none py-2 md:py-2.5 pl-10 text-sm rounded-lg"
              />
            </div>

            <div className="relative w-full mb-1.5 md:mb-2">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={studentForm.password}
                onChange={handleStudentInputChange}
                required
                className="w-full bg-gray-100 dark:bg-gray-800 border-none py-2 md:py-2.5 pl-10 pr-10 text-sm rounded-lg"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            <a
              href="#"
              className="text-xs text-gray-600 my-2 md:my-3 hover:text-purple-600"
            >
              Forgot Your Password?
            </a>

            {error && !isAdminActive && (
              <div className="w-full p-2 mb-1.5 md:mb-2 rounded-lg bg-red-100 border border-red-300 text-red-600 text-xs text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-purple-600 text-white text-xs py-2 md:py-2.5 px-8 md:px-11 rounded-lg font-semibold uppercase tracking-wide mt-1.5 md:mt-2 hover:bg-purple-700"
            >
              {isLoading && !isAdminActive ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>

        {/* Admin Sign In Form */}
        <div
          className={`absolute top-0 left-0 flex items-center justify-center transition-all duration-[0.6s] ease-in-out z-1 opacity-0 ${
            isMobile ? "w-full h-1/2" : "w-1/2 h-full"
          } ${
            isAdminActive
              ? isMobile
                ? "translate-y-full opacity-100 z-5 animate-slide"
                : "translate-x-full opacity-100 z-5 animate-slide"
              : ""
          }`}
        >
          <form
            onSubmit={(e) => handleLogin(e, "admin")}
            className="bg-white flex flex-col items-center justify-center px-6 md:px-10 h-full w-full"
          >
            <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4 text-xs">
              <Link
                href="/"
                className="text-gray-500 hover:text-purple-600 flex items-center gap-1 transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                Home
              </Link>
              {/* <span className="text-gray-300">|</span> */}
              {/* <Link
                href="/sign-up"
                className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                Create New Account
              </Link> */}
            </div>

            <div className="flex items-center gap-2 mb-1 md:mb-2">
              <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                Admin Login
              </h1>
            </div>
            <span className="text-xs text-gray-500 mb-3 md:mb-4">
              Authorized personnel only
            </span>

            <div className="relative w-full mb-1.5 md:mb-2">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
              <Input
                type="email"
                name="email"
                placeholder="Admin Email"
                value={adminForm.email}
                onChange={handleAdminInputChange}
                required
                className="w-full bg-gray-100 dark:bg-gray-800 border-none py-2 md:py-2.5 pl-10 text-sm rounded-lg"
              />
            </div>

            <div className="relative w-full mb-1.5 md:mb-2">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={adminForm.password}
                onChange={handleAdminInputChange}
                required
                className="w-full bg-gray-100 dark:bg-gray-800 border-none py-2 md:py-2.5 pl-10 pr-10 text-sm rounded-lg"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            <a
              href="#"
              className="text-xs text-gray-600 my-2 md:my-3 hover:text-purple-600"
            >
              Forgot Your Password?
            </a>

            {error && isAdminActive && (
              <div className="w-full p-2 mb-1.5 md:mb-2 rounded-lg bg-red-100 border border-red-300 text-red-600 text-xs text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-purple-600 text-white text-xs py-2 md:py-2.5 px-8 md:px-11 rounded-lg font-semibold uppercase tracking-wide mt-1.5 md:mt-2 hover:bg-purple-700"
            >
              {isLoading && isAdminActive ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>

        {/* Toggle Container */}
        <div
          className={`absolute overflow-hidden transition-all duration-[0.6s] ease-in-out z-1000 ${
            isMobile
              ? "top-1/2 left-0 w-full h-1/2"
              : "top-0 left-1/2 w-1/2 h-full"
          }`}
          style={{
            transform: isAdminActive
              ? isMobile
                ? "translateY(-100%)"
                : "translateX(-100%)"
              : isMobile
                ? "translateY(0)"
                : "translateX(0)",
            borderRadius: isAdminActive
              ? isMobile
                ? "0 0 100px 100px"
                : "0 150px 100px 0"
              : isMobile
                ? "100px 100px 0 0"
                : "150px 0 0 100px",
          }}
        >
          {/* Toggle Background */}
          <div
            className={`bg-linear-to-r from-indigo-500 to-purple-600 text-white relative transition-all duration-[0.6s] ease-in-out ${
              isMobile
                ? "-top-full h-[200%] w-full"
                : "-left-full h-full w-[200%]"
            } ${
              isAdminActive
                ? isMobile
                  ? "translate-y-1/2"
                  : "translate-x-1/2"
                : ""
            }`}
          >
            {/* Left Panel - Shows when Admin is active */}
            <div
              className={`absolute flex flex-col items-center justify-center px-4 md:px-8 text-center top-0 transition-all duration-[0.6s] ease-in-out ${
                isMobile ? "w-full h-1/2" : "w-1/2 h-full left-0"
              } ${
                isAdminActive
                  ? ""
                  : isMobile
                    ? "-translate-y-[200%]"
                    : "-translate-x-[200%]"
              }`}
            >
              <GraduationCap className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4 opacity-90" />
              <h1 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">
                Welcome Back!
              </h1>
              <p className="text-xs md:text-sm leading-5 tracking-wide my-3 md:my-5 opacity-90">
                Access your student dashboard and continue your learning journey
              </p>
              <button
                onClick={togglePanel}
                className="bg-transparent border border-white text-white text-xs py-2 md:py-2.5 px-8 md:px-11 rounded-lg font-semibold uppercase tracking-wide cursor-pointer hover:bg-white/10 transition-colors"
              >
                Student Login
              </button>
            </div>

            {/* Right Panel - Shows when Student is active */}
            <div
              className={`absolute flex flex-col items-center justify-center px-4 md:px-8 text-center transition-all duration-[0.6s] ease-in-out ${
                isMobile ? "w-full h-1/2 bottom-0" : "w-1/2 h-full top-0 right-0"
              } ${
                isAdminActive
                  ? isMobile
                    ? "translate-y-[200%]"
                    : "translate-x-[200%]"
                  : ""
              }`}
            >
              <ShieldCheck className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4 opacity-90" />
              <h1 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">
                Admin Access
              </h1>
              <p className="text-xs md:text-sm leading-5 tracking-wide my-3 md:my-5 opacity-90">
                Manage courses, students, and platform settings from your admin
                panel
              </p>
              <button
                onClick={togglePanel}
                className="bg-transparent border border-white text-white text-xs py-2 md:py-2.5 px-8 md:px-11 rounded-lg font-semibold uppercase tracking-wide cursor-pointer hover:bg-white/10 transition-colors"
              >
                Admin Login
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom animation keyframes */}
      <style jsx>{`
        @keyframes slide {
          0%,
          49.99% {
            opacity: 0;
            z-index: 1;
          }
          50%,
          100% {
            opacity: 1;
            z-index: 5;
          }
        }
        .animate-slide {
          animation: slide 0.6s;
        }
      `}</style>
    </div>
  );
}
