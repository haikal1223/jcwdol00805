import { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Flex,
  Heading,
  Select,
  Text,
  VStack,
  Spacer,
  Button,
} from "@chakra-ui/react";

const Dashboard = () => {
  const [productStockData, setProductStockData] = useState([]);
  const [stockLogData, setStockLogData] = useState([]);
  const [warehouseId, setWarehouseId] = useState(null);
  const [productId, setProductId] = useState(null);
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [loading, setLoading] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);

  const fetchWarehouses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
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
      const token = localStorage.getItem("adminToken");
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
      const token = localStorage.getItem("adminToken");
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

  useEffect(() => {
    fetchWarehouses();
    fetchProducts();
    fetchStockLog();
  }, []);

  return (
    <>
      <Box>
        <Flex align="center">
          <Heading as="h1" size="lg" fontWeight="500">
            Produk Stock History Report
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
              <Select placeholder="Month" onChange={handleMonthChange} mr={2}>
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
              <Button ml={4} colorScheme="blue" onClick={fetchProductStockData}>
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
      </Box>
      <Box mt="150px">
        <Flex align="center">
          <Heading as="h1" size="lg" fontWeight="500">
            Detail Product Report
          </Heading>
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
              <Select placeholder="Month" onChange={handleMonthChange2} mr={2}>
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
      </Box>
    </>
  );
};

export default Dashboard;
