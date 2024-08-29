"use client";
import { callFetchAccount } from "@/config/api";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setUserLoginInfo } from "@/lib/redux/slice/auth.slice";
import { message } from "antd";
import { useSearchParams, useRouter } from "next/navigation";
import React, { Suspense, useEffect } from "react";

const GoogleAuth = (props: any) => {
  const searchParams = useSearchParams();

  const navigate = useRouter();

  const token = searchParams.get("token");

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!token) {
      navigate.push("/");
      return;
    }

    const handleCheckAccount = async () => {
      const res = await callFetchAccount(token);

      if (res?.statusCode !== 200) {
        navigate.push("/");
        return;
      }

      localStorage.setItem("access_token", token);
      localStorage.setItem("userId", res.data?.user._id as string);
      dispatch(setUserLoginInfo(res.data?.user));
      message.success("Đăng nhập thành công!");
      navigate.push("/");
    };

    handleCheckAccount();
  }, []);

  return <></>;
};

export default GoogleAuth;
