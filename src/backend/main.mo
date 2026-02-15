import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Type for course modules
  public type Course = {
    id : Nat;
    title : Text;
    description : Text;
    instructor : Text;
    schedule : Text;
  };

  // Type for announcements
  public type Announcement = {
    id : Nat;
    title : Text;
    message : Text;
    date : Text;
  };

  // Type for full student profile
  public type StudentProfile = {
    name : Text;
    age : Nat;
    className : Text;
    school : Text;
    batch : Text; // "Batch 1" or "Batch 2"
    tuitionCenter : Text;
    parentMobileNumber : Text;
    dateOfBirth : Text;
    profilePhoto : Text;
    studentMobileNumber : ?Text;
  };

  // Profile for new sign-up
  public type NewStudentProfile = {
    name : Text;
    age : Nat;
    className : Text;
    school : Text;
    batch : Text; // "Batch 1" or "Batch 2"
    tuitionCenter : Text;
    parentMobileNumber : Text;
    dateOfBirth : Text;
    profilePhoto : Text;
    studentMobileNumber : ?Text;
  };

  // Map from principal (student id) to student profile
  let studentProfiles = Map.empty<Principal, StudentProfile>();

  // Map from course id to course
  let courses = Map.empty<Nat, Course>();

  // Map from announcement id to announcement
  let announcements = Map.empty<Nat, Announcement>();

  var nextCourseId = 1;
  var nextAnnouncementId = 1;

  // Type for site settings (NEW)
  type SiteSettings = {
    var logo : [Nat8]; // Logo image as bytes
    var contactEmail : Text;
    var contactPhone : Text;
    var address : Text;
  };

  // Initialize default site settings (NEW)
  let siteSettings : SiteSettings = {
    var logo = [];
    var contactEmail = "info@tuitioncenter.com";
    var contactPhone = "123-456-7890";
    var address = "123 Tuition Center Street, City, Country";
  };

  // Course Management (Admin only)
  public shared ({ caller }) func createCourse(title : Text, description : Text, instructor : Text, schedule : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create courses");
    };

    let course : Course = {
      id = nextCourseId;
      title;
      description;
      instructor;
      schedule;
    };

    courses.add(nextCourseId, course);
    nextCourseId += 1;
  };

  public shared ({ caller }) func updateCourse(id : Nat, title : Text, description : Text, instructor : Text, schedule : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update courses");
    };

    let course : Course = {
      id;
      title;
      description;
      instructor;
      schedule;
    };

    courses.add(id, course);
  };

  public shared ({ caller }) func deleteCourse(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete courses");
    };

    courses.remove(id);
  };

  // Announcement Management (Admin only)
  public shared ({ caller }) func createAnnouncement(title : Text, message : Text, date : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create announcements");
    };

    let announcement : Announcement = {
      id = nextAnnouncementId;
      title;
      message;
      date;
    };

    announcements.add(nextAnnouncementId, announcement);
    nextAnnouncementId += 1;
  };

  public shared ({ caller }) func updateAnnouncement(id : Nat, title : Text, message : Text, date : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update announcements");
    };

    let announcement : Announcement = {
      id;
      title;
      message;
      date;
    };

    announcements.add(id, announcement);
  };

  public shared ({ caller }) func deleteAnnouncement(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete announcements");
    };

    announcements.remove(id);
  };

  // Public read access to courses and announcements (available on public site and student dashboard)
  public query func getAllCourses() : async [Course] {
    courses.values().toArray();
  };

  public query func getAllAnnouncements() : async [Announcement] {
    announcements.values().toArray();
  };

  // Student Profile Management
  // USER (student) functions - only students can create their own profile, admins cannot
  public shared ({ caller }) func createStudentProfile(newProfile : StudentProfile) : async () {
    // Check that caller is a user (student), not admin or guest
    let role = AccessControl.getUserRole(accessControlState, caller);
    if (role != #user) {
      Runtime.trap("Unauthorized: Only students can create profiles");
    };

    // Check if profile already exists
    if (studentProfiles.containsKey(caller)) {
      Runtime.trap("Profile already exists. Please contact admin to edit your profile");
    };

    // Validate batch field
    if (newProfile.batch != "Batch 1" and newProfile.batch != "Batch 2") {
      Runtime.trap("Invalid batch: must be either 'Batch 1' or 'Batch 2'");
    };

    studentProfiles.add(caller, newProfile);
  };

  // Students can only view their own profile
  public query ({ caller }) func getCallerStudentProfile() : async ?StudentProfile {
    // Check that caller is a user (student)
    let role = AccessControl.getUserRole(accessControlState, caller);
    if (role != #user) {
      Runtime.trap("Unauthorized: Only students can access their profile");
    };
    studentProfiles.get(caller);
  };

  // ADMIN functions - admins can view and edit all student profiles
  public query ({ caller }) func getAllStudentProfiles() : async [(Principal, StudentProfile)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all student profiles");
    };

    let entries = studentProfiles.toArray();
    entries;
  };

  public query ({ caller }) func getStudentProfile(studentId : Principal) : async ?StudentProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access this information");
    };

    studentProfiles.get(studentId);
  };

  public shared ({ caller }) func updateStudentProfile(studentId : Principal, updatedProfile : StudentProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update student profiles");
    };

    if (not studentProfiles.containsKey(studentId)) {
      Runtime.trap("Student profile does not exist");
    };

    // Validate batch field
    if (updatedProfile.batch != "Batch 1" and updatedProfile.batch != "Batch 2") {
      Runtime.trap("Invalid batch: must be either 'Batch 1' or 'Batch 2'");
    };

    studentProfiles.add(studentId, updatedProfile);
  };

  // Role information (users can check their own role, admins can check any role)
  public query ({ caller }) func getCallerRole() : async Text {
    let role = AccessControl.getUserRole(accessControlState, caller);
    switch (role) {
      case (#admin) { "Admin" };
      case (#user) { "Student" };
      case (#guest) { "Guest" };
    };
  };

  public query ({ caller }) func getUserRole(user : Principal) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view other users' roles");
    };

    let role = AccessControl.getUserRole(accessControlState, user);
    switch (role) {
      case (#admin) { "Admin" };
      case (#user) { "Student" };
      case (#guest) { "Guest" };
    };
  };

  // Site Settings (NEW)
  public shared ({ caller }) func updateLogo(logo : [Nat8]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update logo");
    };
    siteSettings.logo := logo;
  };

  public shared ({ caller }) func updateContactDetails(email : Text, phone : Text, address : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update contact details");
    };
    siteSettings.contactEmail := email;
    siteSettings.contactPhone := phone;
    siteSettings.address := address;
  };

  public query ({ caller }) func getLogo() : async [Nat8] {
    // Allow ALL users to retrieve the logo, even unauthenticated.
    siteSettings.logo;
  };

  public query ({ caller }) func getContactDetails() : async (Text, Text, Text) {
    // Allow ALL users to retrieve contact details, even unauthenticated.
    (siteSettings.contactEmail, siteSettings.contactPhone, siteSettings.address);
  };
};
