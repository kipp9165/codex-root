/**
 * Simple keyword-based industry classification.
 * Mirrors the BLS-style tags used in the frontend.
 */

const BLS_INDUSTRY_TAGS = [
  "Information",
  "Manufacturing",
  "Professional, Scientific, and Technical Services",
  "Finance and Insurance",
  "Health Care and Social Assistance",
  "Educational Services",
  "Transportation and Warehousing",
  "Retail Trade",
  "Wholesale Trade",
  "Construction",
  "Utilities",
  "Arts, Entertainment, and Recreation"
];

function classifyIndustry(input) {
  const text = (input || "").toLowerCase();
  const tags = [];

  if (text.match(/software|saas|platform|api|cloud|ai|ml|data/)) {
    tags.push("Information");
    tags.push("Professional, Scientific, and Technical Services");
  }
  if (text.match(/hospital|clinic|medical|health|biotech|pharma/)) {
    tags.push("Health Care and Social Assistance");
  }
  if (text.match(/school|education|learning|university|course/)) {
    tags.push("Educational Services");
  }
  if (text.match(/bank|payment|stripe|finance|loan|credit|insurance/)) {
    tags.push("Finance and Insurance");
  }
  if (text.match(/factory|manufacturing|production|hardware|device/)) {
    tags.push("Manufacturing");
  }
  if (text.match(/logistics|shipping|delivery|transport|fleet/)) {
    tags.push("Transportation and Warehousing");
  }
  if (text.match(/game|media|content|music|film|entertainment/)) {
    tags.push("Arts, Entertainment, and Recreation");
  }

  if (tags.length === 0) {
    tags.push("UNCLASSIFIED");
  }

  return [...new Set(tags)];
}

module.exports = {
  classifyIndustry,
  BLS_INDUSTRY_TAGS
};
