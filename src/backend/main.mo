import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Array "mo:core/Array";
import Principal "mo:core/Principal";


actor {
  // Include Authorization Mixin
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  type StudentProfile = {
    name : Text;
    age : Nat;
    className : Text;
    school : Text;
    batch : Text;
    tuitionCenter : Text;
    parentMobileNumber : Text;
    dateOfBirth : Text;
    profilePhoto : [Nat8];
    studentMobileNumber : ?Text;
  };

  type Course = {
    id : Nat;
    title : Text;
    description : Text;
    instructor : Text;
    schedule : Text;
    monthlyFee : Nat;
  };

  type Announcement = {
    id : Nat;
    title : Text;
    message : Text;
    date : Text;
  };

  type SiteSettings = {
    var logo : [Nat8];
    var contactEmail : Text;
    var contactPhone : Text;
    var address : Text;
  };

  type AttendanceStatus = { #present; #absent };

  type AttendanceEntry = {
    date : Time.Time;
    status : AttendanceStatus;
  };

  type AttendanceDay = {
    year : Nat;
    month : Nat;
    day : Nat;
    status : AttendanceStatus;
  };

  // New Types (for migration)
  type EnrollmentStatus = { #pending; #approved; #rejected; #expired };
  type EnrollmentRequest = {
    student : Principal;
    courseId : Nat;
    requestDate : Time.Time;
    status : EnrollmentStatus;
    approvalDate : ?Time.Time;
    expiryDate : ?Time.Time;
    renewalRequest : Bool;
  };

  type TestResult = {
    id : Nat;
    student : Principal;
    courseId : Nat;
    score : Nat;
    grade : Text;
    pass : Bool;
    feedback : Text;
    date : Time.Time;
  };

  type DailyResult = {
    student : Principal;
    courseId : Nat;
    date : Time.Time;
    resultType : Text;
    score : Nat;
    remarks : Text;
  };

  // State
  let studentProfiles = Map.empty<Principal, StudentProfile>();
  let courses = Map.empty<Nat, Course>();
  let announcements = Map.empty<Nat, Announcement>();
  let attendanceRecords = Map.empty<Principal, List.List<AttendanceEntry>>();
  let enrollmentRequests = List.empty<EnrollmentRequest>();
  let testResults = List.empty<TestResult>();
  let dailyResults = List.empty<DailyResult>();

  var nextCourseId = 1;
  var nextAnnouncementId = 1;
  var nextTestResultId = 1;

  let siteSettings : SiteSettings = {
    var logo = [];
    var contactEmail = "info@tuitioncenter.com";
    var contactPhone = "123-456-7890";
    var address = "123 Tuition Center Street, City, Country";
  };

  // Migration helper for state compatibility
  public type OldActor = {
    courses : Map.Map<Nat, {
      id : Nat;
      title : Text;
      description : Text;
      instructor : Text;
      schedule : Text;
    }>;
  };
  // End helper

  // Course Management
  public shared ({ caller }) func createCourse(title : Text, description : Text, instructor : Text, schedule : Text, monthlyFee : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create courses");
    };

    let course : Course = {
      id = nextCourseId;
      title;
      description;
      instructor;
      schedule;
      monthlyFee;
    };

    courses.add(nextCourseId, course);
    nextCourseId += 1;
  };

  public shared ({ caller }) func updateCourse(id : Nat, title : Text, description : Text, instructor : Text, schedule : Text, monthlyFee : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update courses");
    };

    let course : Course = {
      id;
      title;
      description;
      instructor;
      schedule;
      monthlyFee;
    };

    courses.add(id, course);
  };

  public shared ({ caller }) func deleteCourse(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete courses");
    };
    courses.remove(id);
  };

  public query ({ caller }) func getAllCourses() : async [Course] {
    courses.values().toArray();
  };

  public query ({ caller }) func getCourse(id : Nat) : async ?Course {
    courses.get(id);
  };

  // Announcements
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

  public query ({ caller }) func getAllAnnouncements() : async [Announcement] {
    announcements.values().toArray();
  };

  // Student Profiles
  public shared ({ caller }) func createStudentProfile(newProfile : StudentProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create profiles");
    };

    if (studentProfiles.containsKey(caller)) {
      Runtime.trap("Profile already exists. Please contact admin to edit your profile");
    };

    if (newProfile.batch != "Batch 1" and newProfile.batch != "Batch 2") {
      Runtime.trap("Invalid batch: must be either 'Batch 1.. 😎 ' or 'Batch 2.. 🔥 '");
    };

    studentProfiles.add(caller, newProfile);
  };

  public query ({ caller }) func getCallerStudentProfile() : async ?StudentProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access their profile");
    };
    studentProfiles.get(caller);
  };

  public query ({ caller }) func getAllStudentProfiles() : async [(Principal, StudentProfile)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all student profiles");
    };
    studentProfiles.toArray();
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

    if (updatedProfile.batch != "Batch 1" and updatedProfile.batch != "Batch 2") {
      Runtime.trap("Invalid batch: must be either 'Batch 1.. 😎 ' or 'Batch 2.. 🔥 '");
    };

    studentProfiles.add(studentId, updatedProfile);
  };

  // Role Queries
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

  // Site Settings
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
    siteSettings.logo;
  };

  public query ({ caller }) func getContactDetails() : async (Text, Text, Text) {
    (siteSettings.contactEmail, siteSettings.contactPhone, siteSettings.address);
  };

  // Attendance Management
  public shared ({ caller }) func markAttendance(studentId : Principal, date : Time.Time, status : AttendanceStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can mark attendance");
    };

    let currentEntries = switch (attendanceRecords.get(studentId)) {
      case (null) { List.empty<AttendanceEntry>() };
      case (?entries) { entries };
    };

    let newEntry : AttendanceEntry = {
      date;
      status;
    };

    currentEntries.add(newEntry);
    attendanceRecords.add(studentId, currentEntries);
  };

  public query ({ caller }) func getAttendanceForMonth(studentId : Principal, year : Nat, month : Nat) : async [AttendanceDay] {
    if (caller != studentId and not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Can only view your own attendance");
    };

    let numDays = switch (month) {
      case (2) {
        if (year % 4 == 0) { 29 } else { 28 };
      };
      case (4) { 30 };
      case (6) { 30 };
      case (9) { 30 };
      case (11) { 30 };
      case (_) { 31 };
    };

    Array.tabulate<AttendanceDay>(
      numDays,
      func(dayIndex) {
        { year; month; day = dayIndex + 1; status = #absent };
      },
    );
  };

  public query ({ caller }) func getStudentAttendance(studentId : Principal) : async [AttendanceEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view student attendance");
    };
    switch (attendanceRecords.get(studentId)) {
      case (null) { [] };
      case (?entries) { entries.toArray() };
    };
  };

  public query ({ caller }) func getCallerAttendance() : async [AttendanceEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access their attendance");
    };
    switch (attendanceRecords.get(caller)) {
      case (null) { [] };
      case (?entries) { entries.toArray() };
    };
  };

  public query ({ caller }) func getAttendanceByDateRange(studentId : Principal, startDate : Time.Time, endDate : Time.Time) : async [AttendanceEntry] {
    if (caller != studentId and not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Can only view your own attendance");
    };

    switch (attendanceRecords.get(studentId)) {
      case (null) { [] };
      case (?entries) {
        entries.toArray().filter(
          func(entry) {
            entry.date >= startDate and entry.date <= endDate
          }
        );
      };
    };
  };

  // Enrollment Requests and Renewals
  public query ({ caller }) func getCoursesWithEnrollmentStatus() : async {
    courses : [Course];
    activeEnrollments : [Nat];
    expiredEnrollments : [Nat];
    enrollmentRequests : [Nat];
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view enrollment status");
    };

    let allCourses = courses.values().toArray();

    let activeEnrollments = enrollmentRequests.toArray().filter(
      func(req) {
        req.student == caller and req.status == #approved
      }
    );
    let activeEnrollmentsIds = activeEnrollments.map(func(req) { req.courseId });

    let expiredEnrollments = enrollmentRequests.toArray().filter(
      func(req) {
        req.student == caller and req.status == #expired
      }
    );
    let expiredEnrollmentsIds = expiredEnrollments.map(func(req) { req.courseId });

    let enrollmentRequestsFiltered = enrollmentRequests.toArray().filter(
      func(req) {
        req.student == caller and req.status == #pending
      }
    );
    let enrollmentRequestsIds = enrollmentRequestsFiltered.map(func(req) { req.courseId });

    {
      courses = allCourses;
      activeEnrollments = activeEnrollmentsIds;
      expiredEnrollments = expiredEnrollmentsIds;
      enrollmentRequests = enrollmentRequestsIds;
    };
  };

  public shared ({ caller }) func requestEnrollment(courseId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only students can request enrollment");
    };

    switch (courses.get(courseId)) {
      case (null) { Runtime.trap("Course not found") };
      case (?_course) {};
    };

    let existingRequest = enrollmentRequests.toArray().find(
      func(req) { req.student == caller and req.courseId == courseId }
    );
    switch (existingRequest) {
      case (?existingReq) {
        switch (existingReq.status) {
          case (#pending) { Runtime.trap("Enrollment request already pending approval") };
          case (#approved) { Runtime.trap("You already have access to this course") };
          case (#expired) { Runtime.trap("Request renewal for expired enrollments") };
          case (#rejected) { Runtime.trap("Enrollment was rejected. Please contact admin for more details") };
        };
      };
      case (null) {
        let newRequest : EnrollmentRequest = {
          student = caller;
          courseId;
          requestDate = Time.now();
          status = #pending;
          approvalDate = null;
          expiryDate = null;
          renewalRequest = false;
        };
        enrollmentRequests.add(newRequest);
      };
    };
  };

  public shared ({ caller }) func approveEnrollment(student : Principal, courseId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Only admins can approve enrollments");
    };

    switch (courses.get(courseId)) {
      case (null) { Runtime.trap("Course not found") };
      case (?_course) {};
    };

    let requestIndex = getRequestIndex(student, courseId, #pending);
    switch (requestIndex) {
      case (null) { Runtime.trap("Pending enrollment request not found") };
      case (?index) {
        let listSize = enrollmentRequests.size();
        if (index >= listSize) {
          Runtime.trap("Invalid request index: " # debug_show (index));
        };
        let request = enrollmentRequests.at(index);
        let updatedRequest : EnrollmentRequest = {
          request with
          status = #approved;
          approvalDate = ?Time.now();
          expiryDate = ?(Time.now() + (30 * 24 * 60 * 60 * 1000000000));
        };
        updateRequestAtIndex(index, updatedRequest);
      };
    };
  };

  public shared ({ caller }) func rejectEnrollment(student : Principal, courseId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Only admins can reject enrollments");
    };

    let listSize = enrollmentRequests.size();
    switch (listSize) {
      case (0) { Runtime.trap("No enrollment requests available") };
      case (_) {
        let requestIndex = getRequestIndex(student, courseId, #pending);
        switch (requestIndex) {
          case (null) { Runtime.trap("Pending enrollment request not found") };
          case (?index) {
            if (index >= listSize) {
              Runtime.trap("Invalid request index: " # debug_show (index));
            };
            let request = enrollmentRequests.at(index);
            let updatedRequest : EnrollmentRequest = {
              request with
              status = #rejected;
              approvalDate = null;
              expiryDate = null;
            };
            updateRequestAtIndex(index, updatedRequest);
          };
        };
      };
    };
  };

  public shared ({ caller }) func requestRenewal(courseId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only students can request renewals");
    };

    let requestIndex = getRequestIndex(caller, courseId, #expired);
    switch (requestIndex) {
      case (null) { Runtime.trap("Expired enrollment not found") };
      case (?index) {
        let request = enrollmentRequests.at(index);
        let updatedRequest : EnrollmentRequest = {
          request with
          status = #pending;
          renewalRequest = true;
        };
        updateRequestAtIndex(index, updatedRequest);
      };
    };
  };

  public shared ({ caller }) func approveRenewal(student : Principal, courseId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Only admins can approve renewals");
    };

    let requestIndex = getRequestIndex(student, courseId, #pending);
    switch (requestIndex) {
      case (null) { Runtime.trap("Pending renewal request not found") };
      case (?index) {
        let request = enrollmentRequests.at(index);
        if (request.renewalRequest) {
          let updatedRequest : EnrollmentRequest = {
            request with
            status = #approved;
            approvalDate = ?Time.now();
            expiryDate = ?(Time.now() + (30 * 24 * 60 * 60 * 1000000000));
            renewalRequest = false;
          };
          updateRequestAtIndex(index, updatedRequest);
        } else {
          Runtime.trap("Not a renewal request");
        };
      };
    };
  };

  public shared ({ caller }) func renewEnrollment(student : Principal, courseId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Only admins can renew enrollments");
    };

    let requestIndex = getRequestIndex(student, courseId, #expired);
    switch (requestIndex) {
      case (null) { Runtime.trap("Expired enrollment not found") };
      case (?index) {
        let request = enrollmentRequests.at(index);
        let updatedRequest : EnrollmentRequest = {
          request with
          status = #approved;
          approvalDate = ?Time.now();
          expiryDate = ?(Time.now() + (30 * 24 * 60 * 60 * 1000000000));
          renewalRequest = false;
        };
        updateRequestAtIndex(index, updatedRequest);
      };
    };
  };

  public query ({ caller }) func getEnrollmentsByUser(student : Principal) : async [EnrollmentRequest] {
    if (caller != student and not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("You can only view your own enrollment requests");
    };

    enrollmentRequests.toArray().filter(
      func(req) { req.student == student }
    );
  };

  public query ({ caller }) func getEnrollmentsByCourse(courseId : Nat) : async [EnrollmentRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view enrollments by course");
    };

    enrollmentRequests.toArray().filter(
      func(req) { req.courseId == courseId }
    );
  };

  // Helper Functions to Support Migration
  func getRequestIndex(student : Principal, courseId : Nat, status : EnrollmentStatus) : ?Nat {
    let requests = enrollmentRequests.toArray();
    var index = 0;
    while (index < requests.size()) {
      let req = requests[index];
      if (req.student == student and req.courseId == courseId and req.status == status) {
        return ?index;
      };
      index += 1;
    };
    null;
  };

  func updateRequestAtIndex(index : Nat, updatedRequest : EnrollmentRequest) {
    let listSize = enrollmentRequests.size();
    if (index >= listSize) {
      Runtime.trap("Item index out of bounds: " # debug_show (index));
    };

    let currentRequests = enrollmentRequests.toArray();
    if (index >= currentRequests.size()) {
      Runtime.trap("Item index out of bounds: " # debug_show (index));
    };

    let newRequests = Array.tabulate(
      currentRequests.size(),
      func(i) { if (i == index) { updatedRequest } else { currentRequests[i] } },
    );

    let newList = List.empty<EnrollmentRequest>();
    for (req in newRequests.values()) {
      newList.add(req);
    };
    enrollmentRequests.clear();
    for (req in newList.values()) {
      enrollmentRequests.add(req);
    };
  };

  // Results Panel
  public shared ({ caller }) func createTestResult(student : Principal, courseId : Nat, score : Nat, grade : Text, pass : Bool, feedback : Text, date : Time.Time) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create test results");
    };

    let testResult : TestResult = {
      id = nextTestResultId;
      student;
      courseId;
      score;
      grade;
      pass;
      feedback;
      date;
    };

    testResults.add(testResult);
    nextTestResultId += 1;
  };

  public shared ({ caller }) func postDailyResult(student : Principal, courseId : Nat, date : Time.Time, resultType : Text, score : Nat, remarks : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can post daily results");
    };

    let dailyResult : DailyResult = {
      student;
      courseId;
      date;
      resultType;
      score;
      remarks;
    };

    dailyResults.add(dailyResult);
  };

  public query ({ caller }) func getResultsByStudent(student : Principal) : async {
    testResults : [TestResult];
    dailyResults : [DailyResult];
  } {
    if (caller != student and not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("You can only view your own results");
    };

    let studentTestResults = testResults.toArray().filter(
      func(result) { result.student == student }
    );
    let studentDailyResults = dailyResults.toArray().filter(
      func(result) { result.student == student }
    );

    {
      testResults = studentTestResults;
      dailyResults = studentDailyResults;
    };
  };

  public query ({ caller }) func getResultsByCourse(courseId : Nat) : async {
    testResults : [TestResult];
    dailyResults : [DailyResult];
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view results by course");
    };

    let courseTestResults = testResults.toArray().filter(
      func(result) { result.courseId == courseId }
    );
    let courseDailyResults = dailyResults.toArray().filter(
      func(result) { result.courseId == courseId }
    );

    {
      testResults = courseTestResults;
      dailyResults = courseDailyResults;
    };
  };

  public query ({ caller }) func getResultsByDate(date : Time.Time) : async {
    testResults : [TestResult];
    dailyResults : [DailyResult];
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view results by date");
    };

    let testResultsByDate = testResults.toArray().filter(
      func(result) { result.date == date }
    );
    let dailyResultsByDate = dailyResults.toArray().filter(
      func(result) { result.date == date }
    );

    {
      testResults = testResultsByDate;
      dailyResults = dailyResultsByDate;
    };
  };

  public shared ({ caller }) func updateTestResult(id : Nat, student : Principal, courseId : Nat, score : Nat, grade : Text, pass : Bool, feedback : Text, date : Time.Time) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update test results");
    };

    let oldTestResults = testResults.toArray();
    let newTestResults = oldTestResults.map(
      func(result) {
        if (result.id == id) {
          {
            id;
            student;
            courseId;
            score;
            grade;
            pass;
            feedback;
            date;
          };
        } else { result };
      }
    );
    testResults.clear();
    for (result in newTestResults.values()) {
      testResults.add(result);
    };
  };

  public shared ({ caller }) func updateDailyResult(student : Principal, courseId : Nat, date : Time.Time, resultType : Text, score : Nat, remarks : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update daily results");
    };

    let oldDailyResults = dailyResults.toArray();
    let newDailyResults = oldDailyResults.map(
      func(result) {
        if (result.student == student and result.courseId == courseId and result.date == date and result.resultType == resultType) {
          {
            student;
            courseId;
            date;
            resultType;
            score;
            remarks;
          };
        } else { result };
      }
    );
    dailyResults.clear();
    for (result in newDailyResults.values()) {
      dailyResults.add(result);
    };
  };
};
