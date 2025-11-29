import {
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaMailBulk,
  FaMailchimp,
} from "react-icons/fa";

export default function RedesSociales() {
  return (
    <div className="text-center md:text-left">
      <h2 className="font-bold mb-2">Nuestras redes</h2>
      <div className="flex flex-col items-center md:items-start gap-2">
        <a
          href="https://facebook.com/tupagina"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 mb-2 hover:underline"
        >
          <FaFacebook size={20} />
          <span>ImperioPlay</span>
        </a>

        <a
          href="https://facebook.com/tupagina"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 mb-2 hover:underline "
        >
          <FaInstagram size={20} />
          <span>ImperioPlay</span>
        </a>
        <a
          href="mailto:contacto@imperioplay.cl"
          className="flex items-center gap-2 mb-2 hover:underline"
        >
          <FaEnvelope size={20} />
          <span>contacto@imperioplay</span>
        </a>
      </div>
    </div>
  );
}
