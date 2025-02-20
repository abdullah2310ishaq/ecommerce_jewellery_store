import Filters from "./product_components/Filters";
import ProductList from "./product_components/ProductList";

// Main Products Page Component
const ProductsPage = () => {
  return (
    <section className="container mx-auto py-16 px-6">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-10">
        Explore Our Exclusive Jewelry
      </h1>

      {/* Layout - Sidebar + Products Grid */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Sidebar - Filters */}
        <aside className="w-full md:w-1/4">
          <Filters />
        </aside>

        {/* Right Section - Products Grid */}
        <div className="w-full md:w-3/4">
          <ProductList />
        </div>
      </div>
    </section>
  );
};

export default ProductsPage;
