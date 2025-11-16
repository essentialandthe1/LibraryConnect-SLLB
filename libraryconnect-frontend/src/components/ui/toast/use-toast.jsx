import * as React from "react";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 3000;

let count = 0;
const genId = () => (++count).toString();

let memoryState = { toasts: [] };
const listeners = [];
const timeouts = new Map();

const action = {
  ADD: "ADD",
  UPDATE: "UPDATE",
  DISMISS: "DISMISS",
  REMOVE: "REMOVE",
};

const reducer = (state, act) => {
  switch (act.type) {
    case action.ADD:
      return {
        ...state,
        toasts: [act.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case action.UPDATE:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === act.toast.id ? { ...t, ...act.toast } : t
        ),
      };

    case action.DISMISS:
      addToRemoveQueue(act.toastId);
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          act.toastId === undefined || t.id === act.toastId
            ? { ...t, open: false }
            : t
        ),
      };

    case action.REMOVE:
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== act.toastId),
      };
  }
};

function dispatch(act) {
  memoryState = reducer(memoryState, act);
  listeners.forEach((l) => l(memoryState));
}

function addToRemoveQueue(id) {
  if (timeouts.has(id)) return;

  const timeout = setTimeout(() => {
    timeouts.delete(id);
    dispatch({ type: action.REMOVE, toastId: id });
  }, TOAST_REMOVE_DELAY);

  timeouts.set(id, timeout);
}

export function toast(props) {
  const id = genId();

  dispatch({
    type: action.ADD,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) =>
        !open && dispatch({ type: action.DISMISS, toastId: id }),
    },
  });

  return {
    id,
    dismiss: () => dispatch({ type: action.DISMISS, toastId: id }),
    update: (props) => dispatch({ type: action.UPDATE, toast: { ...props, id } }),
  };
}

export function useToast() {
  const [state, setState] = React.useState(memoryState);

  React.useEffect(() => {
    listeners.push(setState);

    return () => {
      listeners.splice(listeners.indexOf(setState), 1);
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: (id) => dispatch({ type: action.DISMISS, toastId: id }),
  };
}
