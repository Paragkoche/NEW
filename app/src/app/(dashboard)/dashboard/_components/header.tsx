"use client";
import { useHeader } from "../../_ctx/header.ctx";
const Header = () => {
  const { headerName } = useHeader();
  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 left-0 z-50 px-9">
      <p className="text-xl uppercase">{headerName}</p>
    </div>
  );
};

export default Header;
