import { setRefreshTokenAction } from "@/lib/redux/slice/auth.slice";
import { makeStore } from "@/lib/redux/store";
import {
  IBackendRes,
  ICompany,
  IAccount,
  IUser,
  IModelPaginate,
  IGetAccount,
  IJob,
  IResume,
  IPermission,
  IRole,
  ICreateResume,
  IUpdateUserPassword,
  IJobSuggest,
  ISkill,
  ISubscribers,
  IChat,
  IFile,
  INotification,
  IElasticsearchResult,
} from "@/types/backend";
import { message, notification } from "antd";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

const NO_RETRY_HEADER = "No-Retry";

interface FetchOptions extends RequestInit {
  headers: {
    [key: string]: string;
  };
}

const fetchWithInterceptor = async (
  url: string,
  options: FetchOptions = {
    headers: {},
  }
) => {
  // Pre-request interceptor
  if (typeof window !== "undefined" && localStorage.getItem("access_token")) {
    options.headers = {
      ...options.headers,
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    };
  }
  if (!options.headers?.Accept && options.headers?.["Content-Type"]) {
    options.headers = {
      ...options.headers,
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    };
  }

  let response = await fetch(url, options);

  // Post-response interceptor
  if (!response.ok) {
    if (
      response.status === 401 &&
      url !== "/api/v1/auth/login" &&
      !options.headers[NO_RETRY_HEADER]
    ) {
      const access_token = await refreshToken();
      options.headers[NO_RETRY_HEADER] = "true";
      if (access_token) {
        options.headers["Authorization"] = `Bearer ${access_token}`;
        localStorage.setItem("access_token", access_token);
        response = await fetch(url, options);
      }
    }

    if (
      response.status === 400 &&
      url === "/api/v1/auth/refresh" &&
      location.pathname.startsWith("/admin")
    ) {
      const message =
        (await response.json())?.message ?? "Có lỗi xảy ra, vui lòng login.";
      //dispatch redux action
      makeStore().dispatch(setRefreshTokenAction({ status: true, message }));
    }
    if (!response.ok) {
      const res = await response.json();
      return res;
    }
  }

  return response.json();
};

// API USERS

export const fetchUsers = async (
  current: number,
  name: string = ""
): Promise<IBackendRes<IModelPaginate<IUser>> | undefined> => {
  const regex = new RegExp(name, "i");
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/v1/users?populate=role&pageSize=5&current=${current}${
      name ? `&name=${regex}` : ""
    }`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!res) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
  } else {
    return res;
  }
};

export const countUsers = async (): Promise<IBackendRes<number>> => {
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/v1/users/record/count`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    }
  );
  return res;
};

export const createUser = async (body: IUser) => {
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/v1/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
    body: JSON.stringify(body),
  });
  if (res.statusCode === 400) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
    return;
  }

  return res;
};

export const updateUser = async (id: string | undefined, body: IUser) => {
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/v1/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },

    body: JSON.stringify(body),
  });
  if (res.statusCode === 400) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
    return;
  }

  return res;
};

export const updateUserPassword = async (
  id: string,
  body: IUpdateUserPassword
) => {
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/v1/users/${id}/password`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
      body: JSON.stringify(body),
    }
  );
  return res;
};

export const deleteUser = async (id: string) => {
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/v1/users/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
  });
  if (res.statusCode === 400) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
    return;
  }
  return res;
};

// API COMPANIES
export const fetchCompanies = async (
  current: number = 1,
  name: string = "",
  pageSize: number = 10
): Promise<IBackendRes<IModelPaginate<ICompany>> | undefined> => {
  const regex = new RegExp(name, "i");
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/v1/companies?${current ? `current=${current}` : ""}${
      name ? `&name=${regex}` : ""
    }${pageSize ? `&pageSize=${pageSize}` : ""}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    }
  );
  if (!res) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
  } else {
    return res;
  }
};

export const countCompanies = async (): Promise<IBackendRes<number>> => {
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/v1/companies/record/count`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    }
  );
  return res;
};

export const fetchCompanyById = async (
  id: string
): Promise<IBackendRes<ICompany>> => {
  const res = await fetch(`${BACKEND_URL}/api/v1/companies/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};

export const followCompany = async (id: string) => {
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/v1/companies/follow`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({ companyId: id }),
    }
  );

  if (res.statusCode === 400) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
  }
  return res;
};

export const unFollowCompany = async (id: string) => {
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/v1/companies/unfollow`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({ companyId: id }),
    }
  );

  if (res.statusCode === 400) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
  }
  return res;
};

export const createCompany = async (body: ICompany) => {
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/v1/companies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: JSON.stringify(body),
  });
  if (res.statusCode === 400) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
    return;
  }
  return res;
};

export const updateCompany = async (id: string, body: ICompany) => {
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/v1/companies/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(body),
    }
  );
  if (res.statusCode === 400) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
    return;
  }
  return res;
};

export const deleteCompany = async (id: string) => {
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/v1/companies/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );
  await deleteDocumentElastic({ index: "companies", id });
  if (!res) {
    notification.error({
      message: "Có lỗi xảy ra",
    });
    return;
  }
  return res;
};

// Roles Apis

export const fetchRoles = async (
  current: number = 1,
  name: string = ""
): Promise<IBackendRes<IModelPaginate<IRole>> | undefined> => {
  const regex = new RegExp(name, "i");
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/v1/roles${current ? `?current=${current}` : ""}${
      name ? `&name=${regex}` : ""
    }`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );
  if (!res) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
  } else {
    return res;
  }
};

