import OfertasNuevas from "@/components/home/nuevasOfertas";
import SobreNosotros from "@/components/home/sobreNosotros";
import JuegosNuevos from "@/components/home/juegosNuevos";
import ConsolasNuevas from "@/components/home/consolasNuevas";

export default function Home() {
  return (
    <main>
      <SobreNosotros />

      <JuegosNuevos />

      <ConsolasNuevas />

      <OfertasNuevas />
    </main>
  );
}
