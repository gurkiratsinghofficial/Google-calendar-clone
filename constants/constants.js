/**
 * error constants to be used in controllers are exported
 */
exports.constants = {
  TRUE: "true",
  FALSE: "false",
  DELETE_EVENT: {
    success: "true",
    message: "event deleted",
  },
  EMAIL_EXIST: {
    success: "false",
    message: "email already exists",
  },
  ERROR_NEW_USER: {
    success: "false",
    message: "error creating a new user",
  },
  SIGNUP_SUCCESS: {
    success: "true",
    message: "signup successful",
  },
  SIGNUP_FAILED: {
    success: "false",
    message: "signup unsuccessful",
  },
  USER_CONFIRMED: {
    success: "true",
    message: "email is confirmed",
  },
  USER_FETCH: "user fetched",
  INVALID_LOGIN: {
    success: "false",
    message: "User does not exist",
  },
  WRONG_CREDS: {
    success: "false",
    message: "wrong password or email",
  },
  JWT_ERR: {
    success: "false",
    message: "JWT token cannot be sent",
  },
  CONFIRM_EMAIL: {
    success: "false",
    message: "Please confirm email first",
  },
  LOGIN_SUCCESS: "user is logged in!",
  EMAIL_NOT_FOUND: {
    success: "false",
    message: "email not found",
  },
  CANNOT_UPDATE_USER: {
    success: "false",
    message: "cannot update user",
  },
  USER_UPDATED: {
    success: "true",
    message: "user details are updated",
  },
  UPDATE_SUCCESS: {
    success: "true",
    message: "user details are updated",
  },
  PROD_CREATED: {
    success: "true",
    message: "Product created",
  },
  CANNOT_CREATE_PRODUCT: {
    success: "false",
    message: "product cannot be added",
  },
  CANNOT_CREATE_CATEGORY: {
    success: "false",
    message: "category cannot be added",
  },
  CATEGORY_CREATED: {
    success: "true",
    message: "new category created",
  },
  ACCESS_DENIED: {
    success: "false",
    message: "Login required",
  },
  USER_NOT_FOUND: {
    success: "false",
    message: "Account does not exist, please signup",
  },
  USER_NOT_SIGN: {
    success: "false",
    message: "user is not signed in",
  },
  USER_NOT_AUTH: {
    success: "false",
    message: "user is not authenticated",
  },
  ADMIN_GRANT_ERROR: {
    success: "false",
    message: "Cannot grant admin access to a user",
  },
  deleteCategorySuccess: {
    success: "true",
    message: "Category deleted!",
  },
  ERROR_FETCHING_PRODUCTS: {
    success: "false",
    message: "error while fetching products from database",
  },
  PRODUCT_ID_ERROR: {
    success: "false",
    message: "Product id is required",
  },
  DELETE_PROD_SUCCESS: {
    success: "true",
    message: "Product deleted successfully",
  },
  DELETE_PROD_ERROR: {
    success: "false",
    message: "error occured while deleting product",
  },
  CATEGORY_NOT_EXIST: {
    success: "false",
    message: "Category entered does not exist, please create it",
  },
  CATEGORY_EXIST: {
    success: "false",
    message: "Category already exists",
  },
  AUTHORISATION: "Authorization",
  CATEGORY_ERROR: {
    success: "false",
    message: "Category cannot be created",
  },
  PRODUCT_ERROR: {
    success: "false",
    message: "Product cannot be created",
  },
  CANNOT_CREATE_CART: {
    success: "false",
    message: "Cart cannot be created",
  },
  CART_SUCCESS: {
    success: "true",
    message: "cart items fetched",
  },
  CART_ITEM_ADDED: {
    success: "true",
    message: "Item added to cart",
  },
  WISH_ITEM_ADDED: {
    success: "true",
    message: "Item added to wishlist",
  },
  CART_UPDATED: {
    success: "true",
    message: "Cart item updated",
  },
  EMAIL_REQUIRED: {
    success: "false",
    message: "Email is required to reset password",
  },
  EMAIL_SENT: {
    success: "true",
    message: "An email with link has been sent to your account",
  },
  NO_PROD_EXIST: {
    success: "true",
    message: "No product exists with this ID",
  },
  RESET_MAIL_SENT: {
    success: "true",
    message: "Check email for reset password link",
  },
  PASSWORD_CHANGED: {
    success: "true",
    message: "Password is updated",
  },
  OPTION_EXIST: {
    success: "false",
    message: "Option already exists",
  },
  OPTION_CREATED: {
    success: "true",
    message: "New option added",
  },
  CANNOT_CREATE_OPTION: {
    success: "false",
    message: "New option cannot be created",
  },
  INSUF_STOCK: {
    success: "false",
    message: "Item out of stock",
  },
  WISH_SUCCESS: {
    success: "true",
    message: "wishlist fetched",
  },
  ID_REQUIRED: {
    success: "false",
    message: "user id required to send mails",
  },
  ORDER_NOT_FOUND: {
    success: "false",
    message: "order not found",
  },
  ORDER_DELIVER: {
    success: "true",
    message: "Order delivery mail sent",
  },
  TAX_ADDED: {
    success: "true",
    message: "Tax added",
  },
  CANNOT_ADD_TAX: {
    success: "false",
    message: "error while adding tax",
  },
  TAX_UPDATED: {
    success: "true",
    message: "Tax updated",
  },
  CANNOT_UPDATE_TAX: {
    success: "false",
    message: "error while updating tax",
  },
  ORDER_PLACED: {
    success: "true",
    message: "Order placed, check email for receipt",
  },
  CANNOT_CHECKOUT: {
    success: "false",
    message: "cannot place order",
  },
  PARENT_NOT_EXIST: {
    success: "false",
    message: "parent category entered does not exist",
  },
  PASSWORD_EMPTY: {
    success: "false",
    message: "Password cannot be empty",
  },
  SUB_CATEGORY_EXIST: {
    success: "false",
    message: "subcategory already exists",
  },
  SUB_CATEGORY_CREATED: {
    success: "true",
    message: "subcategory is created",
  },
  CANNOT_CREATE_SUBCATEGORY: {
    success: "false",
    message: "subcategory cannot be created",
  },
  SUBCATEGORY_NOT_EXIST: {
    success: "false",
    message: "subcategory does not exist",
  },
  SIGN_TEMP_UPDATED: {
    success: "true",
    message: "signup template is updated",
  },
  SUB_EDIT: {
    success: "true",
    message: "Sub category edited",
  },
  WISH_EXIST: {
    success: "false",
    message: "item already in wishlist",
  },
  CART_EXIST: {
    success: "false",
    message: "item already in cart",
  },
  MOVE_CART: {
    success: "true",
    message: "Item moved to cart",
  },
  UPDATE_EVENT: {
    success: "true",
    message: "Event updated",
  },
  ADD_EVENT: {
    success: "true",
    message: "New event added",
  },
  GET_USERS_SUCCESS: {
    success: "true",
    message: "All users data fetched",
  },
};
