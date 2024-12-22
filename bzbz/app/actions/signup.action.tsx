"use server";

export default async function signup(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  previousState: any,
  formData: FormData
): Promise<string> {
  // Get the data off the form
  const email = formData.get("email");
  const password = formData.get("password");

  //  Send to our api route
  const res = await fetch("http://localhost:3000/api/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const json = await res.json();

  // Redirect to login if success
  if (res.ok) {
    return json.message
  } else {
    return json.error;
  }
}