"use client";

export interface EventType {
  id: string;
  title: string;
  category: string;
  city?: "Bangalore" | "Mumbai" | "Coimbatore" | string;
  date: string;
  time: string;
  venue: string;
  address?: string;
  price: number;
  seats: number;
  remainingSeats: number;
  image: string;
  description: string;
  host: {
    name: string;
    role: string;
    image: string;
  };
  timeline: { time: string; event: string }[];
}

export interface WaitlistType {
  id: string;
  eventId: string;
  eventTitle: string;
  name: string;
  email: string;
  date: string;
  status: "waiting" | "notified";
}

export interface OrderRecordType {
  orderId: string;
  paymentId: string;
  eventId: string;
  eventTitle: string;
  userName: string;
  userEmail: string;
  amount: number;
  date: string;
  status: "PAID" | "REFUNDED";
  qrCode: string;
}

export interface RegistrationType {
  id: string;
  eventId: string;
  eventTitle: string;
  userName: string;
  userEmail: string;
  archetype: string;
  ticketType: string;
  price: number;
  date: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  qrCode: string;
}

export interface UserSession {
  name: string;
  email: string;
  archetype?: string;
  isLoggedIn: boolean;
}

const INITIAL_EVENTS: EventType[] = [
  {
    id: "nacl-flow-club-rawform-lab",
    title: "NaCl Flow Club: RawForm Lab",
    category: "Movement",
    city: "Bangalore",
    date: "Sat Jun 27th",
    time: "10:30 AM IST",
    venue: "Fit District, Indiranagar, Bangalore",
    address: "Metro Pillar Number 55, 5th floor, 100 Feet Rd, Indira Nagar 1st Stage, H Colony, Indiranagar, Bengaluru, Karnataka 560038, India",
    price: 1499,
    seats: 25,
    remainingSeats: 22,
    image: "https://wwpiutgexsehvoqicydp.supabase.co/storage/v1/object/public/event-images/user_3ELaY1WvidCusp6N022FRw0w6bR/1780583942070-d2297891.png",
    description: "Most of us move through life using only a fraction of what our bodies are capable of.\n\nFlow Club returns to Bangalore with a 90-minute movement intensive in collaboration with FitDistrict, designed for anyone curious about moving beyond conventional fitness.\n\nThis session brings together strength, mobility, coordination, recovery, and flow through a combination of Lifestyle Strength Classes (LSC), Joint Control Training (JCT), Animal Flow, and Steel Mace Flow. Rather than focusing on aesthetics or performance alone, the experience explores how strength, control, and movement quality work together.\n\nLed by Akshay Sharma and Suhail \"Coach Fatboy\", this session brings together expertise from across the movement, strength, and fitness spectrum. With years of experience coaching individuals, athletes, and fitness communities, they will guide participants through a carefully curated exploration of strength, mobility, control, and flow in an accessible, beginner-friendly format.\n\nExpect to crawl, balance, rotate, stabilise, and explore movement patterns you may not encounter in everyday training. We'll wrap up the morning with a sauna session, a chance to slow down, recover, and reflect on the experience.\n\nNo prior experience required. Just curiosity and a willingness to move.",
    host: {
      name: "NaCl Flowclub",
      role: "Movement Curators",
      image: "https://wwpiutgexsehvoqicydp.supabase.co/storage/v1/object/public/community-media/avatars/017f3cb8-2013-4bac-8160-5bd57b87fc9d.png"
    },
    timeline: [
      { time: "10:30 AM", event: "Arrival, Check-in & Open Circle" },
      { time: "10:45 AM", event: "Joint Control & Lifestyle Strength drills" },
      { time: "11:15 AM", event: "Animal Flow Transitions & Steel Mace Swing" },
      { time: "11:45 AM", event: "Structured Coordination & Team Flow Play" },
      { time: "12:00 PM", event: "Sauna Social, Ice Tub Plunge & Integration" }
    ]
  },
  {
    id: "steel-mace-flow-breathwork",
    title: "Steel Mace Flow & Breathwork",
    category: "Fitness",
    city: "Mumbai",
    date: "Nov 5th",
    time: "8:00 AM - 10:00 AM",
    venue: "The Nest Gym, Bandra, Mumbai",
    price: 1200,
    seats: 18,
    remainingSeats: 15,
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop",
    description: "Discover the power of rotational strength and flow using the traditional Indian club / steel mace. We combine structured swing sequences with rhythmic diaphragmatic breathwork. Led by local curators, it's a deep session of concentration and dynamic power.",
    host: {
      name: "NaCl Mumbai Hub",
      role: "Strength & Conditioning Hub",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
    },
    timeline: [
      { time: "8:00 AM", event: "Arrival & Mace Weight Selection" },
      { time: "8:15 AM", event: "360 Swing Mechanics & Grip Conditioning" },
      { time: "8:45 AM", event: "Steel Mace Choreographed Flow" },
      { time: "9:30 AM", event: "Breathwork & Grounding Meditation" },
      { time: "9:50 AM", event: "Community Coffee Connection" }
    ]
  },
  {
    id: "animal-flow-mobility-intensive",
    title: "Animal Flow & Mobility Intensive",
    category: "Movement",
    city: "Coimbatore",
    date: "Dec 12th",
    time: "7:00 AM - 9:00 AM",
    venue: "Race Course Walkway, Coimbatore",
    price: 999,
    seats: 15,
    remainingSeats: 12,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop",
    description: "Take your training outdoors. Ground your movements, challenge your coordination, and build core stability with animal flow patterns on the grass. Includes posture workshops and a post-workout breakfast connection.",
    host: {
      name: "NaCl Coimbatore Hub",
      role: "Outdoor & Calisthenics Club",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
    },
    timeline: [
      { time: "7:00 AM", event: "Morning Circle & Wrist Prep" },
      { time: "7:15 AM", event: "Static Activations (Beast, Crab, Scorpion)" },
      { time: "7:45 AM", event: "Travelling Forms & Transitions" },
      { time: "8:15 AM", event: "Co-created Movement Flow Jam" },
      { time: "8:45 AM", event: "Organic Breakfast & Sharing" }
    ]
  },
  {
    id: "sunset-wellness-circle-cold-plunge",
    title: "Sunset Wellness Circle & Cold Plunge",
    category: "Wellness",
    date: "Oct 24th",
    time: "5:30 PM - 7:30 PM",
    venue: "The Greenhouse Studio, Cubbon Park, Bangalore",
    price: 799,
    seats: 12,
    remainingSeats: 9,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop",
    description: "A deeply calming circle focusing on nervous system regulation. We begin with guided journaling, transition to soft restorative yoga, and conclude with an optional guided 3-minute cold plunge for mental resilience.",
    host: {
      name: "NaCl Bangalore Hub",
      role: "Wellness Curators",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
    },
    timeline: [
      { time: "5:30 PM", event: "Nervous System Check-in & Tea" },
      { time: "5:45 PM", event: "Breathwork & Somatic Grounding" },
      { time: "6:15 PM", event: "Restorative Stretching under Sunset" },
      { time: "6:45 PM", event: "Cold Plunge Briefing & Plunge Rotation" },
      { time: "7:15 PM", event: "Warm Herbal Infusions & Closing Circle" }
    ]
  }
];

