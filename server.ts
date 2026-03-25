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
        age: parseInt(age, 10) || 0, 
        subject, 
        message, 
        booking_date: new Date().toISOString(),
        status: 'pending' 
      }])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      if (error.message?.includes("schema cache") || error.message?.includes("relation")) {
        throw new Error("Database tables are missing. Please run the SQL script in your Supabase SQL Editor.");
      }
      throw new Error(error.message || JSON.stringify(error));
    }

    res.json({ success: true, booking: data });
  } catch (error: any) {
    console.error("Booking catch error:", error.message || error);
    res.status(500).json({ error: error.message || "An unexpected error occurred during booking." });
  }
});

app.post("/api/contact", async (req, res) => {
  try {
    const supabase = getSupabase();
    const { name, address, contact, email, age, subject, message } = req.body;
    const { data, error } = await supabase
      .from("contacts")
      .insert([{ name, address, contact, email, age: parseInt(age, 10) || 0, subject, message }]);

    if (error) {
      console.error("Supabase insert error:", error);
      if (error.message?.includes("schema cache") || error.message?.includes("relation")) {
        throw new Error("Database tables are missing. Please run the SQL script in your Supabase SQL Editor.");
      }
      throw new Error(error.message || JSON.stringify(error));
    }
    res.json({ success: true });
  } catch (error: any) {
    console.error("Contact catch error:", error.message || error);
    res.status(500).json({ error: error.message || "An unexpected error occurred." });
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
    if (error) {
      console.error("Supabase fetch error:", error);
      if (error.message?.includes("schema cache") || error.message?.includes("relation")) {
        throw new Error("Database tables are missing. Please run the SQL script in your Supabase SQL Editor.");
      }
      throw new Error(error.message || JSON.stringify(error));
    }
    res.json(data);
  } catch (error: any) {
    console.error("Bookings fetch catch error:", error.message || error);
    res.status(500).json({ error: error.message || "An unexpected error occurred." });
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
    if (error) {
      console.error("Supabase update error:", error);
      throw new Error(error.message || JSON.stringify(error));
    }
    res.json({ success: true });
  } catch (error: any) {
    console.error("Booking update catch error:", error.message || error);
    res.status(500).json({ error: error.message || "An unexpected error occurred." });
  }
});

app.delete("/api/booking/:id", async (req, res) => {
  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", req.params.id);
    if (error) {
      console.error("Supabase delete error:", error);
      throw new Error(error.message || JSON.stringify(error));
    }
    res.json({ success: true });
  } catch (error: any) {
    console.error("Booking delete catch error:", error.message || error);
    res.status(500).json({ error: error.message || "An unexpected error occurred." });
  }
});

app.get("/api/contacts", async (req, res) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("id", { ascending: false });
    if (error) {
      console.error("Supabase fetch error:", error);
      if (error.message?.includes("schema cache") || error.message?.includes("relation")) {
        throw new Error("Database tables are missing. Please run the SQL script in your Supabase SQL Editor.");
      }
      throw new Error(error.message || JSON.stringify(error));
    }
    res.json(data);
  } catch (error: any) {
    console.error("Contacts fetch catch error:", error.message || error);
    res.status(500).json({ error: error.message || "An unexpected error occurred." });
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
