import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const InstantService = () => {
  return (
    <div className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4">Instant Service</h1>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          Book reliable local professionals for home services, repairs, cleaning, and more—on-demand.
        </p>

        <div className="flex gap-3">
          <Link to="/find-services">
            <Button variant="brand">Find Services</Button>
          </Link>
          <Link to="/become-provider">
            <Button variant="outline">Provide a Service</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default InstantService;



