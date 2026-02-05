"use client";

import dynamic from "next/dynamic";
import { Button } from "./ui/button";
import { ButtonProps } from "./ui/button";

const ResumeButton = dynamic(() => import("./resume-button"), {
    ssr: false,
    loading: () => <Button variant="outline" size="lg">Loading...</Button>,
});

export default ResumeButton;
