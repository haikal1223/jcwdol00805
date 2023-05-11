import {
  Button,
  Text,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Spacer,
  Td,
  Box,
  Flex,
  VStack,
  HStack,
  Heading,
  Input,
  InputGroup,
  Select,
  IconButton,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../components/sidebar";
import axios from "axios";
import { ViewIcon, ViewOffIcon, Search2Icon } from "@chakra-ui/icons";
import {
  TbChevronLeft,
  TbChevronRight,
  TbChevronsLeft,
  TbChevronsRight,
} from "react-icons/tb";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";

const AdminUser = () => {
  const [allSalesMode, setAllSalesMode] = useState(true);
  const [categorySalesMode, setCategorySalesMode] = useState(false);
  const [productSalesMode, setProductSalesMode] = useState(false);
  const [salesTitle, setSalesTitle] = useState("Sales Report");
  const today = new Date();
  const lastMonth = new Date();
  const lastTwoMonth = new Date();
  lastMonth.setDate(today.getDate() - 30);
  lastTwoMonth.setDate(today.getDate() - 60);

  const [whList, setWhList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [allStats, setAllStats] = useState([]);
  const [localWarehouseAdminName, setLocalWarehouseAdminName] = useState("");
  const [localWarehouseAdminId, setLocalWarehouseAdminId] = useState("");
  const [adminType, setAdminType] = useState("");
  const [adminId, setAdminId] = useState("");

  const [productStockData, setProductStockData] = useState([]);
  const [stockLogData, setStockLogData] = useState([]);
  const [warehouseId, setWarehouseId] = useState(null);
  const [productId, setProductId] = useState(null);
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [loading, setLoading] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [pageAdmin, setPageAdmin] = useState(1);
  const [maxPageAdmin, setMaxPageAdmin] = useState(0);
  const [pageUser, setPageUser] = useState(1);
  const [maxPageUser, setMaxPageUser] = useState(0);
  const rowPerPage = 10;
  const [productStockMode, setProductStockMode] = useState(false);
  const [detailProductStockMode, setDetailProductStockMode] = useState(false);

  const [filter, setFilter] = useState({
    searchProductName: "",
    filterCategory: "",
    filterWarehouse: "",
  });
  const [sort, setSort] = useState({
    sortBy: "",
  });
  const [sortMode, setSortMode] = useState("ASC");

  let getWarehouse = async () => {
    try {
      let getWarehouse = await axios.get(
        `http://localhost:8000/admin/adminWarehouse`
      );
      setWhList(getWarehouse.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  let adminLoginType = async () => {
    try {
      const adminToken = Cookies.get("adminToken");
      let adminLoginType = await axios.get(
        `http://localhost:8000/admin/admin-type?token=${adminToken}`
      );
      setAdminType(adminLoginType.data.data.adminData.role);
      setAdminId(adminLoginType.data.data.adminData.id);
    } catch (error) {
      console.log(error.message);
    }
  };

  let localWarehouse = async () => {
    try {
      if (adminType === "wh_admin") {
        let localWarehouse = await axios.get(
          `http://localhost:8000/admin/local-admin?id=${adminId}`
        );
        setLocalWarehouseAdminName(
          localWarehouse.data.data.localAdmin.warehouse.name
        );
        setFilter({
          ...filter,
          ["filterWarehouse"]: localWarehouse.data.data.localAdmin.warehouse.id,
        });
      }
    } catch (error) {}
  };

  let getProductCategory = async () => {
    try {
      let getProductCategory = await axios.get(
        `http://localhost:8000/product/productCategory`
      );
      setCategoryList(getProductCategory.data.data);
    } catch (error) {}
  };

  let getProductByCategory = async () => {
    try {
      let getProductByCategory = await axios.get(
        `http://localhost:8000/product/product-list?id=${filter.filterCategory}&&sortMode=${sortMode}&name=${filter.searchProductName}`
      );
      setProductList(getProductByCategory.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Get Stats
  let getAllStats = async () => {
    try {
      let getAllStats = await axios.get(
        `http://localhost:8000/admin/admin-all-stats?dateNow=${today}&dateLastMonth=${lastMonth}&dateLastTwoMonth=${lastTwoMonth}&warehouseId=${filter.filterWarehouse}`
      );
      setAllStats(getAllStats.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchWarehouses = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("adminToken");
      const response = await axios.get(
        "http://localhost:8000/admin/warehouses",
        {
          headers: { token },
        }
      );
      setWarehouses(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/admin/products");
      setProducts(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const fetchStockLog = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("adminToken");
      const response = await axios.get(
        "http://localhost:8000/admin/detail-report",
        {
          params: {
            product_id: productId,
            warehouse_id: warehouseId,
            month,
            year,
          },
          headers: { token },
        }
      );
      setStockLogData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const fetchProductStockData = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("adminToken");
      const response = await axios.get(
        "http://localhost:8000/admin/sum-report",
        {
          params: { warehouse_id: warehouseId, month, year },
          headers: { token },
        }
      );
      setProductStockData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleProductChange2 = (event) => {
    setProductId(event.target.value);
  };

  const handleWarehouseChange2 = (event) => {
    setWarehouseId(event.target.value);
  };

  const handleMonthChange2 = (event) => {
    setMonth(event.target.value);
  };

  const handleYearChange2 = (event) => {
    setYear(event.target.value);
  };

  const handleWarehouseChange = (event) => {
    setWarehouseId(event.target.value);
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const nextPageHandler = () => {
    if (pageAdmin < maxPageAdmin) {
      setPageAdmin(pageAdmin + 1);
    }
    if (pageUser < maxPageUser) {
      setPageUser(pageUser + 1);
    }
  };
  const prevPageHandler = () => {
    if (pageAdmin > 1) {
      setPageAdmin(pageAdmin - 1);
    }
    if (pageUser > 1) {
      setPageUser(pageUser - 1);
    }
  };
  const firstPageHandler = () => {
    if (pageAdmin > 1) {
      setPageAdmin(1);
    }
    if (pageUser > 1) {
      setPageUser(1);
    }
  };
  const maxPageHandler = () => {
    if (pageAdmin < maxPageAdmin) {
      setPageAdmin(maxPageAdmin);
    }
    if (pageUser < maxPageUser) {
      setPageUser(maxPageUser);
    }
  };

  useEffect(() => {
    fetchWarehouses();
    fetchProducts();
    fetchStockLog();
  }, []);

  useEffect(() => {
    getWarehouse();
    getProductCategory();
    getProductByCategory();
    getAllStats();
    adminLoginType();
  }, []);

  useEffect(() => {
    getProductByCategory();
    getAllStats();
  }, [filter, sortMode]);

  useEffect(() => {
    localWarehouse();
  }, [adminType]);

  let percentNumberOrder = () => {
    return (
      (allStats.findOrderThisMonth?.length -
        allStats.findOrderLastMonth?.length) /
      allStats.findOrderLastMonth?.length
    );
  };

  let percentNumberProduct = () => {
    return (
      (renderQuantity(allStats.findOrderDetailThisMonth) -
        renderQuantity(allStats.findOrderDetailLastMonth)) /
      renderQuantity(allStats.findOrderDetailLastMonth)
    );
  };

  let percentRevenue = () => {
    return (
      (renderRevenue(allStats.findOrderDetailThisMonth) -
        renderRevenue(allStats.findOrderDetailLastMonth)) /
      renderRevenue(allStats.findOrderDetailLastMonth)
    );
  };

  let renderQuantity = (arrayOrderDetail) => {
    let totalQuantity = 0;

    arrayOrderDetail?.forEach((item) => {
      totalQuantity += item.product_quantity;
    });

    return totalQuantity;
  };

  let renderRevenue = (arrayOrderDetail) => {
    let totalRevenue = 0;

    arrayOrderDetail?.forEach((item) => {
      totalRevenue += item.subtotal;
    });

    return totalRevenue;
  };

  let renderQuantityByCategory = (arrayOrderDetail, categoryId) => {
    let totalQuantity = 0;

    arrayOrderDetail?.forEach((item) => {
      if (item.product?.product_category_id === categoryId) {
        totalQuantity += item.product_quantity;
      }
    });

    return totalQuantity;
  };

  let renderRevenueByCategory = (arrayOrderDetail, categoryId) => {
    let totalRevenue = 0;

    arrayOrderDetail?.forEach((item) => {
      if (item.product.product_category_id === categoryId) {
        totalRevenue += item.subtotal;
      }
    });

    return totalRevenue;
  };

  let renderQuantityByProduct = (arrayOrderDetail, productId) => {
    let totalQuantity = 0;

    arrayOrderDetail?.forEach((item) => {
      if (item.product_id === productId) {
        totalQuantity += item.product_quantity;
      }
    });

    return totalQuantity;
  };

  let renderRevenueByProduct = (arrayOrderDetail, productId) => {
    let totalRevenue = 0;

    arrayOrderDetail?.forEach((item) => {
      if (item.product_id === productId) {
        totalRevenue += item.subtotal;
      }
    });

    return totalRevenue;
  };

  let percentNumberProductByCategory = (val) => {
    return (
      (renderQuantityByCategory(allStats.findOrderDetailThisMonth, val) -
        renderQuantityByCategory(allStats.findOrderDetailLastMonth, val)) /
      renderQuantityByCategory(allStats.findOrderDetailLastMonth, val)
    );
  };

  let percentRevenueByCategory = (val) => {
    return (
      (renderRevenueByCategory(allStats.findOrderDetailThisMonth, val) -
        renderRevenueByCategory(allStats.findOrderDetailLastMonth, val)) /
      renderRevenueByCategory(allStats.findOrderDetailLastMonth, val)
    );
  };

  let percentNumberProductByProduct = (val) => {
    return (
      (renderQuantityByProduct(allStats.findOrderDetailThisMonth, val) -
        renderQuantityByProduct(allStats.findOrderDetailLastMonth, val)) /
      renderQuantityByProduct(allStats.findOrderDetailLastMonth, val)
    );
  };

  let percentRevenueByProduct = (val) => {
    return (
      (renderRevenueByProduct(allStats.findOrderDetailThisMonth, val) -
        renderRevenueByProduct(allStats.findOrderDetailLastMonth, val)) /
      renderRevenueByProduct(allStats.findOrderDetailLastMonth, val)
    );
  };

  let renderCategoryDashboard = () => {
    return categoryList.map((val, idx) => {
      return (
        <>
          <Text
            fontSize={24}
            fontWeight={500}
            className="bg-purple text-white py-2 px-4"
          >
            {val.category_name}
          </Text>
          <StatGroup className="pb-8">
            <Stat>
              <StatLabel>Number of Product Sold</StatLabel>
              <StatNumber>
                {renderQuantityByCategory(
                  allStats.findOrderDetailThisMonth,
                  val.id
                )}
              </StatNumber>
              <StatHelpText>
                {renderQuantityByCategory(
                  allStats.findOrderDetailLastMonth,
                  val.id
                ) === 0 ? (
                  <>
                    <StatArrow type="increase" />
                    No Data Last Month
                  </>
                ) : percentNumberProductByCategory(val.id) >= 0 ? (
                  <>
                    <StatArrow type="increase" />
                    {`${(percentNumberProductByCategory(val.id) * 100).toFixed(
                      2
                    )}%`}
                  </>
                ) : (
                  <>
                    <StatArrow type="decrease" />
                    {`${(percentNumberProductByCategory(val.id) * 100).toFixed(
                      2
                    )}%`}
                  </>
                )}
              </StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Total Revenue</StatLabel>
              <StatNumber>
                Rp
                {renderRevenueByCategory(
                  allStats.findOrderDetailThisMonth,
                  val.id
                ).toLocaleString("id-ID", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </StatNumber>
              <StatHelpText>
                {renderRevenueByCategory(
                  allStats.findOrderDetailLastMonth,
                  val.id
                ) === 0 ? (
                  <>
                    <StatArrow type="increase" />
                    No Data Last Month
                  </>
                ) : percentRevenueByCategory(val.id) >= 0 ? (
                  <>
                    <StatArrow type="increase" />
                    {`${(percentRevenueByCategory(val.id) * 100).toFixed(2)}%`}
                  </>
                ) : (
                  <>
                    <StatArrow type="decrease" />
                    {`${(percentRevenueByCategory(val.id) * 100).toFixed(2)}%`}
                  </>
                )}
              </StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Average Revenue per Product</StatLabel>
              {renderQuantityByCategory(
                allStats.findOrderDetailThisMonth,
                val.id
              ) === 0 ? (
                <>
                  <StatNumber>Rp0,00</StatNumber>
                </>
              ) : (
                <>
                  <StatNumber>
                    Rp
                    {(
                      renderRevenueByCategory(
                        allStats.findOrderDetailThisMonth,
                        val.id
                      ) /
                      renderQuantityByCategory(
                        allStats.findOrderDetailThisMonth,
                        val.id
                      )
                    ).toLocaleString("id-ID", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </StatNumber>
                </>
              )}
              <StatHelpText></StatHelpText>
            </Stat>
          </StatGroup>
        </>
      );
    });
  };

  let renderProductDashboard = () => {
    return productList.map((val, idx) => {
      return (
        <>
          <Text
            fontSize={24}
            fontWeight={500}
            className="bg-purple text-white py-2 px-4"
          >
            {`${val.name} (#${val.id})`}
          </Text>
          <StatGroup className="pb-8">
            <Stat>
              <StatLabel>Number of Product Sold</StatLabel>
              <StatNumber>
                {renderQuantityByProduct(
                  allStats.findOrderDetailThisMonth,
                  val.id
                )}
              </StatNumber>
              <StatHelpText>
                {renderQuantityByProduct(
                  allStats.findOrderDetailLastMonth,
                  val.id
                ) === 0 ? (
                  <>
                    <StatArrow type="increase" />
                    No Data Last Month
                  </>
                ) : percentNumberProductByProduct(val.id) >= 0 ? (
                  <>
                    <StatArrow type="increase" />
                    {`${(percentNumberProductByProduct(val.id) * 100).toFixed(
                      2
                    )}%`}
                  </>
                ) : (
                  <>
                    <StatArrow type="decrease" />
                    {`${(percentNumberProductByProduct(val.id) * 100).toFixed(
                      2
                    )}%`}
                  </>
                )}
              </StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Total Revenue</StatLabel>
              <StatNumber>
                Rp
                {renderRevenueByProduct(
                  allStats.findOrderDetailThisMonth,
                  val.id
                ).toLocaleString("id-ID", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </StatNumber>
              <StatHelpText>
                {renderRevenueByProduct(
                  allStats.findOrderDetailLastMonth,
                  val.id
                ) === 0 ? (
                  <>
                    <StatArrow type="increase" />
                    No Data Last Month
                  </>
                ) : percentRevenueByProduct(val.id) >= 0 ? (
                  <>
                    <StatArrow type="increase" />
                    {`${(percentRevenueByProduct(val.id) * 100).toFixed(2)}%`}
                  </>
                ) : (
                  <>
                    <StatArrow type="decrease" />
                    {`${(percentRevenueByProduct(val.id) * 100).toFixed(2)}%`}
                  </>
                )}
              </StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Average Revenue per Product</StatLabel>
              {renderQuantityByProduct(
                allStats.findOrderDetailThisMonth,
                val.id
              ) === 0 ? (
                <>
                  <StatNumber>Rp0,00</StatNumber>
                </>
              ) : (
                <>
                  <StatNumber>
                    Rp
                    {(
                      renderRevenueByProduct(
                        allStats.findOrderDetailThisMonth,
                        val.id
                      ) /
                      renderQuantityByProduct(
                        allStats.findOrderDetailThisMonth,
                        val.id
                      )
                    ).toLocaleString("id-ID", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </StatNumber>
                </>
              )}
              <StatHelpText></StatHelpText>
            </Stat>
          </StatGroup>
        </>
      );
    });
  };

  const searchInputHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFilter({
      ...filter,
      [name]: value,
    });
  };

  const sortHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setSort({
      ...sort,
      [name]: value,
    });
    console.log(sort);
  };

  const changeSort = () => {
    if (sortMode === "ASC") {
      setSortMode("DESC");
    } else {
      setSortMode("ASC");
    }
  };

  const whOptions = [...new Set(whList.map((val) => val.name))];
  const categoryOptions = [
    ...new Set(categoryList.map((val) => val.category_name)),
  ];

  // Change Mode of Sales Report

  let changeAllMode = () => {
    setAllSalesMode(true);
    setCategorySalesMode(false);
    setProductSalesMode(false);
    setProductStockMode(false);
    setDetailProductStockMode(false);
    setSalesTitle("Sales Report");
  };

  let changeCategoryMode = () => {
    setAllSalesMode(false);
    setCategorySalesMode(true);
    setProductSalesMode(false);
    setProductStockMode(false);
    setDetailProductStockMode(false);
    setSalesTitle("Sales Report by Product Category");
  };

  let changeProductMode = () => {
    setAllSalesMode(false);
    setCategorySalesMode(false);
    setProductSalesMode(true);
    setProductStockMode(false);
    setDetailProductStockMode(false);
    setSalesTitle("Sales Report by Product");
  };

  let changeProductStockMode = () => {
    setAllSalesMode(false);
    setCategorySalesMode(false);
    setProductSalesMode(false);
    setProductStockMode(true);
    setDetailProductStockMode(false);
    setSalesTitle("Product Stock History Report");
  };

  let changeDetailProductMode = () => {
    setAllSalesMode(false);
    setCategorySalesMode(false);
    setProductSalesMode(false);
    setProductStockMode(false);
    setDetailProductStockMode(true);
    setSalesTitle("Detail Product Report");
  };

  return (
    <>
      <div className="w-[100%]">
        <div className="w-[100%] flex flex-1 justify-between">
          <Sidebar />
          <div className="bg-white w-[1240px] h-auto z-0 shadow-inner flex flex-col overflow-auto py-[40px] pl-[50px]">
            <div className="w-[1140px] h-auto">
              <div className="w-full h-full">
                <VStack align={["left"]} w="full" className="font-ibmFont">
                  <Text
                    fontSize={30}
                    fontWeight={500}
                    borderBottom="2px"
                    borderColor="black"
                  >
                    <span className="text-purple">Admin</span>
                    <span> Dashboard</span>
                  </Text>
                  <HStack justifyContent={"space-between"}>
                    <div className="w-auto flex justify-between items-center my-7">
                      <Text
                        w={"auto"}
                        className="mr-1 font-ibmMed"
                        fontSize={18}
                        fontWeight={500}
                      >
                        Warehouse:
                      </Text>
                      {adminType === "admin" ? (
                        <>
                          <Select
                            w={"180px"}
                            name="filterWarehouse"
                            placeholder="All warehouse"
                            color={"gray"}
                            onChange={searchInputHandler}
                          >
                            {whList.map((val, idx) => {
                              return (
                                <option value={val.id} key={idx}>
                                  {val.name}
                                </option>
                              );
                            })}
                          </Select>
                        </>
                      ) : (
                        <>
                          <Text
                            w={"auto"}
                            className="mr-1 font-ibmMed"
                            fontSize={18}
                            fontWeight={500}
                          >
                            {localWarehouseAdminName}
                          </Text>
                        </>
                      )}
                    </div>
                  </HStack>
                  <HStack>
                    {allSalesMode ? (
                      <>
                        <Button bg="#5D5FEF" color="white" size="lg">
                          Sales Report
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="lg"
                          variant="outline"
                          color="#5D5FEF"
                          borderColor="#5D5FEF"
                          onClick={changeAllMode}
                        >
                          Sales Report
                        </Button>
                      </>
                    )}
                    {categorySalesMode ? (
                      <>
                        <Button bg="#5D5FEF" color="white" size="lg">
                          Sales Report by Product Category
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="lg"
                          variant="outline"
                          color="#5D5FEF"
                          borderColor="#5D5FEF"
                          onClick={changeCategoryMode}
                        >
                          Sales Report by Product Category
                        </Button>
                      </>
                    )}

                    {productSalesMode ? (
                      <>
                        <Button bg="#5D5FEF" color="white" size="lg">
                          Sales Report by Product
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="lg"
                          variant="outline"
                          color="#5D5FEF"
                          borderColor="#5D5FEF"
                          onClick={changeProductMode}
                        >
                          Sales Report by Product
                        </Button>
                      </>
                    )}
                    {productStockMode ? (
                      <>
                        <Button bg="#5D5FEF" color="white" size="lg">
                          Product Stock Report
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="lg"
                          variant="outline"
                          color="#5D5FEF"
                          borderColor="#5D5FEF"
                          onClick={changeProductStockMode}
                        >
                          Product Stock Report
                        </Button>
                      </>
                    )}
                    {detailProductStockMode ? (
                      <>
                        <Button bg="#5D5FEF" color="white" size="lg">
                          Detail Product Report
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="lg"
                          variant="outline"
                          color="#5D5FEF"
                          borderColor="#5D5FEF"
                          onClick={changeDetailProductMode}
                        >
                          Detail Product Report
                        </Button>
                      </>
                    )}
                  </HStack>
                  <Text fontSize={24} fontWeight={500} className="pt-4">
                    {salesTitle}
                  </Text>
                  <Text fontSize={20} fontWeight={500} className="py-4">
                    {`${lastMonth.toUTCString().slice(5, 16)} - ${today
                      .toUTCString()
                      .slice(5, 16)} (last 30 days)`}
                  </Text>
                  {allSalesMode ? (
                    <>
                      <StatGroup>
                        <Stat>
                          <StatLabel>Number of Order</StatLabel>
                          <StatNumber>
                            {allStats.findOrderThisMonth?.length}
                          </StatNumber>
                          <StatHelpText>
                            {percentNumberOrder() >= 0 ? (
                              <>
                                <StatArrow type="increase" />
                                {`${(percentNumberOrder() * 100).toFixed(2)}%`}
                              </>
                            ) : (
                              <>
                                <StatArrow type="decrease" />
                                {`${(percentNumberOrder() * 100).toFixed(2)}%`}
                              </>
                            )}
                          </StatHelpText>
                        </Stat>
                        <Stat>
                          <StatLabel>Number of Product Sold</StatLabel>
                          <StatNumber>
                            {renderQuantity(allStats.findOrderDetailThisMonth)}
                          </StatNumber>
                          <StatHelpText>
                            {percentNumberProduct() >= 0 ? (
                              <>
                                <StatArrow type="increase" />
                                {`${(percentNumberProduct() * 100).toFixed(
                                  2
                                )}%`}
                              </>
                            ) : (
                              <>
                                <StatArrow type="decrease" />
                                {`${(percentNumberProduct() * 100).toFixed(
                                  2
                                )}%`}
                              </>
                            )}
                          </StatHelpText>
                        </Stat>
                        <Stat>
                          <StatLabel>Total Revenue</StatLabel>
                          <StatNumber>
                            {`Rp${renderRevenue(
                              allStats.findOrderDetailThisMonth
                            ).toLocaleString("id-ID", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}`}
                          </StatNumber>
                          <StatHelpText>
                            {percentRevenue() >= 0 ? (
                              <>
                                <StatArrow type="increase" />
                                {`${(percentRevenue() * 100).toFixed(2)}%`}
                              </>
                            ) : (
                              <>
                                <StatArrow type="increase" />
                                {`${(percentRevenue() * 100).toFixed(2)}%`}
                              </>
                            )}
                          </StatHelpText>
                        </Stat>
                      </StatGroup>
                      <StatGroup>
                        <Stat>
                          <StatLabel>Average Revenue per Order</StatLabel>
                          <StatNumber>
                            {`Rp${(
                              renderRevenue(allStats.findOrderDetailThisMonth) /
                              allStats.findOrderThisMonth?.length
                            ).toLocaleString("id-ID", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}`}
                          </StatNumber>
                          <StatHelpText></StatHelpText>
                        </Stat>
                        <Stat>
                          <StatLabel>Average Revenue per Product</StatLabel>
                          <StatNumber>
                            {`Rp${(
                              renderRevenue(allStats.findOrderDetailThisMonth) /
                              renderQuantity(allStats.findOrderDetailThisMonth)
                            ).toLocaleString("id-ID", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}`}
                          </StatNumber>
                          <StatHelpText></StatHelpText>
                        </Stat>
                        <Stat>
                          <StatLabel></StatLabel>
                          <StatNumber></StatNumber>
                          <StatHelpText></StatHelpText>
                        </Stat>
                      </StatGroup>
                    </>
                  ) : productStockMode ? (
                    <>
                      <div className="w-[100%] flex flex-1 justify-between">
                        <div className=" w-[1240px] h-auto z-0 shadow-inner flex flex-col py-[40px] px-[50px]">
                          <div className="w-[1140px] flex justify-center items-start overflow-auto "></div>
                          <div className="flex justify-center"></div>
                          <Box>
                            <Flex align="center">
                              <Spacer />
                              <VStack spacing={4} alignItems="flex-end">
                                <Select
                                  placeholder="Select Warehouse"
                                  onChange={handleWarehouseChange}
                                >
                                  {warehouses.map((warehouse) => (
                                    <option
                                      key={warehouse.id}
                                      value={warehouse.id}
                                    >
                                      {warehouse.name}
                                    </option>
                                  ))}
                                </Select>
                                <Flex align="center">
                                  <Select
                                    placeholder="Month"
                                    onChange={handleMonthChange}
                                    mr={2}
                                  >
                                    <option value="01">January</option>
                                    <option value="02">February</option>
                                    <option value="03">March</option>
                                    <option value="04">April</option>
                                    <option value="05">May</option>
                                    <option value="06">June</option>
                                    <option value="07">July</option>
                                    <option value="08">August</option>
                                    <option value="09">September</option>
                                    <option value="10">October</option>
                                    <option value="11">November</option>
                                    <option value="12">December</option>
                                  </Select>
                                  <Select
                                    placeholder="Year"
                                    onChange={handleYearChange}
                                  >
                                    <option value="2022">2022</option>
                                    <option value="2023">2023</option>
                                    <option value="2024">2024</option>
                                    <option value="2025">2025</option>
                                  </Select>
                                  <Button
                                    ml={4}
                                    colorScheme="blue"
                                    onClick={fetchProductStockData}
                                  >
                                    Filter
                                  </Button>
                                </Flex>
                              </VStack>
                            </Flex>
                            <Table mt={8} size="sm">
                              <Thead>
                                <Tr>
                                  <Th>Product ID</Th>
                                  <Th>Product Name</Th>
                                  <Th>Initial Stock</Th>
                                  <Th>Addition</Th>
                                  <Th>Reduction</Th>
                                  <Th>Latest Stock</Th>
                                  <Th>Warehouse ID</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {productStockData.map((product) => (
                                  <Tr key={product.id}>
                                    <Td>{product.product_id}</Td>
                                    <Td>{product.product_name}</Td>
                                    <Td>{product.Initial_Stock}</Td>
                                    <Td>{product.addition}</Td>
                                    <Td>{product.reduction}</Td>
                                    <Td>{product.latest_stock}</Td>
                                    <Td>{product.warehouse_id}</Td>
                                  </Tr>
                                ))}
                              </Tbody>
                            </Table>
                            <div className="w-[100%] mt-5 flex justify-center items-center gap-5">
                              {" "}
                              <IconButton
                                isDisabled={pageAdmin === 1}
                                onClick={firstPageHandler}
                                size={"sm"}
                                bg="#5D5FEF"
                                aria-label="previous page"
                                icon={
                                  <TbChevronsLeft
                                    color="white"
                                    boxsize={"16px"}
                                  />
                                }
                              />
                              <IconButton
                                isDisabled={pageAdmin === 1}
                                onClick={prevPageHandler}
                                size={"sm"}
                                bg="#5D5FEF"
                                aria-label="previous page"
                                icon={
                                  <TbChevronLeft
                                    color="white"
                                    boxsize={"16px"}
                                  />
                                }
                              />
                              <div className="font-ibmReg text-dgrey">
                                Page {pageAdmin} / {maxPageAdmin}
                              </div>
                              <IconButton
                                isDisabled={pageAdmin === maxPageAdmin}
                                onClick={nextPageHandler}
                                size={"sm"}
                                bg="#5D5FEF"
                                aria-label="next page"
                                icon={
                                  <TbChevronRight
                                    color="white"
                                    boxsize={"16px"}
                                  />
                                }
                              />
                              <IconButton
                                isDisabled={pageAdmin === maxPageAdmin}
                                onClick={maxPageHandler}
                                size={"sm"}
                                bg="#5D5FEF"
                                aria-label="next page"
                                icon={
                                  <TbChevronsRight
                                    color="white"
                                    boxsize={"16px"}
                                  />
                                }
                              />
                            </div>
                          </Box>
                        </div>
                      </div>
                    </>
                  ) : detailProductStockMode ? (
                    <>
                      <Box mt="150px">
                        <Flex align="center">
                          <Spacer />
                          <VStack spacing={4} alignItems="flex-end">
                            <Select
                              placeholder="Select Product"
                              onChange={handleProductChange2}
                            >
                              {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                  {product.name}
                                </option>
                              ))}
                            </Select>
                            <Select
                              placeholder="Select Warehouse"
                              onChange={handleWarehouseChange2}
                            >
                              {warehouses.map((warehouse) => (
                                <option key={warehouse.id} value={warehouse.id}>
                                  {warehouse.name}
                                </option>
                              ))}
                            </Select>
                            <Flex align="center">
                              <Select
                                placeholder="Month"
                                onChange={handleMonthChange2}
                                mr={2}
                              >
                                <option value="01">January</option>
                                <option value="02">February</option>
                                <option value="03">March</option>
                                <option value="04">April</option>
                                <option value="05">May</option>
                                <option value="06">June</option>
                                <option value="07">July</option>
                                <option value="08">August</option>
                                <option value="09">September</option>
                                <option value="10">October</option>
                                <option value="11">November</option>
                                <option value="12">December</option>
                              </Select>
                              <Select
                                placeholder="Year"
                                onChange={handleYearChange2}
                              >
                                <option value="2022">2022</option>
                                <option value="2023">2023</option>
                                <option value="2024">2024</option>
                                <option value="2025">2025</option>
                              </Select>
                              <Button
                                ml={4}
                                colorScheme="blue"
                                onClick={fetchStockLog}
                              >
                                Filter
                              </Button>
                            </Flex>
                          </VStack>
                        </Flex>

                        <Table mt={8} size="sm">
                          <Thead>
                            <Tr>
                              <Th>Product ID</Th>
                              <Th>Mutation ID</Th>
                              <Th>New Stock</Th>
                              <Th>Old Stock</Th>
                              <Th>Operation</Th>
                              <Th>Order Id</Th>
                              <Th>Warehouse ID</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {stockLogData.map((data) => (
                              <Tr key={data.id}>
                                <Td>{data.product_id}</Td>
                                <Td>{data.mutation_id}</Td>
                                <Td>{data.new_stock}</Td>
                                <Td>{data.old_stock}</Td>
                                <Td>{data.operation}</Td>
                                <Td>{data.order_id}</Td>
                                <Td>{data.warehouse_id}</Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                        <div className="w-[100%] mt-5 flex justify-center items-center gap-5">
                          {" "}
                          <IconButton
                            isDisabled={pageAdmin === 1}
                            onClick={firstPageHandler}
                            size={"sm"}
                            bg="#5D5FEF"
                            aria-label="previous page"
                            icon={
                              <TbChevronsLeft color="white" boxsize={"16px"} />
                            }
                          />
                          <IconButton
                            isDisabled={pageAdmin === 1}
                            onClick={prevPageHandler}
                            size={"sm"}
                            bg="#5D5FEF"
                            aria-label="previous page"
                            icon={
                              <TbChevronLeft color="white" boxsize={"16px"} />
                            }
                          />
                          <div className="font-ibmReg text-dgrey">
                            Page {pageAdmin} / {maxPageAdmin}
                          </div>
                          <IconButton
                            isDisabled={pageAdmin === maxPageAdmin}
                            onClick={nextPageHandler}
                            size={"sm"}
                            bg="#5D5FEF"
                            aria-label="next page"
                            icon={
                              <TbChevronRight color="white" boxsize={"16px"} />
                            }
                          />
                          <IconButton
                            isDisabled={pageAdmin === maxPageAdmin}
                            onClick={maxPageHandler}
                            size={"sm"}
                            bg="#5D5FEF"
                            aria-label="next page"
                            icon={
                              <TbChevronsRight color="white" boxsize={"16px"} />
                            }
                          />
                        </div>
                      </Box>
                    </>
                  ) : categorySalesMode ? (
                    <>{renderCategoryDashboard()}</>
                  ) : (
                    <>
                      <div className="flex justify-between mt-4">
                        <div className="w-auto flex justify-between items-center">
                          <Text
                            w={"auto"}
                            className="mr-1 font-ibmMed"
                            fontSize={18}
                            fontWeight={500}
                          >
                            Product Category:
                          </Text>
                          <Select
                            w={"auto"}
                            name="filterCategory"
                            placeholder="Choose a category"
                            color={"gray"}
                            onChange={searchInputHandler}
                          >
                            {categoryList.map((val, idx) => {
                              return (
                                <option value={val.id} key={idx}>
                                  {val.category_name}
                                </option>
                              );
                            })}
                          </Select>
                        </div>

                        <div
                          className="mb-4 mt-4 flex justify-between"
                          w="450px"
                        >
                          <InputGroup>
                            <Input
                              w="350px"
                              name="searchProductName"
                              placeholder="Search by Product Name"
                              className="p-1"
                              onChange={searchInputHandler}
                            />
                          </InputGroup>
                          <Button w="100px" ml="20px" onClick={changeSort}>
                            {sortMode === "ASC" ? "A to Z" : "Z to A"}
                          </Button>
                        </div>
                      </div>
                      {filter.filterCategory ? (
                        productList.length > 0 ? (
                          <>{renderProductDashboard()}</>
                        ) : (
                          <>
                            <Text
                              fontSize={24}
                              fontWeight={500}
                              className="text-black py-2 self-center"
                            >
                              ⚠️ Product is Not Found
                            </Text>
                          </>
                        )
                      ) : (
                        <>
                          <Text
                            fontSize={24}
                            fontWeight={500}
                            className="text-black py-2 self-center"
                          >
                            ⚠️ Please Choose a Category
                          </Text>
                        </>
                      )}
                    </>
                  )}
                </VStack>
              </div>
            </div>
          </div>
        </div>
        <Toaster />
      </div>
      {/* <div className="w-[100%] flex flex-1 justify-between">
        <Sidebar />
        <div className="bg-[#f1f1f1] w-[1240px] h-auto z-0 shadow-inner flex flex-col py-[40px] px-[50px]">
          <div className="w-[1140px] flex justify-center items-start overflow-auto "></div>
          <div className="flex justify-center"></div>
          <Box>
            <Flex align="center">
              <Heading
                as="h1"
                size="lg"
                fontWeight="500"
                className=" font-ibmBold"
              >
                Product Stock History Report
              </Heading>
              <Spacer />
              <VStack spacing={4} alignItems="flex-end">
                <Select
                  placeholder="Select Warehouse"
                  onChange={handleWarehouseChange}
                >
                  {warehouses.map((warehouse) => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </option>
                  ))}
                </Select>
                <Flex align="center">
                  <Select
                    placeholder="Month"
                    onChange={handleMonthChange}
                    mr={2}
                  >
                    <option value="01">January</option>
                    <option value="02">February</option>
                    <option value="03">March</option>
                    <option value="04">April</option>
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </Select>
                  <Select placeholder="Year" onChange={handleYearChange}>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                  </Select>
                  <Button
                    ml={4}
                    colorScheme="blue"
                    onClick={fetchProductStockData}
                  >
                    Filter
                  </Button>
                </Flex>
              </VStack>
            </Flex>
            <Table mt={8} size="sm">
              <Thead>
                <Tr>
                  <Th>Product ID</Th>
                  <Th>Product Name</Th>
                  <Th>Initial Stock</Th>
                  <Th>Addition</Th>
                  <Th>Reduction</Th>
                  <Th>Latest Stock</Th>
                  <Th>Warehouse ID</Th>
                </Tr>
              </Thead>
              <Tbody>
                {productStockData.map((product) => (
                  <Tr key={product.id}>
                    <Td>{product.product_id}</Td>
                    <Td>{product.product_name}</Td>
                    <Td>{product.Initial_Stock}</Td>
                    <Td>{product.addition}</Td>
                    <Td>{product.reduction}</Td>
                    <Td>{product.latest_stock}</Td>
                    <Td>{product.warehouse_id}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <div className="w-[100%] mt-5 flex justify-center items-center gap-5">
              {" "}
              <IconButton
                isDisabled={pageAdmin === 1}
                onClick={firstPageHandler}
                size={"sm"}
                bg="#5D5FEF"
                aria-label="previous page"
                icon={<TbChevronsLeft color="white" boxsize={"16px"} />}
              />
              <IconButton
                isDisabled={pageAdmin === 1}
                onClick={prevPageHandler}
                size={"sm"}
                bg="#5D5FEF"
                aria-label="previous page"
                icon={<TbChevronLeft color="white" boxsize={"16px"} />}
              />
              <div className="font-ibmReg text-dgrey">
                Page {pageAdmin} / {maxPageAdmin}
              </div>
              <IconButton
                isDisabled={pageAdmin === maxPageAdmin}
                onClick={nextPageHandler}
                size={"sm"}
                bg="#5D5FEF"
                aria-label="next page"
                icon={<TbChevronRight color="white" boxsize={"16px"} />}
              />
              <IconButton
                isDisabled={pageAdmin === maxPageAdmin}
                onClick={maxPageHandler}
                size={"sm"}
                bg="#5D5FEF"
                aria-label="next page"
                icon={<TbChevronsRight color="white" boxsize={"16px"} />}
              />
            </div>
          </Box>

          <Box mt="150px">
            <Flex align="center">
              <Spacer />
              <VStack spacing={4} alignItems="flex-end">
                <Select
                  placeholder="Select Product"
                  onChange={handleProductChange2}
                >
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </Select>
                <Select
                  placeholder="Select Warehouse"
                  onChange={handleWarehouseChange2}
                >
                  {warehouses.map((warehouse) => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </option>
                  ))}
                </Select>
                <Flex align="center">
                  <Select
                    placeholder="Month"
                    onChange={handleMonthChange2}
                    mr={2}
                  >
                    <option value="01">January</option>
                    <option value="02">February</option>
                    <option value="03">March</option>
                    <option value="04">April</option>
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </Select>
                  <Select placeholder="Year" onChange={handleYearChange2}>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                  </Select>
                  <Button ml={4} colorScheme="blue" onClick={fetchStockLog}>
                    Filter
                  </Button>
                </Flex>
              </VStack>
            </Flex>

            <Table mt={8} size="sm">
              <Thead>
                <Tr>
                  <Th>Product ID</Th>
                  <Th>Mutation ID</Th>
                  <Th>New Stock</Th>
                  <Th>Old Stock</Th>
                  <Th>Operation</Th>
                  <Th>Order Id</Th>
                  <Th>Warehouse ID</Th>
                </Tr>
              </Thead>
              <Tbody>
                {stockLogData.map((data) => (
                  <Tr key={data.id}>
                    <Td>{data.product_id}</Td>
                    <Td>{data.mutation_id}</Td>
                    <Td>{data.new_stock}</Td>
                    <Td>{data.old_stock}</Td>
                    <Td>{data.operation}</Td>
                    <Td>{data.order_id}</Td>
                    <Td>{data.warehouse_id}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <div className="w-[100%] mt-5 flex justify-center items-center gap-5">
              {" "}
              <IconButton
                isDisabled={pageAdmin === 1}
                onClick={firstPageHandler}
                size={"sm"}
                bg="#5D5FEF"
                aria-label="previous page"
                icon={<TbChevronsLeft color="white" boxsize={"16px"} />}
              />
              <IconButton
                isDisabled={pageAdmin === 1}
                onClick={prevPageHandler}
                size={"sm"}
                bg="#5D5FEF"
                aria-label="previous page"
                icon={<TbChevronLeft color="white" boxsize={"16px"} />}
              />
              <div className="font-ibmReg text-dgrey">
                Page {pageAdmin} / {maxPageAdmin}
              </div>
              <IconButton
                isDisabled={pageAdmin === maxPageAdmin}
                onClick={nextPageHandler}
                size={"sm"}
                bg="#5D5FEF"
                aria-label="next page"
                icon={<TbChevronRight color="white" boxsize={"16px"} />}
              />
              <IconButton
                isDisabled={pageAdmin === maxPageAdmin}
                onClick={maxPageHandler}
                size={"sm"}
                bg="#5D5FEF"
                aria-label="next page"
                icon={<TbChevronsRight color="white" boxsize={"16px"} />}
              />
            </div>
          </Box>
        </div>
      </div> */}
    </>
  );
};

export default AdminUser;
