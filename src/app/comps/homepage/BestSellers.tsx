// /components/BestSellers.tsx
const BestSellers = () => {
    return (
      <section className="py-10 text-center">
        <h3 className="text-2xl font-semibold mb-6">Best Sellers</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6">
          <div className="p-4 border">Product 1</div>
          <div className="p-4 border">Product 2</div>
          <div className="p-4 border">Product 3</div>
          <div className="p-4 border">Product 4</div>
        </div>
      </section>
    );
  };
  
  export default BestSellers;
  