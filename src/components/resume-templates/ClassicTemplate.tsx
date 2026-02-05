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

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Times-Roman',
  },
  header: {
    marginBottom: 15,
    borderBottomWidth: 1,
    // borderBottomColor: dynamic
    paddingBottom: 10,
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    // color: dynamic
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  role: {
    fontSize: 14,
    color: '#000',
    marginBottom: 5,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginTop: 5,
  },
  contactItem: {
    fontSize: 10,
    color: '#000',
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    // color: dynamic
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 2,
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
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000',
  },
  date: {
    fontSize: 10,
    color: '#000',
    fontStyle: 'italic',
  },
  jobTitle: {
    fontSize: 11,
    color: '#000',
    marginBottom: 2,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 2,
    paddingLeft: 5,
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
  skillsText: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#000',
  },
  link: {
    color: '#000',
    textDecoration: 'none',
  },
});

export const ClassicTemplate = ({ 
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
                        <Text style={[styles.sectionTitle, { color: themeColor, borderBottomColor: themeColor }]}>Professional Summary</Text>
                        <Text style={{ fontSize: 10, lineHeight: 1.5, color: '#000' }}>
                            {resume.personalInfo.about}
                        </Text>
                    </View>
                );
            case 'skills':
                return showSections.skills && (
                    <View key="skills" style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: themeColor, borderBottomColor: themeColor }]}>Technical Skills</Text>
                        <Text style={styles.skillsText}>
                            {skillsToDisplay.join(' • ')}
                        </Text>
                    </View>
                );
            case 'experience':
                return showSections.experience && (
                    <View key="experience" style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: themeColor, borderBottomColor: themeColor }]}>Experience</Text>
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
                        <Text style={[styles.sectionTitle, { color: themeColor, borderBottomColor: themeColor }]}>Projects</Text>
                        {resume.projects.filter(p => p.isVisible !== false).map((project, index) => (
                            <View key={index} style={[styles.subSection, { marginBottom: 10 }]} wrap={false}>
                                <View style={styles.companyRow}>
                                    <Text style={{ fontSize: 11, fontWeight: 'bold' }}>
                                        {project.title}
                                    </Text>
                                    {project.link && project.link !== '#' && (
                                        <Link src={project.link} style={[styles.date, styles.link]}>
                                            [Link]
                                        </Link>
                                    )}
                                </View>
                                <Text style={{ fontSize: 10, fontStyle: 'italic', marginBottom: 2 }}>
                                    {Array.isArray(project.tech) ? project.tech.join(', ') : project.tech}
                                </Text>
                                <Text style={{ fontSize: 10, lineHeight: 1.3 }}>
                                    {project.description}
                                </Text>
                            </View>
                        ))}
                    </View>
                );
            case 'education':
                return showSections.education && (
                    <View key="education" style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: themeColor, borderBottomColor: themeColor }]}>Education</Text>
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

    // For Classic, we might only use themeColor for Name and Titles, keeping text black
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: themeColor === '#000000' ? '#000' : themeColor }]}>
            <Text style={[styles.name, { color: themeColor === '#112e42' ? '#000' : themeColor }]}>
                {resume.personalInfo.name}
            </Text>
            <Text style={styles.role}>
                {customRole || resume.personalInfo.role}
            </Text>
            <View style={styles.contactRow}>
              <Text style={styles.contactItem}>{resume.personalInfo.contact.location}</Text>
              <Text style={styles.contactItem}> | </Text>
              <Text style={styles.contactItem}>{resume.personalInfo.contact.phone}</Text>
              <Text style={styles.contactItem}> | </Text>
              <Text style={styles.contactItem}>{resume.personalInfo.contact.email}</Text>
            </View>
          </View>
  
          {/* Content Sections */}
          {Array.from(new Set(sectionOrder)).map(key => renderSection(key))}
        </Page>
      </Document>
    );
  };
