import React from "react";
import CIcon from "@coreui/icons-react";
import {
  cibMaterialDesign,
  cilAddressBook,
  cilAppsSettings,
  cilBrush,
  cilCart,
  cilCat,
  cilClipboard,
  cilCommand,
  cilCompress,
  cilContact,
  cilImage,
  cilLanguage,
  cilLoopCircular,
  cilMedicalCross,
  cilNotes,
  cilSpeedometer,
  cilSwapHorizontal,
  cilTablet,
  cilTennisBall,
  cilText,
  cilUser,
  cilAlarm,
  cilFeaturedPlaylist,
  cilLocationPin,
  cilSettings,
  cilMoney,
  cilBell,
  cilViewModule,
  cilHistory,
} from "@coreui/icons";
import { CNavGroup, CNavItem, CNavTitle, CTabContent } from "@coreui/react";

const _nav = [
  {
    component: CNavItem,
    name: "Dashboard",
    to: "/dashboard",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    group: "",
  },
  {
    component: CNavGroup,
    name: "Product Management",
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
    group: "",

    items: [
      {
        component: CNavItem,
        name: "Categories",
        icon: <CIcon icon={cilCat} customClassName="nav-icon" />,
        to: "/categories",
        group: "Product Management",
      },
      {
        component: CNavItem,
        name: "Brands",
        icon: <CIcon icon={cilCat} customClassName="nav-icon" />,
        to: "/brands",
        group: "Product Management",
      },
      {
        component: CNavItem,
        name: "Products",
        icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
        to: "/products",
        group: "Product Management",
      },
    ],
  },
  {
    component: CNavItem,
    name: "ProductManual",
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
    to: "/product-manual",
    group: "Product Management",
  },
  {
    component: CNavItem,
    name: "Franchisee",
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    to: "/franchisee",
    group: "Franchisee",
  },

  // {
  //   component: CNavItem,
  //   name: "Tasks",
  //   icon: <CIcon icon={cilAlarm} customClassName="nav-icon" />,
  //   to: "/task/today",
  //   group: "Tasks",
  // },

  // {
  //   component: CNavGroup,
  //   name: "Reports",
  //   icon: <CIcon icon={cilTablet} customClassName="nav-icon" />,
  //   group: "",

  //   items: [
  //     {
  //       component: CNavItem,
  //       name: "Opening Inventory",
  //       icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
  //       to: "/reports/opening-inventory",
  //       group: "Reports",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Stock",
  //       icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
  //       to: "/reports/stock",
  //       group: "Reports",
  //     },
  //   ],
  // },
  {
    component: CNavGroup,
    name: "Franchisee Orders",
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
    group: "",

    items: [
      {
        component: CNavItem,
        name: "New",
        icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
        to: "/orders/new",
        group: "Orders",
      },
      {
        component: CNavItem,
        name: "Pending",
        icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
        to: "/orders/Pending",
        group: "Orders",
      },
      // {
      //   component: CNavItem,
      //   name: "Paid",
      //   icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
      //   to: "/orders/returned",
      // },
      {
        component: CNavItem,
        name: "Processing",
        icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
        to: "/orders/processing",
        group: "Orders",
      },
      {
        component: CNavItem,
        name: "Dispatched",
        icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
        to: "/orders/dispatched",
        group: "Orders",
      },
      {
        component: CNavItem,
        name: "Delivered",
        icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
        to: "/orders/delivered",
        group: "Orders",
      },
      {
        component: CNavItem,
        name: "Cancelled",
        icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
        to: "/orders/cancelled",
        group: "Orders",
      },

      // {
      //   component: CNavItem,
      //   name: "In Store Cash Orders",
      //   icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
      //   to: "/inStoreCashOrders/new",
      //   group: "Orders",
      // },
      // {
      //   component: CNavItem,
      //   name: "In Store QRCode Orders",
      //   icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
      //   to: "/InStoreQRCodeOrders/new",
      //   group: "Orders",
      // },
    ],
  },
  {
    component: CNavItem,
    name: "Announcement",
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
    to: "/announcement",
    group: "Annoucement",
  },

  {
    component: CNavGroup,
    name: "Menu",
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    group: "Menu",

    items: [
      {
        component: CNavItem,
        name: "Menu Item",
        icon: <CIcon icon={cilViewModule} customClassName="nav-icon" />,
        to: "/menu",
        group: "Menu",
      },

      {
        component: CNavItem,
        name: "Menu category",
        icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
        to: "/menu-categories",
        group: "Menu",
      },
    ],
  },
  {
    component: CNavItem,
    name: "Customer orders",
    icon: <CIcon icon={cilHistory} customClassName="nav-icon" />,
    to: "/order-history",
    group: "Customer orders",
  },
  {
    component: CNavGroup,
    name: "Settings",
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    group: "",

    items: [
      {
        component: CNavItem,
        name: "Transporter",
        icon: <CIcon icon={cilCompress} customClassName="nav-icon" />,
        to: "/transporter",
        group: "Transporter",
      },

      // {
      //   component: CNavItem,
      //   name: "SEO and Analytics",
      //   icon: <CIcon icon={cilContact} customClassName="nav-icon" />,
      //   to: "/seo/request/new",
      //   group: "Website Related",
      // },

      // {
      //   component: CNavItem,
      //   name: "Content ",
      //   icon: <CIcon icon={cilText} customClassName="nav-icon" />,
      //   to: "/content",
      //   group: "Settings",
      // },
      // {
      //   component: CNavItem,
      //   name: "Social Media",
      //   icon: <CIcon icon={cilMedicalCross} customClassName="nav-icon" />,
      //   to: "/socialmedia",
      //   group: "Settings",
      // },
      {
        component: CNavItem,
        name: "Currency",
        icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
        to: "/currency",
        group: "Settings",
      },
      {
        component: CNavItem,
        name: "Application Name",
        icon: <CIcon icon={cilText} customClassName="nav-icon" />,
        to: "/application/name",
        group: "Settings",
      },

      {
        component: CNavItem,
        name: "Address",
        icon: <CIcon icon={cilAddressBook} customClassName="nav-icon" />,
        to: "/address",
        group: "Settings",
      },
      {
        component: CNavItem,
        name: "Logos",
        icon: <CIcon icon={cilCommand} customClassName="nav-icon" />,
        to: "/logo",
        group: "Settings",
      },
      // {
      //   component: CNavItem,
      //   name: "Copyright Message",
      //   icon: <CIcon icon={cilText} customClassName="nav-icon" />,
      //   to: "/copyright/message",
      //   group: "Settings",
      // },
    ],
  },
  // {
  //   component: CNavGroup,
  //   name: "Configuration",
  //   icon: <CIcon icon={cilAppsSettings} customClassName="nav-icon" />,
  //   group: "",

  //   items: [

  //   ],
  // },
  //Affiliate start
  // {
  //   component: CNavGroup,
  //   name: "Affiliate & Coupons",
  //   icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
  //   group: "",

  //   items: [
  //     {
  //       component: CNavItem,
  //       name: "Coupons",
  //       icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  //       to: "/affiliate/coupons",
  //       group: "Affiliate & Coupons",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Affiliates",
  //       icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  //       to: "/affiliate/affiliates",
  //       group: "Affiliate & Coupons",
  //     },
  //   ],
  // },
  // //Affiliate end
  //Blog start
  // {
  //   component: CNavItem,
  //   name: "Blog",
  //   icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  //   to: "/blogs",
  //   group: "Blog",
  // },
  // // Employee
  // {
  //   component: CNavItem,
  //   name: "Employees & Access",
  //   icon: <CIcon icon={cilImage} customClassName="nav-icon" />,
  //   to: "/employee",
  //   group: "Employees & Access",
  // },
  // {
  //   component: CNavGroup,
  //   name: "Blog",
  //   icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: "Blog",
  //       icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  //       to: "/blogs",
  //     },
  //   ],
  // },
];

export default _nav;
