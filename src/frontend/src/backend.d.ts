import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Course {
    id: bigint;
    title: string;
    instructor: string;
    description: string;
    schedule: string;
    monthlyFee: bigint;
}
export interface StudentProfile {
    age: bigint;
    tuitionCenter: string;
    dateOfBirth: string;
    school: string;
    name: string;
    profilePhoto: Uint8Array;
    studentMobileNumber?: string;
    parentMobileNumber: string;
    batch: string;
    className: string;
}
export type Time = bigint;
export interface EnrollmentRequest {
    status: EnrollmentStatus;
    expiryDate?: Time;
    approvalDate?: Time;
    student: Principal;
    renewalRequest: boolean;
    requestDate: Time;
    courseId: bigint;
}
export interface DailyResult {
    date: Time;
    score: bigint;
    student: Principal;
    resultType: string;
    courseId: bigint;
    remarks: string;
}
export interface AttendanceDay {
    day: bigint;
    status: AttendanceStatus;
    month: bigint;
    year: bigint;
}
export interface AttendanceEntry {
    status: AttendanceStatus;
    date: Time;
}
export interface Announcement {
    id: bigint;
    title: string;
    date: string;
    message: string;
}
export interface TestResult {
    id: bigint;
    date: Time;
    pass: boolean;
    feedback: string;
    score: bigint;
    grade: string;
    student: Principal;
    courseId: bigint;
}
export enum AttendanceStatus {
    present = "present",
    absent = "absent"
}
export enum EnrollmentStatus {
    expired = "expired",
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    approveEnrollment(student: Principal, courseId: bigint): Promise<void>;
    approveRenewal(student: Principal, courseId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createAnnouncement(title: string, message: string, date: string): Promise<void>;
    createCourse(title: string, description: string, instructor: string, schedule: string, monthlyFee: bigint): Promise<void>;
    createStudentProfile(newProfile: StudentProfile): Promise<void>;
    createTestResult(student: Principal, courseId: bigint, score: bigint, grade: string, pass: boolean, feedback: string, date: Time): Promise<void>;
    deleteAnnouncement(id: bigint): Promise<void>;
    deleteCourse(id: bigint): Promise<void>;
    getAllAnnouncements(): Promise<Array<Announcement>>;
    getAllCourses(): Promise<Array<Course>>;
    getAllStudentProfiles(): Promise<Array<[Principal, StudentProfile]>>;
    getAttendanceByDateRange(studentId: Principal, startDate: Time, endDate: Time): Promise<Array<AttendanceEntry>>;
    getAttendanceForMonth(studentId: Principal, year: bigint, month: bigint): Promise<Array<AttendanceDay>>;
    getCallerAttendance(): Promise<Array<AttendanceEntry>>;
    getCallerRole(): Promise<string>;
    getCallerStudentProfile(): Promise<StudentProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactDetails(): Promise<[string, string, string]>;
    getCourse(id: bigint): Promise<Course | null>;
    getCoursesWithEnrollmentStatus(): Promise<{
        courses: Array<Course>;
        expiredEnrollments: Array<bigint>;
        activeEnrollments: Array<bigint>;
        enrollmentRequests: Array<bigint>;
    }>;
    getEnrollmentsByCourse(courseId: bigint): Promise<Array<EnrollmentRequest>>;
    getEnrollmentsByUser(student: Principal): Promise<Array<EnrollmentRequest>>;
    getLogo(): Promise<Uint8Array>;
    getResultsByCourse(courseId: bigint): Promise<{
        testResults: Array<TestResult>;
        dailyResults: Array<DailyResult>;
    }>;
    getResultsByDate(date: Time): Promise<{
        testResults: Array<TestResult>;
        dailyResults: Array<DailyResult>;
    }>;
    getResultsByStudent(student: Principal): Promise<{
        testResults: Array<TestResult>;
        dailyResults: Array<DailyResult>;
    }>;
    getStudentAttendance(studentId: Principal): Promise<Array<AttendanceEntry>>;
    getStudentProfile(studentId: Principal): Promise<StudentProfile | null>;
    getUserRole(user: Principal): Promise<string>;
    isCallerAdmin(): Promise<boolean>;
    markAttendance(studentId: Principal, date: Time, status: AttendanceStatus): Promise<void>;
    postDailyResult(student: Principal, courseId: bigint, date: Time, resultType: string, score: bigint, remarks: string): Promise<void>;
    rejectEnrollment(student: Principal, courseId: bigint): Promise<void>;
    renewEnrollment(student: Principal, courseId: bigint): Promise<void>;
    requestEnrollment(courseId: bigint): Promise<void>;
    requestRenewal(courseId: bigint): Promise<void>;
    updateAnnouncement(id: bigint, title: string, message: string, date: string): Promise<void>;
    updateContactDetails(email: string, phone: string, address: string): Promise<void>;
    updateCourse(id: bigint, title: string, description: string, instructor: string, schedule: string, monthlyFee: bigint): Promise<void>;
    updateDailyResult(student: Principal, courseId: bigint, date: Time, resultType: string, score: bigint, remarks: string): Promise<void>;
    updateLogo(logo: Uint8Array): Promise<void>;
    updateStudentProfile(studentId: Principal, updatedProfile: StudentProfile): Promise<void>;
    updateTestResult(id: bigint, student: Principal, courseId: bigint, score: bigint, grade: string, pass: boolean, feedback: string, date: Time): Promise<void>;
}
