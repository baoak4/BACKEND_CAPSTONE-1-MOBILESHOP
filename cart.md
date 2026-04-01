# Cart API

Tai lieu nay duoc tao dua tren cac file:

- `src/routes/cart.routes.js`
- `src/controllers/cart.controller.js`
- `src/services/cart.service.js`
- `src/models/cart.model.js`

## Base URL

```text
http://localhost:3000/api/cart
```

Neu project cua ban chay port khac, doi lai cho phu hop.

## Authentication

Tat ca API cart deu di qua:

- `authMiddleware`
- `authorizeRoles('user', 'admin', 'shop')`

Can them header sau trong Postman:

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

## 1. Lay gio hang theo user

- Method: `GET`
- URL:

```text
{{base_url}}/getCartByUserId/{{userId}}
```

- Body: khong co

### Test tren Postman

Path param mau:

```text
65f001122334455667788990
```

### Luu y

Controller hien tai khong dung `req.params.userId`, ma dang lay `req.user._id`.

Trong `authMiddleware`, `req.user` dang co dang:

```js
req.user = { userId: user._id, role: user.role };
```

Vi vay API nay kha nang cao se loi hoac tra ve sai du lieu neu chua sua code.

## 2. Them san pham vao gio hang

- Method: `POST`
- URL:

```text
{{base_url}}/addItemToCart/{{userId}}
```

### Body JSON de test

```json
{
  "productId": "65f111122334455667788991",
  "sku": "TSHIRT-BLACK-M",
  "color": "black",
  "quantity": 2
}
```

### Luu y

Route dang khai bao `:userId`, nhung controller lai doc:

```js
const cartId = req.params.cartId;
```

Service `addItemToCart` cung yeu cau `cartId`, khong phai `userId`.

Nghia la de test thanh cong theo code hien tai, route dang bi lech voi controller/service.

## 3. Xoa mot san pham khoi gio hang

- Method: `POST`
- URL:

```text
{{base_url}}/removeItemFromCart/{{userId}}
```

### Body JSON de test

```json
{
  "productId": "65f111122334455667788991",
  "sku": "TSHIRT-BLACK-M"
}
```

### Luu y

Controller dang doc:

```js
const { cartId } = req.params;
```

Nhung route lai truyen `userId`.

Ngoai ra controller dang goi `CartService.removeItemFromCart(...)`, trong khi file import la `cartService`.

API nay kha nang cao se loi runtime.

## 4. Cap nhat so luong san pham trong gio hang

- Method: `PUT`
- URL:

```text
{{base_url}}/updateItemQuantity/{{userId}}
```

### Body JSON de test

```json
{
  "productId": "65f111122334455667788991",
  "sku": "TSHIRT-BLACK-M",
  "quantity": 3
}
```

### Luu y

Controller tiep tuc doc `cartId` tu `req.params`, trong khi route la `userId`.

## 5. Xoa toan bo gio hang

- Method: `DELETE`
- URL:

```text
{{base_url}}/deleteCart/{{userId}}
```

- Body: khong co

### Luu y

Controller hien tai viet nham thu tu tham so:

```js
async deleteCart(res, req, next)
```

Dung ra phai la:

```js
async deleteCart(req, res, next)
```

Ngoai ra controller van doc `cartId` tu `req.params`, trong khi route dang la `userId`.

## Postman Collection Variables goi y

Ban co the tao cac bien sau trong Postman:

```text
base_url = http://localhost:3000/api/cart
access_token = <jwt_token>
userId = 65f001122334455667788990
productId = 65f111122334455667788991
sku = TSHIRT-BLACK-M
```

## Mau body nhanh de copy

### Add item

```json
{
  "productId": "{{productId}}",
  "sku": "{{sku}}",
  "color": "black",
  "quantity": 1
}
```

### Remove item

```json
{
  "productId": "{{productId}}",
  "sku": "{{sku}}"
}
```

### Update quantity

```json
{
  "productId": "{{productId}}",
  "sku": "{{sku}}",
  "quantity": 5
}
```

## Ket luan

Danh sach API theo route hien tai:

- `GET /api/cart/getCartByUserId/:userId`
- `POST /api/cart/addItemToCart/:userId`
- `POST /api/cart/removeItemFromCart/:userId`
- `PUT /api/cart/updateItemQuantity/:userId`
- `DELETE /api/cart/deleteCart/:userId`

Tuy nhien code hien tai dang bi lech giua `routes`, `controller`, `service`:

- Route dung `userId`
- Controller/service lai dang xu ly `cartId`
- `getCartByUserId` doc sai key `req.user._id`
- `removeItemFromCart` goi sai ten service
- `deleteCart` viet nguoc thu tu `req`, `res`

Neu ban muon, toi co the sua tiep module cart de cac API nay chay dung theo `userId` hoac chuyen dong bo sang `cartId`.
