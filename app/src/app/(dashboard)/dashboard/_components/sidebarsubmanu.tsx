"use client";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

function SidebarSubmenu({
  submenu,
  icon,
  name,
}: {
  submenu: {
    path: string;
    name: string;
    icon: ReactNode;
  }[];
  icon: ReactNode;
  name: string;
}) {
  const location = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  /** Open Submenu list if path found in routes, this is for directly loading submenu routes  first time */
  useEffect(() => {
    if (
      submenu.filter((m) => {
        return m.path === location;
      })[0]
    )
      setIsExpanded(true);
  }, []);

  return (
    <>
      {/** Route header */}
      <li onClick={() => setIsExpanded(!isExpanded)}>
        {icon} {name}
        <ChevronDownIcon
          className={
            "w-5 h-5 mt-1 float-right delay-400 duration-500 transition-all  " +
            (isExpanded ? "rotate-180" : "")
          }
        />
      </li>

      {/** Submenu list */}
      <li className={` w-full ` + (isExpanded ? "" : "hidden")}>
        <ul className={`menu menu-compact`}>
          {submenu.map((m, k) => {
            console.log("ss->", m, k);

            return (
              <li key={k}>
                <Link href={m.path}>
                  {m.icon} {m.name}
                  {location == m.path ? (
                    <span
                      className="absolute mt-1 mb-1 inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-primary "
                      aria-hidden="true"
                    ></span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </li>
    </>
  );
}

export default SidebarSubmenu;
