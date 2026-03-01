import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";

import { ResumeData } from "@/context/resume-config";
interface ResumeTemplateProps {
  themeColor: string;
  showSections: {
    summary: boolean;
    experience: boolean;
    projects: boolean;
    skills: boolean;
    education: boolean;
  };
  resumeData: ResumeData;
  sectionOrder?: string[];
  fontSize?: number;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: "36pt", // Around 0.5 inch margins as standard
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 12,
    alignItems: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 2,
    color: "#000",
  },
  role: {
    fontSize: 12,
    marginBottom: 4,
    color: "#000",
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  contactItem: {
    fontSize: 10,
    color: "#000",
    textDecoration: "none",
  },
  section: {
    marginBottom: 12,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 2,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  bodyText: {
    fontSize: 10,
    lineHeight: 1.4,
    color: "#000",
  },
  subSection: {
    marginBottom: 8,
  },
  rowSpaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 2,
  },
  boldText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#000",
  },
  jobTitle: {
    fontSize: 10,
    fontStyle: "italic",
    color: "#000",
    marginBottom: 2,
  },
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 2,
    paddingLeft: 8,
    paddingRight: 8,
  },
  bullet: {
    width: 12,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.4,
  },
  skillCategory: {
    marginBottom: 3,
  },
});

export const InternationalTemplate = ({
  showSections,
  resumeData,
  sectionOrder = ["summary", "experience", "projects", "skills", "education"],
  fontSize = 10,
}: ResumeTemplateProps) => {
  const resume = resumeData;

  const renderSection = (key: string) => {
    switch (key) {
      case "summary":
        return (
          showSections.summary &&
          resume.personalInfo.about && (
            <View key="summary" style={styles.section} minPresenceAhead={20}>
              <Text style={[styles.sectionTitle, { fontSize: fontSize + 1 }]}>
                PROFESSIONAL SUMMARY
              </Text>
              <Text style={[styles.bodyText, { fontSize: fontSize }]}>
                {resume.personalInfo.about}
              </Text>
            </View>
          )
        );
      case "skills":
        return (
          showSections.skills && (
            <View key="skills" style={styles.section} minPresenceAhead={20}>
              <Text style={[styles.sectionTitle, { fontSize: fontSize + 1 }]}>
                TECHNICAL SKILLS
              </Text>
              {Object.entries(resume.skills || {}).map(
                ([category, items], i) => (
                  <View key={i} style={styles.skillCategory}>
                    <Text style={[styles.bodyText, { fontSize: fontSize }]}>
                      <Text style={{ fontWeight: "bold" }}>{category}: </Text>
                      {Array.isArray(items) ? items.join(", ") : items}
                    </Text>
                  </View>
                ),
              )}
            </View>
          )
        );
      case "experience":
        return (
          showSections.experience && (
            <View key="experience" style={styles.section} minPresenceAhead={40}>
              <Text style={[styles.sectionTitle, { fontSize: fontSize + 1 }]}>
                PROFESSIONAL EXPERIENCE
              </Text>
              {resume.experience
                .filter((e) => e.isVisible !== false)
                .map((exp, index) => (
                  <View
                    key={index}
                    style={styles.subSection}
                    minPresenceAhead={20}
                  >
                    <View style={styles.rowSpaceBetween}>
                      <Text style={[styles.boldText, { fontSize: fontSize }]}>
                        {exp.role}
                      </Text>
                    </View>
                    <View style={styles.rowSpaceBetween}>
                      <Text style={[styles.jobTitle, { fontSize: fontSize }]}>
                        {exp.company}
                      </Text>
                      <Text style={[styles.bodyText, { fontSize: fontSize }]}>
                        {exp.duration}
                      </Text>
                    </View>
                    {exp.description.map((desc: string, i: number) => (
                      <View key={i} style={styles.bulletPoint}>
                        <Text style={[styles.bullet, { fontSize: fontSize }]}>
                          •
                        </Text>
                        <Text
                          style={[styles.bulletText, { fontSize: fontSize }]}
                        >
                          {desc}
                        </Text>
                      </View>
                    ))}
                  </View>
                ))}
            </View>
          )
        );
      case "projects":
        return (
          showSections.projects && (
            <View key="projects" style={styles.section} minPresenceAhead={40}>
              <Text style={[styles.sectionTitle, { fontSize: fontSize + 1 }]}>
                PROJECTS
              </Text>
              {resume.projects
                .filter((p) => p.isVisible !== false)
                .map((project, index) => (
                  <View
                    key={index}
                    style={styles.subSection}
                    minPresenceAhead={20}
                  >
                    <View style={styles.rowSpaceBetween}>
                      <Text style={[styles.boldText, { fontSize: fontSize }]}>
                        {project.title}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.bodyText,
                        { fontSize: fontSize, marginBottom: 2 },
                      ]}
                    >
                      <Text style={{ fontWeight: "bold" }}>Tech Stack: </Text>
                      {Array.isArray(project.tech)
                        ? project.tech.join(", ")
                        : project.tech}
                    </Text>
                    <View style={styles.bulletPoint}>
                      <Text style={[styles.bullet, { fontSize: fontSize }]}>
                        •
                      </Text>
                      <Text style={[styles.bulletText, { fontSize: fontSize }]}>
                        {project.description}
                      </Text>
                    </View>
                  </View>
                ))}
            </View>
          )
        );
      case "education":
        return (
          showSections.education && (
            <View key="education" style={styles.section} minPresenceAhead={20}>
              <Text style={[styles.sectionTitle, { fontSize: fontSize + 1 }]}>
                EDUCATION
              </Text>
              {resume.education.map((edu, index) => (
                <View
                  key={index}
                  style={[styles.rowSpaceBetween, { marginBottom: 4 }]}
                >
                  <View>
                    <Text style={[styles.boldText, { fontSize: fontSize }]}>
                      {edu.degree}
                    </Text>
                    <Text style={[styles.bodyText, { fontSize: fontSize }]}>
                      {edu.institution}
                    </Text>
                  </View>
                  <Text style={[styles.bodyText, { fontSize: fontSize }]}>
                    {edu.duration}
                  </Text>
                </View>
              ))}
            </View>
          )
        );
      default:
        return null;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.name, { fontSize: fontSize + 10 }]}>
            {resume.personalInfo.name}
          </Text>
          {resume.personalInfo.role && (
            <Text style={[styles.role, { fontSize: fontSize + 2 }]}>
              {resume.personalInfo.role}
            </Text>
          )}
          {resume.personalInfo.contact.location && (
            <Text
              style={[styles.role, { fontSize: fontSize, marginBottom: 2 }]}
            >
              {resume.personalInfo.contact.location}
            </Text>
          )}
          <View style={styles.contactRow}>
            {resume.personalInfo.contact.email && (
              <>
                <Text style={[styles.contactItem, { fontSize: fontSize }]}>
                  {resume.personalInfo.contact.email}
                </Text>
                {resume.personalInfo.contact.phone ? (
                  <Text style={[styles.contactItem, { fontSize: fontSize }]}>
                    |
                  </Text>
                ) : null}
              </>
            )}
            {resume.personalInfo.contact.phone && (
              <Text style={[styles.contactItem, { fontSize: fontSize }]}>
                {resume.personalInfo.contact.phone}
              </Text>
            )}
          </View>
        </View>

        {/* Content Sections */}
        <View wrap={true}>
          {sectionOrder
            .filter((key) => key && key.trim() !== "")
            .map((key) => renderSection(key))}
        </View>
      </Page>
    </Document>
  );
};
