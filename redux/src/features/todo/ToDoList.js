import React, { useState } from "react";
import { useDispatch } from "react-redux";
import validateInput from "../../helperFunction";
import LineItem from "./LineItem";
import styles from "./ToDoList.module.css";
import { add } from "./todoListSlice";

const ToDoList = (props) => {
  const [arrListItem, setArrListItem] = useState([]);
  const [arrSelectedListItemId, setArrSelectedListItemId] = useState([]);
  const [textboxAddItem, setTextboxAddItem] = useState("");
  const [validationError, setValidationError] = useState("");

  const dispatch = useDispatch();

  const handleChangeTxtInputAddItem = (event) => {
    setTextboxAddItem(event.target.value);
  };

  const handleClickAddBtn = () => {
    if (validateInput(textboxAddItem)) {
      // setArrListItem((prevListItem) => [
      //   ...prevListItem,
      //   { id: uuidv4(), content: textboxAddItem },
      // ]);
      dispatch(add(textboxAddItem));
      setTextboxAddItem("");
      setValidationError("");
    } else setValidationError("Item content cannot be empty");
  };

  const handleEnterKeyAddItem = ({ key }) => {
    if (key === "Enter") handleClickAddBtn();
  };

  const handleChangeLineItemCheckbox = (e) => {
    const { id, checked } = e.target;
    if (!checked) {
      setArrSelectedListItemId(
        arrSelectedListItemId.filter((itemId) => itemId !== id)
      );
    } else {
      setArrSelectedListItemId((prevArr) => [...prevArr, id]);
    }
  };

  const handleClickClearSelectedBtn = () => {
    setArrSelectedListItemId([]);
    setArrListItem(
      arrListItem.filter((item) => !arrSelectedListItemId.includes(item.id))
    );
  };

  const handleClickClearAllBtn = () => {
    setArrListItem([]);
    setArrSelectedListItemId([]);
    setValidationError("");
  };

  const handleUpdateContent = (id, newContent) => {
    const newListItem = [...arrListItem];
    for (let item of newListItem) {
      if (item.id === id) {
        item.content = newContent;
        break;
      }
    }
    setArrListItem(newListItem);
  };

  const handleValidationError = (msg) => {
    setValidationError(msg);
  };

  return (
    <div>
      <h1>{props.title}</h1>
      <p>
        <span className="validation-error">{validationError}</span>
      </p>
      <input
        type="text"
        placeholder="Add items"
        onChange={handleChangeTxtInputAddItem}
        onKeyPress={handleEnterKeyAddItem}
        value={textboxAddItem}
      />
      <button onClick={handleClickAddBtn}>Add item</button>
      <button
        onClick={handleClickClearSelectedBtn}
        disabled={arrSelectedListItemId.length > 0 ? "" : "disabled"}
      >
        Clear selected
      </button>
      <button
        disabled={arrListItem.length > 0 ? "" : "disabled"}
        onClick={handleClickClearAllBtn}
      >
        Clear all
      </button>
      <ul className={styles.ul}>
        {arrListItem.map((listItem) => (
          <LineItem
            key={listItem.id}
            listItem={listItem}
            onChangeCheckbox={handleChangeLineItemCheckbox}
            onUpdate={handleUpdateContent}
            validationError={handleValidationError}
          />
        ))}
      </ul>
    </div>
  );
};

export default ToDoList;
