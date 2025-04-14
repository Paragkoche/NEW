"use client";
import Link from "next/link";
const Header = () => {
  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 left-0 z-50">
      <div className="flex-1">
        <Link href={"/dashboard"} className="btn btn-ghost text-xl">
          SOS
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href={"/dashboard/model/add"}>Add model</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