const INITIAL_REGISTRATIONS: RegistrationType[] = [];

const STORAGE_KEYS = {
  EVENTS: "nacl_events",
  REGISTRATIONS: "nacl_registrations",
  USER: "nacl_user_session"
};

// Safe window checks for SSR
const isClient = typeof window !== "undefined";

export function getEvents(): EventType[] {
  if (!isClient) return INITIAL_EVENTS;
  const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
    return INITIAL_EVENTS;
  }
  return JSON.parse(data);
}

export function saveEvents(events: EventType[]) {
  if (!isClient) return;
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
}

export function getEventById(id: string): EventType | undefined {
  const events = getEvents();
  return events.find(e => e.id === id);
}

export function createEvent(event: Omit<EventType, "id" | "remainingSeats">): EventType {
  const events = getEvents();
  const id = event.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const newEvent: EventType = {
    ...event,
    id,
    remainingSeats: event.seats
  };
  events.push(newEvent);
  saveEvents(events);
  return newEvent;
}

export function deleteEvent(id: string) {
  const events = getEvents();
  const filtered = events.filter(e => e.id !== id);
  saveEvents(filtered);
}

export function getRegistrations(): RegistrationType[] {
  if (!isClient) return INITIAL_REGISTRATIONS;
  const data = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(INITIAL_REGISTRATIONS));
    return INITIAL_REGISTRATIONS;
  }
  return JSON.parse(data);
}

