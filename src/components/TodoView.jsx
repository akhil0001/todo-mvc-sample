import { useActor } from "@xstate/react";
import PropTypes from "prop-types";
import { useCallback } from "react";
export const TodoView = ({ actorRef }) => {
  const [state, send] = useActor(actorRef);
  const { value, status } = state.context;
  const changeStatusCb = useCallback(() => {
    send("TOGGLE_STATUS");
  }, [send]);
  const onClear = useCallback(() => {
    send('DELETE');
  },[send])


  return (
      <li className="todo-item">
        <input
          type="checkbox"
          value={status === "completed"}
          checked={status === "completed"}
          onChange={changeStatusCb}
        />
        {value}
        <button onClick={onClear}></button>
      </li>
  );
};

TodoView.propTypes = {
  actorRef: PropTypes.object,
};
