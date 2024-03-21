import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  productUpdateRequest,
  productUpdateSuccess,
  productUpdateFail,
  productUpdateReset,
} from "../features/productUpdateSlice";
import {
  fetchProductDetailsRequest,
  fetchProductDetailsSuccess,
  fetchProductDetailsFail,
} from "../features/productDetailSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import FormContainer from "../components/FormContainer";

const ProductEditAdminScreen = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [countIntStock, setCountIntStock] = useState(0);
  const [brand, setBrand] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const { userInfo } = useSelector((state) => state.userlogin);
  const { loading, product, error } = useSelector(
    (state) => state.productDetails
  );
  const {
    loading: loadingUpdate,
    success: successUpdate,
    error: errorUpdate,
  } = useSelector((state) => state.productUpdate);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const listProductDetails = (id) => async () => {
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

  const updateProdcut = (product) => async () => {
    try {
      dispatch(productUpdateRequest());
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/products/update/${product._id}/`,
        product,
        config
      );
      dispatch(productUpdateSuccess(data));
      dispatch(fetchProductDetailsSuccess(data));
    } catch (err) {
      dispatch(
        productUpdateFail(
          err.response && err.response.data.detail
            ? err.response.data.detail
            : err.message
        )
      );
    }
  };

  useEffect(() => {
    if (successUpdate) {
      dispatch(productUpdateReset());
      navigate("/admin/productlist");
    } else {
      if (!product.name || product._id !== Number(id)) {
        dispatch(listProductDetails(id));
      } else {
        setName(product.name);
        setPrice(product.price);
        setImage(product.image);
        setBrand(product.brand);
        setCategory(product.category);
        setCountIntStock(product.countIntStock);
        setDescription(product.description);
      }
    }
  }, [dispatch, product, id, navigate, successUpdate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProdcut({
        _id: id,
        name,
        price,
        image,
        brand,
        category,
        countIntStock,
        description,
      })
    );
  };
  const uploadFileHandler = async(e)=>{
    // console.log('file is uploding')
    const file=e.target.files[0]
    const formData=new FormData()
    formData.append('image',file)
    formData.append('product_id',id)
    setUploading(true)
    try{
        const config={
            headers:{
                'Content-Type':'multipart/form-data'
            }
        }

        const {data}=await axios.post('/api/products/upload/',formData,config)
        setImage(data)
        setUploading(false)



    }catch(error){
        setUploading(false)
    }
}
  return (
    <div>
      <Link to="/admin/productlist">Go Back</Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name" style={{ margin: "1rem 0" }}>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="price" style={{ margin: "1rem 0" }}>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Price"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="image" style={{ margin: "1rem 0" }}>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image"
                value={image}
                onChange={(e) => {
                  setImage(e.target.value);
                }}
              ></Form.Control>
              <Form.Control
                type='file'
                id="image-file"
                
                custom
                onChange={(e)=>uploadFileHandler(e)}
              ></Form.Control>
              {/* {uploading&&<Loader/>} */}
            </Form.Group>

            <Form.Group controlId="brand" style={{ margin: "1rem 0" }}>
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                }}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="countInStock" style={{ margin: "1rem 0" }}>
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter stock"
                value={countIntStock}
                onChange={(e) => {
                  setCountIntStock(e.target.value);
                }}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="category" style={{ margin: "1rem 0" }}>
              <Form.Label>category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="description" style={{ margin: "1rem 0" }}>
              <Form.Label>description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              ></Form.Control>
            </Form.Group>

            <Form.Group style={{ margin: "1rem 0" }}>
              <Button type="submit" variant="primary">
                Update
              </Button>
            </Form.Group>
          </Form>
        )}
      </FormContainer>
    </div>
  );
}
export default ProductEditAdminScreen;
