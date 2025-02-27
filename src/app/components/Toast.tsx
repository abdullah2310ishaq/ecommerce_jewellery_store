"use client";
import { useToast } from "vyrn";

export default function MyComponent() {
  const toast = useToast();

  const showToasts = () => {
    // Basic toasts
    toast.success("Success message");
    toast.error("Error message");
    toast.warning("Warning message");
    toast.info("Info message");

    // Custom styled toast
    toast.custom(
      <div className="font-bold">Custom styled toast</div>,
      {
        className: "bg-white text-black border-l-4 border-purple-500",
        duration: 5000
      }
    );

    // Complex toast with actions
    toast.custom(
      <div>
        <h3>Complex Toast</h3>
        <p>With actions and input</p>
      </div>,
      {
        className: "bg-gray-100 text-gray-800 border-l-4 border-blue-500",
        duration: 0,
        actions: [
          {
            label: "Action",
            onClick: () => console.log("Action clicked"),
            className: "bg-blue-500 text-white px-2 py-1 rounded"
          }
        ]
      }
    );
  };

  return (
    <button onClick={showToasts}>
      Show Toasts
    </button>
  );
}