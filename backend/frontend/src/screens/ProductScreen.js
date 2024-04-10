import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
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
import {
  productReviewCreateRequest,
  productReviewCreateSuccess,
  productReviewCreateFail,
  productReviewCreateReset,
} from "../features/productReviewCreateSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";

function ProductScreen() {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState();
  const { id } = useParams();
  // const [product, setaProduct] = useState([]);
  const { userInfo } = useSelector((state) => state.userlogin);
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );
  const {
    success: successProductReview,
    loading: loadingProductReview,
    error: errorProductReview,
  } = useSelector((state) => state.productReviewCreate);

  const createProductReview = (productId, review) => async () => {
    try {
      dispatch(productReviewCreateRequest());
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/products/${productId}/reviews/`,
        review,
        config
      );
      dispatch(productReviewCreateSuccess(data));
    } catch (err) {
      dispatch(
        productReviewCreateFail(
          err.response && err.response.data.detail
            ? err.response.data.detail
            : err.message
        )
      );
    }
  };

  const fetchProduct = (id) => async () => {
    try {
      dispatch(fetchProductDetailsRequest());
      const { data } = await axios.get(`/api/products/${id}`);
      dispatch(fetchProductDetailsSuccess(data));
    } catch (err) {
      dispatch(
        fetchProductDetailsFail(
          err.response && err.response.data.detail
            ? err.response.data.detail
            : err.message
        )
      );
    }
  };
  useEffect(() => {
    if(successProductReview){
      setRating(0)
      setComment('')
      dispatch(productReviewCreateReset())
    }
    dispatch(fetchProduct(id));
  }, [dispatch, id,successProductReview]);
  const navigate = useNavigate();
  const addToCartHandler = () => {
    navigate(`/cart/${id}?qty=${qty}`);
  };
  const submitHandler=(e)=>{
    e.preventDefault()
    dispatch(createProductReview(
      id,
      {rating,
      comment} 
    ))
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
        <div>
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
                    text={`${product.numReviwes} reviews`}
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
                        {product.countIntStock > 0
                          ? "In Stock"
                          : "Out of Stock"}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {product.countIntStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col xs="auto" className="my-1">
                          <Form.Select
                            as="select"
                            value={qty}
                            onChange={(e) => {
                              setQty(e.target.value);
                            }}
                          >
                            {[...Array(product.countIntStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
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
          <Row>
            <Col md={6}>
                <h4>Reviews</h4>
                {product.reviews.length===0&&<Message variant='info'>No Reviews</Message>}
                <ListGroup variant="flush">
                    {product.reviews.map((review)=>(
                      <ListGroup.Item key={review._id}>
                        <storng>{review.name}</storng>
                        <Rating value={review.rating} color='#f8e825'/>
                        <p>{review.createdAt.substring(0,10)}</p>
                        <p>{review.comment}</p>
                      </ListGroup.Item>
                    ))}
                    <ListGroup.Item>
                      <h4>Write a review</h4>
                      {loadingProductReview&&<Loader/>}
                      {successProductReview&&<Message variant='success'>Review Submitted</Message>}
                      {errorProductReview&&<Message variant='danger'>{errorProductReview}</Message>}
                      {userInfo?(
                        <Form onSubmit={submitHandler}>
                          <Form.Group>
                            <Form.Label>Rating</Form.Label>
                            <Form.Control
                            as='select'
                            value={rating}
                            onChange={(e)=>setRating(e.target.value)}
                            >
                              <option value=''>Select...</option>
                              <option value='1'>1 - Poor</option>
                              <option value='2'>2 - Fair</option>
                              <option value='3'>3 - Good</option>
                              <option value='4'>4 -  Very Good</option>
                              <option value='5'>5 - Excellent</option>
                            </Form.Control>
                          </Form.Group>
                          <Form.Group>
                            <Form.Label>Review</Form.Label>
                            <Form.Control
                            as='textarea'
                            row='5'
                            value={comment}
                            onChange={(e)=>setComment(e.target.value)}
                            ></Form.Control>
                          </Form.Group>
                          <Button disabled={loadingProductReview} type='submit' variant="primary">Submit</Button>
                        </Form>
                      ):
                      (
                        <Message variant='info'>Please <Link to='/login'>login</Link> to write a review</Message>
                      )}
                    </ListGroup.Item>
                </ListGroup>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}

export default ProductScreen;
