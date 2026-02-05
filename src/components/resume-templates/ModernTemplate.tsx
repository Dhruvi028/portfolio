import { Page, Text, View, Document, StyleSheet, Link } from '@react-pdf/renderer';


import { ResumeData } from '@/context/resume-config';
interface ResumeTemplateProps {
  themeColor: string;
  showSections: {
    summary: boolean;
    experience: boolean;
    projects: boolean;
    skills: boolean;
    education: boolean;
  };
  customRole: string;
  resumeData: ResumeData;
  sectionOrder?: string[];
}

// We need to create styles dynamically or pass colors as props
// Since StyleSheet.create doesn't support dynamic values easily in all versions,
// we'll mix static styles with inline style overrides.

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    // borderBottomColor: dynamic
    paddingBottom: 10,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    // color: dynamic
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  role: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 6,
    fontWeight: 'medium',
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    gap: 15,
    marginTop: 5,
  },
  contactItem: {
    fontSize: 10,
    color: '#555',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    // color: dynamic
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  subSection: {
    marginBottom: 10,
  },
  companyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 10,
    color: '#666',
    textAlign: 'right',
  },
  jobTitle: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#444',
    marginBottom: 4,
  },
  description: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#333',
    marginBottom: 2,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  bullet: {
    width: 10,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.5,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  skillTag: {
    fontSize: 9,
    // color: dynamic
    backgroundColor: '#f0f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  projectTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333',
  },
  link: {
    color: '#3b82f6',
    textDecoration: 'none',
  },
});

export const ModernTemplate = ({ 
    themeColor, 
    showSections, 
    customRole, 
    resumeData,
    sectionOrder = ['summary', 'experience', 'projects', 'skills', 'education']
}: ResumeTemplateProps) => {
  const resume = resumeData;
  const skillsToDisplay = resume.highlightedSkills || (resume.skills ? Object.values(resume.skills).flat() : []);

  const renderSection = (key: string) => {
    switch (key) {
      case 'summary':
        return showSections.summary && resume.personalInfo.about && (
          <View key="summary" style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColor }]}>Summary</Text>
            <Text style={{ fontSize: 10, lineHeight: 1.5, color: '#333' }}>
              {resume.personalInfo.about}
            </Text>
          </View>
        );
      case 'skills':
        return showSections.skills && (
          <View key="skills" style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColor }]}>Skills</Text>
            <View style={styles.skillsRow}>
              {skillsToDisplay.map((skill: string, index: number) => (
                <Text key={index} style={[styles.skillTag, { color: themeColor }]}>{skill}</Text>
              ))}
            </View>
          </View>
        );
      case 'experience':
        return showSections.experience && (
          <View key="experience" style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColor }]}>Experience</Text>
            {resume.experience.filter(e => e.isVisible !== false).map((exp, index) => (
              <View key={index} style={styles.subSection} wrap={false}>
                <View style={styles.companyRow}>
                  <Text style={styles.companyName}>{exp.company}</Text>
                  <Text style={styles.date}>{exp.duration}</Text>
                </View>
                <Text style={styles.jobTitle}>{exp.role}</Text>
                {exp.description.map((desc: string, i: number) => (
                  <View key={i} style={styles.bulletPoint}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{desc}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        );
      case 'projects':
        return showSections.projects && (
          <View key="projects" style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColor }]}>Projects</Text>
            {resume.projects.filter(p => p.isVisible !== false).map((project, index) => ( 
              <View key={index} style={[styles.subSection, { marginBottom: 12 }]} wrap={false}>
                 <View style={styles.companyRow}>
                    <Text style={styles.projectTitle}>
                        {project.title}
                    </Text>
                     {project.link && project.link !== '#' && (
                        <Link src={project.link} style={[styles.date, styles.link]}>
                            Link
                        </Link>
                    )}
                 </View>
                 <Text style={{ fontSize: 9, fontStyle: 'italic', color: '#555', marginBottom: 2 }}>
                    {Array.isArray(project.tech) ? project.tech.join(', ') : project.tech}
                  </Text>
                  <Text style={{ fontSize: 9, lineHeight: 1.3 }}>
                    {project.description}
                  </Text>
              </View>
            ))}
          </View>
        );
      case 'education':
        return showSections.education && (
          <View key="education" style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColor }]}>Education</Text>
            {resume.education.map((edu, index) => (
              <View key={index} style={styles.companyRow}>
                <View>
                    <Text style={styles.companyName}>{edu.degree}</Text>
                    <Text style={styles.jobTitle}>{edu.institution}</Text>
                </View>
                <Text style={styles.date}>{edu.duration}</Text>
              </View>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: themeColor }]}>
          <Text style={[styles.name, { color: themeColor }]}>
              {resume.personalInfo.name}
          </Text>
          <Text style={styles.role}>
              {customRole || resume.personalInfo.role}
          </Text>
          <View style={styles.contactRow}>
            <Text style={styles.contactItem}>{resume.personalInfo.contact.location}</Text>
            <Text style={styles.contactItem}>•</Text>
            <Text style={styles.contactItem}>{resume.personalInfo.contact.phone}</Text>
            <Text style={styles.contactItem}>•</Text>
            <Text style={styles.contactItem}>{resume.personalInfo.contact.email}</Text>
          </View>
        </View>

        {/* Content Sections */}
        {Array.from(new Set(sectionOrder)).map(key => renderSection(key))}
      </Page>
    </Document>
  );
};