export function saveRegistrations(regs: RegistrationType[]) {
  if (!isClient) return;
  localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(regs));
}

export function createRegistration(
  eventId: string,
  userName: string,
  userEmail: string,
  archetype: string,
  ticketType: string = "General Admission"
): { registration: RegistrationType; success: boolean; message: string } {
  const events = getEvents();
  const eventIdx = events.findIndex(e => e.id === eventId);
  
  if (eventIdx === -1) {
    return { success: false, message: "Event not found", registration: {} as any };
  }

  const event = events[eventIdx];
  if (event.remainingSeats <= 0) {
    return { success: false, message: "This event is sold out!", registration: {} as any };
  }

  // Deduct seat
  event.remainingSeats -= 1;
  saveEvents(events);

  const registrations = getRegistrations();
  const id = "reg-" + Math.floor(Math.random() * 900000 + 100000);
  const code = `NACL-${event.category.toUpperCase().slice(0, 3)}-${Math.floor(Math.random() * 9000 + 1000)}`;
  
  const newReg: RegistrationType = {
    id,
    eventId,
    eventTitle: event.title,
    userName,
    userEmail,
    archetype,
    ticketType,
    price: event.price,
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    status: "pending",
    qrCode: code
  };

  registrations.push(newReg);
  saveRegistrations(registrations);

  return { success: true, message: "Registration successful!", registration: newReg };
}

export function getUserSession(): UserSession {
  if (!isClient) return { name: "", email: "", isLoggedIn: false };
  const data = localStorage.getItem(STORAGE_KEYS.USER);
  if (!data) {
    const defaultUser: UserSession = { name: "Guest User", email: "guest@nacl.in", isLoggedIn: false };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(defaultUser));
    return defaultUser;
  }
  return JSON.parse(data);
}

export function saveUserSession(session: UserSession) {
  if (!isClient) return;
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(session));
}

export function updateRegistrationStatus(id: string, status: "approved" | "rejected" | "cancelled" | "pending") {
  const regs = getRegistrations();
  const idx = regs.findIndex(r => r.id === id);
  if (idx !== -1) {
    regs[idx].status = status;
    saveRegistrations(regs);
  }
}

export interface CustomerStoryType {
  id: string;
  customerName: string;
  eventId: string;
  eventTitle: string;
  experience: string;
  photo: string;
  date: string;
}

const INITIAL_STORIES: CustomerStoryType[] = [
  {
    id: "story-1",
    customerName: "Aarav Sharma",
    eventId: "nacl-flow-club-rawform-lab",
    eventTitle: "NaCl Flow Club: RawForm Lab",
    experience: "The steel mace flow and animal movement session completely shifted my perspective on mobility and body control. Incredible energy!",
    photo: "https://wwpiutgexsehvoqicydp.supabase.co/storage/v1/object/public/event-images/user_3ELaY1WvidCusp6N022FRw0w6bR/1780583942070-d2297891.png",
    date: "Jun 2025"
  },
  {
    id: "story-2",
    customerName: "Priya Nair",
    eventId: "sunset-wellness-circle-cold-plunge",
    eventTitle: "Sunset Wellness Circle & Cold Plunge",
    experience: "The sunset breathwork circle followed by the 3-minute cold plunge was deeply transformative. Found genuine peace & connection.",
    photo: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop",
    date: "Oct 2025"
  },
  {
    id: "story-3",
    customerName: "Karan Patel",
    eventId: "steel-mace-flow-breathwork",
    eventTitle: "Steel Mace Flow & Breathwork",
    experience: "Learning the 360 swing mechanics in Bandra with the NaCl crew was electric. Grounding diaphragmatic breathwork after was top tier.",
    photo: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop",
    date: "Nov 2025"
  },
  {
    id: "story-4",
    customerName: "Ananya Deshmukh",
    eventId: "animal-flow-mobility-intensive",
    eventTitle: "Animal Flow & Mobility Intensive",
    experience: "Early morning movement flow jam on the Race Course grass in Coimbatore! My wrists and core never felt so alive.",
    photo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop",
    date: "Dec 2025"
  }
];

