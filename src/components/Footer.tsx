import { HeartFilledIcon } from "@radix-ui/react-icons";
import type { FunctionComponent } from "react";
import Container from "./Container";

const Footer: FunctionComponent = () => {
  return (
    <footer className="mt-auto border-t-[0.5px] py-10">
      <Container>
        <div className="flex items-center justify-center pb-2">
          <span>Made with</span>
          <HeartFilledIcon className="mx-2 animate-ping text-red-700" />
          <span>by Imad</span>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
