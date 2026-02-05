import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useResumeConfig } from "@/context/resume-config";

const STORAGE_KEY = "admin_authenticated";

export function UseAdminAuth() {
  const { isAdmin, setIsAdmin } = useResumeConfig();
  const [showLogin, setShowLogin] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  // No need to check storage here, handled in ContextProvider
  useEffect(() => {
    // We could add any specific mount logic here if needed
  }, []);

  // Listen for Ctrl + Shift + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl + Shift + A
      if (e.ctrlKey && e.shiftKey && (e.key === "a" || e.key === "A")) {
        e.preventDefault();
        setShowLogin(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogin = () => {
    const pinSecret = process.env.NEXT_PUBLIC_ADMIN_PIN || "1234";
    if (pin === pinSecret) {
      setIsAdmin(true);
      setShowLogin(false);
      localStorage.setItem(STORAGE_KEY, "true");
      setError(false);
    } else {
      setError(true);
      setPin("");
    }
  };

  const AdminLoginModal = (
    <Dialog open={showLogin} onOpenChange={setShowLogin}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Admin Access</DialogTitle>
          <DialogDescription>
            Enter the secret PIN to enable the resume builder.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 py-4">
          <Input
            type="password"
            placeholder="PIN"
            value={pin}
            onChange={(e) => {
                setPin(e.target.value);
                setError(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className={error ? "border-red-500 focus-visible:ring-red-500" : ""}
          />
        </div>
        <DialogFooter className="sm:justify-end">
            <Button type="button" variant="secondary" onClick={() => setShowLogin(false)}>
                Cancel
            </Button>
            <Button type="submit" onClick={handleLogin}>
                Access
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return { isAdmin, AdminLoginModal };
}
