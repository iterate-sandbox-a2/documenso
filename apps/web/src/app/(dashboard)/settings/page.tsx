import mixpanel from 'mixpanel-browser';
import { useEffect } from 'react';
import { redirect } from "next/navigation";

export default function SettingsPage() {
  useEffect(() => {
    mixpanel.track('settings_page_visited');
  }, []);
  redirect("/settings/profile");
  // Page is intentionally empty because it will be redirected to /settings/profile
  return <div />;
}
