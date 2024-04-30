import React from "react";
import classNames from "classnames/bind";
import styles from "../../../styles/CompanyClient.module.scss";
import { fetchCompanies } from "@/config/api";
import { ICompany } from "@/types/backend";
import CompanyCard from "@/components/client/Company/Company.card";
import { Pagination } from "antd";
import CompanyPagination from "@/components/client/Company/Company.pagination";

const cx = classNames.bind(styles);

const CompanyClient = async (props: any) => {
  const current = props.searchParams?.page || 1;
  const res = await fetchCompanies(current, "", 9);

  const data = res?.data?.result;
  const meta = res?.data?.meta;
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <h1 className={cx("header")}>Các công ty hàng đầu</h1>
        <div className={cx("content")}>
          {data?.map((item: ICompany) => {
            return <CompanyCard key={item._id} result={item} meta={meta} />;
          })}
        </div>
        {meta && (
          <div className={cx("pagination")}>
            <CompanyPagination meta={meta} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyClient;
