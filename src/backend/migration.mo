import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";

module {
  // Old types (without siteSettings)
  type OldActor = {
    studentProfiles : Map.Map<Principal, StudentProfile>;
    courses : Map.Map<Nat, Course>;
    announcements : Map.Map<Nat, Announcement>;
    nextCourseId : Nat;
    nextAnnouncementId : Nat;
  };

  type Course = {
    id : Nat;
    title : Text;
    description : Text;
    instructor : Text;
    schedule : Text;
  };

  type Announcement = {
    id : Nat;
    title : Text;
    message : Text;
    date : Text;
  };

  type StudentProfile = {
    name : Text;
    age : Nat;
    className : Text;
    school : Text;
    batch : Text;
    tuitionCenter : Text;
    parentMobileNumber : Text;
    dateOfBirth : Text;
    profilePhoto : Text;
    studentMobileNumber : ?Text;
  };

  // New siteSettings type
  type SiteSettings = {
    var logo : [Nat8];
    var contactEmail : Text;
    var contactPhone : Text;
    var address : Text;
  };

  type NewActor = {
    studentProfiles : Map.Map<Principal, StudentProfile>;
    courses : Map.Map<Nat, Course>;
    announcements : Map.Map<Nat, Announcement>;
    nextCourseId : Nat;
    nextAnnouncementId : Nat;
    siteSettings : SiteSettings;
  };

  public func run(old : OldActor) : NewActor {
    let newSiteSettings : SiteSettings = {
      var logo = [];
      var contactEmail = "info@tuitioncenter.com";
      var contactPhone = "123-456-7890";
      var address = "123 Tuition Center Street, City, Country";
    };

    { old with siteSettings = newSiteSettings };
  };
};
