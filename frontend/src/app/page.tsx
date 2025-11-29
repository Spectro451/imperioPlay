import OfertasNuevas from "@/components/home/nuevasOfertas";
import ProductosNuevos from "@/components/home/nuevosProductos";
import SobreNosotros from "@/components/home/sobreNosotros";

export default function Home() {
  return (
    <main>
      <SobreNosotros />

      <ProductosNuevos />

      <OfertasNuevas />
    </main>
  );
}
