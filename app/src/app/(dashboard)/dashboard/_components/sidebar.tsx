import { Home, PackageIcon, Rotate3d } from "lucide-react";
import Link from "next/link";
import { PropsWithChildren } from "react";
import SidebarSubmenu from "./sidebarsubmanu";

const SideBar = (props: PropsWithChildren) => {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content ">
        {/* Page content here */}
        {props.children}
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          {/* Sidebar content here */}
          <li className="mb-10">
            <Link href={"/dashboard"} className="hover:bg-transparent text-xl">
              SOS
            </Link>
          </li>
          <li>
            <Link href={"/dashboard"}>
              <Home />
              Home
            </Link>
          </li>

          {/* <li>
            <Link href={"/dashboard/fabric"}>
              <PackageIcon />
              Fabrics
            </Link>
          </li> */}

          <li>
            <Link href={""}>Product</Link>
            <ul>
              <li>
                <Link href={"/dashboard/fabric"}>
                  <PackageIcon />
                  Fabrics
                </Link>
              </li>
              <li>
                <Link href={"/dashboard/fabric/fabric-range"}>
                  <PackageIcon />
                  Fabrics Range
                </Link>
              </li>
            </ul>
          </li>

          <li>
            <Link href={""}>Product</Link>
            <ul>
              <li>
                <Link href={"/dashboard/product"}>
                  <Rotate3d />
                  Product
                </Link>
              </li>
              <li>
                <Link href={"/dashboard/model"}>
                  <Rotate3d />
                  Model
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
