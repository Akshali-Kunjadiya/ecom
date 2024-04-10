import React from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { cartAddItem, cartRemoveItem } from "../features/cartSlice";
import { useParams, Link, useLocation,useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import Message from "../components/Message";

function CartScreen() {
  const { id } = useParams();
  const productId = id;

  const navigate=useNavigate();
  const location = useLocation();
  const qty = location.search ? Number(location.search.split("=")[1]) : Number(1);
  // console.log(qty)
  const { cartItems } = useSelector((state) => state.cart);
  // console.log(cartItems)
  const dispatch = useDispatch();
  const addToCart = (id, qty) => async () => {
    const { data } = await axios.get(`/api/products/${id}`);
    const item = {
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countIntStock: data.countIntStock,
      qty,
    };
    dispatch(cartAddItem(item));
  };

  const removeFromCartHandler = (id)=>{
    // console.log('remove',id)
    dispatch(cartRemoveItem(id))

  }
  const checkOutHandler = ()=>{
    navigate(`/login?redirect=shipping`)
  }
  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
  }, [dispatch, id, qty]);
  return (
    <Row>
      <Col md={8}>
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message variant="info">
            Your cart is empty <Link style={{ textDecoration: 'none' }} to="/">Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item.product}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link
                      style={{ textDecoration: "none" }}
                      to={`/product/${item.product}`}
                    >
                      {item.name}
                    </Link>
                  </Col>
                  <Col md={2}>${item.price}</Col>
                  <Col md={3}>
                    <Form.Select
                      as="select"
                      value={item.qty}
                      onChange={(e) => {
                        dispatch(addToCart(item.product,Number(e.target.value)));
                      }}
                    >
                      {[...Array(item.countIntStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={1}>
                    <Button type='button' variant="light" onClick={()=>removeFromCartHandler(item.product)}><i className="fas fa-trash"></i></Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card >
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Subtotal ({cartItems.reduce((acc,item)=> acc+item.qty,0)}) items</h2>
              ${cartItems.reduce((acc,item)=> acc+item.qty*item.price,0).toFixed(2)}
            </ListGroup.Item>
          <ListGroup.Item>
          <Row>
            <Button type="button" className="btn-block" disabled={cartItems.length===0} onClick={()=>checkOutHandler()}>
                        Proceed To Checkout
            </Button>
            </Row>
          </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
}

export default CartScreen;
