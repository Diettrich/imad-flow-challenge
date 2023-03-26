import Link from "next/link";
import type { FunctionComponent } from "react";
import Container from "./Container";

interface Link {
  label: string;
  href: string;
}

interface Props {
  links: Link[];
}

const Navbar: FunctionComponent<Props> = ({ links }) => {
  return (
    <header className="z-10 fixed w-full border-b-[0.5px] bg-white">
      <Container className="flex flex-col sm:flex-row py-4 justify-center sm:justify-start items-center">
        <Link className="text-sm mb-5 lg:text-base sm:mb-0 sm:mr-20 font-bold" href="/">
          Flow Challenge
        </Link>
        <nav>
          <ul className="flex justify-center space-x-10">
            {links.map((link) => (
              <Link
                className="hover:text-gray-500"
                key={link.href}
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
};

export default Navbar;
