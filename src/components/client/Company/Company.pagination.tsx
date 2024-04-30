"use client";
import { Pagination } from "antd";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React from "react";

interface IProps {
  meta: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
}

const CompanyPagination = (props: IProps) => {
  const { meta } = props;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const handleChange = (pagination: any) => {
    if (pagination) {
      const params = new URLSearchParams(searchParams);
      params.set("page", pagination);
      replace(`${pathname}?${params.toString()}`);
    }
  };
  return (
    <div>
      <Pagination
        {...meta}
        showTotal={(total, range) => {
          return <div>{`${range[0]} - ${range[1]} trên ${total} công ty`}</div>;
        }}
        onChange={handleChange}
      />
    </div>
  );
};

export default CompanyPagination;
