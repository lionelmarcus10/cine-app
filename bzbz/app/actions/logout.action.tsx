"use server"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logOut() {
    (await cookies()).delete('token');
    return redirect('/');
  }