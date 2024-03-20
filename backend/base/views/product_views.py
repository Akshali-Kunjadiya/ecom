from django.shortcuts import render
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from base.models import Product
from base.serializers import ProductSerializer
from rest_framework import status

# Create your views here.

@api_view(['GET'])
def getProducts(request):
    products=Product.objects.all()
    serializer=ProductSerializer(products,many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getProduct(request,pk):
    product=Product.objects.get(_id=pk)
    serializer=ProductSerializer(product,many=False)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    user=request.user
    # data=
    product=Product.objects.create(
        user=user,
        name='sample',
        price=0,
        brand='apple',
        countIntStock=0,
        category="sample category",
        description=''
    )
    serializer=ProductSerializer(product,many=False)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request,pk):
    data=request.data
    product=Product.objects.get(_id=pk)
    product.name=data["name"]
    product.price=data["price"]
    product.brand=data["brand"]
    product.countIntStock=data["countIntStock"]
    product.category=data["category"]
    product.description=data["description"]
    product.save()
    serializer=ProductSerializer(product,many=False)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request,pk):
    product=Product.objects.get(_id=pk)
    product.delete()
    return Response('Product Deleted')

@api_view(['POST'])
def uploadImage(request):
    data=request.data
    product_id=data['product_id']
    product=Product.objects.get(_id=product_id)
    product.image=request.FILES.get('image')
    product.save()
    return Response('Image was uploded')

