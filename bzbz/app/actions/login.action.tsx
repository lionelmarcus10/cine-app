"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function login(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  previousState: any,
  formData: FormData
) {
  // Get the data off the form
  const email = formData.get("email");
  const password = formData.get("password");
  //  Send to our api route
  const res = await fetch("http://localhost:3000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const json = await res.json();

  

  // Redirect to login if success
  if (res.ok) {
    (await cookies()).set("token", json.token, {
        secure: true,
        httpOnly: true,
        expires: Date.now() + 24 * 60 * 60 * 1000 * 3,
        path: "/",
        sameSite: "strict",
      });

    const email = formData.get("email") as string; // Ensure email is treated as a string
    const username = email.split("@")[0]; // Extract username from email

    (await cookies()).set("username", username, {
        secure: true,
        path: "/",
        sameSite: "strict",
    });

    redirect("/admin-dashboard");
  } else {
    return json.error;
  }
}