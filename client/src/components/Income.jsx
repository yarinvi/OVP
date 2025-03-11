import { Form } from "./Form";
import {
  createIncomes,
  getIncomes,
  editIncome,
  deleteIncome,
} from "../api/income";
import { INCOME_TAGS } from "../constants";

export const Incomes = () => {
  return (
    <Form
      formTitle={"Income"}
      createObject={createIncomes}
      updateObject={editIncome}
      deleteObject={deleteIncome}
      getObjects={getIncomes}
      tagOptions={INCOME_TAGS}
    />
  );
};
