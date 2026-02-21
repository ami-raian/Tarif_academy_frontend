# TarifAcademy — API Documentation

> **Base URL:** `http://localhost:5000/api/v1`
> Environment variable: `NEXT_PUBLIC_TARIFACADEMY_API_URL`

---

## Table of Contents

- [Overview](#overview)
- [Authentication & Token](#authentication--token)
- [Standard Response Format](#standard-response-format)
- [Data Types & Interfaces](#data-types--interfaces)
- [ADMIN Panel APIs](#-admin-panel-apis)
  - [Auth — Admin](#1-auth--admin)
  - [Course Management](#2-course-management)
  - [Video Management](#3-video-management)
  - [Enrollment Management](#4-enrollment-management)
  - [MCQ Exam Management](#5-mcq-exam-management)
  - [MCQ Question Management](#6-mcq-question-management)
  - [Exam Submissions (Admin View)](#7-exam-submissions-admin-view)
  - [Student Management](#8-student-management)
  - [Video Sync (Webhook)](#9-video-sync-webhook)
- [STUDENT Panel APIs](#-student-panel-apis)
  - [Auth — Student](#1-auth--student)
  - [Student Registration](#2-student-registration)
  - [Courses (Student View)](#3-courses-student-view)
  - [Videos & Progress](#4-videos--progress)
  - [Enrollment (Student)](#5-enrollment-student)
  - [MCQ Exams (Student View)](#6-mcq-exams-student-view)
  - [MCQ Exam Attempt Flow](#7-mcq-exam-attempt-flow)
- [Shared APIs (Both Panels)](#-shared-apis-both-panels)

---

## Overview

TarifAcademy একটি অনলাইন শিক্ষা প্ল্যাটফর্ম যেখানে দুটি আলাদা প্যানেল আছে:

| Panel             | Role                           | Base Auth Endpoint    |
| ----------------- | ------------------------------ | --------------------- |
| **Admin Panel**   | Course/Exam/Student management | `/auth/admin/login`   |
| **Student Panel** | Course learning & MCQ exam     | `/auth/student/login` |

---

## Authentication & Token

সব protected API-তে `Authorization` header পাঠাতে হবে।

```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Token Storage:**
Token প্রথমে `localStorage` এ খোঁজা হয় (`accessToken` key), তারপর Cookie থেকে।

```
localStorage.getItem("accessToken")
// OR
Cookie: accessToken=<token>
```

---

## Standard Response Format

সব API একই structure-এ response দেয়:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request successful",
  "data": { ... }
}
```

**Paginated Response** (list endpoints-এ):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Data fetched",
  "data": [ ... ],
  "pagination": {
    "totalItems": 100,
    "totalPages": 10,
    "currentPage": 1,
    "pageSize": 10
  }
}
```

---

## Data Types & Interfaces

### McqOption

```typescript
{
  text: string;          // Option এর text
  isCorrect?: boolean;   // Admin response-এ থাকে, student-এ থাকে না
}
```

### McqQuestion

```typescript
{
  _id: string;
  examId: string;
  questionText: string;
  options: McqOption[];
  marks: number;         // এই প্রশ্নের marks (default: 1)
  order: number;         // প্রশ্নের ক্রম
}
```

### McqExam

```typescript
{
  _id: string;
  title: string;
  description?: string;
  duration: number;            // মিনিটে পরীক্ষার সময়
  totalQuestions: number;
  totalMarks: number;
  passingMarks: number;
  isPublished: boolean;
  isResultPublished: boolean;
  hasAccessCode?: boolean;     // পরীক্ষায় access code আছে কিনা
  accessCode?: string;         // শুধু Admin response-এ আসে
  startTime?: string;          // ISO 8601 date string
  endTime?: string;
  createdBy?: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

### StudentAnswer

```typescript
{
  questionId: string;
  selectedOptionIndex: number | null;  // null = unanswered
  isCorrect?: boolean;                 // result publish হলে আসে
  marksObtained?: number;
}
```

### McqSubmission

```typescript
{
  _id: string;
  examId: McqExam | string;
  studentId: {
    _id: string;
    fullName: string;
    email: string;
  } | string;
  answers: StudentAnswer[];
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  isPassed: boolean;
  startedAt: string;
  submittedAt?: string;
  isAutoSubmitted: boolean;
  status: "in_progress" | "submitted" | "evaluated";
}
```

---

---

# 🔴 ADMIN Panel APIs

Admin panel-এ ব্যবহৃত সব API গুলো নিচে বর্ণিত হয়েছে।

---

## 1. Auth — Admin

### Login Admin

Admin-এর login করার জন্য।

```
POST /auth/admin/login
```

**Headers:** (No auth required)

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "admin@tarifacademy.com",
  "password": "your_password"
}
```

| Field      | Type   | Required | Description            |
| ---------- | ------ | -------- | ---------------------- |
| `email`    | string | ✅       | Admin এর email address |
| `password` | string | ✅       | Admin এর password      |

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "admin": {
      "_id": "64abc123...",
      "email": "admin@tarifacademy.com",
      "role": "admin",
      "avatar": "https://..."
    }
  }
}
```

---

### Get Admin Profile

Logged-in admin-এর তথ্য দেখার জন্য।

```
GET /auth/admin/me
```

**Headers:** `Authorization: Bearer <token>` ✅

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "64abc123...",
    "email": "admin@tarifacademy.com",
    "role": "admin",
    "avatar": "https://..."
  }
}
```

---

## 2. Course Management

### Get All Courses (Admin)

সব course এর list, filter সহ।

```
GET /courses
```

**Headers:** `Authorization: Bearer <token>` ✅

**Query Parameters:**

| Parameter     | Type    | Required | Description                              |
| ------------- | ------- | -------- | ---------------------------------------- |
| `page`        | number  | ❌       | Page number (default: 1)                 |
| `limit`       | number  | ❌       | Items per page (default: 10)             |
| `category`    | string  | ❌       | Category দিয়ে filter করুন               |
| `level`       | string  | ❌       | `beginner` / `intermediate` / `advanced` |
| `isPublished` | boolean | ❌       | `true` বা `false` দিয়ে filter           |

**Example Request:**

```
GET /courses?page=1&limit=10&level=beginner&isPublished=true
```

**Response:** Paginated course list

---

### Get Course by ID

```
GET /courses/:courseId
```

**Headers:** `Authorization: Bearer <token>` ✅

**URL Parameter:**

| Parameter  | Description                |
| ---------- | -------------------------- |
| `courseId` | Course এর MongoDB ObjectId |

**Response:** Single course object

---

### Create Course

নতুন course তৈরি করার জন্য।

```
POST /courses
```

**Headers:** `Authorization: Bearer <token>` ✅

**Request Body:**

```json
{
  "title": "Web Development Bootcamp",
  "description": "Complete web development course",
  "category": "Programming",
  "level": "beginner",
  "price": 2500,
  "thumbnail": "https://...",
  "isPublished": false
}
```

| Field         | Type    | Required | Description                              |
| ------------- | ------- | -------- | ---------------------------------------- |
| `title`       | string  | ✅       | Course এর নাম                            |
| `description` | string  | ✅       | Course এর বিবরণ                          |
| `category`    | string  | ✅       | Course category                          |
| `level`       | string  | ✅       | `beginner` / `intermediate` / `advanced` |
| `price`       | number  | ✅       | Course এর মূল্য (টাকায়)                 |
| `thumbnail`   | string  | ❌       | Thumbnail image URL                      |
| `isPublished` | boolean | ❌       | Default: false                           |

**Response:** Created course object

---

### Update Course

Existing course update করার জন্য।

```
PUT /courses/:courseId
```

**Headers:** `Authorization: Bearer <token>` ✅

**URL Parameter:** `courseId` — Course এর MongoDB ObjectId

**Request Body:** (সব field optional, যেটা change করতে চান সেটাই পাঠান)

```json
{
  "title": "Updated Course Title",
  "price": 3000,
  "level": "intermediate"
}
```

**Response:** Updated course object

---

### Toggle Course Publish Status

Course publish বা unpublish করার জন্য।

```
PATCH /courses/:courseId/publish
```

**Headers:** `Authorization: Bearer <token>` ✅

**URL Parameter:** `courseId`

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "...",
    "isPublished": true
  }
}
```

> প্রতিবার call করলে publish status toggle হবে।

---

### Delete Course

```
DELETE /courses/:courseId
```

**Headers:** `Authorization: Bearer <token>` ✅

**URL Parameter:** `courseId`

**Response:**

```json
{
  "success": true,
  "message": "Course deleted successfully"
}
```

---

## 3. Video Management

### Get Course Videos (Admin)

Course এর সব video, section অনুযায়ী grouped।

```
GET /videos/course/:courseId
```

**Headers:** `Authorization: Bearer <token>` ✅

**Response:**

```json
{
  "success": true,
  "data": {
    "sections": [
      {
        "sectionTitle": "Introduction",
        "videos": [
          {
            "_id": "...",
            "title": "Welcome Video",
            "order": 1,
            "isFree": true,
            "duration": 300
          }
        ]
      }
    ]
  }
}
```

---

### Create Video (Metadata Only)

Video metadata তৈরি করা, video file upload ছাড়া।

```
POST /videos
```

**Headers:** `Authorization: Bearer <token>` ✅

**Request Body:**

```json
{
  "title": "Introduction to HTML",
  "description": "Learn HTML basics",
  "courseId": "64abc123...",
  "sectionTitle": "Module 1: Basics",
  "order": 1,
  "isFree": false
}
```

| Field          | Type    | Required | Description                        |
| -------------- | ------- | -------- | ---------------------------------- |
| `title`        | string  | ✅       | Video এর নাম                       |
| `description`  | string  | ❌       | Video এর বিবরণ                     |
| `courseId`     | string  | ✅       | কোন course এ add করতে চান          |
| `sectionTitle` | string  | ✅       | Section এর নাম                     |
| `order`        | number  | ✅       | Section এ video এর ক্রম            |
| `isFree`       | boolean | ❌       | Free preview কিনা (default: false) |

---

### Upload Video (Multipart FormData)

Video file সহ upload করার জন্য।

```
POST /videos/upload
```

**Headers:**

```
Authorization: Bearer <token>
// Content-Type header পাঠাবেন না — browser automatically set করবে
```

**Request Body:** `FormData`

| Field          | Type   | Required | Description                    |
| -------------- | ------ | -------- | ------------------------------ |
| `video`        | File   | ✅       | Video file (.mp4, .mkv, etc.)  |
| `title`        | string | ✅       | Video এর নাম                   |
| `description`  | string | ❌       | Video বিবরণ                    |
| `courseId`     | string | ✅       | Course ID                      |
| `sectionTitle` | string | ✅       | Section নাম                    |
| `order`        | string | ✅       | ক্রম (number কে string হিসেবে) |
| `isFree`       | string | ❌       | `"true"` বা `"false"`          |

> **Note:** Video Bunny CDN-এ upload হয়। Upload শেষে async encoding শুরু হয়। Status `/videos/:videoId/status` দিয়ে check করুন।

---

### Check Video Encoding Status

Video encoding এর status জানার জন্য।

```
GET /videos/:videoId/status
```

**Headers:** `Authorization: Bearer <token>` ✅

**Response:**

```json
{
  "success": true,
  "data": {
    "status": "processing",
    "progress": 45
  }
}
```

| Status       | Description                  |
| ------------ | ---------------------------- |
| `processing` | Video encode হচ্ছে           |
| `ready`      | Video ready, stream করা যাবে |
| `failed`     | Encoding fail হয়েছে         |

---

### Update Video

```
PATCH /videos/:videoId
```

**Headers:** `Authorization: Bearer <token>` ✅

**Request Body:** (যে field update করতে চান)

```json
{
  "title": "Updated Title",
  "order": 2,
  "isFree": true
}
```

---

### Delete Video

```
DELETE /videos/:videoId
```

**Headers:** `Authorization: Bearer <token>` ✅

---

## 4. Enrollment Management

### Get All Enrollments (Admin)

সব student এর enrollment list দেখার জন্য।

```
GET /enrollments/admin/all
```

**Headers:** `Authorization: Bearer <token>` ✅

**Query Parameters:**

| Parameter | Type   | Required | Description                         |
| --------- | ------ | -------- | ----------------------------------- |
| `status`  | string | ❌       | `pending` / `approved` / `rejected` |
| `page`    | number | ❌       | Page number                         |
| `limit`   | number | ❌       | Per page limit                      |

**Example:**

```
GET /enrollments/admin/all?status=pending&page=1&limit=20
```

**Response:** Paginated enrollment list with student and course details

---

### Approve Enrollment

Student এর enrollment approve করার জন্য।

```
PATCH /enrollments/:enrollmentId/approve
```

**Headers:** `Authorization: Bearer <token>` ✅

**URL Parameter:** `enrollmentId`

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "status": "approved",
    "studentId": "...",
    "courseId": "..."
  }
}
```

---

### Reject Enrollment

Student এর enrollment reject করার জন্য।

```
PATCH /enrollments/:enrollmentId/reject
```

**Headers:** `Authorization: Bearer <token>` ✅

**Request Body:**

```json
{
  "reason": "Payment verification failed"
}
```

| Field    | Type   | Required | Description               |
| -------- | ------ | -------- | ------------------------- |
| `reason` | string | ❌       | Reject এর কারণ (optional) |

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "status": "rejected",
    "reason": "Payment verification failed"
  }
}
```

---

## 5. MCQ Exam Management

### Get All MCQ Exams (Admin)

সব MCQ exam এর list।

```
GET /mcq/exams
```

**Headers:** `Authorization: Bearer <token>` ✅

**Query Parameters:**

| Parameter     | Type    | Required | Description                 |
| ------------- | ------- | -------- | --------------------------- |
| `page`        | number  | ❌       | Page number                 |
| `limit`       | number  | ❌       | Per page limit              |
| `isPublished` | boolean | ❌       | Publish status দিয়ে filter |
| `search`      | string  | ❌       | Title দিয়ে search          |

> Admin এই endpoint থেকে সব exam দেখতে পারবেন, published/unpublished উভয়ই।

---

### Get Single MCQ Exam (Admin)

```
GET /mcq/exams/:examId
```

**Headers:** `Authorization: Bearer <token>` ✅

**Response:** Full exam details সহ `accessCode` (admin only field)

---

### Create MCQ Exam

নতুন MCQ exam তৈরি করার জন্য।

```
POST /mcq/exams
```

**Headers:** `Authorization: Bearer <token>` ✅

**Request Body:**

```json
{
  "title": "JavaScript Fundamentals Test",
  "description": "Test your JavaScript knowledge",
  "duration": 30,
  "passingMarks": 40,
  "accessCode": "TARIFJS2024",
  "startTime": "2024-12-01T09:00:00.000Z",
  "endTime": "2024-12-31T23:59:59.000Z"
}
```

| Field          | Type   | Required | Description                            |
| -------------- | ------ | -------- | -------------------------------------- |
| `title`        | string | ✅       | Exam এর নাম                            |
| `description`  | string | ❌       | Exam এর বিবরণ                          |
| `duration`     | number | ✅       | সময়সীমা মিনিটে (e.g. `30` = 30 মিনিট) |
| `passingMarks` | number | ✅       | Pass করতে minimum marks                |
| `accessCode`   | string | ❌       | Secret code (private exam-এর জন্য)     |
| `startTime`    | string | ❌       | Exam শুরুর সময় (ISO 8601)             |
| `endTime`      | string | ❌       | Exam শেষের সময় (ISO 8601)             |

**Response:** Created `McqExam` object

---

### Update MCQ Exam

```
PUT /mcq/exams/:examId
```

**Headers:** `Authorization: Bearer <token>` ✅

**Request Body:** (সব field optional)

```json
{
  "title": "Updated Exam Title",
  "duration": 45,
  "passingMarks": 50,
  "accessCode": "NEWCODE123"
}
```

| Field          | Type   | Required | Description            |
| -------------- | ------ | -------- | ---------------------- |
| `title`        | string | ❌       | Exam এর নতুন নাম       |
| `description`  | string | ❌       | নতুন বিবরণ             |
| `duration`     | number | ❌       | নতুন সময়সীমা (মিনিটে) |
| `passingMarks` | number | ❌       | নতুন passing marks     |
| `accessCode`   | string | ❌       | নতুন access code       |
| `startTime`    | string | ❌       | নতুন শুরুর সময়        |
| `endTime`      | string | ❌       | নতুন শেষের সময়        |

---

### Delete MCQ Exam

```
DELETE /mcq/exams/:examId
```

**Headers:** `Authorization: Bearer <token>` ✅

---

### Toggle MCQ Exam Publish

Exam publish/unpublish করার জন্য।

```
PATCH /mcq/exams/:examId/publish
```

**Headers:** `Authorization: Bearer <token>` ✅

> প্রতিবার call করলে `isPublished` toggle হবে।

---

### Publish Exam Results

Exam-এর result students-দের কাছে visible করতে।

```
PATCH /mcq/exams/:examId/publish-results
```

**Headers:** `Authorization: Bearer <token>` ✅

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "isResultPublished": true
  }
}
```

---

### Unpublish Exam Results

Result আবার hide করতে।

```
PATCH /mcq/exams/:examId/unpublish-results
```

**Headers:** `Authorization: Bearer <token>` ✅

---

## 6. MCQ Question Management

### Get MCQ Questions (Admin — With Answers)

Exam এর সব প্রশ্ন, সঠিক উত্তর সহ।

```
GET /mcq/exams/:examId/questions
```

**Headers:** `Authorization: Bearer <token>` ✅

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "examId": "...",
      "questionText": "JavaScript কী?",
      "options": [
        { "text": "একটি programming language", "isCorrect": true },
        { "text": "একটি database", "isCorrect": false },
        { "text": "একটি framework", "isCorrect": false },
        { "text": "একটি OS", "isCorrect": false }
      ],
      "marks": 1,
      "order": 1
    }
  ]
}
```

> **Admin** পাবেন `isCorrect` field, **Student** পাবেন না।

---

### Create MCQ Question

একটি নতুন প্রশ্ন তৈরি করার জন্য।

```
POST /mcq/questions
```

**Headers:** `Authorization: Bearer <token>` ✅

**Request Body:**

```json
{
  "examId": "64abc123...",
  "questionText": "HTML এর পূর্ণরূপ কী?",
  "options": [
    { "text": "HyperText Markup Language", "isCorrect": true },
    { "text": "High-level Text Machine Language", "isCorrect": false },
    { "text": "HyperText Machine Language", "isCorrect": false },
    { "text": "HyperTransfer Markup Language", "isCorrect": false }
  ],
  "marks": 1,
  "order": 1
}
```

| Field                 | Type    | Required | Description                                         |
| --------------------- | ------- | -------- | --------------------------------------------------- |
| `examId`              | string  | ✅       | কোন exam-এ question যোগ করতে চান                    |
| `questionText`        | string  | ✅       | প্রশ্নের text                                       |
| `options`             | array   | ✅       | Option গুলো (min 2, প্রতিটিতে `text` ও `isCorrect`) |
| `options[].text`      | string  | ✅       | Option এর text                                      |
| `options[].isCorrect` | boolean | ✅       | এটি সঠিক উত্তর কিনা                                 |
| `marks`               | number  | ❌       | এই প্রশ্নের marks (default: 1)                      |
| `order`               | number  | ❌       | প্রশ্নের ক্রম                                       |

---

### Update MCQ Question

```
PUT /mcq/questions/:questionId
```

**Headers:** `Authorization: Bearer <token>` ✅

**Request Body:** (সব field optional)

```json
{
  "questionText": "Updated question text",
  "options": [
    { "text": "Option A", "isCorrect": false },
    { "text": "Option B", "isCorrect": true },
    { "text": "Option C", "isCorrect": false },
    { "text": "Option D", "isCorrect": false }
  ],
  "marks": 2,
  "order": 3
}
```

---

### Delete MCQ Question

```
DELETE /mcq/questions/:questionId
```

**Headers:** `Authorization: Bearer <token>` ✅

---

### Bulk Create MCQ Questions

একসাথে অনেকগুলো প্রশ্ন তৈরি করার জন্য।

```
POST /mcq/exams/:examId/questions/bulk
```

**Headers:** `Authorization: Bearer <token>` ✅

**URL Parameter:** `examId`

**Request Body:**

```json
{
  "questions": [
    {
      "questionText": "প্রশ্ন ১",
      "options": [
        { "text": "A", "isCorrect": true },
        { "text": "B", "isCorrect": false },
        { "text": "C", "isCorrect": false },
        { "text": "D", "isCorrect": false }
      ],
      "marks": 1
    },
    {
      "questionText": "প্রশ্ন ২",
      "options": [
        { "text": "A", "isCorrect": false },
        { "text": "B", "isCorrect": true },
        { "text": "C", "isCorrect": false },
        { "text": "D", "isCorrect": false }
      ],
      "marks": 2
    }
  ]
}
```

| Field                      | Type   | Required | Description                 |
| -------------------------- | ------ | -------- | --------------------------- |
| `questions`                | array  | ✅       | প্রশ্নের array              |
| `questions[].questionText` | string | ✅       | প্রশ্নের text               |
| `questions[].options`      | array  | ✅       | Option গুলো                 |
| `questions[].marks`        | number | ❌       | প্রতিটির marks (default: 1) |

**Response:** Created `McqQuestion[]` array

---

## 7. Exam Submissions (Admin View)

### Get Exam Submissions (Admin)

Exam-এ কোন কোন student অংশগ্রহণ করেছে।

```
GET /mcq/exams/:examId/submissions
```

**Headers:** `Authorization: Bearer <token>` ✅

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "studentId": {
        "_id": "...",
        "fullName": "John Doe",
        "email": "john@example.com"
      },
      "totalMarks": 50,
      "obtainedMarks": 42,
      "percentage": 84,
      "isPassed": true,
      "status": "submitted",
      "submittedAt": "2024-12-01T10:30:00.000Z",
      "isAutoSubmitted": false
    }
  ]
}
```

---

### Get MCQ Leaderboard

Exam-এর top performers এর list।

```
GET /mcq/exams/:examId/leaderboard?limit=10
```

**Headers:** `Authorization: Bearer <token>` ✅

**Query Parameters:**

| Parameter | Type   | Required | Description                   |
| --------- | ------ | -------- | ----------------------------- |
| `limit`   | number | ❌       | Top কতজন দেখাবে (default: 10) |

---

## 8. Student Management

### Get All Students

সব registered student এর list।

```
GET /students
```

**Headers:** `Authorization: Bearer <token>` ✅

**Query Parameters:**

| Parameter | Type   | Required | Description    |
| --------- | ------ | -------- | -------------- |
| `page`    | number | ❌       | Page number    |
| `limit`   | number | ❌       | Per page limit |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "fullName": "John Doe",
      "email": "john@example.com",
      "mobile": "01700000000",
      "photo": "https://...",
      "isVerified": true,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": { ... }
}
```

---

### Delete Student

```
DELETE /students/:studentId
```

**Headers:** `Authorization: Bearer <token>` ✅

**Response:**

```json
{
  "success": true,
  "message": "Student deleted successfully"
}
```

---

## 9. Video Sync (Webhook)

### Sync All Videos with Bunny CDN

Bunny CDN থেকে সব video এর status sync করার জন্য।

```
POST /webhooks/sync-all-videos
```

**Headers:** `Authorization: Bearer <token>` ✅

**Response:**

```json
{
  "success": true,
  "message": "All videos synced",
  "data": {
    "readyCount": 45,
    "totalSynced": 50
  }
}
```

---

---

# 🟢 STUDENT Panel APIs

Student panel-এ ব্যবহৃত সব API গুলো নিচে বর্ণিত হয়েছে।

---

## 1. Auth — Student

### Login Student

```
POST /auth/student/login
```

**Headers:** (No auth required)

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "student@example.com",
  "password": "your_password"
}
```

| Field      | Type   | Required | Description         |
| ---------- | ------ | -------- | ------------------- |
| `email`    | string | ✅       | Student এর email    |
| `password` | string | ✅       | Student এর password |

**Response:**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "student": {
      "_id": "...",
      "fullName": "John Doe",
      "email": "john@example.com",
      "mobile": "01700000000",
      "photo": "https://...",
      "isVerified": true,
      "isActive": true
    }
  }
}
```

---

### Get Student Profile

Logged-in student এর নিজের profile দেখার জন্য।

```
GET /auth/student/me
```

**Headers:** `Authorization: Bearer <token>` ✅

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "mobile": "01700000000",
    "photo": "https://...",
    "isVerified": true,
    "isActive": true
  }
}
```

---

## 2. Student Registration

### Register Student

নতুন student account তৈরি করার জন্য।

```
POST /students/register
```

**Headers:** (No auth required)

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "mobile": "01700000000",
  "password": "securepassword"
}
```

| Field      | Type   | Required | Description          |
| ---------- | ------ | -------- | -------------------- |
| `fullName` | string | ✅       | Student এর পূর্ণ নাম |
| `email`    | string | ✅       | Email address        |
| `mobile`   | string | ✅       | Mobile number        |
| `password` | string | ✅       | Password             |

---

## 3. Courses (Student View)

### Get Published Courses

Student শুধু published courses দেখতে পারবেন।

```
GET /courses
```

**Headers:** `Authorization: Bearer <token>` ✅

**Query Parameters:**

| Parameter  | Type   | Required | Description                              |
| ---------- | ------ | -------- | ---------------------------------------- |
| `page`     | number | ❌       | Page number                              |
| `limit`    | number | ❌       | Per page limit                           |
| `category` | string | ❌       | Category filter                          |
| `level`    | string | ❌       | `beginner` / `intermediate` / `advanced` |

> Student শুধু `isPublished=true` courses দেখতে পাবেন।

---

### Get Course by Slug

SEO-friendly URL থেকে course দেখার জন্য।

```
GET /courses/slug/:slug
```

**Headers:** `Authorization: Bearer <token>` ✅

**URL Parameter:** `slug` — Course এর URL-friendly name (e.g., `web-development-bootcamp`)

**Response:** Single course object

---

### Get Course by ID

```
GET /courses/:courseId
```

**Headers:** `Authorization: Bearer <token>` ✅

---

## 4. Videos & Progress

### Get Course Videos (Student)

Course এর সব video, section ভিত্তিক।

```
GET /videos/course/:courseId
```

**Headers:** `Authorization: Bearer <token>` ✅

> Student শুধু enrolled course এর video দেখতে পারবেন। Free videos সবাই দেখতে পারবেন।

---

### Get Video Stream URL

Video play করার জন্য streaming URL পাওয়া।

```
GET /videos/:videoId/stream
```

**Headers:** `Authorization: Bearer <token>` ✅

**Response:**

```json
{
  "success": true,
  "data": {
    "streamUrl": "https://bunny.net/stream/...",
    "embedUrl": "https://iframe.mediadelivery.net/embed/..."
  }
}
```

| Field       | Description                       |
| ----------- | --------------------------------- |
| `streamUrl` | Direct stream URL                 |
| `embedUrl`  | Embeddable iframe URL (Bunny CDN) |

---

### Mark Video as Completed

Student কোনো video দেখা শেষ করলে mark করার জন্য।

```
POST /videos/:videoId/complete
```

**Headers:** `Authorization: Bearer <token>` ✅

**URL Parameter:** `videoId`

**Response:**

```json
{
  "success": true,
  "message": "Video marked as completed"
}
```

> এই API call করলে course progress automatically update হয়।

---

## 5. Enrollment (Student)

### Enroll in Course (Quick)

Payment ছাড়া সরাসরি enrollment এর জন্য।

```
POST /enrollments
```

**Headers:** `Authorization: Bearer <token>` ✅

**Request Body:**

```json
{
  "courseId": "64abc123..."
}
```

| Field      | Type   | Required | Description                 |
| ---------- | ------ | -------- | --------------------------- |
| `courseId` | string | ✅       | যে course-এ enroll করতে চান |

---

### Create Enrollment with Payment

Payment তথ্য সহ enrollment।

```
POST /enrollments
```

**Headers:** `Authorization: Bearer <token>` ✅

**Request Body:**

```json
{
  "courseId": "64abc123...",
  "paymentAmount": 2500,
  "transactionId": "TXN123456789"
}
```

| Field           | Type   | Required | Description              |
| --------------- | ------ | -------- | ------------------------ |
| `courseId`      | string | ✅       | Course ID                |
| `paymentAmount` | number | ✅       | Payment amount (টাকায়)  |
| `transactionId` | string | ❌       | বিকাশ/নগদ transaction ID |

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "studentId": "...",
    "courseId": "...",
    "status": "pending",
    "paymentAmount": 2500,
    "transactionId": "TXN123456789",
    "createdAt": "2024-12-01T00:00:00.000Z"
  }
}
```

> Enrollment তৈরির পর `status: "pending"` থাকবে। Admin approve করলে `"approved"` হবে।

---

### Get My Enrolled Courses

Student এর সব enrolled course দেখার জন্য।

```
GET /enrollments/my-courses
```

**Headers:** `Authorization: Bearer <token>` ✅

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "courseId": {
        "_id": "...",
        "title": "Web Development",
        "thumbnail": "https://..."
      },
      "status": "approved",
      "enrolledAt": "2024-12-01T00:00:00.000Z"
    }
  ]
}
```

---

### Check Enrollment Status

Student কোনো specific course-এ enrolled কিনা চেক করার জন্য।

```
GET /enrollments/check/:courseId
```

**Headers:** `Authorization: Bearer <token>` ✅

**Response:**

```json
{
  "success": true,
  "data": {
    "isEnrolled": true,
    "status": "approved",
    "enrollmentId": "..."
  }
}
```

| Field        | Description                         |
| ------------ | ----------------------------------- |
| `isEnrolled` | true/false                          |
| `status`     | `pending` / `approved` / `rejected` |

---

### Get Course Progress

Course এ student এর অগ্রগতি দেখার জন্য।

```
GET /enrollments/progress/:courseId
```

**Headers:** `Authorization: Bearer <token>` ✅

**Response:**

```json
{
  "success": true,
  "data": {
    "totalVideos": 20,
    "completedVideos": 12,
    "progressPercentage": 60,
    "isCompleted": false
  }
}
```

| Field                | Description               |
| -------------------- | ------------------------- |
| `totalVideos`        | Course-এ মোট video সংখ্যা |
| `completedVideos`    | Student কতটি দেখেছেন      |
| `progressPercentage` | শতাংশে progress (0-100)   |
| `isCompleted`        | সব video দেখা হয়েছে কিনা |

---

## 6. MCQ Exams (Student View)

### Get Published MCQ Exams

Student সব published exam এর list দেখতে পারবেন।

```
GET /mcq/exams/published
```

**Headers:** `Authorization: Bearer <token>` ✅

**Query Parameters:**

| Parameter | Type   | Required | Description             |
| --------- | ------ | -------- | ----------------------- |
| `page`    | number | ❌       | Page number             |
| `limit`   | number | ❌       | Per page limit          |
| `search`  | string | ❌       | Exam title দিয়ে search |

**Response:** Paginated `McqExam[]` (accessCode field **থাকবে না**)

---

### Get Single MCQ Exam (Student)

```
GET /mcq/exams/published/:examId
```

**Headers:** `Authorization: Bearer <token>` ✅

> শুধু published exam দেখা যাবে।

---

### Get MCQ Questions for Student (Without Answers)

Exam-এর প্রশ্নগুলো, সঠিক উত্তর **ছাড়া**।

```
GET /mcq/exams/:examId/questions/student
```

**Headers:** `Authorization: Bearer <token>` ✅

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "questionText": "JavaScript কী?",
      "options": [
        { "text": "একটি programming language" },
        { "text": "একটি database" },
        { "text": "একটি framework" },
        { "text": "একটি OS" }
      ],
      "marks": 1,
      "order": 1
    }
  ]
}
```

> `isCorrect` field **থাকবে না** — শুধু Admin দেখতে পারবেন।

---

### Get My MCQ Exam Attempts

Student তার সব exam attempt এর list দেখার জন্য।

```
GET /mcq/my-exams
```

**Headers:** `Authorization: Bearer <token>` ✅

**Response:** `McqSubmission[]` list

---

### Get MCQ Exam Result

নির্দিষ্ট exam-এর result দেখার জন্য (result publish হওয়ার পরে)।

```
GET /mcq/exams/:examId/result
```

**Headers:** `Authorization: Bearer <token>` ✅

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "examId": "...",
    "totalMarks": 50,
    "obtainedMarks": 42,
    "percentage": 84,
    "isPassed": true,
    "answers": [
      {
        "questionId": "...",
        "selectedOptionIndex": 0,
        "isCorrect": true,
        "marksObtained": 1
      }
    ]
  }
}
```

> Admin `isResultPublished = true` করলে তবেই student result দেখতে পারবেন।

---

## 7. MCQ Exam Attempt Flow

Exam দেওয়ার পুরো flow step by step:

```
Step 1: Verify Access Code (যদি exam-এ code থাকে)
Step 2: Start Exam
Step 3: Save Answers (প্রতিটি answer দেওয়ার সাথে সাথে)
Step 4: Submit Exam (manually বা auto)
Step 5: View Result (admin publish করলে)
```

---

### Step 1: Verify Exam Access Code

Access code যাচাই করার জন্য।

```
POST /mcq/exams/:examId/verify-code
```

**Headers:** `Authorization: Bearer <token>` ✅

**Request Body:**

```json
{
  "accessCode": "TARIFJS2024"
}
```

| Field        | Type   | Required | Description                |
| ------------ | ------ | -------- | -------------------------- |
| `accessCode` | string | ✅       | Exam-এর secret access code |

**Response:**

```json
{
  "success": true,
  "message": "Access code verified"
}
```

---

### Step 2: Start MCQ Exam

Exam শুরু করার জন্য।

```
POST /mcq/exams/:examId/start
```

**Headers:** `Authorization: Bearer <token>` ✅

**Request Body:** (Access code থাকলে)

```json
{
  "accessCode": "TARIFJS2024"
}
```

| Field        | Type   | Required | Description                       |
| ------------ | ------ | -------- | --------------------------------- |
| `accessCode` | string | ❌       | Exam-এ access code থাকলে দিতে হবে |

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "submission_id",
    "examId": "...",
    "studentId": "...",
    "status": "in_progress",
    "startedAt": "2024-12-01T10:00:00.000Z",
    "answers": []
  }
}
```

---

### Step 2b: Get Current Submission (Resume করতে)

Page refresh হলে existing submission retrieve করার জন্য।

```
GET /mcq/exams/:examId/submission
```

**Headers:** `Authorization: Bearer <token>` ✅

**Response:** Current `McqSubmission` object (in_progress status সহ)

---

### Step 3: Save MCQ Answer

প্রতিটি answer দেওয়ার সাথে সাথে save করার জন্য।

```
POST /mcq/exams/:examId/answer
```

**Headers:** `Authorization: Bearer <token>` ✅

**Request Body:**

```json
{
  "questionId": "64abc123...",
  "selectedOptionIndex": 0
}
```

| Field                 | Type           | Required | Description                                             |
| --------------------- | -------------- | -------- | ------------------------------------------------------- |
| `questionId`          | string         | ✅       | প্রশ্নের ID                                             |
| `selectedOptionIndex` | number \| null | ✅       | Selected option এর index (0-based), `null` = unanswered |

**Response:**

```json
{
  "success": true,
  "data": {
    "questionId": "...",
    "selectedOptionIndex": 0
  }
}
```

> **Important:** প্রতিটি answer real-time এ server-এ save হয়। Browser close/refresh হলেও answers থাকবে।

---

### Step 4: Submit MCQ Exam

Exam জমা দেওয়ার জন্য।

```
POST /mcq/exams/:examId/submit
```

**Headers:** `Authorization: Bearer <token>` ✅

**Request Body:**

```json
{
  "isAutoSubmit": false
}
```

| Field          | Type    | Required | Description                                              |
| -------------- | ------- | -------- | -------------------------------------------------------- |
| `isAutoSubmit` | boolean | ✅       | `false` = manual submit, `true` = timer শেষে auto submit |

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "status": "submitted",
    "totalMarks": 50,
    "obtainedMarks": 42,
    "percentage": 84,
    "isPassed": true,
    "isAutoSubmitted": false,
    "submittedAt": "2024-12-01T10:28:00.000Z"
  }
}
```

---

---

# 🔵 Shared APIs (Both Panels)

উভয় panel-এ ব্যবহার হয় এমন API।

---

### Get MCQ Exam Leaderboard

Exam-এর top performers দেখার জন্য।

```
GET /mcq/exams/:examId/leaderboard?limit=10
```

**Headers:** `Authorization: Bearer <token>` ✅

**Query Parameters:**

| Parameter | Type   | Required | Default | Description |
| --------- | ------ | -------- | ------- | ----------- |
| `limit`   | number | ❌       | 10      | কতজন দেখাবে |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "studentId": {
        "fullName": "John Doe",
        "email": "john@example.com"
      },
      "obtainedMarks": 48,
      "percentage": 96,
      "submittedAt": "2024-12-01T10:15:00.000Z"
    },
    {
      "rank": 2,
      "studentId": {
        "fullName": "Jane Smith",
        "email": "jane@example.com"
      },
      "obtainedMarks": 45,
      "percentage": 90,
      "submittedAt": "2024-12-01T10:22:00.000Z"
    }
  ]
}
```

---

---

## Enrollment Status Flow

```
Student enrolls → status: "pending"
       ↓
