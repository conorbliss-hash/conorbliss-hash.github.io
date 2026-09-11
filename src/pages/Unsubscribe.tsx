import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

type State = "loading" | "ready" | "done" | "error";

const Unsubscribe = () => {
  const [state, setState] = useState<State>("loading");
  const [message, setMessage] = useState("");
  const token = new URLSearchParams(window.location.search).get("token");

  useEffect(() => {
    if (!token) {
      setState("error");
      setMessage("This unsubscribe link is missing its code.");
      return;
    }
    fetch(`${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`, {
      headers: { apikey: SUPABASE_ANON_KEY },
    })
      .then((r) => (r.ok ? setState("ready") : Promise.reject()))
      .catch(() => {
        setState("error");
        setMessage("This unsubscribe link is no longer valid.");
      });
  }, [token]);

  const confirm = async () => {
    const { error } = await supabase.functions.invoke("handle-email-unsubscribe", {
      body: { token },
    });
    if (error) {
      setState("error");
      setMessage("Something went wrong. Please try again.");
    } else {
      setState("done");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 text-center shadow-sm">
        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-3">Email preferences</p>
        <h1 className="text-2xl font-semibold text-foreground mb-4">Unsubscribe</h1>
        {state === "loading" && <p className="text-muted-foreground">Checking your link...</p>}
        {state === "ready" && (
          <>
            <p className="text-muted-foreground mb-6">
              Confirm you no longer want to receive these emails.
            </p>
            <button
              onClick={confirm}
              className="w-full rounded-md bg-primary px-4 py-2.5 text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Confirm unsubscribe
            </button>
          </>
        )}
        {state === "done" && <p className="text-muted-foreground">You have been unsubscribed.</p>}
        {state === "error" && <p className="text-destructive">{message}</p>}
      </div>
    </main>
  );
};

export default Unsubscribe;
