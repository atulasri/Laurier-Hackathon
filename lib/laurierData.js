export const PROGRAMS_BY_FACULTY = {
  "Lazarides School of Business & Economics": [
    "Business Administration (BBA)",
    "Accounting & Financial Management",
    "Business Technology Management",
    "Economics",
    "Finance",
    "Marketing",
    "Human Resource Management",
    "Supply Chain Management",
    "Entrepreneurship",
  ],
  "Faculty of Science": [
    "Computer Science",
    "Mathematics",
    "Statistics",
    "Biology",
    "Chemistry",
    "Physics",
    "Biochemistry",
    "Environmental Science",
    "Kinesiology & Physical Education",
    "Neuroscience",
    "Health Sciences",
  ],
  "Faculty of Arts": [
    "Communication Studies",
    "English",
    "History",
    "Philosophy",
    "Political Science",
    "Psychology",
    "Sociology",
    "Religion & Culture",
    "Cultural Studies",
    "Global Studies",
    "Indigenous Studies",
    "Women & Gender Studies",
    "French",
    "Geography",
    "Theatre & Film Studies",
  ],
  "Faculty of Music": [
    "Music (Performance)",
    "Music (Education)",
    "Music Therapy",
  ],
  "Faculty of Social Work": ["Social Work"],
  "Brantford Campus": [
    "Criminology",
    "Law & Society",
    "Digital Media & Journalism",
    "Human Rights & Human Diversity",
    "Game Design & Development",
    "Policing",
    "Concurrent Education",
  ],
};

export const ALL_PROGRAMS = Object.values(PROGRAMS_BY_FACULTY).flat();

