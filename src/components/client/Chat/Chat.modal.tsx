'use client';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import styles from '../../../styles/Chat.module.scss';
import classnames from 'classnames/bind';
import socket from '../../../utils/socket';
import { useAppSelector } from '@/lib/redux/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCircle, faComment, faFile, faPaperPlane, faXmark } from '@fortawesome/free-solid-svg-icons';
import { createChat, fetchChats, uploadFile } from '@/config/api';
import { IChat } from '@/types/backend';
import MessageCard from './Message.card';
import InputEmoji from "react-input-emoji";
import { LoadingOutlined } from '@ant-design/icons';
import { Flex, Spin } from 'antd';
import { notification } from 'antd';

import { Button, message } from 'antd';



const cx = classnames.bind(styles);


const Chat = () => {
  const [messages, setMessages] = useState<IChat[]>([]);
  const [input, setInput] = useState('');
  const [open, setOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [userTyping, setUserTyping] = useState<string | null>(null);
  const [fileLoading, setFileLoading] = useState<boolean>(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isAuth = useAppSelector(state => state.auth.isAuthenticated);

  const user = useAppSelector(state => state.auth.user);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    socket.on('message', (message: any) => {

      if (!open) {
        setNotification(true);
      }
      setMessages((prevMessages: any) => [...prevMessages, message]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  useEffect(() => {
    containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);//
  }, [messages]);

  useEffect(() => {
    if (open && wrapperRef.current) {
      wrapperRef.current.style.transform = 'translateX(0)'
      containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
    }
  }, [open])

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchChats();
      const data = result.data?.result as IChat[];

      setMessages(data);
    }

    fetchData();
  }, [])

  const sendMessage = async () => {

    if (!isAuth) {
      message.error('Vui lòng đăng nhập để nhắn tin!');
      return;
    };
    if (!input && !file) return;


    if (fileLoading) {
      message.error('Vui lòng chờ file upload hoàn tất');
      return;
    }

    const data: IChat = {
      name: user.name,
      content: input,
      userId: user._id,
      type: file ? 'image' : 'text',
      fileUrl: fileUrl ? fileUrl : ''

    }


    createChat(data);
    socket.emit('message', data);
    setInput('');
    setFile(null);
    setFileUrl(null);
    socket.emit('stopTyping');
  };

  useEffect(() => {
    socket.on('typing', (message) => {
      setUserTyping(message);
      setIsTyping(true);

    });
    socket.on('stopTyping', () => setIsTyping(false));
  }, []);

  useEffect(() => {
    if (!isAuth) return;


    if (!input) {
      socket.emit('stopTyping');
      return;
    }
    socket.emit('typing', user.name);
    const timeout = setTimeout(() => {
      socket.emit('stopTyping');
    }, 3000);

    return () => {
      clearTimeout(timeout);
    }
  }, [input])


  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      if ((event as unknown as React.KeyboardEvent<HTMLTextAreaElement>).key === 'Enter' && !(event as unknown as React.KeyboardEvent<HTMLTextAreaElement>).shiftKey) {
        event.preventDefault();

        sendMessage();
      }
    }
  };

  const handleFileChange = async (e: any) => {
    const selectedFile = e.target.files[0];

    if (fileLoading) {
      message.error('Vui lòng chờ file upload hoàn tất');
      return;
    }

    const validFileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

    if (selectedFile && !validFileTypes.includes(selectedFile.type)) {
      message.error('Chỉ chấp nhận định dạng .png, .jpg, .jpeg, .webp');
      return;
    }
    setFile(selectedFile);
    setFileLoading(true);
    const res = await uploadFile(selectedFile);

    if (res.statusCode !== 201) {
      message.error('Upload file thất bại!');
      setFileLoading(false);
      return;
    }

    setFileLoading(false);

    setFileUrl(res.data?.url as string);


  }

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleOpenChat = () => {
    if (wrapperRef.current) {
      wrapperRef.current.style.opacity = '1';
      wrapperRef.current.style.pointerEvents = 'auto';
      wrapperRef.current.style.transform = 'translateX(0)';
    }
    setNotification(false);
    setOpen(true);
  }


  const handleCloseChat = () => {

    if (wrapperRef.current) {
      wrapperRef.current.style.opacity = '0';
      wrapperRef.current.style.pointerEvents = 'none';
      wrapperRef.current.style.transform = 'translateX(100%)';
    }
    setOpen(false);
    setNotification(false);
  }

  return (
    <>

      <div ref={wrapperRef} className={cx('wrapper')}>
        <div className={cx('container')}>

          <div className={cx('messages-wrapper')}>
            <h2 className={cx('message-title')}>Tin nhắn
              <FontAwesomeIcon onClick={handleCloseChat} icon={faXmark} className={cx('close')} />

            </h2>
            <div ref={containerRef} className={cx('message-container')}>
              {messages.map((chat: IChat, index) => (
                <MessageCard target={index} messages={messages} setMessages={setMessages} key={chat._id} chat={chat} userId={user._id} />
              ))}
              {isTyping &&
                <div className={cx('typing-wrapper')}>
                  <div className={cx('typing-info')}>
                    <p> <span>{userTyping} </span>đang nhắn:</p>
                  </div>


                  <div className={cx("typing-indicator")}>
                    <span className={cx("dot")}></span>
                    <span className={cx("dot")}></span>
                    <span className={cx("dot")}></span>
                  </div>

                </div>}
            </div>
          </div>


          <div className={cx('input-wrapper')}>
            <div className={cx('input-icon')}>
              {file &&

                <p className={cx('file-preview')}>Bạn đã chọn file:
                  <span>{file.name}</span>
                  <span className={cx('file-loading')}>
                    {fileLoading && <Flex align="center" gap="middle">
                      <Spin indicator={<LoadingOutlined spin />} size="small" />

                    </Flex>}

                    {!fileLoading && <p><FontAwesomeIcon icon={faCheck} /></p>}
                  </span>

                </p>
              }

              <div className={cx('input-content')}>

                <InputEmoji onChange={setInput} value={input} shouldReturn={true} language='vi' shouldConvertEmojiToImage={false} onKeyDown={handleKeyDown} placeholder={isAuth ? 'Nhập tin nhắn...' : "Vui lòng đăng nhập để nhắn tin"} />


              </div>

              <div onClick={handleFileClick} className={cx('file-wrapper')}>
                <input accept=".png, .jpg, .jpeg, .webp" onChange={handleFileChange} ref={fileInputRef} type="file" id="file" hidden />
                <FontAwesomeIcon icon={faFile} />
              </div>

              <div onClick={sendMessage} className={cx('file-submit')}>
                <FontAwesomeIcon icon={faPaperPlane} />
              </div>

            </div>
          </div>

        </div>

      </div>

      {open ? <Fragment /> :

        <div className={cx('chat-icon')} onClick={handleOpenChat}>
          <div className={cx('icon-wrapper')}>
            <FontAwesomeIcon icon={faComment} className={cx('icon-msg')} />
            {notification ? <FontAwesomeIcon icon={faCircle} className={cx('notification')} /> : <Fragment />}

          </div>
        </div>

      }


    </>
  );
};

export default Chat;