"use client";
import React, { useEffect, useState } from "react";
import type { FormProps } from "antd";
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  message,
  notification,
} from "antd";
import classNames from "classnames/bind";
import styles from "../../../styles/Login.module.scss";
import Link from "next/link";
import { callLogin } from "@/config/api";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setUserLoginInfo } from "@/lib/redux/slice/auth.slice";
import { useRouter } from "next/navigation";

const cx = classNames.bind(styles);

type FieldType = {
  username: string;
  password: string;
  remember?: string;
};

const Login: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useRouter();
  const isAuth = useAppSelector((state) => state.auth.isAuthenticated);
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    if (isAuth) {
      navigate.push("/");
      notification.error({
        message: "Bạn đã đăng nhập rồi!",
      });
      return;
    }
    setShow(true);
  }, []);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { username, password } = values;
    setLoading(true);
    const res = await callLogin(username, password);

    if (res?.data) {
      localStorage.setItem("access_token", res.data.access_token);
      dispatch(setUserLoginInfo(res.data.user));
      setLoading(false);
      message.success("Đăng nhập tài khoản thành công!");
      navigate.push("/");
    } else {
      setLoading(false);
    }
  };

  return (
    show && (
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <h1 className={cx("title")}>Đăng Nhập</h1>
          <Form name="basic" onFinish={onFinish} autoComplete="off">
            <Form.Item
              labelCol={{ span: 24 }}
              label="Email (test_admin@gmail.com)"
              name="username"
              required
              rules={[
                { required: true, message: "Email không được để trống!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              labelCol={{ span: 24 }}
              label="Mật khẩu (123456)"
              name="password"
              rules={[
                { required: true, message: "Mật khẩu không được để trống!" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Đăng nhập
              </Button>
            </Form.Item>
            <Divider>Or</Divider>
            <p className="text text-normal">
              Chưa có tài khoản ?
              <span>
                <Link href="/register"> Đăng Ký </Link>
              </span>
            </p>
          </Form>
        </div>
      </div>
    )
  );
};

export default Login;
