import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Translation resources
const resources = {
  en: {
    translation: {
      // Header
      settings: "Settings",
      manageSettings: "Manage your account preferences and app settings",

      // Profile Information
      profileInformation: "Profile Information",
      accountDetails: "Your account details",
      name: "Name",
      email: "Email",
      role: "Role",
      department: "Department",
      "N/A": "N/A",

      // Appearance
      appearance: "Appearance",
      customizeLook: "Customize the look and feel of the application",
      theme: "Theme",
      lightMode: "Light mode",
      darkMode: "Dark mode",

      // Language & Region
      languageRegion: "Language & Region",
      setPreferredLanguage: "Set your preferred language",
      language: "Language",

      // Notifications
      notifications: "Notifications",
      manageNotifications: "Manage notification preferences",
      emailNotifications: "Email notifications",
      emailNotificationsDesc: "Receive email alerts for new documents",
      documentDelivery: "Document delivery confirmations",
      documentDeliveryDesc: "Get notified when documents are delivered",
      weeklySummary: "Weekly summary",
      weeklySummaryDesc: "Receive a weekly summary of your activity",

      // Security
      security: "Security",
      manageSecurity: "Manage your account security",
      logout: "Logout"
    }
  },
  fr: {
    translation: {
      settings: "Paramètres",
      manageSettings: "Gérez vos préférences de compte et les paramètres de l'application",
      profileInformation: "Informations du profil",
      accountDetails: "Les détails de votre compte",
      name: "Nom",
      email: "E-mail",
      role: "Rôle",
      department: "Département",
      "N/A": "N/A",
      appearance: "Apparence",
      customizeLook: "Personnalisez l'apparence de l'application",
      theme: "Thème",
      lightMode: "Mode clair",
      darkMode: "Mode sombre",
      languageRegion: "Langue et région",
      setPreferredLanguage: "Choisissez votre langue préférée",
      language: "Langue",
      notifications: "Notifications",
      manageNotifications: "Gérez vos préférences de notification",
      emailNotifications: "Notifications par e-mail",
      emailNotificationsDesc: "Recevez des alertes par e-mail pour les nouveaux documents",
      documentDelivery: "Confirmation de livraison de documents",
      documentDeliveryDesc: "Recevez une notification lorsque les documents sont livrés",
      weeklySummary: "Résumé hebdomadaire",
      weeklySummaryDesc: "Recevez un résumé hebdomadaire de votre activité",
      security: "Sécurité",
      manageSecurity: "Gérez la sécurité de votre compte",
      logout: "Se déconnecter"
    }
  },
  es: {
    translation: {
      settings: "Configuración",
      manageSettings: "Administra las preferencias de tu cuenta y la configuración de la aplicación",
      profileInformation: "Información del perfil",
      accountDetails: "Los detalles de tu cuenta",
      name: "Nombre",
      email: "Correo electrónico",
      role: "Rol",
      department: "Departamento",
      "N/A": "N/A",
      appearance: "Apariencia",
      customizeLook: "Personaliza la apariencia de la aplicación",
      theme: "Tema",
      lightMode: "Modo claro",
      darkMode: "Modo oscuro",
      languageRegion: "Idioma y región",
      setPreferredLanguage: "Elige tu idioma preferido",
      language: "Idioma",
      notifications: "Notificaciones",
      manageNotifications: "Gestiona tus preferencias de notificación",
      emailNotifications: "Notificaciones por correo",
      emailNotificationsDesc: "Recibe alertas por correo para nuevos documentos",
      documentDelivery: "Confirmaciones de entrega de documentos",
      documentDeliveryDesc: "Recibe notificaciones cuando se entreguen documentos",
      weeklySummary: "Resumen semanal",
      weeklySummaryDesc: "Recibe un resumen semanal de tu actividad",
      security: "Seguridad",
      manageSecurity: "Gestiona la seguridad de tu cuenta",
      logout: "Cerrar sesión"
    }
  },
  de: {
    translation: {
      settings: "Einstellungen",
      manageSettings: "Verwalten Sie Ihre Kontoeinstellungen und App-Präferenzen",
      profileInformation: "Profilinformationen",
      accountDetails: "Ihre Kontodetails",
      name: "Name",
      email: "E-Mail",
      role: "Rolle",
      department: "Abteilung",
      "N/A": "N/A",
      appearance: "Erscheinungsbild",
      customizeLook: "Passen Sie das Aussehen der Anwendung an",
      theme: "Thema",
      lightMode: "Hellmodus",
      darkMode: "Dunkelmodus",
      languageRegion: "Sprache & Region",
      setPreferredLanguage: "Wählen Sie Ihre bevorzugte Sprache",
      language: "Sprache",
      notifications: "Benachrichtigungen",
      manageNotifications: "Verwalten Sie Ihre Benachrichtigungseinstellungen",
      emailNotifications: "E-Mail-Benachrichtigungen",
      emailNotificationsDesc: "Erhalten Sie E-Mail-Benachrichtigungen für neue Dokumente",
      documentDelivery: "Dokumentlieferbestätigungen",
      documentDeliveryDesc: "Erhalten Sie Benachrichtigungen, wenn Dokumente geliefert werden",
      weeklySummary: "Wochenübersicht",
      weeklySummaryDesc: "Erhalten Sie eine wöchentliche Zusammenfassung Ihrer Aktivitäten",
      security: "Sicherheit",
      manageSecurity: "Verwalten Sie die Sicherheit Ihres Kontos",
      logout: "Abmelden"
    }
  },
  zh: {
    translation: {
      settings: "设置",
      manageSettings: "管理您的帐户首选项和应用设置",
      profileInformation: "个人信息",
      accountDetails: "您的帐户详细信息",
      name: "姓名",
      email: "电子邮件",
      role: "角色",
      department: "部门",
      "N/A": "N/A",
      appearance: "外观",
      customizeLook: "自定义应用的外观和感觉",
      theme: "主题",
      lightMode: "浅色模式",
      darkMode: "深色模式",
      languageRegion: "语言和地区",
      setPreferredLanguage: "设置首选语言",
      language: "语言",
      notifications: "通知",
      manageNotifications: "管理通知偏好",
      emailNotifications: "电子邮件通知",
      emailNotificationsDesc: "接收新文档的电子邮件提醒",
      documentDelivery: "文档交付确认",
      documentDeliveryDesc: "当文档交付时收到通知",
      weeklySummary: "每周摘要",
      weeklySummaryDesc: "接收您的活动每周摘要",
      security: "安全",
      manageSecurity: "管理您的帐户安全性",
      logout: "登出"
    }
  },
  krio: {
    translation: {
      settings: "Setins",
      manageSettings: "Manage yu akount preferences an settings",
      profileInformation: "Profile Information",
      accountDetails: "Your account details",
      name: "Name",
      email: "Email",
      role: "Role",
      department: "Department",
      "N/A": "N/A",
      appearance: "Appearance",
      customizeLook: "Customize di app look an feel",
      theme: "Theme",
      lightMode: "Light mode",
      darkMode: "Dark mode",
      languageRegion: "Language & Region",
      setPreferredLanguage: "Set yu preferred language",
      language: "Language",
      notifications: "Notifications",
      manageNotifications: "Manage notification preferences",
      emailNotifications: "Email notifications",
      emailNotificationsDesc: "Receive email alerts for new documents",
      documentDelivery: "Document delivery confirmations",
      documentDeliveryDesc: "Get notified when documents are delivered",
      weeklySummary: "Weekly summary",
      weeklySummaryDesc: "Receive a weekly summary of your activity",
      security: "Security",
      manageSecurity: "Manage your account security",
      logout: "Logout"
    }
  }
};

i18n
  .use(LanguageDetector) // detects browser language
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"]
    }
  });

export default i18n;
