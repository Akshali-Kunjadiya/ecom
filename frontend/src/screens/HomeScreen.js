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
import axios from "axios";
function HomeScreen() {
  // const [products,setaProducts]=useState([])

  const dispatch = useDispatch();
  const { productList, loading, error } = useSelector(
    (state) => state.productList
  );
  useEffect(() => {
    const fetchProducts = () => async () => {
      try {
        dispatch(fetchProductRequest());
        const { data } = await axios.get("/api/products/");
        dispatch(fetchProductSuccess(data));
      } catch (err) {
        dispatch(
          fetchProductFail(
            err.responsse && err.responsse.data.detail
              ? err.response.data.detail
              : err.message
          )
        );
      }
    };
    dispatch(fetchProducts());
    // async function fetchProducts(){
    //   const {data}=await axios.get('/api/products/')
    //   setaProducts(data)
    // }
    // fetchProducts()
  }, [dispatch]);
  // console.log(productList)
  return (
    <div>
      <h1>Latest Products</h1>
      {loading ? (
        <Loader/>
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Row>
          {productList.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default HomeScreen;