const STORY_STORAGE_KEY = "nacl_customer_stories";

export function getCustomerStories(): CustomerStoryType[] {
  if (!isClient) return INITIAL_STORIES;
  const data = localStorage.getItem(STORY_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORY_STORAGE_KEY, JSON.stringify(INITIAL_STORIES));
    return INITIAL_STORIES;
  }
  return JSON.parse(data);
}

export async function syncCustomerStoriesFromBackend() {
  if (!isClient) return;
  try {
    const res = await fetch("/api/stories");
    if (!res.ok) return;
    const data = await res.json();
    if (Array.isArray(data)) {
      const currentStories = getCustomerStories();
      const remoteIds = new Set(data.map((s: any) => s.id));
      const localOnly = currentStories.filter((s) => !remoteIds.has(s.id));
      const merged = [...localOnly, ...data];
      const newRaw = JSON.stringify(merged);
      const currentRaw = localStorage.getItem(STORY_STORAGE_KEY);
      if (currentRaw !== newRaw) {
        localStorage.setItem(STORY_STORAGE_KEY, newRaw);
        window.dispatchEvent(new Event("nacl_stories_update"));
      }
    }
  } catch (err) {
    console.log("Backend story sync offline, using local store:", err);
  }
}

export function saveCustomerStories(stories: CustomerStoryType[]) {
  if (!isClient) return;
  localStorage.setItem(STORY_STORAGE_KEY, JSON.stringify(stories));
  window.dispatchEvent(new Event("nacl_stories_update"));
}

export async function addCustomerStory(story: Omit<CustomerStoryType, "id" | "date">): Promise<CustomerStoryType> {
  const stories = getCustomerStories();
  const date = new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" });
  const localId = "story-" + Date.now();
  
  const newStory: CustomerStoryType = {
    ...story,
    id: localId,
    date
  };

  // Immediate local update for zero-latency UX
  stories.unshift(newStory);
  saveCustomerStories(stories);

  // Sync to Backend Database via POST /api/stories
  try {
    const res = await fetch("/api/stories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(story)
    });
    if (res.ok) {
      const backendStory = await res.json();
      const updatedStories = stories.map(s => s.id === localId ? backendStory : s);
      saveCustomerStories(updatedStories);
      return backendStory;
    }
  } catch (err) {
    console.warn("Backend POST failed, saved locally:", err);
  }

  return newStory;
}

export async function deleteCustomerStory(id: string) {
  const stories = getCustomerStories();
  const filtered = stories.filter(s => s.id !== id);
  saveCustomerStories(filtered);

  // Sync deletion to Backend Database via DELETE /api/stories?id=...
  try {
    await fetch(`/api/stories?id=${encodeURIComponent(id)}`, {
      method: "DELETE"
    });
  } catch (err) {
    console.warn("Backend DELETE failed, updated locally:", err);
  }
}

export async function clearAllCustomerStories() {
  saveCustomerStories([]);
  try {
    await fetch("/api/stories?clearAll=true", { method: "DELETE" });
  } catch (err) {
    console.warn("Backend clearAll failed:", err);
  }
}

export async function resetCustomerStories() {
  saveCustomerStories(INITIAL_STORIES);
  try {
    await fetch("/api/stories?clearAll=true", { method: "DELETE" });
    for (const story of INITIAL_STORIES) {
      await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(story)
      });
    }
  } catch (err) {
    console.warn("Backend reset failed:", err);
  }
}

// WAITLIST STORE HELPERS
const WAITLIST_STORAGE_KEY = "nacl_waitlist_entries";