Admin reviews payment
       ↓
  ┌────────────┐
  │  Approve   │ → status: "approved" → Student can access content
  └────────────┘
  ┌────────────┐
  │  Reject    │ → status: "rejected" → Student needs to re-enroll
  └────────────┘
```

## MCQ Exam Lifecycle (Admin)

```
Create Exam → Add Questions → Toggle Publish (Students can see)
     ↓
Students take exam
     ↓
Admin reviews submissions → Publish Results (Students can see results)
     ↓
Admin can Unpublish Results if needed
```

## Video Upload Flow (Admin)

```
Upload Video (FormData) → Bunny CDN receives file
          ↓
  Async encoding starts (status: "processing")
          ↓
  Check status: GET /videos/:videoId/status
          ↓
  status: "ready" → Students can stream
```

---

## Error Responses

সব API এ error হলে এই format এ response আসে:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation error: email is required",
  "data": null
}
```

**Common HTTP Status Codes:**

| Code  | Meaning                              |
| ----- | ------------------------------------ |
| `200` | Success                              |
| `201` | Created                              |
| `400` | Bad Request (Validation error)       |
| `401` | Unauthorized (Token missing/invalid) |
| `403` | Forbidden (Permission denied)        |
| `404` | Not Found                            |
| `500` | Internal Server Error                |

---

_Documentation generated from [lib/api.ts](lib/api.ts) — TarifAcademy Frontend_
