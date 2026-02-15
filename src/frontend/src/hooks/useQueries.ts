import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Course, Announcement, StudentProfile } from '../backend';
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
    mutationFn: async (data: { title: string; description: string; instructor: string; schedule: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createCourse(data.title, data.description, data.instructor, data.schedule);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

export function useUpdateCourse() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: bigint; title: string; description: string; instructor: string; schedule: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCourse(data.id, data.title, data.description, data.instructor, data.schedule);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
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
