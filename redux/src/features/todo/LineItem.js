import React, { useEffect, useRef, useState } from "react";
import validateInput from "../../helperFunction";

const LineItem = (props) => {
  const { onChangeCheckbox, onUpdate, validationError } = props;
  const { id, content } = props.listItem;
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState(content);

  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  });

  const handleChangeEditContent = (e) => {
    setEditContent(e.target.value);
  };

  const notifySave = () => {
    if (validateInput(editContent)) {
      setEditMode(false);
      onUpdate(id, editContent);
      validationError("");
    } else {
      validationError("Item content cannot be empty");
      if (inputRef.current) inputRef.current.focus();
    }
  };

  const handleBlur = (e) => {
    const { relatedTarget } = e;
    if (!relatedTarget || relatedTarget.value !== "save") {
      setEditMode(false);
      setEditContent(content);
      validationError("");
    }
  };

  return editMode ? (
    <li>
      <button onClick={notifySave} value="save">
        save
      </button>
      <input
        type="text"
        value={editContent}
        onChange={handleChangeEditContent}
        onBlur={handleBlur}
        ref={inputRef}
      />
    </li>
  ) : (
    <li>
      <button onClick={() => setEditMode(true)}>edit</button>
      <input type="checkbox" id={id} onChange={onChangeCheckbox} />
      <span>{content}</span>
    </li>
  );
};

export default LineItem;
