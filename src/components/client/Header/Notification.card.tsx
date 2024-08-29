"use client";
import React from "react";
import classnames from "classnames/bind";
import styles from "../../../styles/Header.module.scss";
import { INotification } from "@/types/backend";
import dayjs from "dayjs";
import Link from "next/link";

interface IProps {
  notification: INotification;
}

const cx = classnames.bind(styles);

const NotificationCard = (props: IProps) => {
  const { notification } = props;

  return (
    <div className={cx("noti-card")}>
      <Link href={`/jobs/${notification.options.jobId}`}>
        <div className={cx("noti-title")}>
          <span>
            {notification.type === "job" &&
              "Nhà tuyển dụng đã đăng việc làm mới"}
          </span>
        </div>

        <div className={cx("noti-text")}>
          <span>{notification.content}</span>
        </div>
      </Link>

      <div className={cx("noti-time")}>
        <span>{dayjs(notification.createdAt).format("DD/MM/YYYY")}</span>
      </div>
    </div>
  );
};

export default NotificationCard;
