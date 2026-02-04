"use client";

import { resume } from "@/data/resume";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Mail, MapPin, Phone, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function Contact() {
    const ref = useRef(null);
    const formRef = useRef<HTMLFormElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [isLoading, setIsLoading] = useState(false);

    const sendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formRef.current) return;

        setIsLoading(true);

        const formData = new FormData(formRef.current);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("Message sent successfully! I'll get back to you soon.");
                formRef.current?.reset();
            } else {
                throw new Error(result.message || "Failed to send message");
            }
        } catch (error) {
            console.error("Submission Error:", error);
            toast.error("Failed to send message. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="contact" className="py-20 relative">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background to-muted/20 pointer-events-none" />

            <div className="container px-6 relative z-10">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl md:text-5xl font-bold font-heading mb-16 text-center">Get in <span className="text-primary">Touch</span></h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        <div className="space-y-8">
                            <p className="text-lg text-muted-foreground">
                                I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Email</p>
                                        <a href={`mailto:${resume.personalInfo.contact.email}`} className="text-lg font-medium hover:text-primary transition-colors">{resume.personalInfo.contact.email}</a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Phone</p>
                                        <a href={`tel:${resume.personalInfo.contact.phone}`} className="text-lg font-medium hover:text-primary transition-colors">{resume.personalInfo.contact.phone}</a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Location</p>
                                        <p className="text-lg font-medium">{resume.personalInfo.contact.location}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                            <CardHeader>
                                <CardTitle>Send a Message</CardTitle>
                                <CardDescription>I'll get back to you as soon as possible.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form ref={formRef} className="space-y-4" onSubmit={sendEmail}>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Input name="user_name" placeholder="Name" required className="bg-background/50 border-input focus:border-primary transition-colors" />
                                        </div>
                                        <div className="space-y-2">
                                            <Input name="user_email" placeholder="Email" type="email" required className="bg-background/50 border-input focus:border-primary transition-colors" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Input name="subject" placeholder="Subject" required className="bg-background/50 border-input focus:border-primary transition-colors" />
                                    </div>
                                    <div className="space-y-2">
                                        <Textarea name="message" placeholder="Message" required className="min-h-[120px] bg-background/50 border-input focus:border-primary transition-colors" />
                                    </div>
                                    <Button 
                                        type="submit" 
                                        disabled={isLoading}
                                        className="w-full font-bold bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <>Converting... <Loader2 className="ml-2 w-4 h-4 animate-spin" /></>
                                        ) : (
                                            <>Send Message <Send className="ml-2 w-4 h-4" /></>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
