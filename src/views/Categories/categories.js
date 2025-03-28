import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { isAutheticated } from "src/auth";
import {
  Button,
  Box,
  IconButton,
  Modal,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ClipLoader } from "react-spinners";
import swal from "sweetalert";
import { toast } from "react-hot-toast";
import debounce from "lodash.debounce";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "0.5rem",
  boxShadow: 24,
  width: "500px",
};

const Categories = () => {
  const token = isAutheticated();
  const nameRef = useRef();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(true);
  const [saveLoding, setSaveLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [category, setCategory] = useState([]);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [olderCategoryName, setOlderCategoruName] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    // setUpdating(false);
    setEdit(false);

    setCategoryName("");
    setCategoryId("");
  };

  const getCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/category/getCategories", {
        params: {
          // page,
          // show: itemPerPage,
          categoryName: nameRef.current?.value || "",
        }, // Include pagination and search
      });

      if (response.status === 200) {
        setCategory(response?.data?.categories);
      }
    } catch (error) {
      console.error("Failed to fetch brands:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleEditClick = (_id, categoryName) => {
    setOpen(true);
    setCategoryName(categoryName);
    setCategoryId(_id);
    setOlderCategoruName(categoryName);
    setEdit(true);
    // setUpdating(false);
  };

  const handleUpdate = async () => {
    const filteredArrayNames = category
      .filter(
        (item) =>
          item.categoryName.toLowerCase() !== olderCategoryName.toLowerCase()
      )
      .map((item) => item.categoryName.toLowerCase());
    // console.log(filteredArrayNames, "filter");
    if (filteredArrayNames.includes(categoryName.toLowerCase())) {
      swal({
        title: "Warning",
        text: "Category already exists ",
        icon: "error",
        button: "Retry",
        dangerMode: true,
      });
    }
    if (!categoryName) {
      swal({
        title: "Warning",
        text: "Please fill all the  required  fields!",
        icon: "error",
        button: "Retry",
        dangerMode: true,
      });
      return;
    }
    setUpdating(false);
    const formData = new FormData();
    formData.append("categoryName", categoryName);
    try {
      await axios.patch(`/api/category/update/${categoryId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      handleClose();
      toast.success("Category updated successfully");
      getCategories();
    } catch (err) {
      swal({
        title: "",
        text: "Something went wrong!",
        icon: "error",
        button: "Retry",
        dangerMode: true,
      });
    } finally {
      setUpdating(true);
    }
  };

  const handleDelete = (_id) => {
    swal({
      title: "Are you sure?",
      icon: "error",
      buttons: {
        Yes: { text: "Yes", value: true },
        Cancel: { text: "Cancel", value: "cancel" },
      },
    }).then(async (value) => {
      if (value === true) {
        try {
          await axios.delete(`/api/category/delete/${_id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          toast.success("Category deleted successfully");
          getCategories();
        } catch (err) {
          swal({
            title: "",
            text: "Something went wrong!",
            icon: "error",
            button: "Retry",
            dangerMode: true,
          });
        }
      }
    });
  };

  const handleSaveCategory = async () => {
    if (
      category.some(
        (item) => item.categoryName.toLowerCase() === categoryName.toLowerCase()
      )
    ) {
      swal({
        title: "Warning",
        text: "Category already exists ",
        icon: "error",
        button: "Retry",
        dangerMode: true,
      });
      return;
    }
    if (!categoryName) {
      swal({
        title: "Warning",
        text: "Please fill all the  required  fields!",
        icon: "error",
        button: "Retry",
        dangerMode: true,
      });
      return;
    }
    setSaveLoading(false);
    setLoading(true);
    const formData = new FormData();
    formData.append("categoryName", categoryName);
    try {
      await axios.post("/api/category/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/formdata",
        },
      });
      handleClose();
      toast.success("Category added successfully");
      getCategories();
    } catch (err) {
      swal({
        title: "",
        text: "Something went wrong!",
        icon: "error",
        button: "Retry",
        dangerMode: true,
      });
    } finally {
      setSaveLoading(true);
    }
  };
  const getPageCount = () => {
    return Math.max(1, Math.ceil(category.length / itemPerPage));
  };
  const debouncedSearch = useCallback(
    debounce(() => {
      setPage(1);
      getCategories();
    }, 500),
    []
  );

  const handleSearchChange = () => {
    debouncedSearch();
  };
  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div
                className="
                    page-title-box
                    d-flex
                    align-items-center
                    justify-content-between
                  "
              >
                <div style={{ fontSize: "22px" }} className="fw-bold">
                  Categories
                </div>

                <div className="page-title-right">
                  <Button
                    variant="contained"
                    color="primary"
                    style={{
                      fontWeight: "bold",
                      marginBottom: "1rem",
                      textTransform: "capitalize",
                    }}
                    onClick={handleOpen}
                  >
                    Add New Category
                  </Button>
                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      <Box p={2} display={"flex"}>
                        <Typography
                          id="modal-modal-title"
                          variant="body"
                          component="h2"
                          flex={1}
                        >
                          Category Name
                        </Typography>
                        <IconButton onClick={() => handleClose()}>
                          <CloseIcon />
                        </IconButton>
                      </Box>
                      <hr />
                      <TextField
                        placeholder="category name"
                        value={categoryName}
                        fullWidth
                        inputProps={{
                          maxLength: 25,
                        }}
                        style={{
                          padding: "1rem",
                        }}
                        onChange={(e) =>
                          setCategoryName(
                            e.target.value.charAt(0).toUpperCase() +
                              e.target.value.slice(1)
                          )
                        }
                      />
                      {categoryName ? (
                        <>
                          <small className="charLeft mt-2 ml-3 fst-italic">
                            {25 - categoryName.length} characters left
                          </small>
                        </>
                      ) : (
                        <></>
                      )}

                      <Box
                        p={2}
                        display={"flex"}
                        justifyContent={"right"}
                        // width={"500px"}
                      >
                        {!edit && (
                          <button
                            style={{
                              color: "white",
                              marginRight: "1rem",
                            }}
                            onClick={() => handleSaveCategory()}
                            type="button"
                            className="
                                      btn btn-primary btn-sm
                                    waves-effect waves-light
                                    btn-table
                                    mx-1
                                    mt-1
                                  "
                          >
                            <ClipLoader loading={!saveLoding} size={18} />
                            {saveLoding && "Save"}
                          </button>
                        )}
                        {edit && (
                          <button
                            style={{
                              color: "white",
                              marginRight: "1rem",
                            }}
                            onClick={() => handleUpdate()}
                            type="button"
                            className="
                                      btn btn-primary btn-sm
                                    waves-effect waves-light
                                    btn-table
                                    mx-1
                                    mt-1
                                  "
                          >
                            <ClipLoader loading={!updating} size={18} />
                            {updating && "update"}
                          </button>
                        )}
                        <button
                          style={{
                            color: "black",
                            marginRight: "1rem",
                            background: "grey",
                          }}
                          onClick={() => setOpen(false)}
                          type="button"
                          className="
                                      btn  btn-sm
                                    waves-effect waves-light
                                    btn-table
                                    mx-1
                                    mt-1
                                  "
                        >
                          Close
                        </button>
                      </Box>
                    </Box>
                  </Modal>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="row ml-0 mr-0 mb-10">
                    <div className="col-lg-1">
                      <div className="dataTables_length">
                        <label className="w-100">
                          Show
                          <select
                            onChange={(e) => {
                              setItemPerPage(e.target.value);
                              setPage(1);
                            }}
                            className="form-control"
                            disabled={loading}
                          >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                          </select>
                          entries
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <label>Category Name:</label>
                      <input
                        type="text"
                        placeholder="Category name"
                        className="form-control"
                        ref={nameRef}
                        onChange={handleSearchChange}
                        disabled={loading}
                      />
                    </div>
                  </div>

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
                          <th> Category Name</th>

                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!loading && category.length === 0 && (
                          <tr className="text-center">
                            <td colSpan="2">
                              <h5>No Data Available</h5>
                            </td>
                          </tr>
                        )}
                        {loading ? (
                          <tr>
                            <td className="text-center" colSpan="6">
                              Loading...
                            </td>
                          </tr>
                        ) : (
                          category &&
                          category
                          .slice(
                            (`${page}` - 1) * itemPerPage,
                            `${page}` * itemPerPage
                          )
                          .map((item, i) => (
                            <tr key={i}>
                              <td>
                                <h5>{item.categoryName} </h5>
                              </td>
                              <td className="text-start">
                                <button
                                  style={{
                                    color: "white",
                                    marginRight: "1rem",
                                  }}
                                  type="button"
                                  className="
                                      btn btn-primary btn-sm
                                    waves-effect waves-light
                                    btn-table
                                    mx-1
                                    mt-1
                                  "
                                  onClick={() =>
                                    handleEditClick(item._id, item.categoryName)
                                  }
                                >
                                  Edit
                                </button>
                                <button
                                  style={{
                                    color: "white",
                                    marginRight: "1rem",
                                    background: "red",
                                  }}
                                  type="button"
                                  className="
                                      btn  btn-sm
                                    waves-effect waves-light
                                    btn-table
                                    mx-1
                                    mt-1
                                  "
                                  onClick={() => handleDelete(item._id)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ display: "flex", justifyContent: "right" }}>
                    <Pagination
                      style={{ margin: "2rem" }}
                      variant="outlined"
                      size="large"
                      count={getPageCount()}
                      color="primary"
                      onChange={(event, value) => setPage(value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
