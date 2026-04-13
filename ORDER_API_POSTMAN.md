# Order API Guide For Postman

Tai lieu nay huong dan test cac API trong [src/routes/order.routes.js](/E:/luyentap-nodejs/src/routes/order.routes.js) bang Postman.

## 1. Base URL

Neu server chay local:

```text
http://localhost:3000/api/orders
```

## 2. Header bat buoc

Tat ca API trong `order.routes.js` deu di qua `authMiddleware`, vi vay can gui token:

```http
Authorization: Bearer <your_access_token>
Content-Type: application/json
```

## 3. Gia tri enum dang dung

### `paymentMethod`

```text
CASH
BANK_TRANSFER
STRIPE
```

### `orderStatus`

```text
PROCESSING
SHIPPING
DELIVERED
CANCELLED
```

## 4. API chi tiet

### 4.1. Tao don hang

- Method: `POST`
- URL: `http://localhost:3000/api/orders/create`

#### Body JSON

```json
{
  "userId": "661111111111111111111111",
  "phoneNumber": "0901234567",
  "items": [
    {
      "productId": "662222222222222222222222",
      "sku": "TSHIRT-BLACK-M",
      "quantity": 2
    },
    {
      "productId": "663333333333333333333333",
      "sku": "HOODIE-WHITE-L",
      "quantity": 1
    }
  ],
  "totalAmount": 850000,
  "paymentMethod": "CASH",
  "trackingNumber": "TRK-TEST-0001",
  "shippingAddress": {
    "street": "123 Le Loi",
    "city": "Ho Chi Minh",
    "district": "District 1",
    "ward": "Ben Nghe"
  },
  "note": "Giao gio hanh chinh"
}
```

#### Luu y

- Validator cua route nay dang bi comment, nhung du lieu nen gui dung theo schema de tranh loi MongoDB.
- `paymentStatus` mac dinh se la `UNPAID`.
- `orderStatus` mac dinh se la `PROCESSING`.

#### Response thanh cong

```json
{
  "message": "Tao don hang thanh cong",
  "data": {
    "_id": "664444444444444444444444",
    "userId": "661111111111111111111111",
    "phoneNumber": "0901234567",
    "items": [
      {
        "productId": "662222222222222222222222",
        "sku": "TSHIRT-BLACK-M",
        "quantity": 2,
        "_id": "665555555555555555555551"
      }
    ],
    "totalAmount": 850000,
    "paymentStatus": "UNPAID",
    "paymentMethod": "CASH",
    "orderStatus": "PROCESSING",
    "trackingNumber": "TRK-TEST-0001",
    "shippingAddress": {
      "street": "123 Le Loi",
      "city": "Ho Chi Minh",
      "district": "District 1",
      "ward": "Ben Nghe"
    },
    "note": "Giao gio hanh chinh",
    "createdAt": "2026-04-13T10:00:00.000Z",
    "updatedAt": "2026-04-13T10:00:00.000Z"
  }
}
```

### 4.2. Tao Stripe Payment Intent

- Method: `POST`
- URL: `http://localhost:3000/api/orders/createStripePaymentIntent`

#### Body JSON

```json
{
  "orderId": "664444444444444444444444",
  "currency": "vnd"
}
```

#### Luu y

- `currency` la optional.
- Gia tri hop le: `usd`, `vnd`.

### 4.3. Dong bo thanh toan Stripe

- Method: `POST`
- URL: `http://localhost:3000/api/orders/syncStripePaymentIntent`

#### Body JSON

```json
{
  "paymentIntentId": "pi_3Qexample123456789"
}
```

#### Luu y

- `paymentIntentId` phai bat dau bang `pi_`.

### 4.4. Lay tat ca don hang

- Method: `GET`
- URL: `http://localhost:3000/api/orders/getAllOrders`

#### Query params

```text
page=1
limit=10
```

#### Vi du URL

```text
http://localhost:3000/api/orders/getAllOrders?page=1&limit=10
```

#### Response mau

```json
{
  "message": "Get all orders successfully",
  "data": [],
  "pagination": {
    "total": 0,
    "page": 1,
    "limit": 10,
    "totalPages": 0
  }
}
```

### 4.5. Lay chi tiet don hang theo ID

- Method: `GET`
- URL: `http://localhost:3000/api/orders/getOrderById/:orderId`

#### Vi du URL

```text
http://localhost:3000/api/orders/getOrderById/664444444444444444444444
```

#### Luu y

- Route validator dang bi comment, nhung `orderId` van nen dung dinh dang Mongo ObjectId.

### 4.6. Lay danh sach don hang theo userId

- Method: `GET`
- URL: `http://localhost:3000/api/orders/getOrdersByUserId/:userId`

#### Query params

```text
page=1
limit=10
```

#### Vi du URL

```text
http://localhost:3000/api/orders/getOrdersByUserId/661111111111111111111111?page=1&limit=10
```

### 4.7. Huy don hang

- Method: `PUT`
- URL: `http://localhost:3000/api/orders/cancelOrder/:orderId`

#### Body

Khong can body.

#### Vi du URL

```text
http://localhost:3000/api/orders/cancelOrder/664444444444444444444444
```

### 4.8. Cap nhat trang thai don hang

- Method: `PUT`
- URL: `http://localhost:3000/api/orders/updateOrderStatus/:orderId`

#### Body JSON

```json
{
  "orderStatus": "SHIPPING"
}
```

#### Luu y

- Gia tri hop le: `PROCESSING`, `SHIPPING`, `DELIVERED`, `CANCELLED`.

## 5. Cach test nhanh tren Postman

1. Dang nhap de lay access token.
2. Trong Postman, tao collection `Orders`.
3. Them header:

```http
Authorization: Bearer <token>
Content-Type: application/json
```

4. Test theo thu tu:

```text
create
createStripePaymentIntent
syncStripePaymentIntent
getAllOrders
getOrderById/:orderId
getOrdersByUserId/:userId
updateOrderStatus/:orderId
cancelOrder/:orderId
```

## 6. Loi thuong gap

- `401 Unauthorized`: thieu token hoac token khong hop le.
- `404 Khong tim thay don hang`: `orderId` khong ton tai.
- `400 Validation error`: body/query sai dinh dang.
- `data: []` o `getAllOrders`: thuong la do app dang noi sai database hoac database hien tai chua co du lieu.

