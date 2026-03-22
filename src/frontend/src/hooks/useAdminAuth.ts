import { useState } from "react";

const SESSION_KEY = "grubshala_admin_session";
const PASS_KEY = "grubshala_admin_pass";
const USER_KEY = "grubshala_admin_user";

function hashPass(pass: string): string {
  return btoa(`${pass}_grubshala_salt`);
}

function initDefaults() {
  if (!localStorage.getItem(USER_KEY)) {
    localStorage.setItem(USER_KEY, "admin");
  }
  if (!localStorage.getItem(PASS_KEY)) {
    localStorage.setItem(PASS_KEY, hashPass("admin123"));
  }
}

export function useAdminAuth() {
  initDefaults();
  const [loggedIn, setLoggedIn] = useState(
    () => localStorage.getItem(SESSION_KEY) === "1",
  );

  function login(username: string, password: string): boolean {
    const storedUser = localStorage.getItem(USER_KEY) || "admin";
    const storedPass = localStorage.getItem(PASS_KEY) || hashPass("admin123");
    if (username === storedUser && hashPass(password) === storedPass) {
      localStorage.setItem(SESSION_KEY, "1");
      setLoggedIn(true);
      return true;
    }
    return false;
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setLoggedIn(false);
  }

  function changePassword(oldPass: string, newPass: string): boolean {
    const storedPass = localStorage.getItem(PASS_KEY) || hashPass("admin123");
    if (hashPass(oldPass) !== storedPass) return false;
    localStorage.setItem(PASS_KEY, hashPass(newPass));
    return true;
  }

  return { isLoggedIn: loggedIn, login, logout, changePassword };
}
