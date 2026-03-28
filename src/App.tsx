import React, { useState, useEffect, createContext, useContext } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Heart, 
  Calendar, 
  Phone, 
  LayoutDashboard, 
  Menu, 
  X, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  Trash2,
  Check,
  LogOut,
  Mail,
  MapPin,
  User,
  Clock,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import { supabase, supabaseUrl } from './lib/supabase';

// --- Context ---

const defaultContent = {
  hero: {
    title: "Mental Health Matters.",
    subtitle: "We Are Here to Help.",
    description: "Equator Health Care Pvt. Ltd. is a specialized pharmacy and lab dedicated to mental health. We provide professional support, diagnostics, and medication management to help you lead a fulfilling life."
  },
  contact_info: {
    email: "pharmaequator@gmail.com",
    phone: "+977-9840066925",
    address: "Tinkune - 32, Kathmandu (Near CITe College)"
  }
};

type ContentType = typeof defaultContent;

const ContentContext = createContext<{
  content: ContentType;
  refreshContent: () => void;
}>({
  content: defaultContent,
  refreshContent: () => {}
});

export const useContent = () => useContext(ContentContext);

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Book Appointment', path: '/book' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                <Heart className="text-white w-6 h-6" />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">Equator Health</span>
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-teal-600 ${
                  location.pathname === link.path ? 'text-teal-600' : 'text-gray-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-teal-600 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-teal-600 hover:bg-gray-50 rounded-md"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => {
  const { content } = useContent();
  return (
  <footer className="bg-gray-900 text-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <Heart className="text-teal-400 w-6 h-6" />
            <span className="font-bold text-xl tracking-tight">Equator Health Care</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Dedicated to mental health awareness and providing accessible care for everyone. 
            Your well-being is our priority.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
          <ul className="space-y-4 text-sm text-gray-400">
            <li><Link to="/" className="hover:text-teal-400 transition-colors">Home</Link></li>
            <li><Link to="/book" className="hover:text-teal-400 transition-colors">Book Appointment</Link></li>
            <li><Link to="/contact" className="hover:text-teal-400 transition-colors">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-6">Contact Info</h3>
          <ul className="space-y-4 text-sm text-gray-400">
            <li className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-teal-400" />
              <span>{content.contact_info.email}</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-teal-400" />
              <span>{content.contact_info.phone}</span>
            </li>
            <li className="flex items-center space-x-3">
              <MapPin className="w-4 h-4 text-teal-400" />
              <span>{content.contact_info.address}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Equator Health Care Pvt. Ltd. All rights reserved.
      </div>
    </div>
  </footer>
)};

// --- Pages ---

