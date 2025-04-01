import axios from "axios";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { isAutheticated } from "src/auth";
import { City, State } from "country-state-city";
import { Modal, Button } from "react-bootstrap";
import { Autocomplete, TextField, Typography, Box } from "@mui/material";

const SinglePrincipalDistributorAllDetails = () => {
  const token = isAutheticated();
  const { _id } = useParams();

  const [user, setUser] = useState(null);
  const [userOrder, setUserOrder] = useState({
    totalOrders: 0,
    totalValue: 0,
    lastPurchaseOrderDate: null,
  });
  const [userAllAddress, setUserAllAddress] = useState([]);
  const [gstNumber, setGstNumber] = useState(null);
  const [panNumber, setPanNumber] = useState(null);
  const [tradeName, setTradeName] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [currentAddress, setCurrentAddress] = useState({
    Name: "",
    tradeName: "",
    gstNumber: "",
    panNumber: "",
    phoneNumber: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    isDefault: false,
  });

  // Fetch states when the component mounts
  useEffect(() => {
    const fetchStates = () => {
      const states = State.getStatesOfCountry("IN").map((state) => ({
        label: state.name,
        value: state.isoCode,
      }));
      setStateOptions(states);
    };
    fetchStates();
  }, []);

  // Fetch cities when a state is selected
  useEffect(() => {
    const fetchCities = () => {
      if (selectedState) {
        const cities = City.getCitiesOfState("IN", selectedState.value).map(
          (city) => ({
            label: city.name,
            value: city.name,
          })
        );
        setCityOptions(cities);
      } else {
        setCityOptions([]); // Clear cities if no state is selected
      }
    };
    fetchCities();
  }, [selectedState]);

  // Open modal for add or edit mode
  const handleOpenModal = (address = null) => {
    setIsEditMode(!!address); // Set edit mode if address is provided
    const initialAddress = address || {
      Name: "",
      tradeName: tradeName,
      gstNumber: gstNumber,
      panNumber: panNumber,
      phoneNumber: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      isDefault: false,
    };
    setCurrentAddress(initialAddress);

    // Fetch city options based on the state from the backend
    if (address) {
      const state =
        stateOptions.find((option) => option.label === address.state) || null;

      // Set selected state from backend address
      setSelectedState(state);

      // Fetch cities if state is found
      if (state) {
        const cities = City.getCitiesOfState("IN", state.value).map((city) => ({
          label: city.name,
          value: city.name,
        }));
        setCityOptions(cities);

        // Set selected city if it exists in the fetched city options
        const city =
          cities.find((option) => option.label === address.city) || null;
        setSelectedCity(city); // Set the selected city
      }
    } else {
      setSelectedState(null);
      setSelectedCity(null);
      setCityOptions([]); // Clear city options if no address is provided
    }

    setShowModal(true);
  };

  // Close modal without saving changes
  const handleCloseModal = () => {
    setShowModal(false);
    // Reset selections to previous state when modal is closed
    setSelectedState(null); // Reset state selection
    setSelectedCity(null); // Reset city selection
    setCurrentAddress({
      Name: "",
      tradeName: "",
      gstNumber: "",
      panNumber: "",
      phoneNumber: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      isDefault: false,
    });
  };

  // Save address logic for adding or updating
  const handleSaveAddress = async () => {
    try {
      const apiUrl = isEditMode
        ? `/api/shipping/address/update/${currentAddress._id}`
        : `/api/shipping/address/admin/new/${_id}`;

      // console.log(currentAddress);
      const method = isEditMode ? "patch" : "post";

      // Prepare the headers with the token
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // Make the API call with the headers
      await axios[method](apiUrl, currentAddress, { headers });

      swal(
        "Success!",
        `Address ${isEditMode ? "updated" : "added"} successfully!`,
        "success"
      );

      handleCloseModal();
      getUserAddress();
    } catch (error) {
      console.error("Error saving address:", error);
      swal("Error!", "There was an error saving the address.", "error");
    }
  };

  const handleStateChange = (event, newValue) => {
    setSelectedState(newValue);
    setCurrentAddress((prev) => ({
      ...prev,
      state: newValue ? newValue.label : "",
      city: "", // Clear city when state changes
    }));
    setSelectedCity(null); // Reset city selection
    setCityOptions([]); // Clear city options on state change
  };

  const handleCityChange = (event, newValue) => {
    setSelectedCity(newValue);
    setCurrentAddress((prev) => ({
      ...prev,
      city: newValue ? newValue.label : "",
    }));
  };

  // Fetch Shipping address of the individual user
  const getUserAddress = useCallback(async () => {
    try {
      const response = await axios.get(
        `/api/shipping/address/user/address/${_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response.data);
      setUserAllAddress(response.data?.UserShippingAddress || []);

      const defaultAddress =
        response.data?.UserShippingAddress.find(
          (address) => address.isDefault
        ) ||
        response.data?.UserShippingAddress[0] ||
        {};

      // Set the values based on the found default address or the first one
      setGstNumber(defaultAddress.gstNumber || "");
      setPanNumber(defaultAddress.panNumber || "");
      setTradeName(defaultAddress.tradeName || "");
    } catch (error) {
      swal({
        title: "Warning",
        text: error.message,
        icon: "error",
        button: "Close",
        dangerMode: true,
      });
    }
  }, [_id, token]);

  // Fetch Order Count and Total Value
  const getOrdersCount = useCallback(async () => {
    try {
      const response = await axios.get(`/api/single-pd-ordercount/${_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserOrder(response.data);
    } catch (error) {
      swal({
        title: "Warning",
        text: error.message,
        icon: "error",
        button: "Close",
        dangerMode: true,
      });
    }
  }, [_id, token]);

  // Fetch User Details
  const getUserDetails = useCallback(async () => {
    try {
      const response = await axios.get(`/api/v1/admin/user/${_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(response.data);
      setUser(response.data.user);
    } catch (error) {
      swal({
        title: "Warning",
        text: error.message,
        icon: "error",
        button: "Close",
        dangerMode: true,
      });
    }
  }, [_id, token]);

  useEffect(() => {
    getOrdersCount();
    getUserAddress();
    getUserDetails();
  }, [_id, getOrdersCount, getUserAddress, getUserDetails]);
  const handledeleteAddress = async (id) => {
    try {
      const response = await axios.delete(
        `/api/shipping/address/delete/${id}`, // Address ID in the URL
        {
          headers: {
            Authorization: `Bearer ${token}`, // Authorization header
          },
          data: { userId: _id }, // User ID in the request body
        }
      );

      swal({
        title: "Success",
        text: response.data.message,
        icon: "success",
        button: "Close",
      });

      getUserAddress();
    } catch (error) {
      // Handle errors here, ensuring that you access the error message correctly
      swal({
        title: "Warning",
        text: error.response?.data?.message || error.message, // Improved error handling
        icon: "error",
        button: "Close",
        dangerMode: true,
      });
    }
  };

  return (
    <div>
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-flex align-items-center justify-content-between">
            <div style={{ fontSize: "22px" }} className="fw-bold">
              Franchisee All Details
            </div>
            <div className="page-title-right">
              <Link to="/franchisee">
                <Button className="btn btn-danger btn-sm">Back</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="card" style={{ padding: "1rem" }}>
        <h5 style={{ fontWeight: "bold" }}>&bull; Franchisee Profile</h5>
        <div style={{ marginLeft: "1rem", marginTop: "1rem" }}>
          <Typography style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
            Franchisee ID:
            <Typography
              component="span"
              style={{ fontWeight: "normal", marginLeft: "0.5rem" }}
            >
              {user?.uniqueId}
            </Typography>
          </Typography>
          {/* Repeating fields with similar styling and structure */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ flex: 1, paddingRight: "1rem" }}>
              {[
                { label: "Name", value: user?.name },
                { label: "Email", value: user?.email },
                { label: "Mobile Number", value: user?.phone },
              ].map((item, index) => (
                <Typography
                  key={index}
                  style={{ fontWeight: "bold", fontSize: "1.2rem" }}
                >
                  {item.label}:
                  <Typography
                    component="span"
                    style={{ fontWeight: "normal", marginLeft: "0.5rem" }}
                  >
                    {item.value}
                  </Typography>
                </Typography>
              ))}
            </div>
            <div style={{ flex: 1, paddingLeft: "1rem" }}>
              {[
                {
                  label: "Date Registered",
                  value: new Date(user?.createdAt).toLocaleString("en-IN", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  }),
                },
                {
                  label: "Last Purchase",
                  value: userOrder?.lastPurchaseOrderDate
                    ? new Date(userOrder?.lastPurchaseOrderDate).toLocaleString(
                        "en-IN",
                        {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        }
                      )
                    : "No Purchase",
                },
                {
                  label: "Total Orders",
                  value: userOrder?.totalOrders ? userOrder?.totalOrders : 0,
                },
                {
                  label: "Total Spent",
                  value: `₹ ${
                    userOrder?.totalValue ? userOrder?.totalValue : 0
                  }`,
                },
              ].map((item, index) => (
                <Typography
                  key={index}
                  style={{ fontWeight: "bold", fontSize: "1.2rem" }}
                >
                  {item.label}:
                  <Typography
                    component="span"
                    style={{ fontWeight: "normal", marginLeft: "0.5rem" }}
                  >
                    {item.value}
                  </Typography>
                </Typography>
              ))}
            </div>
          </div>
        </div>
        <div style={{ marginTop: "2rem" }}>
          <h5 style={{ fontWeight: "bold", marginBottom: "1rem" }}>
            &bull; Addresses{" "}
          </h5>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 style={{ fontWeight: "bold" }}>
              &bull; Total Addresses: {userAllAddress?.length || 0}{" "}
            </h5>
            <Button
              className="btn btn-primary"
              onClick={() => handleOpenModal()} // Open modal for adding
            >
              Add Address
            </Button>
          </div>
          {userAllAddress?.length > 0 && (
            <div className="table-responsive table-shoot mt-3">
              <table
                className="table table-centered table-nowrap"
                style={{ border: "1px solid" }}
              >
                <thead
                  className="thead-info"
                  style={{ background: "rgb(140, 213, 213)" }}
                >
                  <tr>
                    <th style={{ width: "5%" }}>SL No.</th>
                    <th style={{ width: "20%" }}>Trade Name</th>
                    <th style={{ width: "10%" }}>GST</th>
                    <th style={{ width: "10%" }}>PAN</th>
                    <th style={{ width: "37%" }}>Address</th>
                    <th style={{ width: "7%" }}>Default</th>
                    <th style={{ width: "11%" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {userAllAddress?.map((address, i) => (
                    <tr key={address._id || i}>
                      <td className="text-start">
                        <strong>{i + 1}</strong>
                      </td>
                      <td className="text-start">
                        <strong>
                          {address?.tradeName
                            ? `${address.tradeName}`
                            : "No Trade Name"}
                        </strong>
                      </td>
                      <td className="text-start">
                        <strong>{address.gstNumber}</strong>
                      </td>
                      <td className="text-start">
                        <strong>{address.panNumber}</strong>
                      </td>
                      <td className="text-start">
                        <strong>
                          {address?.Name}-{address?.street}, {address?.city},{" "}
                          {address?.state}, {address?.country},{" "}
                          {address?.postalCode}
                        </strong>
                      </td>
                      <td className="text-center">
                        <strong>{address.isDefault ? "Yes" : "No"}</strong>
                      </td>
                      <td className="text-start">
                        <Button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => handleOpenModal(address)} // Open modal for editing
                        >
                          Edit
                        </Button>
                        <Button
                          className="btn btn-danger btn-sm"
                          onClick={() => handledeleteAddress(address._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* Modal for Adding/Editing Address */}
          <Modal
            show={showModal}
            onHide={handleCloseModal}
            dialogClassName="modal-lg"
          >
            <Modal.Header closeButton>
              <Modal.Title>
                {isEditMode ? "Edit Shipping Address" : "Add Shipping Address"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="container">
                <div className="row">
                  {/* Name and Trade Name */}
                  <div className="col-md-6">
                    <label>Name</label>
                    <input
                      type="text"
                      value={currentAddress?.Name || ""}
                      onChange={(e) =>
                        setCurrentAddress({
                          ...currentAddress,
                          Name: e.target.value,
                        })
                      }
                      className="form-control mb-3"
                      placeholder="Enter name"
                    />
                  </div>
                  <div className="col-md-6">
                    <label>Trade Name</label>
                    <input
                      type="text"
                      value={currentAddress?.tradeName || ""}
                      onChange={(e) =>
                        setCurrentAddress({
                          ...currentAddress,
                          tradeName: e.target.value,
                        })
                      }
                      className="form-control mb-3"
                      placeholder="Enter trade name"
                    />
                  </div>
                </div>

                <div className="row">
                  {/* GST Number and PAN Number */}
                  <div className="col-md-6">
                    <label>GST Number</label>
                    <input
                      type="text"
                      value={currentAddress?.gstNumber || ""}
                      onChange={(e) =>
                        setCurrentAddress({
                          ...currentAddress,
                          gstNumber: e.target.value,
                        })
                      }
                      className="form-control mb-3"
                      placeholder="Enter GST number"
                    />
                  </div>
                  <div className="col-md-6">
                    <label>PAN Number</label>
                    <input
                      type="text"
                      value={currentAddress?.panNumber || ""}
                      onChange={(e) =>
                        setCurrentAddress({
                          ...currentAddress,
                          panNumber: e.target.value,
                        })
                      }
                      className="form-control mb-3"
                      placeholder="Enter PAN number"
                    />
                  </div>
                </div>

                <div className="row">
                  {/* Phone Number and Street */}
                  <div className="col-md-6">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      value={currentAddress?.phoneNumber || ""}
                      onChange={(e) =>
                        setCurrentAddress({
                          ...currentAddress,
                          phoneNumber: e.target.value,
                        })
                      }
                      className="form-control mb-3"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="col-md-6">
                    <label>Street</label>
                    <input
                      type="text"
                      value={currentAddress?.street || ""}
                      onChange={(e) =>
                        setCurrentAddress({
                          ...currentAddress,
                          street: e.target.value,
                        })
                      }
                      className="form-control mb-3"
                      placeholder="Enter street"
                    />
                  </div>
                </div>

                <div className="row">
                  {/* State and City */}
                  <div className="col-md-6">
                    <Autocomplete
                      options={stateOptions}
                      value={selectedState}
                      onChange={handleStateChange}
                      renderInput={(params) => (
                        <TextField {...params} label="Select State" />
                      )}
                    />
                  </div>
                  <div className="col-md-6">
                    <Autocomplete
                      options={cityOptions}
                      value={selectedCity}
                      onChange={handleCityChange}
                      isOptionEqualToValue={(option, value) =>
                        option.value === value.value
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Select City" />
                      )}
                    />
                  </div>
                </div>

                <div className="row">
                  {/* Postal Code and Country */}
                  <div className="col-md-6">
                    <label>Postal Code</label>
                    <input
                      type="text"
                      value={currentAddress?.postalCode || ""}
                      onChange={(e) =>
                        setCurrentAddress({
                          ...currentAddress,
                          postalCode: e.target.value,
                        })
                      }
                      className="form-control mb-3"
                      placeholder="Enter postal code"
                    />
                  </div>
                  <div className="col-md-6">
                    <label>Country</label>
                    <input
                      type="text"
                      disabled
                      value={currentAddress?.country || ""}
                      className="form-control mb-3"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <label>Is Default Address</label>
                    <select
                      className="form-control mb-3"
                      value={currentAddress.isDefault ? "Yes" : "No"}
                      onChange={(e) =>
                        setCurrentAddress({
                          ...currentAddress,
                          isDefault: e.target.value === "Yes", // Convert Yes/No to true/false
                        })
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              {/* <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button> */}
              <Button variant="primary" onClick={handleSaveAddress}>
                Save
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};
export default SinglePrincipalDistributorAllDetails;
