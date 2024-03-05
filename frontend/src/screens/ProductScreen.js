import React, { useState, useEffect } from "react";
import { Link, useParams ,useNavigate} from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Card,
  Form,
} from "react-bootstrap";
import Rating from "../components/Rating";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetailsRequest,
  fetchProductDetailsSuccess,
  fetchProductDetailsFail,
} from "../features/productDetailSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";

function ProductScreen() {
  const [qty, setQty] = useState(1);
  const { id } = useParams();
  // const [product, setaProduct] = useState([]);

  const dispatch = useDispatch();
  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );

  useEffect(() => {
    const fetchProduct = (id) => async () => {
      try {
        dispatch(fetchProductDetailsRequest());
        const { data } = await axios.get(`/api/products/${id}`);
        dispatch(fetchProductDetailsSuccess(data));
      } catch (err) {
        dispatch(
          fetchProductDetailsFail(
            err.responsse && err.responsse.data.detail
              ? err.response.data.detail
              : err.message
          )
        );
      }
    };
    dispatch(fetchProduct(id));
  }, [dispatch, id]);
  const navigate=useNavigate()
  const addToCartHandler = ()=>{
    navigate(`/cart/${id}?qty=${qty}`)
  }
  // const product = products.find((p) => p._id == id);
  return (
    <div>
      <Link to="/" className="btn btn-light my-3">
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          <Col md={6}>
            <Image src={product.image} alt={product.name} />
          </Col>
          <Col md={3}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>{product.name}</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                  color={"#f8e825"}
                />
              </ListGroup.Item>
              <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
              <ListGroup.Item>
                Description: {product.description}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>
                      <storage>${product.price}</storage>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countIntStock > 0 ? "In Stock" : "Out of Stock"}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {product.countIntStock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Qty</Col>
                      <Col xs='auto' className="my-1">
                        <Form.Select
                          as="select"
                          value={qty}
                          onChange={(e) => {
                            setQty(e.target.value);
                          }}
                        >
                          {
                            [...Array(product.countIntStock).keys()].map((x)=>(
                              <option key={x+1} value={x+1}>
                                {x+1}
                              </option>
                            ))
                          }
                        </Form.Select>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}
                <ListGroup.Item>
                  <Row>
                    <Button
                      onClick={addToCartHandler}
                      className="btn-block"
                      disabled={product.countIntStock == 0}
                      type="button"
                    >
                      Add To Cart
                    </Button>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Card> 
          </Col>
        </Row>
      )}
    </div>
  );
}

export default ProductScreen;
