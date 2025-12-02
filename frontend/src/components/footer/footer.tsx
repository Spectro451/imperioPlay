import Image from "next/image";
import Contacto from "./contacto";
import Enlaces from "./enlaces";
import RedesSociales from "./redesSociales";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-2 ">
      <div className="max-w-full mx-4 md:mx-auto px-2">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 ">
          <Contacto />
          <RedesSociales />
          <Enlaces />
          <div className="items-center justify-center m-auto">
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={100}
              height={100}
              priority={true}
              loading="eager"
              className="w-24 h-auto"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
