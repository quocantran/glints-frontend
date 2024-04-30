"use client";
import React, { useEffect, useState } from "react";
import { IJob } from "@/types/backend";
import { fetchJobs } from "@/config/api";
import Access from "@/components/admin/Access/Access";
import { ALL_PERMISSIONS } from "@/config/permissions";

import JobTable from "@/components/admin/Jobs/Job.table";

const Jobs = (props: any) => {
  const current = props.searchParams?.page ?? 1;
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [meta, setMeta] = useState<any>(null);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetchJobs(current);
      setJobs(res?.data?.result || []);
      setMeta(res?.data?.meta);
      setLoading(false);
    };

    fetchData();
  }, [current, reload]);

  return (
    <Access permission={ALL_PERMISSIONS.JOBS.GET_PAGINATE}>
      <div>
        <JobTable
          meta={meta}
          jobs={jobs ? jobs : []}
          reload={reload}
          setReload={setReload}
          loading={loading}
          setJobs={setJobs}
          current={current}
        />
      </div>
    </Access>
  );
};

export default Jobs;
