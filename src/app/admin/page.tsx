"use client";

import { useState, useEffect } from "react";
import { Plus, Users, Calendar as CalendarIcon, Settings, Search, Trash2, Check, X, Mail, ShieldCheck } from "lucide-react";
import { getEvents, getRegistrations, createEvent, deleteEvent, updateRegistrationStatus, getSubscribers, EventType, RegistrationType, SubscriberType } from "@/lib/store";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("events");
  const [events, setEvents] = useState<EventType[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationType[]>([]);
  const [subscribers, setSubscribers] = useState<SubscriberType[]>([]);

  // Security state
  const [passcode, setPasscode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // New Event form modal state
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Movement");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState(1499);
  const [seats, setSeats] = useState(25);
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = sessionStorage.getItem("nacl_admin_auth");
      if (auth === "true") {
        setIsAuthorized(true);
      }
    }
    const loadAdminData = () => {
      setEvents(getEvents());
      setRegistrations(getRegistrations());
      setSubscribers(getSubscribers());
    };
    loadAdminData();

    window.addEventListener("nacl_events_update", loadAdminData);
    window.addEventListener("nacl_subscribers_update", loadAdminData);

    return () => {
      window.removeEventListener("nacl_events_update", loadAdminData);
      window.removeEventListener("nacl_subscribers_update", loadAdminData);
    };
  }, []);

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "28012007") {
      setIsAuthorized(true);
      sessionStorage.setItem("nacl_admin_auth", "true");
      setErrorMsg("");
    } else {
      setErrorMsg("Access Denied: Invalid security passcode.");
    }
  };

  const handleApprove = async (id: string) => {
    updateRegistrationStatus(id, "approved");
    try {
      await fetch("/api/registrations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId: id,
          status: "approved",
          adminApproved: true,
          approvedBy: "NaCl Admin Portal"
        })
      });
    } catch {}
    setRegistrations(getRegistrations());
    window.dispatchEvent(new Event("nacl_events_update"));
  };

  const handleReject = async (id: string) => {
    updateRegistrationStatus(id, "rejected");
    try {
      await fetch("/api/registrations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId: id,
          status: "rejected",
          adminApproved: false,
          approvedBy: "NaCl Admin Portal"
        })
      });
    } catch {}
    setRegistrations(getRegistrations());
    window.dispatchEvent(new Event("nacl_events_update"));
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImagePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              if (typeof reader.result === "string") {
                setImage(reader.result);
              }
            };
            reader.readAsDataURL(file);
          }
          e.preventDefault();
          break;
        }
      }
    }
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !venue || !date || !time || !description) return;

    // Fallback image if empty
    const imgUrl = image || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop";

    createEvent({
      title,
      category,
      date,
      time,
      venue,
      address,
      price: Number(price),
      seats: Number(seats),
      image: imgUrl,
      description,
      host: {
        name: "NaCl Active Panel",
        role: "Hub Curator",
        image: "https://wwpiutgexsehvoqicydp.supabase.co/storage/v1/object/public/community-media/avatars/017f3cb8-2013-4bac-8160-5bd57b87fc9d.png"
      },
      timeline: [
        { time: time, event: "Arrival & Orientation" },
        { time: "In-session", event: "Structured movement & training loops" },
        { time: "Closing", event: "Sauna transition & community wrapup" }
      ]
    });

    // Reset fields & refresh
    setTitle("");
    setVenue("");
    setAddress("");
    setDate("");
    setTime("");
    setImage("");
    setDescription("");
    setShowModal(false);
    
    // Sync UI
    setEvents(getEvents());
    // Trigger cross-page update
    window.dispatchEvent(new Event("nacl_events_update"));
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm("Are you sure you want to delete this program/event?")) {
      deleteEvent(id);
      setEvents(getEvents());
      window.dispatchEvent(new Event("nacl_events_update"));
    }
  };

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If not authorized, show passcode validation screen
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-primary text-secondary">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-secondary/5 border border-secondary/15 rounded-3xl p-8 shadow-2xl backdrop-blur-xl text-center space-y-6"
        >
          <div className="w-16 h-16 bg-accent/15 border border-accent/30 text-accent rounded-2xl flex items-center justify-center mx-auto mb-2 font-mono text-xl font-bold">
            ⌥
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-white uppercase">Control Room</h1>
            <p className="text-xs text-additional/60 uppercase tracking-widest font-bold">NaCl Security Terminal</p>
          </div>

          <form onSubmit={handlePasscodeSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter Administrator Passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-primary border border-secondary/10 focus:border-accent hover:border-secondary/20 rounded-xl px-4 py-3.5 text-center text-white focus:outline-none transition-colors tracking-[0.5em] text-lg font-bold font-mono placeholder:tracking-normal placeholder:font-sans placeholder:text-sm"
                required
              />
            </div>
            
            {errorMsg && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-400 font-bold"
              >
                {errorMsg}
              </motion.p>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-accent text-primary font-bold rounded-xl hover:bg-white hover:text-primary transition-all duration-300 shadow-lg hover:shadow-accent/15 text-sm uppercase tracking-wider"
            >
              Verify Credentials
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 text-secondary bg-primary">
      {/* Sidebar / Mobile Pill Navigation */}
      <div className="w-full lg:w-64 shrink-0">
        <h2 className="text-xl font-bold mb-4 lg:mb-8 px-1 text-white flex justify-between items-center">
          <span>Control Room</span>
          <button
            onClick={() => {
              setIsAuthorized(false);
              sessionStorage.removeItem("nacl_admin_auth");
              setPasscode("");
            }}
            className="lg:hidden text-xs text-red-400 hover:underline flex items-center gap-1 uppercase tracking-wider font-bold"
          >
            <X size={14} /> Lock
          </button>
        </h2>

        <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-3 lg:pb-0 custom-scrollbar snap-x">
          <button 
            onClick={() => setActiveTab("events")}
            className={`shrink-0 lg:w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl transition-colors text-xs lg:text-sm font-bold uppercase tracking-wider whitespace-nowrap snap-start ${
              activeTab === "events" ? "bg-accent text-primary font-black shadow-md" : "bg-secondary/5 lg:bg-transparent text-additional hover:bg-secondary/10 hover:text-white"
            }`}
          >
            <CalendarIcon size={16} /> Manage Catalog
          </button>
          <button 
            onClick={() => setActiveTab("registrations")}
            className={`shrink-0 lg:w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl transition-colors text-xs lg:text-sm font-bold uppercase tracking-wider whitespace-nowrap snap-start ${
              activeTab === "registrations" ? "bg-accent text-primary font-black shadow-md" : "bg-secondary/5 lg:bg-transparent text-additional hover:bg-secondary/10 hover:text-white"
            }`}
          >
            <Users size={16} /> Registrations
          </button>
          <button 
            onClick={() => setActiveTab("subscribers")}
            className={`shrink-0 lg:w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl transition-colors text-xs lg:text-sm font-bold uppercase tracking-wider whitespace-nowrap snap-start ${
              activeTab === "subscribers" ? "bg-accent text-primary font-black shadow-md" : "bg-secondary/5 lg:bg-transparent text-additional hover:bg-secondary/10 hover:text-white"
            }`}
          >
            <Mail size={16} /> Subscribers & Leads
          </button>
        </div>

        <div className="hidden lg:block pt-8 border-t border-secondary/5 mt-4">
          <button 
            onClick={() => {
              setIsAuthorized(false);
              sessionStorage.removeItem("nacl_admin_auth");
              setPasscode("");
            }}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-colors text-sm font-bold uppercase tracking-wider text-red-400/80 hover:bg-red-500/10 hover:text-red-400"
          >
            <X size={18} /> Lock Terminal
          </button>
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1">
        {activeTab === "events" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">Programs & Events</h1>
                <p className="text-xs text-additional mt-1">Configure user-facing experiences across hub cities</p>
              </div>
              <button 
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-5 py-3 bg-accent text-primary font-bold rounded-2xl hover:bg-white transition-all text-sm shadow-lg hover:shadow-accent/10"
              >
                <Plus size={18} /> Add Program/Event
              </button>
            </div>

            {/* Search/Filter Bar */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-additional/40" size={18} />
                <input 
                  type="text" 
                  placeholder="Filter events by title or location..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-secondary/5 border border-secondary/10 hover:border-secondary/20 focus:border-accent rounded-2xl pl-12 pr-4 py-3.5 text-xs text-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Catalog Table */}
            <div className="bg-secondary/5 border border-secondary/10 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-additional">
                  <thead className="bg-primary border-b border-secondary/10 text-[10px] font-bold uppercase tracking-widest text-white">
                    <tr>
                      <th className="px-6 py-4">Event</th>
                      <th className="px-6 py-4">Location</th>
                      <th className="px-6 py-4">Schedule</th>
                      <th className="px-6 py-4">Spots</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary/10">
                    {filteredEvents.map(e => (
                      <tr key={e.id} className="hover:bg-secondary/5 transition-colors font-medium">
                        <td className="px-6 py-4 font-bold text-white text-sm">
                          <div>{e.title}</div>
                          <span className="text-[9px] bg-accent/10 text-accent px-1.5 py-0.5 rounded uppercase font-bold tracking-wider mt-1 inline-block">
                            {e.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs">{e.venue}</td>
                        <td className="px-6 py-4 text-xs">
                          <div>{e.date}</div>
                          <div className="text-[10px] text-additional/40 mt-0.5">{e.time}</div>
                        </td>
                        <td className="px-6 py-4 text-xs">
                          <span className="font-bold text-white">{e.remainingSeats}</span> / {e.seats} left
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleDeleteEvent(e.id)}
                            className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-colors"
                            title="Remove Gathering"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "registrations" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Access Passes</h1>
              <p className="text-xs text-additional mt-1 font-medium">List of active member tickets and match archetypes</p>
            </div>

            <div className="bg-secondary/5 border border-secondary/10 rounded-3xl overflow-hidden shadow-2xl">
              {registrations.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-additional">
                    <thead className="bg-primary border-b border-secondary/10 text-[10px] font-bold uppercase tracking-widest text-white">
                      <tr>
                        <th className="px-6 py-4">Attendee</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Event</th>
                        <th className="px-6 py-4">Archetype</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary/10 font-medium">
                      {registrations.map(reg => (
                        <tr key={reg.id} className="hover:bg-secondary/5 transition-colors">
                          <td className="px-6 py-4 text-sm font-bold text-white">{reg.userName}</td>
                          <td className="px-6 py-4 text-xs">{reg.userEmail}</td>
                          <td className="px-6 py-4 text-xs text-white">{reg.eventTitle}</td>
                          <td className="px-6 py-4">
                            <span className="text-[9px] bg-accent/15 text-accent border border-accent/20 px-2 py-0.5 rounded uppercase tracking-widest">
                              {reg.archetype}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs">
                            {reg.status === "pending" && (
                              <span className="text-[9px] bg-yellow-500/15 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded uppercase tracking-widest font-semibold">
                                Pending
                              </span>
                            )}
                            {reg.status === "approved" && (
                              <span className="text-[9px] bg-green-500/15 text-green-400 border border-green-500/20 px-2 py-0.5 rounded uppercase tracking-widest font-semibold">
                                Approved
                              </span>
                            )}
                            {reg.status === "rejected" && (
                              <span className="text-[9px] bg-red-500/15 text-red-400 border border-red-500/20 px-2 py-0.5 rounded uppercase tracking-widest font-semibold">
                                Rejected
                              </span>
                            )}
                            {reg.status === "cancelled" && (
                              <span className="text-[9px] bg-gray-500/15 text-gray-400 border border-gray-500/20 px-2 py-0.5 rounded uppercase tracking-widest font-semibold">
                                Cancelled
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            {reg.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleApprove(reg.id)}
                                  className="px-2.5 py-1 bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-white rounded-xl text-xs font-bold transition-colors"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReject(reg.id)}
                                  className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-xl text-xs font-bold transition-colors"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center text-additional/40 text-sm font-semibold">
                  No active member registrations found in catalog.
                </div>
              )}
            </div>
          </div>
        )}



        {activeTab === "subscribers" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Subscribers & Leads</h1>
              <p className="text-xs text-additional mt-1">Growth tracking, city preferences & acquisition channels</p>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-secondary/5 border border-secondary/15 rounded-2xl p-5">
                <div className="text-additional text-[10px] font-bold uppercase tracking-wider">Total Subscribers</div>
                <div className="text-2xl font-black text-white mt-1">{subscribers.length}</div>
              </div>
              <div className="bg-secondary/5 border border-secondary/15 rounded-2xl p-5">
                <div className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider">Active List</div>
                <div className="text-2xl font-black text-white mt-1">
                  {subscribers.filter((s) => s.status === "active").length}
                </div>
              </div>
              <div className="bg-secondary/5 border border-secondary/15 rounded-2xl p-5">
                <div className="text-accent text-[10px] font-bold uppercase tracking-wider">Landing Page Leads</div>
                <div className="text-2xl font-black text-white mt-1">
                  {subscribers.filter((s) => s.source === "landing").length}
                </div>
              </div>
              <div className="bg-secondary/5 border border-secondary/15 rounded-2xl p-5">
                <div className="text-purple-400 text-[10px] font-bold uppercase tracking-wider">Pet Widget & Popups</div>
                <div className="text-2xl font-black text-white mt-1">
                  {subscribers.filter((s) => s.source === "pet_widget" || s.source === "popup").length}
                </div>
              </div>
            </div>

            {/* Subscribers Table */}
            <div className="bg-secondary/5 border border-secondary/15 rounded-3xl overflow-hidden">
              <div className="px-6 py-4 border-b border-secondary/10 flex justify-between items-center">
                <h3 className="font-bold text-white text-sm">Active Subscriber List</h3>
                <span className="text-[11px] text-additional font-mono">{subscribers.length} entries</span>
              </div>

              {subscribers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-additional">
                    <thead className="bg-secondary/10 uppercase tracking-wider font-bold text-[10px] text-white border-b border-secondary/10">
                      <tr>
                        <th className="px-6 py-3">Subscriber</th>
                        <th className="px-6 py-3">City Hub</th>
                        <th className="px-6 py-3">Alert Frequency</th>
                        <th className="px-6 py-3">Source Channel</th>
                        <th className="px-6 py-3">Subscribed Date</th>
                        <th className="px-6 py-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary/10">
                      {subscribers.map((sub) => (
                        <tr key={sub.id} className="hover:bg-secondary/5 transition-colors">
                          <td className="px-6 py-4 font-bold text-white">
                            <div>{sub.email}</div>
                            {sub.name && <div className="text-[10px] text-additional font-normal">{sub.name}</div>}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-0.5 rounded-full bg-accent/15 text-accent font-bold text-[10px] border border-accent/30">
                              {sub.cityPreference}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-white capitalize">{sub.frequency}</td>
                          <td className="px-6 py-4 font-mono text-[11px]">{sub.source}</td>
                          <td className="px-6 py-4">{sub.subscribedAt}</td>
                          <td className="px-6 py-4 text-right font-bold text-emerald-400">
                            {sub.status.toUpperCase()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center text-additional/40 text-xs font-semibold">
                  No subscribers registered yet. Try submitting via the landing page or Pet Assistant widget!
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* NEW EVENT FORM MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-primary/80 backdrop-blur-md" onClick={() => setShowModal(false)} />
          
          <div className="relative bg-primary border border-secondary/15 rounded-3xl w-full max-w-lg p-8 shadow-2xl z-10 text-secondary max-h-[85vh] overflow-y-auto">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-additional hover:text-white transition-colors">
              <X size={20} />
            </button>

            <h3 className="text-2xl font-extrabold text-white tracking-tight mb-6 flex items-center gap-2">
              <Plus size={24} className="text-accent" /> Create New Program or Event
            </h3>

            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-additional uppercase tracking-widest mb-1.5">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Steel Mace Flow"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-secondary/5 border border-secondary/10 focus:border-accent hover:border-secondary/20 rounded-xl px-4 py-3 text-white focus:outline-none transition-colors text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-additional uppercase tracking-widest mb-1.5">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-primary border border-secondary/10 focus:border-accent hover:border-secondary/20 rounded-xl px-4 py-3 text-white focus:outline-none transition-colors text-xs"
                  >
                    <option value="Movement">Movement</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Wellness">Wellness</option>
                    <option value="Workshops">Workshops</option>
                    <option value="Social">Social</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-additional uppercase tracking-widest mb-1.5">Date</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sat Jun 27th"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-secondary/5 border border-secondary/10 focus:border-accent hover:border-secondary/20 rounded-xl px-4 py-3 text-white focus:outline-none transition-colors text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-additional uppercase tracking-widest mb-1.5">Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10:30 AM IST"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-secondary/5 border border-secondary/10 focus:border-accent hover:border-secondary/20 rounded-xl px-4 py-3 text-white focus:outline-none transition-colors text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-additional uppercase tracking-widest mb-1.5">Venue</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fit District, Indiranagar"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full bg-secondary/5 border border-secondary/10 focus:border-accent hover:border-secondary/20 rounded-xl px-4 py-3 text-white focus:outline-none transition-colors text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-additional uppercase tracking-widest mb-1.5">Address Details (Optional)</label>
                <input
                  type="text"
                  placeholder="Metro Pillar 55, 100 Feet Rd, Bengaluru..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-secondary/5 border border-secondary/10 focus:border-accent hover:border-secondary/20 rounded-xl px-4 py-3 text-white focus:outline-none transition-colors text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-additional uppercase tracking-widest mb-1.5">Ticket Price (INR)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-secondary/5 border border-secondary/10 focus:border-accent hover:border-secondary/20 rounded-xl px-4 py-3 text-white focus:outline-none transition-colors text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-additional uppercase tracking-widest mb-1.5">Capacity (Spots)</label>
                  <input
                    type="number"
                    required
                    value={seats}
                    onChange={(e) => setSeats(Number(e.target.value))}
                    className="w-full bg-secondary/5 border border-secondary/10 focus:border-accent hover:border-secondary/20 rounded-xl px-4 py-3 text-white focus:outline-none transition-colors text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-additional uppercase tracking-widest mb-1.5">Cover Image (Upload, Paste, or URL)</label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Paste image URL here..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    onPaste={handleImagePaste}
                    className="flex-1 bg-secondary/5 border border-secondary/10 focus:border-accent hover:border-secondary/20 rounded-xl px-4 py-3 text-white focus:outline-none transition-colors text-xs"
                  />
                  <label 
                    htmlFor="admin-image-upload" 
                    className="px-4 py-3 bg-secondary/10 hover:bg-secondary/20 text-white font-bold rounded-xl cursor-pointer text-xs flex items-center justify-center transition-colors shrink-0"
                  >
                    Upload File
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    id="admin-image-upload"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                </div>
                
                {/* Visual Drag/Drop/Paste Zone & Preview */}
                <div 
                  onPaste={handleImagePaste}
                  className="border border-dashed border-secondary/10 bg-secondary/5 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-default hover:border-accent/40 transition-colors group relative overflow-hidden h-32"
                >
                  {image ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={image} 
                        alt="Preview" 
                        className="absolute inset-0 w-full h-full object-cover brightness-[0.4]"
                      />
                      <div className="relative z-10 text-white text-xs font-semibold">Image Selected</div>
                      <button 
                        type="button"
                        onClick={() => setImage("")}
                        className="relative z-10 mt-2 px-2 py-1 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 rounded-lg text-[10px] font-bold uppercase transition-colors"
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <div className="text-additional/40 text-xs">
                      <p className="font-semibold text-additional/60 group-hover:text-accent transition-colors">Drag files here, or copy/paste an image directly</p>
                      <p className="text-[10px] mt-1">Supports PNG, JPG, WebP</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-bold text-additional uppercase tracking-widest mb-1.5">Description</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detail the experience, host bios, requirements..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-secondary/5 border border-secondary/10 focus:border-accent hover:border-secondary/20 rounded-xl px-4 py-3 text-white focus:outline-none transition-colors text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-accent text-primary hover:bg-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 mt-4 text-xs"
              >
                <Check size={14} /> Finalize & Create Program/Event
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