export const fetchRoleById = async (
  id?: string
): Promise<IBackendRes<IRole> | undefined> => {
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/v1/roles/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });
  if (!res.data) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
  } else {
    return res;
  }
};

export const createRole = async (body: IRole) => {
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/v1/roles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: JSON.stringify(body),
  });
  if (res.statusCode === 400) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
    return;
  }
  return res;
};

export const updateRole = async (id: string, body: IRole) => {
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/v1/roles/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: JSON.stringify(body),
  });
  if (res.statusCode === 400) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
    return;
  }
  return res;
};

export const deleteRole = async (id: string) => {
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/v1/roles/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });
  if (!res) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
    return;
  }
  return res;
};

// API JOBS

export const fetchJobs = async ({
  current = 1,
  name = "",
  sort = "createdAt",
  location = "",
  pageSize = 10,
  companyId = "",
  companyName = "",
}): Promise<IBackendRes<IModelPaginate<IJob>> | undefined> => {
  const sanitizedInput = name.replace(/[()\/]/g, "");
  const regex = new RegExp(sanitizedInput, "i");
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/v1/jobs?current=${current}${
      name ? `&name=${regex}` : ""
    }${pageSize ? `&pageSize=${pageSize}` : 10}${sort ? `&sort=${sort}` : ""}${
      location ? `&location=${location}` : ""
    }${companyId ? `&companyId=${companyId}` : ""}${
      companyName ? `&companyName=${companyName}` : ""
    }`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!res) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
  } else {
    return res;
  }
};

export const fetchJobsSuggest = async (
  name: string,
  location: string = ""
): Promise<IBackendRes<IJobSuggest[]>> => {
  const res = await fetch(
    `${BACKEND_URL}/api/v1/jobs/search/suggest?name=${name}${
      location ? `&location=${location}` : ""
    }`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await res.json();
  return data;
};

export const countJobs = async (): Promise<IBackendRes<number>> => {
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/v1/jobs/record/count`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    }
  );
  return res;
};

export const fetchJobById = async (
  id: string
): Promise<IBackendRes<IJob> | undefined> => {
  const res = await fetch(`${BACKEND_URL}/api/v1/jobs/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  return data;
};

export const createJob = async (body: IJob) => {
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/v1/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: JSON.stringify(body),
  });
  if (res.statusCode === 400) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
    return;
  }
  return res;
};

export const updateJob = async (id: string, body: IJob) => {
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/v1/jobs/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: JSON.stringify(body),
  });
  if (res.statusCode === 400) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
    return;
  }
  return res;
};

export const deleteJob = async (id: string) => {
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/v1/jobs/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });
  if (res.statusCode !== 200) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
    return;
  }
  return res;
};

// API RESUMES

export const fetchResumes = async (
  current: number,
  status: string = ""
): Promise<IBackendRes<IModelPaginate<IResume>> | undefined> => {
  const regex = new RegExp(status, "i");
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/v1/resumes?current=${current}${
      status ? `&status=${regex}` : ""
    }&pageSize=5&populate=companyId,jobId`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );
  if (!res) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
    return;
  } else {
    return res;
  }
};

export const fetchResumeByUser = async (): Promise<IBackendRes<IResume[]>> => {
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/v1/resumes/by-user`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );
  return res;
};

export const createResume = async (body: ICreateResume) => {
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/v1/resumes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: JSON.stringify(body),
  });
  if (res.statusCode === 400) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
    return;
  }
  return res;
};

export const updateResumeStatus = async (
  id: string | undefined,
  status: string
) => {
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/v1/resumes/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({ status }),
    }
  );
  if (res.statusCode === 400) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
    return;
  }
  return res;
};

// API PERMISSIONS

export const fetchPermissions = async (
  current: number = 1,
  name: string = "",
  module: string = "",
  pageSize: number = 10
): Promise<IBackendRes<IModelPaginate<IPermission>> | undefined> => {
  const nameRegex = new RegExp(name, "i");
  const moduleRegex = new RegExp(module, "i");
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/v1/permissions?current=${current}${
      name ? `&name=${nameRegex}` : ""
    }${module ? `&module=${moduleRegex}` : ""}${
      pageSize ? `&pageSize=${pageSize}` : ""
    }`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );
  if (!res) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
  } else {
    return res;
  }
};

export const createPermission = async (body: IPermission) => {
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/v1/permissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: JSON.stringify(body),
  });
  if (res.statusCode === 400) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
    return;
  } else {
    return res;
  }
};

export const updatePermission = async (id: string, body: IPermission) => {
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/v1/permissions/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(body),
    }
  );
  if (!res) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
  } else {
    return res;
  }
};

