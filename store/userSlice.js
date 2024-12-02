import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Use this library to decode JWT

export const loginUser = createAsyncThunk(
  "login",
  async (credentials, { dispatch }) => {
    const response = await fetch("https://localhost:7152/api/Auth/Login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },

      body: JSON.stringify({
        userName: credentials.username,
        password: credentials.password,
        expiresInMins: 60, // optional, defaults to 60
      }),
    });
    const data = await response.json();
    let userId = null;
    let cartId = null;
    let role = null;
    if (data) {
      const userIdRequest = await fetch(
        `https://localhost:7152/api/Users/${credentials.username}`,
        {
          method: "GET",
        }
      );
      userId = await userIdRequest.json();
      role=userId.role;
      if (userId.id) {
        localStorage.setItem("userId", JSON.stringify(userId.id));
        localStorage.setItem("role", userId.role);
      }
    }
    localStorage.setItem("user", JSON.stringify(data));
    localStorage.setItem("token", data.token);
    console.log(role);
    if (role === "customer") {
      const checkCartRequest = await fetch(
        `https://localhost:7152/api/Carts/${userId.id}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${data.token}`,
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      const checkCartResponse = await checkCartRequest.text();
      // console.log("Check cart response body", checkCartResponse);

      if (checkCartRequest.status === 404) {
        const createCart = await fetch("https://localhost:7152/api/Carts", {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${data.token}`,
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            userId: userId.id,
          }),
        });
        const resp = await createCart.json();
        cartId = resp.id;
      } else {
        if (checkCartResponse) {
          const checkCart = JSON.parse(checkCartResponse);
          cartId = checkCart.id;
        }
      }
       console.log(cartId);
      localStorage.setItem("cartId", JSON.stringify(cartId));
    }
    return { data, cartId };
  }
);

export const registerUser = createAsyncThunk(
  "register",
  async (credentials) => {
    console.log(credentials);
    const response = await fetch("https://localhost:7152/api/Auth/Register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },

      body: JSON.stringify({
        FirstName: credentials.firstName,
        LastName: credentials.lastName,
        UserName: credentials.userName,
        ContactNumber: credentials.contactNumber,
        Password: credentials.password,
        Email: credentials.email,
        Role: credentials.role,
        expiresInMins: 60, // optional, defaults to 60
      }),
    });
    const data = await response.json();
    if (data) {
      const userIdRequest = await fetch(
        `https://localhost:7152/api/Users/${credentials.username}`,
        {
          method: "GET",
        }
      );
    }

    return data;
  }
);



const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    // isAuthenticated:false,
    user: null,
    cartId: null,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.cartId = null;
      // state.isAuthenticated=false;
      state.error = null;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("cartId");
      localStorage.removeItem("role");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.user = null;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.cartId = action.payload.cartId;
        // state.isAuthenticated=true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.error;
      });
    builder
      .addCase(registerUser.pending, (state, action) => {
        state.loading = true;
        state.user = null;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload;
      });
  },
});
export const { logout } = userSlice.actions;
export default userSlice.reducer;
