import React, { lazy } from "react";
import axios from "axios";
import { useEffect, useState, useCallback, useMemo } from "react";
import { isAutheticated } from "../../auth.js";

const WidgetsDropdown = lazy(() => import("../widgets/WidgetsDropdown.js"));

const Dashboard = () => {
  //1 st
  const [users, setUsers] = useState([]);
  const [salescoordinator, setSalescoordinator] = useState([]);
  const [territorymanager, setTerritorymanager] = useState([]);
  const [retaildistributor, setRetaildistributor] = useState([]);
  const token = isAutheticated();

  const getAllUsers = async () => {
    let res = await axios.get(`/api/v1/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(res.data)
    setUsers(res.data?.total_data);
  };
  // const getAllsalescoordinator = async () => {
  //   let res = await axios.get(`/api/salescoordinator/getAll/`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  //   // console.log(res.data)
  //   setSalescoordinator(res.data.total_data);
  // };

  // const getAllterritorymanager = async () => {
  //   let res = await axios.get(`/api/territorymanager/getAll/`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  //   // console.log(res.data)
  //   setTerritorymanager(res.data.total_data);
  // };
  // const getAllretaildistributor = async () => {
  //   let res = await axios.get(`/api/getAllRD`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  //   // console.log(res.data)
  //   setRetaildistributor(res.data.total_data);
  // };
  //2nd
  const [category, setCategory] = useState(null);
  const getAllCategory = async () => {
    let res = await axios.get(`/api/category/getCategories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(res.data);
    setCategory(res?.data?.total_data);
  };
  // //3rd
  const [product, setProduct] = useState(null);
  const getAllProduct = async () => {
    let res = await axios.get(`/api/product/getAll/user/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(res.data);
    setProduct(res?.data?.total_data);
  };
  const [Brand, setBrand] = useState(null);
  const getAllBrands = async () => {
    let res = await axios.get(`/api/brand/getBrands`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(res.data);
    setBrand(res?.data?.total_data);
  };
  // // 3rd
  // const [Requests, setRequests] = useState([]);
  // const getAllRequests = async () => {
  //   let res = await axios.get(`/api/contact/request/getAll/`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  //   // console.log(res.data);
  //   setRequests(res.data.contactRequest);
  // };

  // //3 requiment
  // const [requirement, setRequirement] = useState([])
  // // console.log(token)
  // const getRequirement = useCallback(async () => {
  //   let res = await axios.get(
  //     `/api/requirement/getAll`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );

  //   setRequirement(res.data.Requirement)

  // }, [token]);
  // //4 news
  // const [news, setNews] = useState([])

  // const getNews = useCallback(async () => {
  //   let res = await axios.get(
  //     `/api/news/getAll`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );

  //   setNews(res.data.news)

  // }, [token]);
  // //5 offers
  // const [offer, setOffer] = useState([])

  // const getOffer = useCallback(async () => {
  //   let res = await axios.get(
  //     `/api/offer/getAll`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );
  //   // console.log(res.data)
  //   setOffer(res.data.offer)

  // }, [token]);
  // //6 event
  // const [event, setEvent] = useState([])
  // const getEvent = useCallback(async () => {
  //   let res = await axios.get(
  //     `/api/event/getAll`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );
  //   // console.log(res.data)
  //   setEvent(res.data.Event)

  // }, [token]);
  useEffect(() => {
    getAllUsers();

    getAllCategory();
    getAllProduct();
    getAllBrands();
    // getAllRequests();
  }, [token]);
  return (
    <>
      <WidgetsDropdown
        users={users}
        salescoordinator={salescoordinator}
        territorymanager={territorymanager}
        retaildistributor={retaildistributor}
        category={category}
        product={product}
        Brand={Brand}
      />
    </>
  );
};

export default Dashboard;
