import { cookies } from "next/headers";
import { io } from "socket.io-client";

import Cookies from "js-cookie";

const userId = Cookies.get("userId");

const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
  withCredentials: true,
  query: { userId: userId ?? null },
});

export default socket;
