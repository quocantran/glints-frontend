import { fetchCompanyById } from "@/config/api";
import { Button, Result } from "antd";
import React from "react";
import classNames from "classnames/bind";
import styles from "../../../../styles/CompanyInfo.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

const CompanyInfo = async (props: any) => {
  const res = await fetchCompanyById(props?.params?.id);

  return res?.statusCode !== 200 ? (
    <Result
      status="404"
      title="404"
      subTitle="Trang này không tồn tại!"
      extra={
        <Button href="/" type="primary">
          Back Home
        </Button>
      }
    />
  ) : (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <div className={cx("header")}>
            <div className={cx("cover")}>
              <img src="/images/company_cover.jpg" alt="cover" />
            </div>
            <div className={cx("logo")}>
              <img src={res?.data?.logo} alt="logo" />
            </div>

            <div className={cx("company-detail")}>
              <div className={cx("box-detail")}>
                <h1>{res.data?.name}</h1>
                <p>{res.data?.address}</p>
              </div>
            </div>
          </div>
        </div>
        <div className={cx("company-description")}>
          <div className={cx("company-info")}>
            <h2 className={cx("title")}>Giới thiệu công ty</h2>
            <div className={cx("box-body")}>
              <div
                className={cx("job-detail")}
                dangerouslySetInnerHTML={{
                  __html: res?.data?.description as string,
                }}
              />
            </div>
          </div>

          <div className={cx("company-location")}>
            <div className={cx("section-contact")}>
              <h2 className={cx("title")}>Thông tin liên hệ</h2>
              <div className={cx("box-body")}>
                <div className={cx("contact-item")}>
                  <div className={cx("item-caption")}>
                    <FontAwesomeIcon icon={faLocationDot} />
                    <span>Địa chỉ công ty</span>
                  </div>
                  <div className={cx("desc")}>{res?.data?.address}</div>
                </div>

                <div className={cx("map")}>
                  <iframe
                    src="https://www.google.com/maps/d/embed?mid=1hSJI5w-gsG-RFj5jcwFJKP_7aEU&hl=en_US&ehbc=2E312F"
                    width="640"
                    height="480"
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfo;
