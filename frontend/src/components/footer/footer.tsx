import Contacto from "./contacto";
import Enlaces from "./enlaces";
import RedesSociales from "./redesSociales";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-2">
      <div className="max-w-full mx-4 md:mx-auto px-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Contacto />
          <RedesSociales />
          <Enlaces />
        </div>
      </div>
    </footer>
  );
}
