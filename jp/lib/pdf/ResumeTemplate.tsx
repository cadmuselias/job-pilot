import { Document, Page, Text, View, StyleSheet, type DocumentProps } from "@react-pdf/renderer";
import type { ReactElement } from "react";

export interface ResumePDFData {
  fullName: string;
  currentTitle?: string;
  email: string;
  phone?: string;
  location?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  summary?: string;
  skills?: string[];
  workExperience?: {
    company: string;
    title: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    bullets: string[];
  }[];
  education?: {
    degree: string;
    field: string;
    institution: string;
    year?: string | number;
  }[];
}

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: "Helvetica",
    color: "#101828",
    lineHeight: 1.35,
  },
  header: {
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#101828",
    marginBottom: 3,
  },
  title: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#5e4cff",
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  contactItem: {
    fontSize: 8.5,
    color: "#6a7282",
    marginRight: 10,
  },
  section: {
    marginTop: 6,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#5e4cff",
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 8.5,
    color: "#364153",
    lineHeight: 1.35,
  },
  experienceItem: {
    marginBottom: 6,
  },
  roleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  roleTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#101828",
  },
  roleCompanyDate: {
    fontSize: 8.5,
    color: "#6a7282",
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 1.5,
    marginBottom: 1.5,
  },
  bulletDot: {
    width: 10,
    fontSize: 8.5,
    color: "#7c5cfc",
    lineHeight: 1.35,
  },
  bulletContent: {
    width: "97%",
    fontSize: 8.5,
    color: "#364153",
    lineHeight: 1.35,
  },
  skillsText: {
    fontSize: 8.5,
    color: "#364153",
    lineHeight: 1.4,
  },
  educationItem: {
    marginBottom: 4,
  },
  eduRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eduDegree: {
    fontSize: 8.5,
    fontWeight: "bold",
    color: "#101828",
  },
  eduInstitutionYear: {
    fontSize: 8.5,
    color: "#6a7282",
  },
});

export function ResumeTemplate({ data }: { data: ResumePDFData }): ReactElement<DocumentProps> {
  const contactParts: string[] = [];
  if (data.email) contactParts.push(data.email);
  if (data.phone) contactParts.push(data.phone);
  if (data.location) contactParts.push(data.location);
  if (data.linkedinUrl) contactParts.push(data.linkedinUrl);
  if (data.portfolioUrl) contactParts.push(data.portfolioUrl);

  const contactString = contactParts.join("  •  ");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.fullName || "Candidate Resume"}</Text>
          {data.currentTitle ? (
            <Text style={styles.title}>{data.currentTitle}</Text>
          ) : null}
          {contactString ? (
            <Text style={styles.contactItem}>{contactString}</Text>
          ) : null}
        </View>

        {/* Professional Summary */}
        {data.summary ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROFESSIONAL SUMMARY</Text>
            <Text style={styles.summaryText}>{data.summary}</Text>
          </View>
        ) : null}

        {/* Skills */}
        {data.skills && data.skills.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CORE COMPETENCIES & SKILLS</Text>
            <Text style={styles.skillsText}>{data.skills.join("  •  ")}</Text>
          </View>
        ) : null}

        {/* Work Experience */}
        {data.workExperience && data.workExperience.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>WORK EXPERIENCE</Text>
            {data.workExperience.map((exp, idx) => {
              const dateRange = [
                exp.startDate || "",
                exp.current ? "Present" : exp.endDate || "",
              ]
                .filter(Boolean)
                .join(" - ");

              return (
                <View key={`exp-${idx}`} style={styles.experienceItem}>
                  <View style={styles.roleRow}>
                    <Text style={styles.roleTitle}>{exp.title}</Text>
                    <Text style={styles.roleCompanyDate}>
                      {exp.company}
                      {dateRange ? `  |  ${dateRange}` : ""}
                    </Text>
                  </View>

                  {exp.bullets && exp.bullets.length > 0 ? (
                    exp.bullets.map((bullet, bIdx) => (
                      <View key={`b-${bIdx}`} style={styles.bulletRow}>
                        <Text style={styles.bulletDot}>•</Text>
                        <Text style={styles.bulletContent}>{bullet}</Text>
                      </View>
                    ))
                  ) : null}
                </View>
              );
            })}
          </View>
        ) : null}

        {/* Education */}
        {data.education && data.education.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EDUCATION</Text>
            {data.education.map((edu, idx) => {
              const degreeStr = [edu.degree, edu.field]
                .filter(Boolean)
                .join(" in ");

              return (
                <View key={`edu-${idx}`} style={styles.educationItem}>
                  <View style={styles.eduRow}>
                    <Text style={styles.eduDegree}>{degreeStr || "Degree"}</Text>
                    <Text style={styles.eduInstitutionYear}>
                      {edu.institution}
                      {edu.year ? `  (${edu.year})` : ""}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        ) : null}
      </Page>
    </Document>
  );
}
