import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Course, Announcement, StudentProfile, AttendanceDay, AttendanceEntry, AttendanceStatus, Time, EnrollmentRequest, TestResult, DailyResult } from '../backend';
import { Principal } from '@icp-sdk/core/principal';

// Student Profile Queries
export function useGetCallerStudentProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<StudentProfile | null>({
    queryKey: ['callerStudentProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerStudentProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useCreateStudentProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: StudentProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createStudentProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callerStudentProfile'] });
      queryClient.invalidateQueries({ queryKey: ['allStudentProfiles'] });
    },
  });
}

// Admin Student Profile Queries
export function useGetAllStudentProfiles() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Array<[Principal, StudentProfile]>>({
    queryKey: ['allStudentProfiles'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStudentProfiles();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useUpdateStudentProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { studentId: Principal; profile: StudentProfile }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateStudentProfile(data.studentId, data.profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allStudentProfiles'] });
      queryClient.invalidateQueries({ queryKey: ['callerStudentProfile'] });
    },
  });
}

// Role Queries
export function useGetCallerRole() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string>({
    queryKey: ['callerRole'],
    queryFn: async () => {
      if (!actor) return 'Guest';
      return actor.getCallerRole();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Content Queries (Public)
export function useGetAllCourses() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCourses();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAllAnnouncements() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Announcement[]>({
    queryKey: ['announcements'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAnnouncements();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Admin Mutations - Courses
export function useCreateCourse() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title: string; description: string; instructor: string; schedule: string; monthlyFee: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createCourse(data.title, data.description, data.instructor, data.schedule, data.monthlyFee);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['coursesWithEnrollmentStatus'] });
    },
  });
}

export function useUpdateCourse() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: bigint; title: string; description: string; instructor: string; schedule: string; monthlyFee: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCourse(data.id, data.title, data.description, data.instructor, data.schedule, data.monthlyFee);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['coursesWithEnrollmentStatus'] });
    },
  });
}

export function useDeleteCourse() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteCourse(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['coursesWithEnrollmentStatus'] });
    },
  });
}

// Admin Mutations - Announcements
export function useCreateAnnouncement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title: string; message: string; date: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createAnnouncement(data.title, data.message, data.date);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
}

export function useUpdateAnnouncement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: bigint; title: string; message: string; date: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateAnnouncement(data.id, data.title, data.message, data.date);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
}

export function useDeleteAnnouncement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteAnnouncement(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
}

// Site Settings Queries (Public - available to all users)
export function useGetLogo() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Uint8Array>({
    queryKey: ['siteLogo'],
    queryFn: async () => {
      if (!actor) return new Uint8Array();
      return actor.getLogo();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

export function useGetContactDetails() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<{ email: string; phone: string; address: string }>({
    queryKey: ['contactDetails'],
    queryFn: async () => {
      if (!actor) return { email: '', phone: '', address: '' };
      const [email, phone, address] = await actor.getContactDetails();
      return { email, phone, address };
    },
    enabled: !!actor && !actorFetching,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

// Admin Mutations - Site Settings
export function useUpdateLogo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (logo: Uint8Array) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateLogo(logo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteLogo'] });
    },
  });
}

export function useUpdateContactDetails() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { email: string; phone: string; address: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateContactDetails(data.email, data.phone, data.address);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactDetails'] });
    },
  });
}

// Attendance Queries and Mutations
export function useMarkAttendance() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { studentId: Principal; date: Time; status: AttendanceStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.markAttendance(data.studentId, data.date, data.status);
    },
    onSuccess: (_, variables) => {
      // Invalidate attendance queries for the affected student
      queryClient.invalidateQueries({ 
        queryKey: ['studentAttendance', variables.studentId.toString()] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['attendanceForMonth', variables.studentId.toString()] 
      });
    },
  });
}

export function useGetAttendanceForMonth(studentId: Principal | null, year: number, month: number) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AttendanceDay[]>({
    queryKey: ['attendanceForMonth', studentId?.toString(), year, month],
    queryFn: async () => {
      if (!actor || !studentId) return [];
      return actor.getAttendanceForMonth(studentId, BigInt(year), BigInt(month));
    },
    enabled: !!actor && !actorFetching && !!studentId,
  });
}

