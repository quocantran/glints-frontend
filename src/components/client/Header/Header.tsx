"use client";
import React, { useEffect, useRef, useState } from "react";
import classnames from "classnames/bind";
import styles from "../../../styles/Header.module.scss";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  Avatar,
  Dropdown,
  Skeleton,
  Space,
  message,
  Button,
  notification,
} from "antd";
import {
  ContactsOutlined,
  DashOutlined,
  FileWordOutlined,
  InsertRowLeftOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { fetchNotifications, logout } from "@/config/api";
import { setLogoutAction } from "@/lib/redux/slice/auth.slice";
import ManageUser from "./User.manage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCircle } from "@fortawesome/free-solid-svg-icons";
import { INotification } from "@/types/backend";
import NotificationCard from "./Notification.card";
import socket from "@/utils/socket";
const cx = classnames.bind(styles);

interface IMessageFromServer {
  message: string;
  companyName: string;
  jobId: string;
  type: string;
}

const Header: React.FC = () => {
  const isAuth = useAppSelector((state) => state?.auth.isAuthenticated);
  const user = useAppSelector((state) => state?.auth.user);
  const [open, setOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const loading = useAppSelector((state) => state?.auth.isLoading);
  const [isNoti, setIsNoti] = useState<boolean>(false);
  const [isNewNoti, setIsNewNoti] = useState<boolean>(false);
  const userRole = user?.role.name;
  const notiRef = useRef<HTMLDivElement>(null);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    socket.on("notification", (data: IMessageFromServer) => {
      api.open({
        message: <h3 style={{ color: "rgb(1, 126, 183)" }}>Thông Báo</h3>,
        description: data.message,
        duration: 10,
      });
      const newNoti = {
        content: data.message,
        createdAt: new Date().toISOString(),
        options: { jobId: data.jobId },
        type: data.type,
      } as INotification;

      setNotifications((prevNotifications) => [newNoti, ...prevNotifications]);
      setIsNewNoti(true);
    });

    return () => {
      console.log("Unregistering socket event");
      socket.off("notification");
    };
  }, []);

  const dispatch = useAppDispatch();
  const handleLogout = async () => {
    const data = await logout();

    dispatch(setLogoutAction({}));
    window.location.reload();
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    setIsNoti(true);
    setIsNewNoti(false);
  };

  useEffect(() => {
    if (isAuth) {
      const getNotification = async () => {
        try {
          const res = await fetchNotifications({});

          if (res.data) {
            setNotifications(res.data.result as INotification[]);
          }
        } catch (error) {}
      };

      getNotification();
    }
  }, [isAuth]);

  useEffect(() => {
    document.body.addEventListener("click", (e) => {
      if (notiRef.current && !notiRef.current.contains(e.target as Node)) {
        setIsNoti(false);
      }
    });

    return () => {
      document.body.removeEventListener("click", () => {});
    };
  }, []);

  const itemsDropdown = [
    {
      label: (
        <label onClick={() => setOpen(true)} style={{ cursor: "pointer" }}>
          Quản lý tài khoản
        </label>
      ),
      key: "manage-account",
      icon: <ContactsOutlined />,
    },
    userRole !== "NORMAL_USER" && {
      label: <Link href={"/admin"}>Trang Quản Trị</Link>,
      key: "admin",
      icon: <DashOutlined />,
    },
    {
      label: <Link href={"/jobs"}>Tìm việc làm</Link>,
      key: "jobs",
      icon: <FileWordOutlined />,
    },
    {
      label: <Link href={"/companies"}>Danh sách công ty</Link>,
      key: "companies",
      icon: <InsertRowLeftOutlined />,
    },
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
          Đăng xuất
        </label>
      ),
      key: "logout",
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <Link href="/">
          <img className={cx("logo")} src="/images/logo.webp" alt="logo" />
        </Link>
        <div className={cx("header-left")}>
          <div className={cx("header-item")}>
            <Link href="/jobs">TÌM VIỆC LÀM</Link>
          </div>
          <div className={cx("header-item")}>
            <Link href="/companies">DANH SÁCH CÔNG TY</Link>
          </div>
        </div>

        {loading ? (
          <Skeleton.Avatar style={{ width: "50px", height: "50px" }} active />
        ) : (
          <div className={cx("header-right")}>
            {isAuth ? (
              <div className={cx("right-items")}>
                <div
                  onClick={handleClick}
                  className={cx("header-notification")}
                >
                  <FontAwesomeIcon
                    style={isNoti ? { color: "rgb(1, 126, 183)" } : {}}
                    icon={faBell}
                  />
                </div>

                {isNewNoti && (
                  <FontAwesomeIcon icon={faCircle} className={cx("noti-dot")} />
                )}

                <div
                  onClick={(e) => e.stopPropagation()}
                  ref={notiRef}
                  style={
                    isNoti
                      ? { opacity: 1, visibility: "visible" }
                      : { opacity: 0, visibility: "hidden" }
                  }
                  className={cx("noti-content")}
                >
                  <div className={cx("noti-header")}>
                    <p>
                      {notifications.length > 0
                        ? "Thông báo"
                        : "Không có thông báo mới"}
                    </p>
                  </div>

                  <div className={cx("noti-inner")}>
                    {notifications.map((item, index) => (
                      <NotificationCard key={index} notification={item} />
                    ))}
                  </div>
                </div>

                <Dropdown
                  menu={{ items: itemsDropdown as any }}
                  trigger={["click"]}
                  arrow={true}
                >
                  <Space style={{ cursor: "pointer" }}>
                    <span>Xin chào {user?.name}</span>
                    <Avatar>
                      {" "}
                      {user?.name?.substring(0, 2)?.toUpperCase()}{" "}
                    </Avatar>
                  </Space>
                </Dropdown>
              </div>
            ) : (
              <>
                <div className={cx("header-item")}>
                  <Link href="/login">ĐĂNG NHẬP</Link>
                </div>
                <div className={cx("header-item")}>
                  <Link href="/register">ĐĂNG KÝ</Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <ManageUser open={open} setOpen={setOpen} />
      <>{contextHolder}</>
    </div>
  );
};

export default Header;
