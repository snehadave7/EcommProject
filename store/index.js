import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import productSlice from "./productSlice"
import shoppingCartSlice from "./cartItemsSlice"
import addressSlice from "./addressSlice"
import orderReducer from "./orderSlice"
import shopSearchSlice  from "./searchSlice";
import categorySlice from "./categorySlice";
import subCategorySlice from "./subCategorySlice";
import reviewSlice from "./reviewSlice";
import reportSlice from "./reportSlice";
import adminUserSlice from "./adminUserSlice";
const store = configureStore({
  reducer: {
    user: userReducer,
    shopProduct: productSlice,
    shopCart: shoppingCartSlice,
    shopAddress: addressSlice,
    order: orderReducer,
    shopSearch: shopSearchSlice,
    shopCategory: categorySlice,
    shopSubCategory: subCategorySlice,
    review: reviewSlice,
    report: reportSlice,
    adminUser: adminUserSlice
  },
});

export default store;
