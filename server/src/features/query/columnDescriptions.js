const columnDescriptions = {
    table_a: {
      col1: "Student ID in the format R200001–R201100 or R210001–R211100. some time it may be r instead of R",
      col2: "Student full name (e.g., POSA VENKATA SIVA SHANKAR).",
      col3: "Hall ticket number, usually a 10-digit number (e.g., 2212027156). May appear as a float (e.g., 2212027156.0) or be null.",
      col4: "Date of birth in any format (e.g., '2004-04-09', '2004/04/09', 'May 9 2004', etc.).",
      col5: "Gender with possible values like Male, Female, M, F (case-insensitive)."
    },
    table_b: {
      col1: "Student ID in the format R200001–R201100 or R210001–R211100.",
      col15: "Marks for E1 Semester 1 (e.g., 9.352 out of 10). May be null or missing.",
      col16: "Marks for E1 Semester 2 (e.g., 9.352 out of 10). May be null or missing.",
      col17: "Marks for E2 Semester 1 (e.g., 9.352 out of 10). May be null or missing."
    },
    table_c: {
      col1: "Student ID in the format R200001–R201100 or R210001–R211100.",
      col8: "Father’s name (e.g., POSA SUBBARAYUDU).",
      col9: "Mother’s name (e.g., manjula). May be null.",
      col10: "Address (e.g., H.No 7&2-40/8/1, Subhash Nagar, Sircilla, Telangana). May be null.",
      col11: "Branch name. Possible values (case and format may vary)...",
      col18: "Batch code (e.g., R20, R21). May appear in different cases like r20, r21."
    }
  };
  
  module.exports = columnDescriptions;
  