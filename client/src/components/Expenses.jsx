import { Form } from "./Form";
import {
  createExpense,
  editExpense,
  deleteExpense,
  getExpenses,
} from "../api/expenses";
import { EXPENSE_TAGS } from "../constants";

export const Expenses = () => {
  return (
    <Form
      formTitle={"Expense"}
      createObject={createExpense}
      updateObject={editExpense}
      deleteObject={deleteExpense}
      getObjects={getExpenses}
      tagOptions={EXPENSE_TAGS}
    />
  );
};
