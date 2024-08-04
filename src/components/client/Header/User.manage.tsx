import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Skeleton,
  Table,
  Tabs,
  message,
  notification,
} from "antd";
import { isMobile } from "react-device-detect";
import { Result, TabsProps } from "antd";
import { IResume, ISkill, ISubscribers } from "@/types/backend";
import { useState, useEffect } from "react";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { createSubscriber, fetchResumeByUser, fetchSkills, updateUserPassword } from "@/config/api";
import { SmileOutlined } from "@ant-design/icons";
import { FormProps } from "antd/lib";
import { useAppSelector } from "@/lib/redux/hooks";

interface IProps {
  open: boolean;
  setOpen: (v: boolean) => void;
}

const UserResume = (props: any) => {
  const [listCV, setListCV] = useState<IResume[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      const res = await fetchResumeByUser();
      if (res && res.data) {
        setListCV(res.data as IResume[]);
      }
      setIsFetching(false);
    };
    fetchData();
  }, []);

  const columns: ColumnsType<IResume> = [
    {
      title: "STT",
      key: "index",
      width: 50,
      align: "center",
      render: (text, record, index) => {
        return <>{index + 1}</>;
      },
    },
    {
      title: "Công Ty",
      dataIndex: ["companyId", "name"],
    },
    {
      title: "Vị trí",
      dataIndex: ["jobId", "name"],
    },
  ];

  if (!isMobile) {
    columns.push({
      title: "Trạng thái",
      dataIndex: "status",
    })
    columns.push(
      {
        title: "Ngày rải CV",
        dataIndex: "createdAt",
        sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
        render(value, record, index) {
          return <>{dayjs(record.createdAt).format("DD-MM-YYYY HH:mm:ss")}</>;
        },
      },
      {
        title: "",
        dataIndex: "",
        render(value, record, index) {
          return (
            <a href={record.url} target="_blank">
              Chi tiết
            </a>
          );
        },
      }
    );
    
  } else {
    columns.slice(0, 3);
  }

  return isFetching ? (
    <Skeleton active />
  ) : !listCV.length ? (
    <Result
      icon={<SmileOutlined />}
      title="Bạn chưa rải CV nào trước đây!"
      extra={
        <Button href="/jobs" type="primary">
          Bấm vào đây để tìm việc!
        </Button>
      }
    />
  ) : (
    <div>
      <Table<IResume>
        bordered={true}
        columns={columns}
        dataSource={listCV}
        loading={isFetching}
        pagination={false}
      />
    </div>
  );
};

interface FieldType {
  password: string;
  newPassword: string;
  repeatedPassword: string;
}

const UpdateUserPassword = (props: any) => {
  const userId = useAppSelector((state) => state.auth.user?._id);
  const [loading, setLoading] = useState(false);
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { password, newPassword, repeatedPassword } = values;

    if (newPassword.length < 6) {
      message.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }

    if (newPassword !== repeatedPassword) {
      message.error("Mật khẩu nhập lại không khớp!");
      return;
    }
    setLoading(true);
    const res = await updateUserPassword(userId, values);
    if (res.statusCode === 200) {
      setLoading(false);
      message.success("Thay đổi mật khẩu thành công!");
    } else {
      notification.error({
        message: "Thay đổi mật khẩu thất bại",
        description: res.message,
      });
      setLoading(false);
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      <h2 style={{ textAlign: "center", marginBottom: 10 }}>
        Thay đổi mật khẩu
      </h2>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 700, margin: "0 auto" }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Nhập mật khẩu cũ"
          name="password"
          rules={[
            { required: true, message: "Trường này không được để trống!" },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType>
          label="Nhập mật khẩu mới"
          name="newPassword"
          rules={[
            { required: true, message: "Trường này không được để trống!" },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType>
          name="repeatedPassword"
          label="Nhập lại mật khẩu mới"
          rules={[
            { required: true, message: "Trường này không được để trống!" },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button loading={loading} type="primary" htmlType="submit">
            Xác nhận
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

const Subscriber = (props : any) => {

  const [skills, setSkills] = useState<any>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const currentEmail = useAppSelector((state) => state.auth.user?.email);
  const [email, setEmail] = useState<string>(currentEmail || '');
  const [loading, setLoading] = useState<boolean>(false);


  const handleChange = (value: any) => {
    setSelectedSkills(value);
  }

  const handleClick = async() => {
    const data : ISubscribers = {
      email : email,
      skills : selectedSkills
    }
    
    setLoading(true);
    const res = await createSubscriber(data);
    const resData = await res.json();
    if(!res.ok){
      notification.error({
        message: "Đăng ký thất bại",
        description: resData.message,
      });
      setLoading(false);
      return;
    }
    setLoading(false);
    message.success('Đăng ký thành công!'); 
  }

  const handleGetEmail = (e : any) => {
    setEmail(e.target.value);
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      const res = await fetchSkills({pageSize : 100, current : 1});
      if (res && res.data) {
        const skillData = res.data.result as ISkill[];
        const skillList = skillData.map((skill) => ({
          label: skill.name,
          value: skill._id,
        }));
        setSkills(skillList);
      }
      setIsFetching(false);
      
    };
    fetchData();
    
  }, []);


  return (
    isFetching ? <Skeleton></Skeleton> :<>
      <h2 style={{ textAlign: "center", marginBottom: 10 }}>
        Đăng ký nhận công việc theo kỹ năng
      </h2>

      <div style = {{marginBottom : '15px'}}>
        <Input value={email} onChange={handleGetEmail} placeholder="Nhập vào email của bạn"/>
      </div>

      <div>
        <Select
            mode="multiple"
            
            placeholder="Lựa chọn kỹ năng"
            onChange={handleChange}
            options={skills}
            style={{ width: '100%' }}
        
          />
      </div>
      <Button onClick={handleClick} loading={loading} type="primary" style={{ marginTop: 10 }}>
        Đăng ký
      </Button>
    </>
  )
}

const ManageUser = (props: IProps) => {
  const { open, setOpen } = props;

  const items: TabsProps["items"] = [
    {
      key: "user-resume",
      label: `Danh sách CV đã nộp`,
      children: <UserResume />,
    },
    {
      key: "user-password",
      label: `Thay đổi mật khẩu`,
      children: <UpdateUserPassword />,
    },
    {
      key: "user-subscriber",
      label: `Đăng ký nhận công việc theo kỹ năng`,
      children: <Subscriber />,
    }
  ];

  return (
    <>
      <Modal
        title="Quản lý tài khoản"
        open={open}
        onCancel={() => setOpen(false)}
        maskClosable={false}
        footer={null}
        destroyOnClose={true}
        width={isMobile ? "100%" : "1400px"}
      >
        <div style={{ minHeight: 400 }}>
          <Tabs defaultActiveKey="user-resume" items={items} />
        </div>
      </Modal>
    </>
  );
};

export default ManageUser;