export function getWaitlistEntries(): WaitlistType[] {
  if (!isClient) return [];
  const data = localStorage.getItem(WAITLIST_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function joinWaitlist(eventId: string, eventTitle: string, name: string, email: string): WaitlistType {
  const entries = getWaitlistEntries();
  const newEntry: WaitlistType = {
    id: "wl-" + Date.now(),
    eventId,
    eventTitle,
    name,
    email,
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    status: "waiting"
  };
  entries.unshift(newEntry);
  if (isClient) {
    localStorage.setItem(WAITLIST_STORAGE_KEY, JSON.stringify(entries));
    window.dispatchEvent(new Event("nacl_waitlist_update"));
  }
  return newEntry;
}

export function notifyWaitlistUsers(eventId: string) {
  if (!isClient) return;
  const entries = getWaitlistEntries();
  let notified = false;
  const updated = entries.map((e) => {
    if (e.eventId === eventId && e.status === "waiting") {
      notified = true;
      console.log(`[WAITLIST NOTIFICATION] A spot opened up for event ${e.eventTitle}! Email sent to ${e.email}`);
      return { ...e, status: "notified" as const };
    }
    return e;
  });
  if (notified) {
    localStorage.setItem(WAITLIST_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("nacl_waitlist_update"));
  }
}

// ORDER & TRANSACTIONS STORE HELPERS
const ORDERS_STORAGE_KEY = "nacl_orders";

export function getOrders(): OrderRecordType[] {
  if (!isClient) return [];
  const data = localStorage.getItem(ORDERS_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveOrderRecord(order: OrderRecordType) {
  if (!isClient) return;
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  window.dispatchEvent(new Event("nacl_orders_update"));
}

export function getOrdersByEmail(email: string): OrderRecordType[] {
  const orders = getOrders();
  return orders.filter((o) => o.userEmail.toLowerCase() === email.toLowerCase());
}

export function getOrderById(orderId: string): OrderRecordType | undefined {
  const orders = getOrders();
  return orders.find((o) => o.orderId.toLowerCase() === orderId.toLowerCase());
}

// SUBSCRIBER & LEAD CAPTURE STORE HELPERS
export interface SubscriberType {
  id: string;
  email: string;
  name?: string;
  cityPreference: "Bangalore" | "Mumbai" | "Coimbatore" | "All" | string;
  frequency: "immediate" | "weekly";
  status: "active" | "unsubscribed";
  source: "landing" | "pet_widget" | "popup" | string;
  subscribedAt: string;
}

const SUBSCRIBERS_STORAGE_KEY = "nacl_subscribers";

export function getSubscribers(): SubscriberType[] {
  if (!isClient) return [];
  const data = localStorage.getItem(SUBSCRIBERS_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function addSubscriber(data: {
  email: string;
  name?: string;
  cityPreference?: string;
  frequency?: "immediate" | "weekly";
  source?: string;
}): SubscriberType {
  const subscribers = getSubscribers();
  const normalizedEmail = data.email.trim().toLowerCase();
  const existingIdx = subscribers.findIndex((s) => s.email.toLowerCase() === normalizedEmail);

  let resultSubscriber: SubscriberType;

  if (existingIdx >= 0) {
    resultSubscriber = {
      ...subscribers[existingIdx],
      name: data.name ? data.name.trim() : subscribers[existingIdx].name,
      cityPreference: data.cityPreference || subscribers[existingIdx].cityPreference,
      frequency: data.frequency || subscribers[existingIdx].frequency,
      status: "active",
      source: data.source || subscribers[existingIdx].source,
    };
    subscribers[existingIdx] = resultSubscriber;
  } else {
    resultSubscriber = {
      id: "sub-" + Date.now(),
      email: normalizedEmail,
      name: data.name ? data.name.trim() : "",
      cityPreference: data.cityPreference || "All",
      frequency: data.frequency || "immediate",
      status: "active",
      source: data.source || "landing",
      subscribedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    subscribers.unshift(resultSubscriber);
  }

  if (isClient) {
    localStorage.setItem(SUBSCRIBERS_STORAGE_KEY, JSON.stringify(subscribers));
    window.dispatchEvent(new Event("nacl_subscribers_update"));
  }

  return resultSubscriber;
}

export function unsubscribeEmail(email: string): boolean {
  if (!isClient) return false;
  const subscribers = getSubscribers();
  const normalized = email.trim().toLowerCase();
  let updated = false;

  const newList = subscribers.map((s) => {
    if (s.email.toLowerCase() === normalized) {
      updated = true;
      return { ...s, status: "unsubscribed" as const };
    }
    return s;
  });

  if (updated) {
    localStorage.setItem(SUBSCRIBERS_STORAGE_KEY, JSON.stringify(newList));
    window.dispatchEvent(new Event("nacl_subscribers_update"));
  }

  return updated;
}

