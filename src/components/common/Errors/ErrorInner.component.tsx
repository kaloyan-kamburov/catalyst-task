interface Props {
  errorText: string;
  onRetry: () => void;
}

const ErrorInner: React.FC<Props> = ({ errorText = "Something went wrong", onRetry }) => {
  return (
    <div className="flex flex-col gap-2 absolute inset-0 flex items-center justify-center">
      <div className="text-red-500">{errorText}</div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
        onClick={onRetry}
      >
        Retry
      </button>
    </div>
  );
};

export default ErrorInner;
