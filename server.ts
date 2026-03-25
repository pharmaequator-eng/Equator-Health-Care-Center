import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Supabase Setup
let supabaseClient: any = null;
function getSupabase() {
  if (!supabaseClient) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required.");
    }
    supabaseClient = createClient(url, key);
  }
  return supabaseClient;
}

// Email and PDF generation removed as per request

// API Routes
app.post("/api/book", async (req, res) => {
  try {
    const supabase = getSupabase();
    const { name, address, contact, email, age, subject, message } = req.body;
    
    const { data, error } = await supabase
      .from("bookings")
      .insert([{ 
        name, 
        address, 
        contact, 
        email, 
        age, 
        subject, 
        message, 
        booking_date: new Date().toISOString(),
        status: 'pending' 
      }])
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, booking: data });
  } catch (error: any) {
    console.error("Booking error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/contact", async (req, res) => {
  try {
    const supabase = getSupabase();
    const { name, address, contact, email, age, subject, message } = req.body;
    const { data, error } = await supabase
      .from("contacts")
      .insert([{ name, address, contact, email, age, subject, message }]);

    if (error) throw error;
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    res.json({ success: true, token: "mock-jwt-token" });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.get("/api/bookings", async (req, res) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("booking_date", { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/booking/:id", async (req, res) => {
  try {
    const supabase = getSupabase();
    const { status } = req.body;
    const { data, error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/booking/:id", async (req, res) => {
  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/contacts", async (req, res) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("id", { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
