import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  CLEAR_ERRORS,
} from "../constants/userConstants";
import axios from "axios";

export const register = (userData) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_REQUEST });
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axios.post(`/api/v1/login`, userData, config);
    dispatch({ type: REGISTER_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({ type: REGISTER_FAIL, payload: error.response.data.message });
  }
};

export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
