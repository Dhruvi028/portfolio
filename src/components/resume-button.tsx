"use client";

import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button, ButtonProps } from "./ui/button";
import { ModernTemplate } from "./resume-templates/ModernTemplate";
import { ClassicTemplate } from "./resume-templates/ClassicTemplate";
import { useResumeConfig } from "@/context/resume-config";

interface ResumeButtonProps extends ButtonProps {
  children: React.ReactNode;
  fileName?: string;
}



export const ResumeButton = ({ children, fileName = "Dhruvi_Shah_Resume.pdf", ...props }: ResumeButtonProps) => {
  const { selectedTemplate, themeColor, showSections, customRole, resumeData, sectionOrder } = useResumeConfig();

  const templateProps = { themeColor, showSections, customRole, resumeData, sectionOrder };
  
  const ResumeDocument = selectedTemplate === 'classic' 
    ? <ClassicTemplate {...templateProps} /> 
    : <ModernTemplate {...templateProps} />;

  return (
    <Button asChild {...props}>
      <PDFDownloadLink
        document={ResumeDocument}
        fileName={fileName}
        className="w-full h-full flex items-center justify-center"
      >
        {({ loading }) => (loading ? "Loading..." : children)}
      </PDFDownloadLink>
    </Button>
  );
};

export default ResumeButton;
