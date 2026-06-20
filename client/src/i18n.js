import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

/**
 * ════════════════════════════════════════════════════════════
 * MULTI-LANGUAGE SETUP (English / Hindi)
 * ════════════════════════════════════════════════════════════
 * Place this file at: src/i18n.js
 * Import it ONCE in src/index.js (see integration guide).
 *
 * Usage in any component:
 *   import { useTranslation } from "react-i18next";
 *   const { t, i18n } = useTranslation();
 *   <h1>{t("home.title")}</h1>
 *   <button onClick={() => i18n.changeLanguage("hi")}>हिंदी</button>
 * ════════════════════════════════════════════════════════════
 */

const resources = {
  en: {
    translation: {
      nav: {
        home: "Home",
        doctors: "Doctors",
        appointments: "My Appointments",
        notifications: "Notifications",
        login: "Login",
        logout: "Logout",
      },
      home: {
        badge: "Live Appointments Available",
        title: "Find the Right Doctor,",
        titleAccent: "Book Instantly",
        subtitle:
          "Trusted healthcare professionals at your fingertips. Real-time slots, verified doctors, seamless booking — all in one place.",
        bookAppointment: "Book Appointment",
        emergency: "Emergency: 108",
        availableDoctors: "Available Doctors",
        searchPlaceholder: "Search by doctor name...",
        ourServices: "Our Services",
        servicesSub: "Everything you need for your health journey",
      },
      services: {
        expertDoctors: "Expert Doctors",
        expertDoctorsDesc: "Consult verified, experienced specialists",
        easyBooking: "Easy Booking",
        easyBookingDesc: "Book appointments in a few clicks",
        bmiCalc: "BMI Calculator",
        bmiCalcDesc: "Check your Body Mass Index instantly",
        secureRecords: "Secure Records",
        secureRecordsDesc: "Your health data stays private",
      },
      doctor: {
        specialization: "Specialization",
        experience: "Experience",
        fee: "Consultation Fee",
        timings: "Timings",
        bookNow: "Book Now",
        viewDetails: "View Details",
        years: "Years",
      },
      booking: {
        title: "Book Your Appointment",
        selectDate: "Appointment Date",
        selectTime: "Appointment Time",
        checkAvailability: "Check Availability",
        confirmBooking: "Book Now",
        summary: "Appointment Summary",
      },
      appointments: {
        title: "My Appointments",
        total: "Total Appointments",
        approved: "Approved",
        pending: "Pending",
        status: "Status",
        date: "Date & Time",
      },
      common: {
        loading: "Loading...",
        submit: "Submit",
        cancel: "Cancel",
        save: "Save",
      },
    },
  },
  hi: {
    translation: {
      nav: {
        home: "होम",
        doctors: "डॉक्टर",
        appointments: "मेरी अपॉइंटमेंट",
        notifications: "सूचनाएं",
        login: "लॉगिन",
        logout: "लॉगआउट",
      },
      home: {
        badge: "अभी अपॉइंटमेंट उपलब्ध हैं",
        title: "सही डॉक्टर खोजें,",
        titleAccent: "तुरंत बुक करें",
        subtitle:
          "भरोसेमंद डॉक्टर अब आपकी उंगलियों पर। रियल-टाइम स्लॉट, सत्यापित डॉक्टर, आसान बुकिंग — सब एक जगह।",
        bookAppointment: "अपॉइंटमेंट बुक करें",
        emergency: "आपातकाल: 108",
        availableDoctors: "उपलब्ध डॉक्टर",
        searchPlaceholder: "डॉक्टर का नाम खोजें...",
        ourServices: "हमारी सेवाएं",
        servicesSub: "आपकी सेहत के सफर के लिए सब कुछ यहाँ है",
      },
      services: {
        expertDoctors: "विशेषज्ञ डॉक्टर",
        expertDoctorsDesc: "अनुभवी और सत्यापित विशेषज्ञों से सलाह लें",
        easyBooking: "आसान बुकिंग",
        easyBookingDesc: "कुछ ही क्लिक में अपॉइंटमेंट बुक करें",
        bmiCalc: "बीएमआई कैलकुलेटर",
        bmiCalcDesc: "अपना बॉडी मास इंडेक्स तुरंत जांचें",
        secureRecords: "सुरक्षित रिकॉर्ड",
        secureRecordsDesc: "आपका स्वास्थ्य डेटा सुरक्षित रहता है",
      },
      doctor: {
        specialization: "विशेषज्ञता",
        experience: "अनुभव",
        fee: "परामर्श शुल्क",
        timings: "समय",
        bookNow: "अभी बुक करें",
        viewDetails: "विवरण देखें",
        years: "वर्ष",
      },
      booking: {
        title: "अपनी अपॉइंटमेंट बुक करें",
        selectDate: "अपॉइंटमेंट की तारीख",
        selectTime: "अपॉइंटमेंट का समय",
        checkAvailability: "उपलब्धता जांचें",
        confirmBooking: "अभी बुक करें",
        summary: "अपॉइंटमेंट सारांश",
      },
      appointments: {
        title: "मेरी अपॉइंटमेंट",
        total: "कुल अपॉइंटमेंट",
        approved: "स्वीकृत",
        pending: "लंबित",
        status: "स्थिति",
        date: "तारीख और समय",
      },
      common: {
        loading: "लोड हो रहा है...",
        submit: "जमा करें",
        cancel: "रद्द करें",
        save: "सहेजें",
      },
    },
  },
};

i18n
  .use(LanguageDetector) // auto-detects browser language on first visit
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
