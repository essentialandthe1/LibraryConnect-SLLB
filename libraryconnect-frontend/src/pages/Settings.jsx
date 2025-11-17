import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useTheme } from "@/context/ThemeContext";
import { useAuthContext } from "@/context/AuthContext";
import { Moon, Sun, Bell, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "react-i18next";

// Reusable ThemeToggle
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />;
};

export default function Settings() {
  const { theme } = useTheme();
  const { user, setUser } = useAuthContext();
  const { currentLanguage, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/login");
  };

  const profileFields = [
    { label: t("name"), value: user?.name },
    { label: t("email"), value: user?.email },
    { label: t("role"), value: user?.role },
    { label: t("department"), value: user?.department }
  ];

  const notifications = [
    { label: t("emailNotifications"), description: t("emailNotificationsDesc"), checked: true },
    { label: t("documentDelivery"), description: t("documentDeliveryDesc"), checked: true },
    { label: t("weeklySummary"), description: t("weeklySummaryDesc"), checked: false }
  ];

  return (
    <div className="space-y-6 p-6 bg-background text-foreground transition-colors min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{t("settings")}</h1>
        <p className="mt-1 text-muted-foreground">{t("manageSettings")}</p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>{t("profileInformation")}</CardTitle>
          <CardDescription>{t("accountDetails")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {profileFields.map((field) => (
              <div key={field.label} className="space-y-2">
                <Label>{field.label}</Label>
                <p className="text-sm font-medium">{field.value || t("N/A")}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle>{t("appearance")}</CardTitle>
          <CardDescription>{t("customizeLook")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {theme === "light" ? (
              <Sun className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Moon className="h-5 w-5 text-muted-foreground" />
            )}
            <div>
              <Label>{t("theme")}</Label>
              <p className="text-sm text-muted-foreground">
                {theme === "light" ? t("lightMode") : t("darkMode")}
              </p>
            </div>
          </div>
          <ThemeToggle />
        </CardContent>
      </Card>

      {/* Language & Region */}
      <Card>
        <CardHeader>
          <CardTitle>{t("languageRegion")}</CardTitle>
          <CardDescription>{t("setPreferredLanguage")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex items-center gap-3">
          <Globe className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1 space-y-2">
            <Label htmlFor="language">{t("language")}</Label>
            <Select value={currentLanguage} onValueChange={changeLanguage}>
              <SelectTrigger id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
                <SelectItem value="krio">Krio</SelectItem>
                {/* Add more languages if needed */}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>{t("notifications")}</CardTitle>
          <CardDescription>{t("manageNotifications")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifications.map((notif) => (
            <div key={notif.label} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label>{notif.label}</Label>
                  <p className="text-sm text-muted-foreground">{notif.description}</p>
                </div>
              </div>
              <Switch defaultChecked={notif.checked} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security / Logout */}
      <Card>
        <CardHeader>
          <CardTitle>{t("security")}</CardTitle>
          <CardDescription>{t("manageSecurity")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start" onClick={logout}>
            {t("logout")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