const Home = () => {
  const { content } = useContent();
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-teal-50 py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6"
            >
              {content.hero.title} <br />
              <span className="text-teal-600">{content.hero.subtitle}</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600 mb-10 leading-relaxed"
            >
              {content.hero.description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link 
                to="/book" 
                className="inline-flex items-center px-8 py-4 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-200 group"
              >
                Book Appointment
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-teal-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-64 h-64 bg-teal-300 rounded-full blur-3xl opacity-20"></div>
      </section>

      {/* Awareness Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Mental Health Awareness</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Understanding the benefits and challenges of mental health care is the first step 
              towards a healthier society.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Pros */}
            <div className="bg-teal-50 p-8 rounded-3xl border border-teal-100">
              <h3 className="text-2xl font-bold text-teal-800 mb-6 flex items-center">
                <CheckCircle className="mr-3 w-6 h-6" />
                Pros of Awareness
              </h3>
              <ul className="space-y-4">
                {[
                  { title: "Early Diagnosis", desc: "Identifying issues early leads to more effective treatment." },
                  { title: "Emotional Well-being", desc: "Awareness helps in managing stress and emotions better." },
                  { title: "Reduced Stigma", desc: "Open conversations make it easier for people to seek help." },
                  { title: "Improved Relationships", desc: "Better self-understanding leads to healthier connections." }
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-2 mr-3 shrink-0"></div>
                    <div>
                      <span className="font-bold text-gray-900 block">{item.title}</span>
                      <span className="text-gray-600 text-sm">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cons / Challenges */}
            <div className="bg-rose-50 p-8 rounded-3xl border border-rose-100">
              <h3 className="text-2xl font-bold text-rose-800 mb-6 flex items-center">
                <AlertCircle className="mr-3 w-6 h-6" />
                Challenges & Cons
              </h3>
              <ul className="space-y-4">
                {[
                  { title: "Social Stigma", desc: "Fear of judgment often prevents people from seeking care." },
                  { title: "High Treatment Cost", desc: "Quality mental health care can be expensive for many." },
                  { title: "Lack of Awareness", desc: "Many people don't recognize symptoms of mental illness." },
                  { title: "Accessibility Issues", desc: "Specialized care is often limited in many regions." }
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-rose-600 rounded-full mt-2 mr-3 shrink-0"></div>
                    <div>
                      <span className="font-bold text-gray-900 block">{item.title}</span>
                      <span className="text-gray-600 text-sm">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const BookAppointment = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact: '',
    email: '',
    age: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
        throw new Error("Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.");
      }

      const { data, error } = await supabase
        .from('bookings')
        .insert([{
          name: formData.name,
          address: formData.address,
          contact: formData.contact,
          email: formData.email,
          age: parseInt(formData.age, 10) || 0,
          subject: formData.subject,
          message: formData.message,
          booking_date: new Date().toISOString(),
          status: 'pending'
        }])
        .select()
        .single();

      if (error) {
        if (error.message?.includes("schema cache") || error.message?.includes("relation")) {
          throw new Error("Database tables are missing. Please run the SQL script in your Supabase SQL Editor.");
        }
        throw error;
      }

      toast.success("Appointment booked successfully!");
      setBookingSuccess(data);
    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
        toast.error("Network error. Please check your internet connection or verify your Supabase URL in Netlify environment variables.");
      } else {
        toast.error(err.message || "An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadTicket = () => {
    if (!bookingSuccess) return;
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Equator Health Care Pvt. Ltd.", 105, 20, { align: "center" });
    doc.setFontSize(14);
    doc.text("Appointment Confirmation Ticket", 105, 30, { align: "center" });
    doc.line(20, 35, 190, 35);
    doc.setFontSize(12);
    doc.text(`Booking ID: ${bookingSuccess.id}`, 20, 45);
    doc.text(`Patient Name: ${bookingSuccess.name}`, 20, 55);
    doc.text(`Age: ${bookingSuccess.age}`, 20, 65);
    doc.text(`Contact: ${bookingSuccess.contact}`, 20, 75);
    doc.text(`Email: ${bookingSuccess.email}`, 20, 85);
    doc.text(`Address: ${bookingSuccess.address}`, 20, 95);
    doc.text(`Subject: ${bookingSuccess.subject}`, 20, 105);
    doc.text(`Date: ${new Date(bookingSuccess.booking_date).toLocaleString()}`, 20, 115);
    doc.setFontSize(14);
    doc.setTextColor(255, 0, 0);
    doc.text("Postpaid – Pay at visit", 105, 135, { align: "center" });
    doc.save(`ticket_${bookingSuccess.id}.pdf`);
  };

  if (bookingSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="text-teal-600 w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
        <p className="text-gray-600 mb-8">
          Thank you, {bookingSuccess.name}. Your appointment has been scheduled. 
          Please download your ticket below and bring it to the clinic.
        </p>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-8 text-left">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <span className="text-gray-500">Booking ID:</span>
            <span className="font-mono font-bold">{bookingSuccess.id}</span>
            <span className="text-gray-500">Patient:</span>
            <span className="font-bold">{bookingSuccess.name}</span>
            <span className="text-gray-500">Date:</span>
            <span className="font-bold">{new Date(bookingSuccess.booking_date).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={downloadTicket}
            className="flex items-center justify-center px-8 py-4 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-all"
          >
            <Download className="mr-2 w-5 h-5" />
            Download Ticket
          </button>
          <Link 
            to="/"
            className="flex items-center justify-center px-8 py-4 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200 transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Book Your Visit</h2>
        <p className="text-gray-600">Fill in the details below to schedule your appointment.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Full Name</label>
            <input 
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Email Address</label>
            <input 
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="info@gmail.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Contact Number</label>
            <input 
              required
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="+977 00000 00000"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Age</label>
            <input 
              required
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="20"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-semibold text-gray-700">Address</label>
            <input 
              required
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Your full address"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-semibold text-gray-700">Subject / Reason for Visit</label>
            <select 
              required
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
            >
              <option value="">Select a reason</option>
              <option value="General Consultation">General Consultation</option>
              <option value="Therapy Session">Therapy Session</option>
              <option value="Lab Test">Lab Test</option>
              <option value="Pharmacy Inquiry">Pharmacy Inquiry</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-semibold text-gray-700">Message (Optional)</label>
            <textarea 
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              placeholder="Any specific details you'd like to share..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>
        <button 
          disabled={loading}
          type="submit"
          className="w-full py-4 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-100 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
};

const Contact = () => {
  const { content } = useContent();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact: '',
    email: '',
    age: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
        throw new Error("Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.");
      }

      const { error } = await supabase
        .from('contacts')
        .insert([{
          name: formData.name,
          address: formData.address,
          contact: formData.contact,
          email: formData.email,
          age: parseInt(formData.age, 10) || 0,
          subject: formData.subject,
          message: formData.message
        }]);

      if (error) {
        if (error.message?.includes("schema cache") || error.message?.includes("relation")) {
          throw new Error("Database tables are missing. Please run the SQL script in your Supabase SQL Editor.");
        }
        throw error;
      }

      toast.success("Message sent successfully! We will get back to you soon.");
      setFormData({ name: '', address: '', contact: '', email: '', age: '', subject: '', message: '' });
    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
        toast.error("Network error. Please check your internet connection or verify your Supabase URL in Netlify environment variables.");
      } else {
        toast.error(err.message || "An error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h2>
        <p className="text-gray-600">Have questions? We're here to answer them.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center shrink-0">
              <Phone className="text-teal-600 w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Call Us</h4>
              <p className="text-gray-600 text-sm">{content.contact_info.phone}</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center shrink-0">
              <Mail className="text-teal-600 w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Email Us</h4>
              <p className="text-gray-600 text-sm">{content.contact_info.email}</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center shrink-0">
              <MapPin className="text-teal-600 w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Visit Us</h4>
              <p className="text-gray-600 text-sm">{content.contact_info.address}</p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl overflow-hidden h-64 shadow-sm border border-gray-100">
            <iframe
              title="Location Map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(content.contact_info.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
            ></iframe>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input 
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
            />
            <input 
              required
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
            />
            <input 
              required
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Contact Number"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
            />
            <input 
              required
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              placeholder="Age"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
            />
            <input 
              required
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none md:col-span-2"
            />
            <input 
              required
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none md:col-span-2"
            />
            <textarea 
              required
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              placeholder="Your Message"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none md:col-span-2"
            />
          </div>
          <button 
            disabled={loading}
            type="submit"
            className="w-full py-4 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-all"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validUsername = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
      const validPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'password123';

      if (username === validUsername && password === validPassword) {
        localStorage.setItem('adminToken', 'mock-jwt-token');
        toast.success("Login successful!");
        navigate('/admin/dashboard');
      } else {
        toast.error("Invalid credentials.");
      }
    } catch (err) {
      toast.error("Login failed.");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LayoutDashboard className="text-gray-600 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
          <p className="text-gray-500 text-sm">Access the management dashboard</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Username</label>
            <input 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Password</label>
            <input 
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          <button 
            type="submit"
            className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

const ContentEditor = () => {
  const { content, refreshContent } = useContent();
  const [hero, setHero] = useState(content.hero);
  const [contactInfo, setContactInfo] = useState(content.contact_info);
  const [saving, setSaving] = useState(false);

  const handleSave = async (key: string, data: any) => {
    setSaving(true);
    try {
      if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
        throw new Error("Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.");
      }

      const { error } = await supabase
        .from('site_content')
        .upsert({ section_key: key, content: data, updated_at: new Date().toISOString() });

      if (error) {
        if (error.message?.includes("schema cache") || error.message?.includes("relation")) {
          throw new Error("Please create the site_content table in Supabase first.");
        }
        throw error;
      }

      toast.success(`${key} content updated successfully`);
      refreshContent();
    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
        toast.error("Network error. Please verify your Supabase URL in Netlify environment variables.");
      } else {
        toast.error(err.message || `Failed to update ${key} content`);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Hero Section</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
            <input 
              value={hero.title}
              onChange={e => setHero({...hero, title: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Subtitle</label>
            <input 
              value={hero.subtitle}
              onChange={e => setHero({...hero, subtitle: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea 
              value={hero.description}
              onChange={e => setHero({...hero, description: e.target.value})}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          <button 
            onClick={() => handleSave('hero', hero)}
            disabled={saving}
            className="px-6 py-2 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
          >
            Save Hero Content
          </button>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input 
              value={contactInfo.email}
              onChange={e => setContactInfo({...contactInfo, email: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
            <input 
              value={contactInfo.phone}
              onChange={e => setContactInfo({...contactInfo, phone: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
            <input 
              value={contactInfo.address}
              onChange={e => setContactInfo({...contactInfo, address: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          <button 
            onClick={() => handleSave('contact_info', contactInfo)}
            disabled={saving}
            className="px-6 py-2 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
          >
            Save Contact Info
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'bookings' | 'contacts' | 'content'>('bookings');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/equatoradmin');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
        toast.error("Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.");
        setBookings([]);
        setContacts([]);
        return;
      }

      const [bookingsRes, contactsRes] = await Promise.all([
        supabase.from('bookings').select('*').order('booking_date', { ascending: false }),
        supabase.from('contacts').select('*').order('created_at', { ascending: false })
      ]);
      
      if (bookingsRes.error) {
        setBookings([]);
        if (!bookingsRes.error.message?.includes("relation")) {
          toast.error(`Bookings error: ${bookingsRes.error.message}`);
        }
      } else {
        setBookings(bookingsRes.data || []);
      }
      
      if (contactsRes.error) {
        setContacts([]);
        if (!contactsRes.error.message?.includes("relation")) {
          toast.error(`Contacts error: ${contactsRes.error.message}`);
        }
      } else {
        setContacts(contactsRes.data || []);
      }
    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
        toast.error("Network error. Please verify your Supabase URL in Netlify environment variables.");
      } else {
        toast.error("Failed to fetch data.");
      }
      setBookings([]);
      setContacts([]);
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    try {
      if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
        throw new Error("Supabase is not configured.");
      }
      const { error } = await supabase.from('bookings').delete().eq('id', id);
      if (!error) {
        setBookings(bookings.filter(b => b.id !== id));
        toast.success("Booking deleted.");
      } else {
        toast.error(error.message || "Failed to delete.");
      }
    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
        toast.error("Network error. Please verify your Supabase URL in Netlify environment variables.");
      } else {
        toast.error("Failed to delete.");
      }
    }
  };

  const markCompleted = async (id: string) => {
    try {
      if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
        throw new Error("Supabase is not configured.");
      }
      const { error } = await supabase.from('bookings').update({ status: 'completed' }).eq('id', id);
      if (!error) {
        setBookings(bookings.map(b => b.id === id ? { ...b, status: 'completed' } : b));
        toast.success("Marked as completed.");
      } else {
        toast.error(error.message || "Failed to update.");
      }
    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
        toast.error("Network error. Please verify your Supabase URL in Netlify environment variables.");
      } else {
        toast.error("Failed to update.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/equatoradmin');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
          <p className="text-gray-500">Manage your clinic operations</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center px-4 py-2 text-rose-600 font-semibold hover:bg-rose-50 rounded-lg transition-colors"
        >
          <LogOut className="mr-2 w-5 h-5" />
          Logout
        </button>
      </div>

      <div className="flex space-x-4 mb-8">
        <button 
          onClick={() => setActiveTab('bookings')}
          className={`px-6 py-2 rounded-full font-bold transition-all ${
            activeTab === 'bookings' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Bookings ({bookings.length})
        </button>
        <button 
          onClick={() => setActiveTab('contacts')}
          className={`px-6 py-2 rounded-full font-bold transition-all ${
            activeTab === 'contacts' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Inquiries ({contacts.length})
        </button>
        <button 
          onClick={() => setActiveTab('content')}
          className={`px-6 py-2 rounded-full font-bold transition-all ${
            activeTab === 'content' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Site Content
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {activeTab === 'content' ? (
          <ContentEditor />
        ) : activeTab === 'bookings' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">Patient</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">Contact</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">Reason</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{booking.name}</div>
                      <div className="text-xs text-gray-500">Age: {booking.age}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{booking.email}</div>
                      <div className="text-xs text-gray-500">{booking.contact}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{booking.subject}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(booking.booking_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        booking.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {booking.status !== 'completed' && (
                          <button 
                            onClick={() => markCompleted(booking.id)}
                            className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                            title="Mark Completed"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                        )}
                        <button 
                          onClick={() => deleteBooking(booking.id)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">No bookings found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">From</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">Subject</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{contact.name}</div>
                      <div className="text-xs text-gray-500">{contact.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-700">{contact.subject}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">{contact.message}</td>
                  </tr>
                ))}
                {contacts.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500">No inquiries found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [content, setContent] = useState<ContentType>(defaultContent);

  const fetchContent = async () => {
    try {
      if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
        return;
      }
      const { data, error } = await supabase.from('site_content').select('*');
      if (!error && Array.isArray(data) && data.length > 0) {
        const newContent = { ...defaultContent };
        data.forEach((item: any) => {
          if (item.section_key === 'hero') newContent.hero = item.content;
          if (item.section_key === 'contact_info') newContent.contact_info = item.content;
        });
        setContent(newContent);
      }
    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
        console.error("Network error. Please verify your Supabase URL in Netlify environment variables.");
      } else {
        console.error("Failed to fetch content", err);
      }
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return (
    <ContentContext.Provider value={{ content, refreshContent: fetchContent }}>
      <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book" element={<BookAppointment />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/equatoradmin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ContentContext.Provider>
  );
}
