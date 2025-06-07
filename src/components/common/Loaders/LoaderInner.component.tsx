// this component will be used to display a loader inside another component
// NOTE: must be placed inside a position relative container

const LoaderInner = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/75">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default LoaderInner;
