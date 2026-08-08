import { Link } from "react-router-dom";
import Media from "../Media/Media";
import type { Product } from "../../data/site";
import "./ProductCard.css";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to="/produkter" className="pcard media--hover">
      <div className="pcard__media">
        <Media
          src={product.image}
          alt={`Burk med ${product.name}`}
          label={product.name}
          ratio="4/5"
          rounded="md"
          className="media--product"
        />
        <span className="pcard__season">{product.season}</span>
      </div>
      <div className="pcard__body">
        <h3 className="pcard__name">{product.name}</h3>
        <p className="pcard__tagline">{product.tagline}</p>
        <ul className="pcard__notes">
          {product.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
