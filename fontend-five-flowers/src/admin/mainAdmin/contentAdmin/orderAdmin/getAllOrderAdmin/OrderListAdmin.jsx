import { DatePicker, Input, Select, Table } from "antd";
import axios from "axios";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import "./orderListAdmin.scss";

const { Option } = Select;
const { RangePicker } = DatePicker;

const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "gold";
    case "Paid":
      return "green";
    case "Packaging":
      return "blue";
    case "Shipping":
      return "cyan";
    case "Delivered":
      return "lime";
    case "Cancelled":
      return "red";
    case "Refunded":
      return "purple";
    case "Returned":
      return "black";
    default:
      return "default";
  }
};

const StyledSelect = styled(Select)`
  width: 110px;
  .ant-select-selection-item {
    color: ${(props) => getStatusColor(props.status)} !important;
  }
  .ant-select-item-option-content {
    color: ${(props) => getStatusColor(props.status)} !important;
  }
`;

const OrderListAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [sortOrder, setSortOrder] = useState("status");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [dateRange, setDateRange] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8080/api/v1/orders/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            size: 1000, // Fetch a large number of orders to ensure we get all of them
          },
        }
      );
      console.log("Fetched orders:", response.data.content);
      setOrders(response.data.content);
      setPagination({
        current: 1,
        pageSize: 10,
        total: response.data.totalElements,
      });
      applyFiltersAndSort(
        response.data.content,
        sortOrder,
        dateRange,
        statusFilter,
        searchTerm
      );
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const viewOrderDetails = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
    applyFiltersAndSort(orders, value, dateRange, statusFilter, searchTerm);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    applyFiltersAndSort(orders, sortOrder, dates, statusFilter, searchTerm);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    applyFiltersAndSort(orders, sortOrder, dateRange, value, searchTerm);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFiltersAndSort(orders, sortOrder, dateRange, statusFilter, value);
  };

  const applyFiltersAndSort = (
    ordersList,
    sortOrder,
    dateRange,
    statusFilter,
    searchTerm
  ) => {
    let filteredOrders = [...ordersList];

    if (dateRange && dateRange.length === 2) {
      const [start, end] = dateRange;
      const startDate = new Date(start).getTime();
      const endDate = new Date(end).getTime();

      filteredOrders = filteredOrders.filter((order) => {
        const orderDateArray = order.createdAt;
        const orderDate = new Date(
          Date.UTC(
            orderDateArray[0],
            orderDateArray[1] - 1,
            orderDateArray[2],
            orderDateArray[3],
            orderDateArray[4],
            orderDateArray[5]
          )
        ).getTime();
        return orderDate >= startDate && orderDate <= endDate;
      });
    }

    if (statusFilter) {
      filteredOrders = filteredOrders.filter(
        (order) => order.status === statusFilter
      );
    }

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filteredOrders = filteredOrders.filter(
        (order) =>
          order.user?.userName.toLowerCase().includes(lowerCaseSearchTerm) ||
          (order.user?.firstName &&
            order.user.firstName.toLowerCase().includes(lowerCaseSearchTerm)) ||
          (order.user?.lastName &&
            order.user.lastName.toLowerCase().includes(lowerCaseSearchTerm)) ||
          (order.address?.address &&
            order.address.address.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }

    const statusPriority = {
      Pending: 1,
      Packaging: 2,
      Shipping: 3,
      Paid: 4,
      Delivered: 5,
      Cancelled: 6,
      Refunded: 7,
      Returned: 8,
    };

    switch (sortOrder) {
      case "newest":
        filteredOrders.sort((a, b) => {
          const dateA = new Date(
            Date.UTC(
              a.createdAt[0],
              a.createdAt[1] - 1,
              a.createdAt[2],
              a.createdAt[3],
              a.createdAt[4],
              a.createdAt[5]
            )
          ).getTime();
          const dateB = new Date(
            Date.UTC(
              b.createdAt[0],
              b.createdAt[1] - 1,
              b.createdAt[2],
              b.createdAt[3],
              b.createdAt[4],
              b.createdAt[5]
            )
          ).getTime();
          return dateB - dateA; // Đổi ngược để sắp xếp từ mới nhất đến cũ nhất
        });
        break;
      case "oldest":
        filteredOrders.sort((a, b) => {
          const dateA = new Date(
            Date.UTC(
              a.createdAt[0],
              a.createdAt[1] - 1,
              a.createdAt[2],
              a.createdAt[3],
              a.createdAt[4],
              a.createdAt[5]
            )
          ).getTime();
          const dateB = new Date(
            Date.UTC(
              b.createdAt[0],
              b.createdAt[1] - 1,
              b.createdAt[2],
              b.createdAt[3],
              b.createdAt[4],
              b.createdAt[5]
            )
          ).getTime();
          return dateA - dateB; // Đổi ngược để sắp xếp từ cũ nhất đến mới nhất
        });
        break;
      case "price-low":
        filteredOrders.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filteredOrders.sort((a, b) => b.price - a.price);
        break;
      case "status":
        filteredOrders.sort(
          (a, b) => statusPriority[a.status] - statusPriority[b.status]
        );
        break;
      default:
        break;
    }
    console.log("Filtered and Sorted orders:", filteredOrders);
    setFilteredOrders(filteredOrders);
  };

  const formatDate = (dateArray) => {
    if (!Array.isArray(dateArray) || dateArray.length !== 6) {
      return "N/A"; // Giá trị mặc định khi dữ liệu không hợp lệ
    }
    const [year, month, day, hours, minutes, seconds] = dateArray;
    const date = new Date(
      Date.UTC(year, month - 1, day, hours, minutes, seconds)
    ); // Chú ý tháng bắt đầu từ 0 trong JavaScript
    if (isNaN(date)) {
      return "N/A"; // Giá trị mặc định khi dữ liệu không hợp lệ
    }
    const formattedDate = date.toISOString().slice(0, 19).replace("T", " ");
    return formattedDate;
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/api/v1/orders/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchOrders(); // Fetch updated orders
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const renderStatusSelect = (status, record) => {
    const handleClick = (e) => {
      e.stopPropagation();
    };

    if (
      status === "Delivered" ||
      status === "Cancelled" ||
      status === "Refunded" ||
      status === "Returned"
    ) {
      return (
        <StyledSelect
          status={status}
          value={status}
          disabled
          onClick={handleClick}
        >
          <Option value="Pending">Pending</Option>
          <Option value="Paid">Paid</Option>
          <Option value="Packaging">Packaging</Option>
          <Option value="Shipping">Shipping</Option>
          <Option value="Delivered">Delivered</Option>
          <Option value="Returned">Returned</Option>
          <Option value="Cancelled">Cancelled</Option>
          <Option value="Refunded">Refunded</Option>
        </StyledSelect>
      );
    }

    return (
      <StyledSelect
        status={status}
        value={status}
        onChange={(value) => updateOrderStatus(record.orderId, value)}
        onClick={handleClick} // prevent event propagation
      >
        <Option value="Pending">Pending</Option>
        <Option value="Paid">Paid</Option>
        <Option value="Packaging">Packaging</Option>
        <Option value="Shipping">Shipping</Option>
        <Option value="Delivered">Delivered</Option>
        <Option value="Returned">Returned</Option>
        <Option value="Cancelled">Cancelled</Option>
        <Option value="Refunded">Refunded</Option>
      </StyledSelect>
    );
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "User",
      dataIndex: ["user", "userName"],
      key: "user",
    },
    {
      title: "First Name",
      key: "firstName",
      render: (text, record) => {
        return record.user?.firstName || record.address?.firstName || "null";
      },
    },
    {
      title: "Last Name",
      key: "lastName",
      render: (text, record) => {
        return record.user?.lastName || record.address?.lastName || "null";
      },
    },
    {
      title: "Total Price",
      dataIndex: "price",
      key: "price",
      render: (text) => `$${text}`, // Sử dụng giá từ backend
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (address) =>
        address ? `${address.address}, ${address.postalCode}` : "No address",
    },
    {
      title: "Order Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => formatDate(createdAt),
    },
    {
      title: "Payment Method",
      dataIndex: ["payment", "paymentMethod"],
      key: "paymentMethod",
      render: (text) => text || "No payment method",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => renderStatusSelect(status, record),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (updatedAt) => formatDate(updatedAt),
    },
  ];

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  return (
    <motion.div
      className="orders-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="header-orders-container">
        <div className="title-orders-container">
          <p>Orders</p>
        </div>
        <div className="menu-orders-container">
          <div className="sort-orders-menu">
            <Select
              style={{ width: 100 }}
              onChange={handleSortChange}
              defaultValue="status"
              placeholder="Sort by"
            >
              <Option value="newest">Newest</Option>
              <Option value="oldest">Oldest</Option>
              <Option value="price-low">Price, low to high</Option>
              <Option value="price-high">Price, high to low</Option>
              <Option value="status">Status</Option>
            </Select>
            <RangePicker style={{ width: 150 }} onChange={handleDateRangeChange} />
            <Select
              style={{ width: 100 }}
              onChange={handleStatusFilterChange}
              defaultValue=""
              placeholder="Filter by Status"
            >
              <Option value="">All</Option>
              <Option value="Pending">Pending</Option>
              <Option value="Paid">Paid</Option>
              <Option value="Packaging">Packaging</Option>
              <Option value="Shipping">Shipping</Option>
              <Option value="Delivered">Delivered</Option>
              <Option value="Returned">Returned</Option>
              <Option value="Cancelled">Cancelled</Option>
              <Option value="Refunded">Refunded</Option>
            </Select>
            <Input
              placeholder="Search something"
              value={searchTerm}
              onChange={handleSearchChange}
              style={{ width: 200 }}
            />
            <div className="button-create-orderadmin">
              <Link to="add">
                <p>Create order</p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredOrders}
        pagination={{ ...pagination, showSizeChanger: false }}
        onChange={handleTableChange}
        rowKey="orderId"
        onRow={(record) => ({
          onClick: () => viewOrderDetails(record.orderId), // navigate to order details on row click
        })}
        rowClassName="clickable-row"
      />
    </motion.div>
  );
};

export default OrderListAdmin;