export const deletePermission = async (id: string) => {
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/v1/permissions/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );
  if (!res) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
    return;
  } else {
    return res;
  }
};

// Auth Apis

export const callLogin = async (
  username: string,
  password: string
): Promise<IBackendRes<IAccount> | undefined> => {
  const res = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: await res.json().then((data) => data.message),
    });
    return;
  }
  const data = await res.json();
  return data;
};

export const callRegister = async (body: IUser) => {
  const res = await fetch(`${BACKEND_URL}/api/v1/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(body),
  });
  if (!res.ok) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: await res.json().then((data) => data.message),
    });
    return;
  }
  const data = await res.json();
  return data;
};

export const callFetchAccount = async (
  accessToken = ""
): Promise<IBackendRes<IGetAccount> | undefined> => {
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/v1/auth/account`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${
        localStorage.getItem("access_token") ?? accessToken
      }`,
    },
  });
  if (!res) {
    return Promise.resolve(undefined);
  }

  return res;
};

export const refreshToken = async (): Promise<string | null> => {
  const res = await fetch(`${BACKEND_URL}/api/v1/auth/refresh`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!res.ok) {
    return null;
  }
  const data: IBackendRes<IAccount> = await res.json();
  return data.data?.access_token || null;
};

export const logout = async (): Promise<void> => {
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/v1/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    credentials: "include",
  });
  if (res.statusCode === 400) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
    return;
  }

  return res;
};

// api skills

export const fetchSkills = async ({
  current = 1,
  name = "",
  pageSize = 10,
  sort = "createdAt",
  location = "",
}): Promise<IBackendRes<IModelPaginate<ISkill>> | undefined> => {
  const sanitizedInput = name.replace(/[()\/]/g, "");
  const regex = new RegExp(sanitizedInput, "i");
  const res = await fetch(
    `${BACKEND_URL}/api/v1/skills?current=${current}${
      name ? `&name=${regex}` : ""
    }${pageSize ? `&pageSize=${pageSize}` : 10}${sort ? `&sort=${sort}` : ""}${
      location ? `&location=${location}` : ""
    }`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await res.json();
  if (!res.ok) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: data.message,
    });
  } else {
    return data;
  }
};

// api subscribers

export const createSubscriber = async (
  body: ISubscribers
): Promise<Response> => {
  const res = await fetch(`${BACKEND_URL}/api/v1/subscribers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res;
};

// api otps

export const createOtp = async (email: string): Promise<Response> => {
  const res = await fetch(`${BACKEND_URL}/api/v1/otps`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  return res;
};

//api files

export const uploadFile = async (file: File): Promise<IBackendRes<IFile>> => {
  const formData = new FormData();
  formData.append("fileUpload", file);
  const res = await fetch(`${BACKEND_URL}/api/v1/files/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: formData,
  });
  return await res.json();
};

// api chats

export const fetchChats = async ({
  current,
  pageSize = 50,
}: {
  current?: number;
  pageSize?: number;
}): Promise<IBackendRes<IModelPaginate<IChat>>> => {
  const res = await fetch(
    `${BACKEND_URL}/api/v1/chats?pageSize=${pageSize}&${
      current ? `current=${current}` : ""
    }`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return await res.json();
};

export const createChat = async (body: IChat): Promise<IBackendRes<IChat>> => {
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/v1/chats`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res;
};

export const deleteChat = async (id: string): Promise<IBackendRes<any>> => {
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/v1/chats/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
};

// api notifications

export const fetchNotifications = async ({
  current = 1,
  pageSize = 50,
}): Promise<IBackendRes<IModelPaginate<INotification>>> => {
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/v1/notifications`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        current,
        pageSize,
      }),
    }
  );
  return res;
};

// api elasticsearch

export const searchWithElastic = async (body: {
  index: string;
  query: string;
  size?: string;
  from?: string;
}) => {
  const res = await fetch(`${BACKEND_URL}/api/v1/elasticsearchs/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  let data;
  if (body.index === "companies") {
    data = (await res.json()) as IElasticsearchResult<ICompany>;
  } else if (body.index === "jobs") {
    data = (await res.json()) as IElasticsearchResult<IJob>;
  }
  return data;
};

export const getDocumentsElastic = async (body: {
  index: string;
  from: string;
  size: string;
}) => {
  const res = await fetch(`${BACKEND_URL}/api/v1/elasticsearchs/get-paginate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  let data;
  if (body.index === "companies") {
    data = (await res.json()) as IElasticsearchResult<ICompany>;
  } else if (body.index === "jobs") {
    data = (await res.json()) as IElasticsearchResult<IJob>;
  }
  return data;
};

export const createDocumentElastic = async (body: {
  index: string;
  document: any;
}) => {
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/v1/elasticsearchs/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  if (res.statusCode !== 201) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
    return;
  }
  return res;
};

export const deleteDocumentElastic = async (body: {
  index: string;
  id: string;
}) => {
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/v1/elasticsearchs/${body.index}/${body.id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (res.statusCode !== 200) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
    return;
  }
  return res;
};
