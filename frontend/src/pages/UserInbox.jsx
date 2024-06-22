import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Layout/Header";
import { useSelector } from "react-redux";
import socketIO from "socket.io-client";
import { RiCustomerService2Fill } from "react-icons/ri";
import { server } from "../server";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import { TfiGallery } from "react-icons/tfi";
import styles from "../styles/styles";

const ENDPOINT = "https://socket-ecommerce-tu68.onrender.com/";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const UserInbox = () => {
  const { user, loading } = useSelector((state) => state.user);
  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState(null); // Initialize as null
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [images, setImages] = useState();
  const [activeStatus, setActiveStatus] = useState(false);
  const [open, setOpen] = useState(false);
  const scrollRef = useRef(null);
  const [currTitle, setcurrTitle] = useState("");
  const [chatActive, setChatActive] = useState(true);

  useEffect(() => {
    socketId.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    const getConversation = async () => {
      try {
        const response = await axios.get(
          `${server}/conversation/get-all-conversation-user/${user?._id}`,
          {
            withCredentials: true,
          }
        );

        setConversations(response.data.conversations);
      } catch (error) {
        console.log(error);
      }
    };
    getConversation();
  }, [user, messages]);

  useEffect(() => {
    if (user) {
      const sellerId = user?._id;
      socketId.emit("addUser", sellerId);
      socketId.on("getUsers", (data) => {
        setOnlineUsers(data);
      });
    }
  }, [user]);

  const onlineCheck = (chat) => {
    if (chat.isActive) return true;
    // const chatMembers = chat.members.find((member) => member !== user?._id);
    // const online = onlineUsers.find((user) => user.userId === chatMembers);
    // return online ? true : false;
  };

  useEffect(() => {
    const getMessage = async () => {
      if (currentChat) {
        try {
          const response = await axios.get(
            `${server}/message/get-all-messages/${currentChat._id}`
          );
          setMessages(response.data.messages);
          setChatActive(currentChat.isActive);
        } catch (error) {
          console.log(error);
        }
      }
    };
    getMessage();
  }, [currentChat]);

  const sendMessageHandler = async (e) => {
    e.preventDefault();

    if (!currentChat) return;

    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };
    const receiverId = currentChat.members.find(
      (member) => member !== user?._id
    );

    socketId.emit("sendMessage", {
      senderId: user?._id,
      receiverId,
      text: newMessage,
    });

    try {
      if (newMessage !== "") {
        await axios
          .post(`${server}/message/create-new-message`, message)
          .then((res) => {
            setMessages([...messages, res.data.message]);
            updateLastMessage();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessage = async () => {
    if (!currentChat) return;

    socketId.emit("updateLastMessage", {
      lastMessage: newMessage,
      lastMessageId: user._id,
    });

    await axios
      .put(`${server}/conversation/update-last-message/${currentChat._id}`, {
        lastMessage: newMessage,
        lastMessageId: user._id,
      })
      .then((res) => {
        setNewMessage("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleImageUpload = async (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setImages(reader.result);
        imageSendingHandler(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const imageSendingHandler = async (e) => {
    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socketId.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      images: e,
    });

    try {
      await axios
        .post(`${server}/message/create-new-message`, {
          images: e,
          sender: user._id,
          text: newMessage,
          conversationId: currentChat._id,
        })
        .then((res) => {
          setImages();
          setMessages([...messages, res.data.message]);
          updateLastMessageForImage();
        });
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessageForImage = async () => {
    if (!currentChat) return;

    await axios.put(
      `${server}/conversation/update-last-message/${currentChat._id}`,
      {
        lastMessage: "Photo",
        lastMessageId: user._id,
      }
    );
  };

  const toggleChatActiveStatus = async () => {
    if (!currentChat) return;

    const newStatus = !chatActive;
    try {
      await axios.put(
        `${server}/conversation/update-conversation-status/${currentChat._id}`,
        {
          isActive: newStatus,
        }
      );
      setChatActive(newStatus);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full">
      {!open && (
  <>
    <Header />
    <h1 className="text-center text-[30px] py-3 font-Poppins">
      All Messages
    </h1>
    {/* All messages list */}
    {conversations &&
      (user.role === "Admin" // Check if the logged-in user is an admin
        ? conversations
            .filter((item) => item.isActive) // Filter active conversations for admin
            .map((item, index) => (
              <MessageList
                data={item}
                key={index}
                index={index}
                setOpen={setOpen}
                setCurrentChat={setCurrentChat}
                me={user?._id}
                setUserData={setUserData}
                userData={userData}
                online={onlineCheck(item)}
                setActiveStatus={setActiveStatus}
                loading={loading}
                setcurrTitle={setcurrTitle}
                toggleChatActiveStatus={toggleChatActiveStatus}
              />
            ))
        : conversations.map((item, index) => ( // Show all conversations for non-admin users
            <MessageList
              data={item}
              key={index}
              index={index}
              setOpen={setOpen}
              setCurrentChat={setCurrentChat}
              me={user?._id}
              setUserData={setUserData}
              userData={userData}
              online={onlineCheck(item)}
              setActiveStatus={setActiveStatus}
              loading={loading}
              setcurrTitle={setcurrTitle}
              toggleChatActiveStatus={toggleChatActiveStatus}
            />
          )))}
  </>
)}



      {open && (
        <SellerInbox
          setOpen={setOpen}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessageHandler={sendMessageHandler}
          messages={messages}
          sellerId={user._id}
          userData={userData}
          activeStatus={activeStatus}
          scrollRef={scrollRef}
          handleImageUpload={handleImageUpload}
          currTitle={currTitle}
          loginuser={user}
          chatActive={chatActive} // Pass chatActive state to SellerInbox
          toggleChatActiveStatus={toggleChatActiveStatus} // Pass the toggle function
        />
      )}
    </div>
  );
};

const MessageList = ({
  data,
  index,
  setOpen,
  setCurrentChat,
  me,
  setUserData,
  userData,
  online,
  setActiveStatus,
  loading,
  setcurrTitle,
  toggleChatActiveStatus, // Receive the prop
}) => {
  const [active, setActive] = useState(0);
  const [user, setUser] = useState([]);
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`/inbox?${id}`);
    setOpen(true);
    setcurrTitle(data?.groupTitle);
  };

  useEffect(() => {
    setActiveStatus(online);
    const userId = data.members.find((item) => item !== me);

    const getUser = async () => {
      try {
        const res = await axios.get(`${server}/user/user-info/${userId}`);
        setUser(res.data.user);
      } catch (error) {
        console.log(error);
      }
    };

    getUser();
  }, [me,data]);

  return (
    <div
      className={`w-full flex p-3 px-3 ${
        active === index ? "bg-[#00000010]" : "bg-transparent"
      } cursor-pointer`}
      onClick={(e) => {
        setActive(index);
        handleClick(data._id);
        setCurrentChat(data);
        setUserData(user);
        setActiveStatus(online);
      }}
    >
      <div className="w-[50px] h-[50px] flex items-center justify-center rounded-full bg-slate-200 relative">
        <RiCustomerService2Fill className="w-[50px] h-[50px] flex items-center justify-center text-blue-300 text-3xl font-bold" />
        {online ? (
          <div className="w-[12px] h-[12px] bg-green-400 rounded-full absolute top-[2px] right-[2px]" />
        ) : (
          <div className="w-[12px] h-[12px] bg-[#c7b9b9] rounded-full absolute top-[2px] right-[2px]" />
        )}
      </div>
      <div className="pl-3">
        <h1 className="text-[18px]">
          {"Help Regarding"} {"#"}
          {data?.groupTitle.split(" ")[0].substring(15)}
        </h1>
        <p className="text-[16px] text-[#000c]">
          {!loading && data?.lastMessageId !== userData?._id
            ? "You:"
            : (userData && userData.name
                ? userData.name.split(" ")[0] + ":"
                : "")}{" "}
          {data?.lastMessage}
        </p>
      </div>
    </div>
  );
};
const SellerInbox = ({
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  sellerId,
  userData,
  activeStatus,
  scrollRef,
  handleImageUpload,
  currTitle,
  loginuser,
  chatActive, // Receive chatActive state
  toggleChatActiveStatus, // Receive the toggle function
}) => {
  return (
    <div className="w-[full] min-h-full flex flex-col justify-between p-5">
      {/* message header */}
      <div className="w-full flex p-3 items-center justify-between bg-slate-200">
        <div className="flex">
          <RiCustomerService2Fill className="w-[50px] h-[50px] flex items-center justify-center text-blue-300 text-3xl font-bold" />
          <div className="pl-3">
            <h1 className="text-[18px] font-[600]">
            {loginuser.role === "Admin" && userData?.name? userData?.name : ""}{" "}{loginuser.role === "Admin" && userData?.name? "" : "Help regarding"}{" "}{loginuser.role === "Admin" && currTitle? currTitle : currTitle.split(' ')[1]}
              
            </h1>
            <h1>{activeStatus ? "Active Now" : ""}</h1>
          </div>
        </div>
        {loginuser.role === "Admin" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleChatActiveStatus();
                  }}
                >
                  {chatActive ? "Deactivate Chat" : "Activate Chat"}
                </button>
              )}{" "}
        <AiOutlineArrowRight
          size={20}
          className="cursor-pointer"
          onClick={() => setOpen(false)}
        />
      </div>

      {/* messages */}
      <div className="px-3 h-[75vh] py-3 overflow-y-scroll">
        {messages &&
          messages.map((item, index) => (
            <div
              className={`flex w-full my-2 ${
                item.sender === sellerId ? "justify-end" : "justify-start"
              }`}
              ref={scrollRef}
            >
              {item.sender !== sellerId && (
                <RiCustomerService2Fill
                  className="w-[30px] h-[30px] rounded-full mr-3 text-blue-300"
                />
              )}
              {item.images && (
                <img
                  src={`${item.images?.url}`}
                  className="w-[300px] h-[300px] object-cover rounded-[10px] ml-2 mb-2"
                />
              )}
              {item.text !== "" && (
                <div>
                  <div
                    className={`w-max p-2 rounded ${
                      item.sender === sellerId ? "bg-[#000]" : "bg-[#38c776]"
                    } text-[#fff] h-min`}
                  >
                    <p>{item.text}</p>
                  </div>
                  <p className="text-[12px] text-[#000000d3] pt-1">
                    {/* {format(item.createdAt)} */}
                  </p>
                </div>
              )}
            </div>
          ))}
      </div>

      {/* send message input */}
      <form
        aria-required={true}
        className="p-3 relative w-full flex justify-between items-center"
        onSubmit={sendMessageHandler}
      >
       {chatActive && ( <div className="w-[30px]">
          <input
            type="file"
            name=""
            id="image"
            className="hidden"
            onChange={handleImageUpload}
          />
          <label htmlFor="image">
            <TfiGallery className="cursor-pointer" size={20} />
          </label>
        </div>)}
        
        {chatActive && (<div className="w-full">
            <input
              type="text"
              required
              placeholder="Enter your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className={`${styles.input}`}
            />
            <input type="submit" value="Send" className="hidden" id="send" />
            <label htmlFor="send">
              <AiOutlineSend
                size={20}
                className="absolute right-4 top-5 cursor-pointer"
              />
            </label>
          </div>
        )}
        {!chatActive && ( // Center the message
            <div className="w-full text-center">
              <h1 className="text-red-500">Chat has been disabled</h1>
            </div>
        )}
      </form>
    </div>
  );
};

export default UserInbox;
