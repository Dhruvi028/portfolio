"use client";

import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button, ButtonProps } from "./ui/button";
import { ModernTemplate } from "./resume-templates/ModernTemplate";
import { InternationalTemplate } from "./resume-templates/InternationalTemplate";
import { useResumeConfig } from "@/context/resume-config";

interface ResumeButtonProps extends ButtonProps {
  children: React.ReactNode;
  fileName?: string;
}

export const ResumeButton = ({
  children,
  fileName = "Dhruvi_Shah_Resume.pdf",
  ...props
}: ResumeButtonProps) => {
  const {
    selectedTemplate,
    themeColor,
    showSections,
    resumeData,
    sectionOrder,
    fontSize,
  } = useResumeConfig();

  const templateProps = {
    themeColor,
    showSections,
    resumeData,
    sectionOrder,
    fontSize,
  };

  const ResumeDocument =
    selectedTemplate === "international" ? (
      <InternationalTemplate {...templateProps} />
    ) : (
      <ModernTemplate {...templateProps} />
    );

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
