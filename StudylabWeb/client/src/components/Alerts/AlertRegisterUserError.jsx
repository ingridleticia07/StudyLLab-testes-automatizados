import { useEffect } from "react";

export default function AlertRegisterUserError({ onHide, text }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onHide();
    }, 6000);
    return () => clearTimeout(timer);
  }, [onHide]);

  return (
    <div className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md text-center">
      {text}
    </div>
  );
}
