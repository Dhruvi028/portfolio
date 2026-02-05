"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { ResumeDocument } from "./resume-document";
import { Button, ButtonProps } from "./ui/button";
import React from "react";

interface ResumeButtonProps extends ButtonProps {
    fileName?: string;
}

const ResumeButton = ({ children, fileName = "Dhruvi_Shah_Resume.pdf", ...props }: ResumeButtonProps) => {
    return (
        <Button {...props} asChild>
            <PDFDownloadLink
                document={<ResumeDocument />}
                fileName={fileName}
            >
                {({ loading }) => (
                    loading ? "Loading..." : children
                )}
            </PDFDownloadLink>
        </Button>
    );
};

export default ResumeButton;