export const COURSES_BY_PROGRAM = {
  "Computer Science": [
    "CP104","CP114","CP164","CP213","CP214","CP216","CP264",
    "CP312","CP317","CP321","CP363","CP372","CP386","CP414",
    "CP431","CP440","CP468","CP470","CP476",
    "CS110","CS115","CS116","CS203","CS230","CS235",
  ],
  "Mathematics": [
    "MA100","MA103","MA104","MA110","MA121","MA122","MA129",
    "MA170","MA205","MA225","MA238","MA240","MA250","MA270",
    "MA271","MA307","MA340","MA341","MA350","MA371","MA405","MA460",
  ],
  "Statistics": [
    "MA240","MA121","MA122","ST259","ST260","ST361","ST362","ST461","ST462",
  ],
  "Business Administration (BBA)": [
    "BU111","BU121","BU127","BU131","BU231","BU233","BU247",
    "BU248","BU252","BU253","BU275","BU281","BU283","BU284",
    "BU288","BU352","BU353","BU354","BU355","BU362","BU385",
    "BU395","BU411","BU413","BU421","BU450","BU481",
  ],
  "Accounting & Financial Management": [
    "BU111","BU121","BU127","BU231","BU247","BU248","BU253",
    "BU283","BU284","BU354","BU355","BU395","BU413","BU450",
  ],
  "Economics": [
    "EC120","EC140","EC238","EC250","EC255","EC260",
    "EC295","EC355","EC360","EC380","EC395","EC455","EC460",
    "MA121","MA122",
  ],
  "Finance": [
    "BU111","BU121","BU127","BU231","BU247","BU281","BU288",
    "BU352","BU353","BU362","BU411","BU421",
  ],
  "Marketing": [
    "BU111","BU121","BU127","BU231","BU252","BU275","BU288",
    "BU352","BU385","BU413","BU421","BU481",
  ],
  "Psychology": [
    "PS101","PS102","PS200","PS261","PS262","PS270","PS275",
    "PS282","PS295","PS365","PS380","PS381","PS395","PS461","PS481",
  ],
  "Biology": [
    "BI110","BI111","BI201","BI202","BI236","BI237","BI265",
    "BI266","BI307","BI308","BI328","BI342","BI365","BI366",
    "CH110","CH111","MA121",
  ],
  "Chemistry": [
    "CH110","CH111","CH202","CH203","CH212","CH213",
    "CH302","CH303","CH350","CH351","MA121","MA122",
  ],
  "Physics": [
    "PH110","PH111","PH121","PH202","PH203","PH304","PH305",
    "MA121","MA122","MA240",
  ],
  "Biochemistry": [
    "BI110","BI111","CH110","CH111","CH202","CH203","CH212",
    "CH302","BI201","BI202","MA121",
  ],
  "Kinesiology & Physical Education": [
    "KP103","KP104","KP205","KP214","KP215","KP222","KP231",
    "KP232","KP304","KP305","KP316","KP322","KP331","KP404",
    "BI110","PS101",
  ],
  "Neuroscience": [
    "BI110","BI111","CH110","PS101","PS102","PS261","PS275",
    "BI265","KP205","BI307","PS365","PS380","BI342",
  ],
  "Health Sciences": [
    "HS100","HS102","HS200","HS201","HS210","HS220",
    "HS300","HS310","HS320","HS400","KP103","BI110","PS101",
  ],
  "Environmental Science": [
    "ES100","ES200","ES201","ES210","ES220","ES300",
    "ES310","ES320","ES400","BI110","CH110","MA121",
  ],
  "Communication Studies": [
    "CC100","CC110","CC200","CC210","CC220","CC236",
    "CC260","CC300","CC310","CC320","CC340","CC360","CC380","CC400",
  ],
  "English": [
    "EN100","EN110","EN200","EN210","EN220","EN240",
    "EN260","EN280","EN300","EN320","EN340","EN360","EN380",
  ],
  "History": [
    "HI100","HI111","HI121","HI200","HI215","HI230",
    "HI260","HI280","HI300","HI320","HI340","HI360","HI380",
  ],
  "Philosophy": [
    "PL100","PL110","PL130","PL200","PL211","PL221",
    "PL231","PL241","PL300","PL311","PL321","PL401",
  ],
  "Political Science": [
    "PO101","PO110","PO201","PO210","PO215","PO220",
    "PO261","PO295","PO301","PO321","PO331","PO341","PO361","PO381",
  ],
  "Sociology": [
    "SO100","SO110","SO200","SO215","SO240","SO260",
    "SO280","SO300","SO310","SO360","SO380","SO400",
  ],
  "Religion & Culture": [
    "RE100","RE110","RE200","RE210","RE220","RE240",
    "RE260","RE300","RE320","RE340","RE360","RE400",
  ],
  "Cultural Studies": [
    "CS100","CS200","CS210","CS220","CS240","CS300","CS320","CS400",
  ],
  "Global Studies": [
    "GS100","GS201","GS210","GS220","GS280","GS300","GS301","GS380","GS400",
  ],
  "Indigenous Studies": [
    "IS100","IS200","IS210","IS220","IS300","IS320","IS400",
  ],
  "Women & Gender Studies": [
    "WS100","WS200","WS210","WS220","WS300","WS320","WS400",
  ],
  "French": [
    "FR100","FR110","FR200","FR210","FR220","FR300","FR310","FR400",
  ],
  "Geography": [
    "GG100","GG110","GG200","GG210","GG220","GG300","GG310","GG400",
  ],
  "Theatre & Film Studies": [
    "TF100","TF110","TF200","TF210","TF220","TF300","TF320","TF400",
  ],
  "Music (Performance)": [
    "MU100","MU110","MU120","MU200","MU210","MU220","MU230","MU240","MU300","MU310","MU320","MU340",
  ],
  "Music (Education)": [
    "MU100","MU110","MU200","MU230","MU240","MU300","MU320","MU340","MU400",
  ],
  "Music Therapy": [
    "MU100","MU110","MU200","MU210","MU300","MU310","MU340","MU400","MU410",
  ],
  "Social Work": [
    "SW101","SW200","SW201","SW211","SW221","SW301","SW311","SW321","SW331","SW401",
  ],
  "Criminology": [
    "CR100","CR200","CR210","CR220","CR240","CR300","CR310","CR320","CR400","CR410",
    "SO100","PO101",
  ],
  "Law & Society": [
    "LS100","LS200","LS210","LS220","LS300","LS310","LS320","LS400",
  ],
  "Digital Media & Journalism": [
    "DJ100","DJ110","DJ200","DJ210","DJ220","DJ300","DJ310","DJ320","DJ400",
  ],
  "Human Rights & Human Diversity": [
    "HR100","HR200","HR210","HR220","HR300","HR320","HR400",
  ],
  "Game Design & Development": [
    "GD100","GD110","GD200","GD210","GD220","GD300","GD320","GD400",
    "CP104","CP164",
  ],
  "Policing": [
    "PL100","PL200","PL210","PL220","PL300","PL310","PL400",
    "CR100","CR200",
  ],
  "Human Resource Management": [
    "BU111","BU121","BU127","BU231","BU288","BU352","BU353","BU362","BU385","BU421",
  ],
  "Supply Chain Management": [
    "BU111","BU121","BU127","BU231","BU247","BU252","BU288","BU352","BU395","BU421",
  ],
  "Entrepreneurship": [
    "BU111","BU121","BU127","BU231","BU275","BU288","BU352","BU385","BU421","BU481",
  ],
  "Business Technology Management": [
    "BU111","BU121","BU127","BU231","BU247","BU288","CP104","CP164","BU352","BU395",
  ],
  "Concurrent Education": [
    "ED100","ED200","ED210","ED220","ED300","ED310","ED320","ED400",
  ],
};

export const YEARS = ["1st Year","2nd Year","3rd Year","4th Year","Graduate","Exchange Student"];

export const MOTIVATIONS = [
  "Ace the midterm",
  "Prepare for finals",
  "Complete assignments together",
  "Understand concepts deeply",
  "Get ahead of the material",
  "Improve my grades",
  "Stay accountable",
  "Practice problems",
  "Review lecture notes",
  "Meet new people",
  "Build study habits",
  "Teach and reinforce my knowledge",
  "Survive the semester",
];

export const AVAILABILITY_SLOTS = [
  "Mon Morning","Mon Afternoon","Mon Evening",
  "Tue Morning","Tue Afternoon","Tue Evening",
  "Wed Morning","Wed Afternoon","Wed Evening",
  "Thu Morning","Thu Afternoon","Thu Evening",
  "Fri Morning","Fri Afternoon","Fri Evening",
  "Sat Morning","Sat Afternoon","Sat Evening",
  "Sun Morning","Sun Afternoon","Sun Evening",
];

export const GENDERS = ["Man","Woman","Non-binary","Prefer not to say"];
export const GENDER_PREFERENCES = ["No preference","Men only","Women only","Non-binary only","Men & Women","Any"];