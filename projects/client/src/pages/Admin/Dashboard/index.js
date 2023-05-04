import {
  Stack,
  Button,
  Text,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Box,
  VStack,
  HStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Icon,
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
    setSalesTitle("Sales Report");
  };

  let changeCategoryMode = () => {
    setAllSalesMode(false);
    setCategorySalesMode(true);
    setProductSalesMode(false);
    setSalesTitle("Sales Report by Product Category");
  };

  let changeProductMode = () => {
    setAllSalesMode(false);
    setCategorySalesMode(false);
    setProductSalesMode(true);
    setSalesTitle("Sales Report by Product");
  };

  return (
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
                              {`${(percentNumberProduct() * 100).toFixed(2)}%`}
                            </>
                          ) : (
                            <>
                              <StatArrow type="decrease" />
                              {`${(percentNumberProduct() * 100).toFixed(2)}%`}
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

                      <div className="mb-4 mt-4 flex justify-between" w="450px">
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
  );
};

export default AdminUser;
