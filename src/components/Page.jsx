import clsx from "clsx";

const Page = ({ bounded, children }) => {
  return (
    <div className={clsx("flex flex-col", bounded && "h-[calc(100vh-120px)]")}>
      {children}
    </div>
  );
};

export default Page;
