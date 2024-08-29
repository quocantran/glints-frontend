export interface IBackendRes<T> {
  statusCode: number | string;
  message?: string;
  error?: string;
  data?: T;
}

export interface IModelPaginate<T> {
  meta: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
  result: T[];
}

export interface IElasticsearchResult<T> {
  statusCode: number | string;
  message?: string;
  data: {
    total: {
      value: number;
    };

    hits: [
      {
        _id: string;
        _source: T;
      }
    ];
  };
}

export interface IMeta {
  current: number;
  pageSize: number;
  pages: number;
  total: number;
}

export interface IAccount {
  access_token: string;
  user: {
    _id: string;
    email: string;
    name: string;
    role: {
      _id: string;
      name: string;
    };
    permissions: {
      _id: string;
      name: string;
      apiPath: string;
      method: string;
      module: string;
    }[];
  };
}

export interface IGetAccount extends Omit<IAccount, "access_token"> {}

export interface ICompany {
  _id?: string;
  name: string;
  address: string;
  logo?: string;
  description?: string;
  usersFollow?: string[];
  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  age: number;
  gender: string;
  address: string;
  role?: {
    _id: string;
    name: string;
  };

  company?: {
    _id: string;
    name: string;
  };
  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IJob {
  _id?: string;
  name: string;
  skills: string[];
  company?: {
    _id: string;
    name: string;
    logo?: string;
    address?: string;
  };
  location: string;
  salary: number;
  quantity: number;
  level: string;
  description: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;

  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IResume {
  _id?: string;
  email: string;
  userId: string;
  url: string;
  status: string;
  companyId: {
    _id: string;
    name: string;
    logo: string;
  };
  jobId: {
    _id: string;
    name: string;
  };

  history?: {
    status: string;
    updatedAt: Date;
    updatedBy: { _id: string; email: string };
  }[];
  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateResume {
  url: string;
  companyId: string;
  jobId: string;
}

export interface IPermission {
  _id?: string;
  name: string;
  apiPath: string;
  method: string;
  module: string;

  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IRole {
  _id?: string;
  name: string;
  description: string;
  isActive: boolean;
  permissions: IPermission[] | string[];

  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUpdateUserPassword {
  password: string;
  newPassword: string;
  repeatedPassword: string;
}

export interface IJobSuggest {
  name: string;
  location: string;
}

export interface ISkill {
  _id?: string;
  name: string;
  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ISubscribers {
  _id?: string;
  email: string;
  skills: string[];
  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IFile {
  url: string;
}

export interface IChat {
  _id?: string;
  name: string;
  type: string;
  fileUrl?: string;
  content: string;
  userId: string;
  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface INotification {
  _id?: string;
  senderId?: string;
  type: string;
  content: string;
  receiverId: string;
  options: {
    jobId?: string;
  };
  isActive?: boolean;
  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}
