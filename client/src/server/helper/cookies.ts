"use server";

import { cookies as CookiesPrommise } from "next/headers";

export const getServerCookieValue = async (
  name: string
): Promise<string | null> => {
  const cookies = await CookiesPrommise();
  const cookieValue = cookies.get(name)?.value;

  if (cookieValue) {
    return cookieValue;
  } else {
    return null;
  }
};

export const setNewCookie = async (
  name: string,
  value: string,
  httpOnly?: boolean,
  maxAge?: number
) => {
  const cookies = await CookiesPrommise();

  cookies.set(name, value, {
    httpOnly: httpOnly || true,
    path: "/",
    maxAge: maxAge || 200000,
  });
};

export const removewCookie = async (name: string) => {
  (await CookiesPrommise()).delete(name);
};
