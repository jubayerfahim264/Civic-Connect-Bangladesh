/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ১. প্রথমে ফায়ারবেস অথেন্টিকেশন
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // ২. ডাটাবেস থেকে এডমিন চেক করা
      const adminDocRef = doc(db, "settings", "admin_config");
      const snap = await getDoc(adminDocRef);

      if (snap.exists()) {
        const data = snap.data();
        console.log("Firestore Admin Data:", data); // ডিবাগ করার জন্য

        const authorizedEmail = data.adminEmail || data.email;

        if (authorizedEmail === user.email) {
          toast({ title: "Welcome Admin!", description: "Redirecting..." });
          navigate("/admin");
        } else {
          throw new Error("You are not an authorized administrator.");
        }
      } else {
        console.error("No such document in Firestore!");
        throw new Error("Admin configuration missing in database.");
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      await signOut(auth); // অথরাইজড না হলে সাইন আউট করে দেয়া
      toast({
        title: "Access Denied",
        description: error.message || "Invalid login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-14 h-14 rounded-full gradient-navy flex items-center justify-center">
            <Shield className="w-7 h-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl text-foreground">
            Admin Login
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            CivicConnect Administration Panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@civicconnect.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="*********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              <LogIn className="w-4 h-4 mr-2" />
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
