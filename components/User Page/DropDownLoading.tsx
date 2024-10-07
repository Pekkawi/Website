import { motion } from "framer-motion";

const DropDownLoading = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center p-4"
    >
      <svg
        className="size-5 animate-spin text-gray-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8l6.293-6.293a1 1 0 011.414 0l1.414 1.414a1 1 0 010 1.414L12 19.414l-7.707-7.707a1 1 0 010-1.414l1.414-1.414A1 1 0 014 12z"
        ></path>
      </svg>
      <p className="ml-3 text-gray-500">Loading...</p>
    </motion.div>
  );
};

export default DropDownLoading;