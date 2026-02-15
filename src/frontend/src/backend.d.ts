import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Announcement {
    id: bigint;
    title: string;
    date: string;
    message: string;
}
export interface StudentProfile {
    age: bigint;
    tuitionCenter: string;
    dateOfBirth: string;
    school: string;
    name: string;
    profilePhoto: string;
    studentMobileNumber?: string;
    parentMobileNumber: string;
    batch: string;
    className: string;
}
export interface Course {
    id: bigint;
    title: string;
    instructor: string;
    description: string;
    schedule: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createAnnouncement(title: string, message: string, date: string): Promise<void>;
    createCourse(title: string, description: string, instructor: string, schedule: string): Promise<void>;
    createStudentProfile(newProfile: StudentProfile): Promise<void>;
    deleteAnnouncement(id: bigint): Promise<void>;
    deleteCourse(id: bigint): Promise<void>;
    getAllAnnouncements(): Promise<Array<Announcement>>;
    getAllCourses(): Promise<Array<Course>>;
    getAllStudentProfiles(): Promise<Array<[Principal, StudentProfile]>>;
    getCallerRole(): Promise<string>;
    getCallerStudentProfile(): Promise<StudentProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactDetails(): Promise<[string, string, string]>;
    getLogo(): Promise<Uint8Array>;
    getStudentProfile(studentId: Principal): Promise<StudentProfile | null>;
    getUserRole(user: Principal): Promise<string>;
    isCallerAdmin(): Promise<boolean>;
    updateAnnouncement(id: bigint, title: string, message: string, date: string): Promise<void>;
    updateContactDetails(email: string, phone: string, address: string): Promise<void>;
    updateCourse(id: bigint, title: string, description: string, instructor: string, schedule: string): Promise<void>;
    updateLogo(logo: Uint8Array): Promise<void>;
    updateStudentProfile(studentId: Principal, updatedProfile: StudentProfile): Promise<void>;
}
