/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { Send, Mail, User, MessageSquare, Loader2 } from "lucide-react";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const CATEGORIES = ["IT", "Politics", "Warfare", "General", "Other"];

  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload: any = {
        name,
        email,
        message,
        createdAt: serverTimestamp(),
      };
      if (user?.uid) payload.uid = user.uid;

      await addDoc(collection(db, "messages"), payload);
      toast({
        title: "Message sent",
        description: "Thank you for reaching out. We'll get back to you soon.",
      });
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Unable to send message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50/50 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                Get in Touch
              </h1>
              <p className="text-slate-500 text-lg">
                Have a question, feedback, or need assistance? Fill out the form
                below and our team will get back to you shortly.
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Input */}
                <div className="space-y-2">
                  <label
                    className="text-sm font-semibold text-slate-700 flex items-center gap-2"
                    htmlFor="name"
                  >
                    <User className="w-4 h-4 text-slate-400" /> Name
                  </label>
                  <input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full flex h-12 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2 text-sm transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="John Doe"
                    required
                  />
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <label
                    className="text-sm font-semibold text-slate-700 flex items-center gap-2"
                    htmlFor="email"
                  >
                    <Mail className="w-4 h-4 text-slate-400" /> Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full flex h-12 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2 text-sm transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                {/* Message Input */}
                <div className="space-y-2">
                  <label
                    className="text-sm font-semibold text-slate-700 flex items-center gap-2"
                    htmlFor="message"
                  >
                    <MessageSquare className="w-4 h-4 text-slate-400" /> Message
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full flex min-h-[120px] rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
                    placeholder="How can we help you today?"
                    rows={5}
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none mt-4"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
