import api from "./api";

export const createIncomes = async (payload) => {
  try {
    const { userId } = payload;
    const { data } = await api.post(`/add-income/${userId}`, payload);

    return data;
  } catch (error) {
    const message =
      error.response?.data.message ||
      "an error occurred while creating the income please try again";

    throw new Error(message);
  }
};

export const getIncomes = async (userId) => {
  try {
    const { data } = await api.get(`/get-incomes/${userId}`);
    return data;
  } catch (error) {
    const message =
      error.response?.data.message ||
      "an error occurred while fetching the Incomes please try again";

    throw new Error(message);
  }
};
export const getTotalIncomes = async (userId) => {
  try {
    const { data } = await api.get(`/get-total-incomes/${userId}`);
    return data;
  } catch (error) {
    const message =
      error.response?.data.message ||
      "an error occurred while fetching the total Incomes please try again";

    throw new Error(message);
  }
};

export const editIncome = async (userId, incomeId, income) => {
  try {
    const { data } = await api.patch(`/update-income/${userId}/${incomeId}`, income);
    return data;
  } catch (error) {
    const message =
      error.response?.data.message ||
      "an error occurred while updating incomes please try again";
    throw new Error(message);
  }
};

export const deleteIncome = async (userId, incomeId) => {
  try {
    const { data } = await api.delete(`/delete-income/${userId}/${incomeId}`);
    return data;
  } catch (error) {
    const message =
      error.response?.data.message ||
      "an error occurred while deleting income please try again";
    throw new Error(message);
  }
};

export const getIncomeByDate = async (userId, { year, start, end }) => {
  try {
    const { data } = await api.get(
      `/get-incomes/${userId}?start=${start}&year=${year}&end=${end}`
    );
    return data;
  } catch (error) {
    console.log(error);

    const message =
      error.response?.data.message ||
      "an error occurred while fetching the expense please try again";
    throw new Error(message);
  }
};