export function useGetCallerAttendance() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AttendanceEntry[]>({
    queryKey: ['callerAttendance'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCallerAttendance();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetStudentAttendance(studentId: Principal | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AttendanceEntry[]>({
    queryKey: ['studentAttendance', studentId?.toString()],
    queryFn: async () => {
      if (!actor || !studentId) return [];
      return actor.getStudentAttendance(studentId);
    },
    enabled: !!actor && !actorFetching && !!studentId,
  });
}

// Enrollment Queries and Mutations
export function useGetCoursesWithEnrollmentStatus() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<{
    courses: Course[];
    activeEnrollments: bigint[];
    expiredEnrollments: bigint[];
    enrollmentRequests: bigint[];
  }>({
    queryKey: ['coursesWithEnrollmentStatus'],
    queryFn: async () => {
      if (!actor) return { courses: [], activeEnrollments: [], expiredEnrollments: [], enrollmentRequests: [] };
      return actor.getCoursesWithEnrollmentStatus();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useRequestEnrollment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.requestEnrollment(courseId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coursesWithEnrollmentStatus'] });
      queryClient.invalidateQueries({ queryKey: ['enrollmentsByUser'] });
    },
  });
}

export function useRequestRenewal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.requestRenewal(courseId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coursesWithEnrollmentStatus'] });
      queryClient.invalidateQueries({ queryKey: ['enrollmentsByUser'] });
    },
  });
}

export function useGetEnrollmentsByUser(student: Principal | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<EnrollmentRequest[]>({
    queryKey: ['enrollmentsByUser', student?.toString()],
    queryFn: async () => {
      if (!actor || !student) return [];
      return actor.getEnrollmentsByUser(student);
    },
    enabled: !!actor && !actorFetching && !!student,
  });
}

export function useGetEnrollmentsByCourse(courseId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<EnrollmentRequest[]>({
    queryKey: ['enrollmentsByCourse', courseId?.toString()],
    queryFn: async () => {
      if (!actor || courseId === null) return [];
      return actor.getEnrollmentsByCourse(courseId);
    },
    enabled: !!actor && !actorFetching && courseId !== null,
  });
}

export function useApproveEnrollment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { student: Principal; courseId: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveEnrollment(data.student, data.courseId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollmentsByUser'] });
      queryClient.invalidateQueries({ queryKey: ['enrollmentsByCourse'] });
      queryClient.invalidateQueries({ queryKey: ['coursesWithEnrollmentStatus'] });
    },
  });
}

export function useRejectEnrollment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { student: Principal; courseId: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectEnrollment(data.student, data.courseId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollmentsByUser'] });
      queryClient.invalidateQueries({ queryKey: ['enrollmentsByCourse'] });
      queryClient.invalidateQueries({ queryKey: ['coursesWithEnrollmentStatus'] });
    },
  });
}

export function useApproveRenewal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { student: Principal; courseId: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveRenewal(data.student, data.courseId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollmentsByUser'] });
      queryClient.invalidateQueries({ queryKey: ['enrollmentsByCourse'] });
      queryClient.invalidateQueries({ queryKey: ['coursesWithEnrollmentStatus'] });
    },
  });
}

export function useRenewEnrollment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { student: Principal; courseId: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.renewEnrollment(data.student, data.courseId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollmentsByUser'] });
      queryClient.invalidateQueries({ queryKey: ['enrollmentsByCourse'] });
      queryClient.invalidateQueries({ queryKey: ['coursesWithEnrollmentStatus'] });
    },
  });
}

// Results Queries and Mutations
export function useGetResultsByStudent(student: Principal | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<{ testResults: TestResult[]; dailyResults: DailyResult[] }>({
    queryKey: ['resultsByStudent', student?.toString()],
    queryFn: async () => {
      if (!actor || !student) return { testResults: [], dailyResults: [] };
      return actor.getResultsByStudent(student);
    },
    enabled: !!actor && !actorFetching && !!student,
  });
}

export function useGetResultsByCourse(courseId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<{ testResults: TestResult[]; dailyResults: DailyResult[] }>({
    queryKey: ['resultsByCourse', courseId?.toString()],
    queryFn: async () => {
      if (!actor || courseId === null) return { testResults: [], dailyResults: [] };
      return actor.getResultsByCourse(courseId);
    },
    enabled: !!actor && !actorFetching && courseId !== null,
  });
}

export function useCreateTestResult() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      student: Principal;
      courseId: bigint;
      score: bigint;
      grade: string;
      pass: boolean;
      feedback: string;
      date: Time;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTestResult(
        data.student,
        data.courseId,
        data.score,
        data.grade,
        data.pass,
        data.feedback,
        data.date
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['resultsByStudent', variables.student.toString()] });
      queryClient.invalidateQueries({ queryKey: ['resultsByCourse', variables.courseId.toString()] });
    },
  });
}

export function usePostDailyResult() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      student: Principal;
      courseId: bigint;
      date: Time;
      resultType: string;
      score: bigint;
      remarks: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.postDailyResult(
        data.student,
        data.courseId,
        data.date,
        data.resultType,
        data.score,
        data.remarks
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['resultsByStudent', variables.student.toString()] });
      queryClient.invalidateQueries({ queryKey: ['resultsByCourse', variables.courseId.toString()] });
    },
  });
}
