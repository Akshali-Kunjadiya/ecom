import React, { useState, useEffect } from "react";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductRequest,
  fetchProductSuccess,
  fetchProductFail,
} from "../features/productSlice";
import {
  ProductDeleteRequest,
  ProductDeleteSuccess,
  ProductDeleteFail,
} from "../features/productDeleteSlice";
import {
  productCreateRequest,
  productCreateSuccess,
  productCreateFail,
  productCreateReset,
} from "../features/productCreateSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";

function ProductListScreen() {
  const location = useLocation();
  const { loading, productList, error,pages,page } = useSelector(
    (state) => state.productList
  );
  const {
    loading: loadingDelete,
    success,
    error: errorDelete,
  } = useSelector((state) => state.productDelete);
  const {
    loading: loadingCreate,
    success:successCreate,
    error: errorCreate,
    product:createdProduct
  } = useSelector((state) => state.productCreate);

  const { userInfo } = useSelector((state) => state.userlogin);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const listProduct = (keyword='') => async () => {
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
  const deleteProduct = (id) => async () => {
    try {
      dispatch(ProductDeleteRequest());

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.delete(
        `/api/products/delete/${id}/`,
        config
      );
      dispatch(ProductDeleteSuccess());
    } catch (err) {
      dispatch(
        ProductDeleteFail(
          err.response && err.response.data.detail
            ? err.response.data.detail
            : err.message
        )
      );
    }
  };

  const createProduct = () => async () => {
    try {
      dispatch(productCreateRequest());

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/products/create/`,{},
        config
      );
      dispatch(productCreateSuccess(data));
    } catch (err) {
      dispatch(
        productCreateFail(
          err.response && err.response.data.detail
            ? err.response.data.detail
            : err.message
        )
      );
    }
  };
  let keyword=location.search

  useEffect(() => {
    dispatch(productCreateReset())
    if (!userInfo.isAdmin) {
      navigate("/login");
    } 
    if(successCreate){
      navigate(`/admin/product/${createdProduct._id}/edit`)
    }
    else {
      dispatch(listProduct(keyword));
    }
  }, [dispatch, navigate, userInfo, success,successCreate,createdProduct,keyword]);
  const deleteHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };
  const createProductHandler = () => {
    dispatch(createProduct())
  };
  return (
    <div>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createProductHandler}>
            <i className="fas fa-plus"></i> Create Product
          </Button>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {productList.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <LinkContainer to={`/admin/product/${product._id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteHandler(product._id)}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>

        </Table>
          <Paginate page={page} pages={pages} keyword={keyword} isAdmin={true}/>
        </div>
      )}
    </div>
  );
}

export default ProductListScreen;
