import api from "./api";

export const createExpense = async (payload) => {
  try {
    const { userId } = payload;
    const { data } = await api.post(`/add-expense/${userId}`, payload);

    return data;
  } catch (error) {
    const message =
      error.response?.data.message ||
      "an error occurred while creating the expense please try again";

    throw new Error(message);
  }
};

export const getExpenses = async (userId) => {
  try {
    const { data } = await api.get(`/get-expenses/${userId}`);
    return data;
  } catch (error) {
    const message =
      error.response?.data.message ||
      "an error occurred while fetching the expenses please try again";

    throw new Error(message);
  }
};
export const getTotalExpenses = async (userId) => {
  try {
    const { data } = await api.get(`/get-total-expenses/${userId}`);
    return data;
  } catch (error) {
    const message =
      error.response?.data.message ||
      "an error occurred while fetching the total expenses please try again";

    throw new Error(message);
  }
};

export const editExpense = async (userId, expenseId, expense) => {
  try {
    const { data } = await api.patch(`/update-expense/${userId}/${expenseId}`, expense);
    return data;
  } catch (error) {
    const message =
      error.response?.data.message ||
      "an error occurred while updating expenses please try again";
    throw new Error(message);
  }
};

export const deleteExpense = async (userId, expenseId) => {
  try {
    const { data } = await api.delete(`/delete-expense/${userId}/${expenseId}`);
    return data;
  } catch (error) {
    const message =
      error.response?.data.message ||
      "an error occurred while deleting expense please try again";
    throw new Error(message);
  }
};

export const getExpensesByDate = async (userId, { year, start, end }) => {
  try {
    const { data } = await api.get(
      `/get-expenses/${userId}?start=${start}&year=${year}&end=${end}`
    );
    return data;
  } catch (error) {
    
    const message =
      error.response?.data.message ||
      "an error occurred while fetching the expense please try again";
    throw new Error(message);
  }
};
