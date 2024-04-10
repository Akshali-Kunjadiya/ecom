import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductFail,
  fetchProductRequest,
  fetchProductSuccess,
} from "../features/productSlice";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
function HomeScreen() {
  // const [products,setaProducts]=useState([])

  const dispatch = useDispatch();
  const location =useLocation()
  const navigate=useNavigate();
  const { productList, loading, error,page,pages } = useSelector(
    (state) => state.productList
  );
  let keyword=location.search
  // console.log(keyword)
  const fetchProducts = (keyword='') => async () => {
    try {
      dispatch(fetchProductRequest());
      const { data } = await axios.get(`/api/products${keyword}`);
      dispatch(fetchProductSuccess(data));
    } catch (err) {
      dispatch(
        fetchProductFail(
          err.response && err.response.data.detail
            ? err.response.data.detail
            : err.message
        )
      );
    }
  };
  useEffect(() => {
    dispatch(fetchProducts(keyword));
    // async function fetchProducts(){
    //   const {data}=await axios.get('/api/products/')
    //   setaProducts(data)
    // }
    // fetchProducts()
  }, [dispatch,keyword]);
  // console.log(productList)
  return (
    <div>
    {!keyword&&<ProductCarousel/>}
      <h1>Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
        <Row>
          {productList.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
        <Paginate page={page} pages={pages} keyword={keyword}/>
        </div>
      )}
    </div>
  );
}

export default HomeScreen;
