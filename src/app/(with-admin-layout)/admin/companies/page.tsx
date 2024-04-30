"use client";
import React, { useEffect, useState } from "react";
import { ICompany } from "@/types/backend";
import { fetchCompanies } from "@/config/api";
import Access from "@/components/admin/Access/Access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import CompanyTable from "@/components/admin/Company/Company.table";

const Companies = (props: any) => {
  const current = props.searchParams?.page ?? 1;
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [meta, setMeta] = useState<any>(null);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetchCompanies(current);
      setCompanies(res?.data?.result || []);
      setMeta(res?.data?.meta);
      setLoading(false);
    };

    fetchData();
  }, [current, reload]);

  return (
    <Access permission={ALL_PERMISSIONS.COMPANIES.GET_PAGINATE}>
      <div>
        <CompanyTable
          meta={meta}
          companies={companies ? companies : []}
          reload={reload}
          setReload={setReload}
          loading={loading}
          setCompanies={setCompanies}
          current={current}
        />
      </div>
    </Access>
  );
};

export default Companies;
