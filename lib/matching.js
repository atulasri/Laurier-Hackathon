/**
 * Score two profiles against each other.
 * Returns 0–100. Profiles must share at least one course to be shown.
 */
export function scoreMatch(myProfile, theirProfile) {
  // Hard requirement: at least one shared course
  const sharedCourses = (myProfile.courses || []).filter(c =>
    (theirProfile.courses || []).includes(c)
  );
  if (sharedCourses.length === 0) return 0;

  let score = 0;

  // Availability overlap — HIGH weight (30 pts)
  const mySlots    = new Set(myProfile.availability || []);
  const theirSlots = theirProfile.availability || [];
  const overlapCount = theirSlots.filter(s => mySlots.has(s)).length;
  const maxSlots   = Math.max(mySlots.size, theirSlots.length, 1);
  score += (overlapCount / maxSlots) * 30;

  // Meeting preference — MEDIUM-HIGH weight (25 pts)
  if (myProfile.meeting_preference && theirProfile.meeting_preference) {
    if (myProfile.meeting_preference === theirProfile.meeting_preference) score += 25;
    else if (
      myProfile.meeting_preference === "Hybrid" ||
      theirProfile.meeting_preference === "Hybrid"
    ) score += 12;
  }

  // Shared motivations — MEDIUM weight (20 pts)
  const myMotivations    = new Set(myProfile.motivations || []);
  const theirMotivations = theirProfile.motivations || [];
  const motivOverlap = theirMotivations.filter(m => myMotivations.has(m)).length;
  const maxMotivs    = Math.max(myMotivations.size, theirMotivations.length, 1);
  score += (motivOverlap / maxMotivs) * 20;

  // Shared courses bonus — MEDIUM weight (15 pts)
  score += Math.min(sharedCourses.length / Math.max(myProfile.courses.length, 1), 1) * 15;

  // Same year — LOW weight (5 pts)
  if (myProfile.year && myProfile.year === theirProfile.year) score += 5;

  // Same program — LOW weight (5 pts)
  if (myProfile.program && myProfile.program === theirProfile.program) score += 5;

  return Math.min(Math.round(score), 100);
}

/**
 * Filter out profiles that don't meet gender preference requirements.
 */
export function meetsGenderPreference(myProfile, theirProfile) {
  const pref = myProfile.gender_preference;
  if (!pref || pref === "No preference" || pref === "Any") return true;
  const theirGender = theirProfile.gender;
  if (!theirGender) return true;
  if (pref === "Men only")       return theirGender === "Man";
  if (pref === "Women only")     return theirGender === "Woman";
  if (pref === "Non-binary only") return theirGender === "Non-binary";
  if (pref === "Men & Women")    return ["Man","Woman"].includes(theirGender);
  return true;
}