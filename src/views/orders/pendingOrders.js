import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Skeleton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { isAutheticated } from "src/auth";

const PendingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalOrders, setTotalOrders] = useState(0);
  const [searchField, setSearchField] = useState("Order ID");
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const token = isAutheticated();

  // Fetch orders with pagination
  const fetchOrders = async (page, limit) => {
    setLoading(true);
    try {
      const response = await axios.get("/api/get-pending-order-admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: page + 1, // Adjusting for zero-based index in the UI
          limit,
          searchField,
          searchText,
        },
      });
      // console.log(response);
      setOrders(response?.data?.placedOrders);
      setTotalOrders(response?.data?.totalOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page, rowsPerPage);
  }, [page, rowsPerPage, searchField, searchText]);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSearchFieldChange = (event) => {
    setSearchField(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredOrders = orders?.filter((order) => {
    if (searchField === "Order ID") {
      return order.uniqueId.toLowerCase().includes(searchText.toLowerCase());
    }
    if (searchField === "Status") {
      return order.status.toLowerCase().includes(searchText.toLowerCase());
    }
    return true;
  });

  return (
    <Box>
      <Typography variant="h4" mb={2} textAlign="center">
        Pending Order List
      </Typography>
      <Box display="flex" mb={2} alignItems="center">
        <FormControl variant="outlined" sx={{ minWidth: 150, mr: 2 }}>
          <InputLabel id="search-field-label">Search By</InputLabel>
          <Select
            labelId="search-field-label"
            id="search-field"
            value={searchField}
            onChange={handleSearchFieldChange}
            label="Search By"
          >
            <MenuItem value="Order ID">Order ID</MenuItem>
            <MenuItem value="Status">Status</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label={`Search by ${searchField}`}
          variant="outlined"
          value={searchText}
          onChange={handleSearchChange}
          fullWidth
        />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Order Value</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from(new Array(rowsPerPage)).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={6}>
                    <Skeleton height={40} />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order.uniqueId}</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toDateString()}
                    <span>, {formatAMPM(order.createdAt)}</span>
                  </TableCell>
                  <TableCell>{order.orderItem.length}</TableCell>
                  <TableCell>₹ {order.grandTotal.toFixed(2)}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        navigate(`/orders/${order.status}/${order._id}`)
                      }
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1">Data not found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalOrders}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

// Helper function to format time as AM/PM
const formatAMPM = (date) => {
  var hours = new Date(date).getHours();
  var minutes = new Date(date).getMinutes();
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
};

export default PendingOrders;
