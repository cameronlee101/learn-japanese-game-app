import { Chapters, Topics } from "@/app/utils/content-utils";
import React from "react";
import ReactDOM from "react-dom";

const TopicStatusModal = (props: {
  onClose: () => void;
  isSelectionValid: (chapter: string, topic: string) => boolean;
}) => {
  const { onClose, isSelectionValid } = props;

  const modalContent = (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-auto h-full w-full flex items-center justify-center"
      data-test="topic-status-modal"
    >
      <div className="p-8 border lg:w-1/2 w-96 shadow-lg rounded-md bg-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold">
            Valid Chapter and Topic Selections
          </h3>
          <div className="overflow-x-auto mt-2">
            <table className="table table-striped table-hover table-bordered table-sm">
              <tbody>
                <tr>
                  <td></td>
                  {Object.values(Topics).map((topic) => (
                    <td key={topic} className="w-1/6">
                      {topic}
                    </td>
                  ))}
                </tr>
                {Object.values(Chapters).map((chapter) => (
                  <tr key={chapter}>
                    <td className="w-1/6 whitespace-nowrap">{chapter}</td>
                    {Object.values(Topics).map((topic) => (
                      <td key={topic} className="w-1/6">
                        <div
                          className={
                            isSelectionValid(chapter, topic)
                              ? "bg-green-600"
                              : "bg-red-600"
                          }
                        >
                          &nbsp;
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-2">
            <button
              className="btn btn-secondary"
              onMouseUp={onClose}
              data-test="modal-close"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (document.getElementById("modal-root")) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal-root")!,
    );
  } else {
    console.error("Error: could not get HTML element to attach modal to");
    return modalContent;
  }
};

export default TopicStatusModal;
