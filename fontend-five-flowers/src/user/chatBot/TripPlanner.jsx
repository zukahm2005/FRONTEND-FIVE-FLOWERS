import { Alert, Snackbar } from "@mui/material"; // Import Snackbar và Alert từ Material UI
import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoMdSend } from "react-icons/io";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./tripPlanner.scss";

const TripPlanner = ({ onClose }) => {
  const [startLocation, setStartLocation] = useState(""); // Input cho địa chỉ bắt đầu
  const [endLocation, setEndLocation] = useState(""); // Input cho địa chỉ đến
  const [extraRequest, setExtraRequest] = useState(""); // Input cho thông tin bổ sung
  const [messages, setMessages] = useState(() => {
    const savedMessages = sessionStorage.getItem("chatMessages");
    return savedMessages
      ? JSON.parse(savedMessages)
      : [
          {
            role: "bot",
            content:
              "Hello! How can I help you with your travel itinerary using bicycles today?",
            time: new Date().toLocaleTimeString(),
          },
        ];
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false); // State cho snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Thông báo trong snackbar
  const [currentStartLocation, setCurrentStartLocation] = useState(""); // Lưu tạm startLocation khi gửi
  const [currentEndLocation, setCurrentEndLocation] = useState(""); // Lưu tạm endLocation khi gửi

  useEffect(() => {
    sessionStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async (type) => {
    if (
      type === "ask" &&
      (startLocation.trim() === "" ||
        endLocation.trim() === "" ||
        extraRequest.trim() === "")
    )
      return;

    // Kết hợp nội dung của ba input thành một đoạn văn bản
    const combinedMessage = `Start: ${startLocation}, End: ${endLocation}. Request: ${extraRequest}`;

    const updatedMessages = [
      ...messages,
      {
        role: "user",
        content: combinedMessage,
        time: new Date().toLocaleTimeString(),
      },
    ];

    setMessages(updatedMessages);
    setCurrentStartLocation(startLocation); // Lưu tạm giá trị của startLocation để lưu sau khi nhấn Save
    setCurrentEndLocation(endLocation); // Lưu tạm giá trị của endLocation để lưu sau khi nhấn Save
    setStartLocation("");
    setEndLocation("");
    setExtraRequest("");

    try {
      const historyToSend = updatedMessages.slice(-5);
      const response = await axios.post(
        "http://localhost:8080/api/v1/bot/ask",
        { history: historyToSend },
        { headers: { "Content-Type": "application/json" } }
      );
      const botResponse = response.data.response;

      setMessages([
        ...updatedMessages,
        {
          role: "bot",
          content: botResponse,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage("ask");
    }
  };

  const saveSpecificMessage = async (messageContent) => {
    try {
      await axios.post(
        "http://localhost:8080/api/v1/bot/save",
        {
          botResponse: messageContent,
          startLocation: currentStartLocation, // Lưu startLocation hiện tại
          endLocation: currentEndLocation, // Lưu endLocation hiện tại
        },
        { headers: { "Content-Type": "application/json" } }
      );
      setSnackbarMessage("Response has been saved!"); // Thông báo lưu thành công
      setSnackbarOpen(true); // Mở snackbar
    } catch (error) {
      setSnackbarMessage("Error saving message!"); // Thông báo lỗi
      setSnackbarOpen(true); // Mở snackbar
      console.error("Error saving message:", error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false); // Đóng snackbar
  };

  return (
    <div className="chat-container">
      <h2 style={{ textAlign: "center", padding: "10px" }}>
        Advice on the schedule of traveling by bike
      </h2>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.role}`}>
            <div className="message-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ node, ...props }) => (
                    <p
                      style={{
                        margin: "0.5em 0",
                        fontSize: "16px",
                        color: "#343a40",
                      }}
                      {...props}
                    />
                  ),
                  img: ({ node, ...props }) => (
                    <img
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        borderRadius: "10px",
                        marginTop: "5px",
                      }}
                      {...props}
                    />
                  ),
                }}
              >
                {msg.content}
              </ReactMarkdown>
            </div>
            <div
              className="message-time"
              style={msg.role === "user" ? { color: "#6c757d" } : {}}
            >
              {msg.time}
            </div>
            {msg.role === "bot" && (
              <p
                className="save-button"
                onClick={() => saveSpecificMessage(msg.content)}
              >
                Save
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Input cho địa chỉ bắt đầu, kết thúc và yêu cầu bổ sung - trên cùng 1 hàng */}
      <div className="chat-input-container">
        <div className="locations-start-end">
          <div className="locations-start">
            <input
              type="text"
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              placeholder="Start location"
              className="chat-input start-end-input" // Đặt class cho input địa chỉ bắt đầu
            />
          </div>
          <div className="locations-end">
            <input
              type="text"
              value={endLocation}
              onChange={(e) => setEndLocation(e.target.value)}
              placeholder="End location"
              className="chat-input start-end-input" // Đặt class cho input địa chỉ đến
            />
          </div>
        </div>
        <div className="request-chat-bot">
          <input
            type="text"
            value={extraRequest}
            onChange={(e) => setExtraRequest(e.target.value)}
            placeholder="Additional request (e.g., calculate cost)"
            className="chat-input extra-request-input" // Đặt class cho input yêu cầu bổ sung
          />{" "}
          <button
            onClick={() => sendMessage("ask")}
            disabled={
              !startLocation.trim() ||
              !endLocation.trim() ||
              !extraRequest.trim()
            }
            className="send-button"
          >
            <IoMdSend />
          </button>
        </div>
      </div>

      {/* Snackbar hiển thị thông báo */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default TripPlanner;
