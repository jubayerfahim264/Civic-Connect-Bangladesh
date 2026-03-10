/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { ServiceVisit } from "@/lib/trackServiceVisit";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Bell, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const [subscribed, setSubscribed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [serviceHistory, setServiceHistory] = useState<ServiceVisit[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }
    if (user) {
      const fetchProfile = async () => {
        try {
          const snap = await getDoc(doc(db, "users", user.uid));
          if (snap.exists()) {
            setSubscribed(snap.data().subscribedToEmails ?? false);
          }
        } catch (error: any) {
          console.error("Error fetching profile:", error);
        } finally {
          setLoadingProfile(false);
        }
      };
      fetchProfile();
    }
  }, [user, authLoading, navigate]);

  const handleToggleSubscription = async (checked: boolean) => {
    if (!user) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        subscribedToEmails: checked,
      });
      setSubscribed(checked);
      toast({
        title: checked ? "Subscribed!" : "Unsubscribed",
        description: checked
          ? "You'll receive email updates from CivicConnect."
          : "You won't receive email updates anymore.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  if (authLoading || loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return null;

  const initials = user.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-2xl py-12 px-4">
        <Card className="border-border shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.photoURL || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl text-foreground">
              {user.displayName || "User"}
            </CardTitle>
            <CardDescription className="text-muted-foreground flex items-center justify-center gap-1">
              <Mail className="h-3.5 w-3.5" />
              {user.email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Account info */}
            <div className="rounded-lg border border-border p-4 space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <User className="h-4 w-4" /> Account Details
              </h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-muted-foreground">Name</span>
                <span className="text-foreground">
                  {user.displayName || "—"}
                </span>
                <span className="text-muted-foreground">Email</span>
                <span className="text-foreground">{user.email}</span>
                <span className="text-muted-foreground">Provider</span>
                <span className="text-foreground capitalize">
                  {user.providerData[0]?.providerId === "google.com"
                    ? "Google"
                    : "Email/Password"}
                </span>
              </div>
            </div>

            {/* Email subscription toggle */}
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Bell className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <Label
                      htmlFor="email-sub"
                      className="text-sm font-semibold text-foreground cursor-pointer"
                    >
                      Subscribe to Email Updates
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Get notified about new services & civic updates
                    </p>
                  </div>
                </div>
                <Switch
                  id="email-sub"
                  checked={subscribed}
                  onCheckedChange={handleToggleSubscription}
                  disabled={saving}
                />
              </div>
            </div>

            {/* Logout */}
            <Button
              variant="outline"
              className="w-full text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
