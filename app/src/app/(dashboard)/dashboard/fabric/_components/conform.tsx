import { Trash2 } from "lucide-react";
import { forwardRef, Ref } from "react";

const ConformBox = forwardRef(
  (
    props: {
      okFun: () => void;
    },
    ref: Ref<HTMLDialogElement>
  ) => {
    return (
      <dialog ref={ref} className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() =>
                (ref as React.RefObject<HTMLDialogElement>)?.current?.close()
              }
            >
              ✕
            </button>
          </form>

          <h3 className="font-bold text-lg">Delete Fabric Rage</h3>
          <div className="modal-action">
            <button className="btn btn-sm" onClick={props.okFun}>
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>
      </dialog>
    );
  }
);

export default ConformBox;
