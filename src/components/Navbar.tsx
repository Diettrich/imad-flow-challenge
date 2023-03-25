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
    <header className="fixed w-full border-b-[0.5px] bg-white">
      <Container className="flex items-center">
        <Link className="mr-6 px-6 py-4 font-bold" href="/">
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
