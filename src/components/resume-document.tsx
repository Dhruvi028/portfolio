
import { Page, Text, View, Document, StyleSheet, Link } from '@react-pdf/renderer';
import { resume } from '@/data/resume';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#112e42',
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#112e42',
    marginBottom: 4,
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
    color: '#112e42',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 3,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  subSection: {
    marginBottom: 8,
  },
  companyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
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
    marginBottom: 2,
  },
  description: {
    fontSize: 10,
    lineHeight: 1.4,
    color: '#333',
    marginBottom: 2,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bullet: {
    width: 10,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.4,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  skillTag: {
    fontSize: 9,
    color: '#112e42',
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

export const ResumeDocument = () => {
  // Use highlightedSkills if available, otherwise fallback to flattening all skills
  const skillsToDisplay = (resume as any).highlightedSkills || Object.values(resume.skills).flat();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{resume.personalInfo.name}</Text>
          <Text style={styles.role}>{resume.personalInfo.role}</Text>
          <View style={styles.contactRow}>
            <Text style={styles.contactItem}>{resume.personalInfo.contact.location}</Text>
            <Text style={styles.contactItem}>•</Text>
            <Text style={styles.contactItem}>{resume.personalInfo.contact.phone}</Text>
            <Text style={styles.contactItem}>•</Text>
            <Text style={styles.contactItem}>{resume.personalInfo.contact.email}</Text>
          </View>
        </View>

        {/* About */}
        {resume.personalInfo.about && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={{ fontSize: 10, lineHeight: 1.5, color: '#333' }}>
              {resume.personalInfo.about}
            </Text>
          </View>
        )}

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillsRow}>
            {skillsToDisplay.map((skill: string, index: number) => (
              <Text key={index} style={styles.skillTag}>{skill}</Text>
            ))}
          </View>
        </View>

        {/* Experience */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {resume.experience.map((exp, index) => (
            <View key={index} style={styles.subSection} wrap={false}>
              <View style={styles.companyRow}>
                <Text style={styles.companyName}>{exp.company}</Text>
                <Text style={styles.date}>{exp.duration}</Text>
              </View>
              <Text style={styles.jobTitle}>{exp.role}</Text>
              {exp.description.map((desc, i) => (
                <View key={i} style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>{desc}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Projects - optional, or concise */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projects</Text>
          {resume.projects.map((project, index) => ( // Limiting to top 4 to fit or just listing all?
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

        {/* Education */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
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

      </Page>
    </Document>
  );
};
