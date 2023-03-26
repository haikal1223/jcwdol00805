import {
  Stack,
  Input,
  IconButton,
  SimpleGrid,
  useRadioGroup,
} from "@chakra-ui/react";
import {
  TbSearch,
  TbDots,
  TbArrowNarrowLeft,
  TbArrowNarrowRight,
} from "react-icons/tb";
import ProductCard from "../../components/productCard";
import CategoryRadio from "./components/category";
import { useEffect, useState } from "react";
import axios from "axios";
import CarouselSection from "./Section/CarouselSection";
import Pages from "../../components/pages";
import { toast, Toaster } from "react-hot-toast";

export default function Home(props) {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(0);
  const [filter, setFilter] = useState({
    searchProductName: "",
    searchCategory: "",
  });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const itemLimit = 15;

  const [uid, setUid] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [userCart, setUserCart] = useState([]);

  // fetch & render
  let getUserCart = async () => {
    try {
      let sumCart = 0;
      let token = localStorage.getItem("myToken");
      let response = await axios.get(
        `http://localhost:8000/user/verifytoken?token=${token}`
      );
      setUid(response.data.data.uid);
      let user_uid = response.data.data.uid;
      let getUserCart = await axios.get(
        `http://localhost:8000/cart/getUserCart?user_uid=${user_uid}`
      );
      setUserCart(getUserCart.data.data);
      for (let i = 0; i < getUserCart.data.data.length; i++) {
        sumCart += getUserCart.data.data[i].quantity;
      }
    } catch (error) {}
  };
  useEffect(() => {
    getUserCart();
  }, []);

  const fetchProduct = async () => {
    try {
      let response = await axios.get(`http://localhost:8000/product/view`);
      setProducts(response.data.data[0]);
      setMaxPage(Math.ceil(response.data.data[0].length / itemLimit));
      setFilteredProducts(response.data.data[0]);
    } catch (error) {}
  };
  useEffect(() => {
    fetchProduct();
  }, []);

  let getUid = async () => {
    try {
      let token = localStorage.getItem("myToken");
      let response = await axios.get(
        `http://localhost:8000/user/verifytoken?token=${token}`
      );
      setUid(response?.data?.data?.uid);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    getUid();
  }, []);

  const renderProduct = () => {
    const startIndex = (page - 1) * itemLimit;
    const productPerPage = filteredProducts.slice(
      startIndex,
      startIndex + itemLimit
    );

    return productPerPage.map((val, idx) => {
      return (
        <ProductCard
          productData={val}
          productIdx={idx}
          func={(e) => addCart(val)}
        />
      );
    });
  };

  // pagination
  const nextPageHandler = () => {
    if (page < maxPage) {
      setPage(page + 1);
    }
  };

  const prevPageHandler = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  // search & filter
  const searchInputHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFilter({
      ...filter,
      [name]: value,
    });
  };

  const searchButtonHandler = () => {
    const filterResult = products.filter((val) => {
      return val.name
        .toLowerCase()
        .includes(filter.searchProductName.toLowerCase());
    });

    setFilteredProducts(filterResult);
    setPage(1);
    setMaxPage(Math.ceil(filterResult.length / itemLimit));
  };

  // category as Radio
  const categories = [
    { name: "All", icon: "GiPerson" },
    { name: "Dress", icon: "GiLargeDress" },
    { name: "Sandal", icon: "GiSlippers" },
    { name: "Topwear", icon: "GiPoloShirt" },
    { name: "Bottom", icon: "GiUnderwearShorts" },
    { name: "Shoes", icon: "GiConverseShoe" },
  ];

  const renderCategory = () => {
    return (
      <Stack {...getRootProps()}>
        <div className="flex justify-between">
          {categories.map((val) => {
            return (
              <CategoryRadio
                key={val.name}
                func={searchInputHandler}
                icon={val.icon}
                name="searchCategory"
                {...getRadioProps({ value: val.name })}
              />
            );
          })}
        </div>
      </Stack>
    );
  };

  const { value, getRadioProps, getRootProps } = useRadioGroup({
    defaultValue: "All",
  });

  // add to cart
  const addCart = async (valProduct) => {
    try {
      if (!props.login) {
        toast.error("Please log in first", {
          duration: 3000,
        });
      } else {
        getUserCart();
        let foundInCart = false;
        let sumStock = 0;
        let getProductStock = await axios.get(
          `http://localhost:8000/product/productStock?product_id=${valProduct.id}`
        );
        for (let i = 0; i < getProductStock.data.data.length; i++) {
          sumStock += getProductStock.data.data[i].stock;
        }

        if (sumStock === 0) {
          toast.error("There are no stock of the product", {
            duration: 3000,
          });
        } else {
          userCart.map(async (valCart, idx) => {
            if (valCart.product_id === valProduct.id) {
              foundInCart = true;
              if (valCart.quantity > sumStock) {
                toast.error("Your cart has maximum stock of the product", {
                  duration: 3000,
                });
              } else {
                let updateCart = await axios.patch(
                  `http://localhost:8000/cart/updateCart?user_uid=${uid}&product_id=${valCart.product_id}`,
                  {
                    quantity: valCart.quantity + 1,
                    price: valCart.price,
                  }
                );
                toast.success("Added to cart", {
                  duration: 3000,
                });
              }
              getUserCart();
            }
          });
          if (!foundInCart) {
            let addCart = await axios.post(
              `http://localhost:8000/cart/addCart`,
              {
                quantity: 1,
                price: valProduct.price,
                user_uid: uid,
                product_id: valProduct.id,
              }
            );
            toast.success("Added to cart", {
              duration: 3000,
            });
            getUserCart();
          }
        }
      }
    } catch (error) {}
  };

  return (
    <div className="flex justify-center">
      <div className="w-[100%] h-[2066px] flex flex-col items-center">
        <CarouselSection />
        <div className="w-[348px] h-[198px] flex flex-col justify-between items-center gap-3 bg-white rounded-md p-5 shadow-md z-10 mt-[50px]">
          <div className="font-ibmBold text-[20px] text-dgrey">
            What are you looking?
          </div>

          <div className="w-[100%] flex justify-between items-center gap-2 mb-1">
            <Input
              name="searchProductName"
              onChange={searchInputHandler}
              placeholder="Find your favorite product"
              className="p-1"
            />
            <IconButton
              onClick={searchButtonHandler}
              bg="#5D5FEF"
              aria-label="search product"
              icon={<TbSearch color="white" />}
            />
          </div>

          {renderCategory()}
        </div>
        <div className="w-[100%] px-[10px] mt-10 flex flex-col items-center gap-5">
          <div className="w-[100%] font-ibmBold text-[20px] text-left">
            Daily Discover
          </div>
          <div className="w-[100%] flex justify-start flex-wrap gap-5">
            {renderProduct()}
          </div>
          <div className="w-[100%] mt-5 flex justify-center items-center gap-5">
            <IconButton
              isDisabled={page === 1}
              onClick={prevPageHandler}
              size={"sm"}
              bg="#5D5FEF"
              aria-label="previous page"
              icon={<TbArrowNarrowLeft color="white" boxsize={"16px"} />}
            />
            <div className="font-ibmReg text-dgrey">
              Page {page} / {maxPage}
            </div>
            <IconButton
              isDisabled={page === maxPage}
              onClick={nextPageHandler}
              size={"sm"}
              bg="#5D5FEF"
              aria-label="next page"
              icon={<TbArrowNarrowRight color="white" boxsize={"16px"} />}
            />
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
