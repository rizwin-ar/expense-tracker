import React, { useContext, useState, useEffect } from "react";
import { Button, Card, Row, Col } from "antd";
import { GlobalContext } from "../../context/global-state";
import ExpenseTable from "./ExpenseTable";
import AddEntryForm, { Entry } from "./AddEntryForm";
import { db } from "../../services/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
} from "firebase/firestore";
import dayjs from "dayjs";
import "./Expense-tracker.css"

interface ExpenseTrackerProps {
  toggle: boolean;
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({
  toggle,
  setToggle,
}) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const { state, dispatch } = useContext(GlobalContext);

  useEffect(() => {
    const fetchEntries = async () => {
      if (!state.user) return;

      try {
        const userId = state.user.uid;
        const q = query(
          collection(db, `users/${userId}/transactions`),
          orderBy("date", "desc")
        );
        const querySnapshot = await getDocs(q);

        const entriesData: Entry[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            date: dayjs(data.date.toDate()),
            type: data.type,
            category: data.category,
            amount: data.amount,
          } as Entry;
        });

        setEntries(entriesData);

        const totalIncome = entriesData
          .filter((entry) => entry.type === "income")
          .reduce((acc, curr) => acc + (curr.amount ?? 0), 0);
        const totalExpense = entriesData
          .filter((entry) => entry.type === "expense")
          .reduce((acc, curr) => acc + (curr.amount ?? 0), 0);

        dispatch({
          type: "UPDATE_TOTALS",
          payload: { totalIncome, totalExpense },
        });
      } catch (error) {
        console.error("Error fetching entries:", error);
      }
    };

    fetchEntries();
  }, [state.user, dispatch]);

  const handleAdd = async (entry: Entry) => {
    if (!state.user) {
      console.error("User not authenticated");
      return;
    }

    try {
      const userId = state.user.uid;
      const docRef = await addDoc(
        collection(db, `users/${userId}/transactions`),
        {
          ...entry,
          date: entry.date.toDate(),
        }
      );
      const newEntry = { id: docRef.id, ...entry };
      const updatedEntries = [...entries, newEntry];
      setEntries(updatedEntries);

      const totalIncome = updatedEntries
        .filter((entry) => entry.type === "income")
        .reduce((acc, curr) => acc + (curr.amount ?? 0), 0);
      const totalExpense = updatedEntries
        .filter((entry) => entry.type === "expense")
        .reduce((acc, curr) => acc + (curr.amount ?? 0), 0);

      dispatch({ type: "ADD_TRANSACTION", payload: newEntry });
      dispatch({
        type: "UPDATE_TOTALS",
        payload: { totalIncome, totalExpense },
      });
    } catch (error) {
      console.error("Error adding entry:", error);
    }
  };

  const changeToggle = () => {
    setToggle((prevToggle) => !prevToggle);
  };

  const totalIncome = state.totalIncome;
  const totalExpense = state.totalExpense;
  const currentBalance = totalIncome - totalExpense;
  const formattedBalance = currentBalance.toFixed(2);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        padding: "20px",
        gap: 25,
        justifyContent: "center",
        marginTop: 80
      }}
    >
      <div className="expense-wrapper">

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={24} xl={24}>
            <Card>
              <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                Current Balance
              </p>
              <p
                style={{
                  fontSize: "24px",
                  color: currentBalance >= 0 ? "green" : "red",
                }}
              >
                ${formattedBalance}
              </p>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8} lg={12} xl={12}>
            <Card>
              <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                Total Income
              </p>
              <p style={{ fontSize: "24px", color: "green", margin: "unset" }}>${totalIncome}</p>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8} lg={12} xl={12}>
            <Card>
              <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                Total Expense
              </p>
              <p style={{ fontSize: "24px", color: "red", margin: "unset" }}>${totalExpense}</p>
            </Card>
          </Col>

        </Row>
        <div style={{ marginTop: 16, alignItems: "flex-end", display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={changeToggle}
            type="primary"
          >
            {toggle ? "Cancel" : "Add Income/Expense"}
          </Button>
        </div>
        {toggle && <AddEntryForm onAdd={handleAdd} />}
      </div>
      <div className="expense-wrapper">
        <ExpenseTable entries={entries} />
      </div>
    </div>
  );
};

export default ExpenseTracker;
