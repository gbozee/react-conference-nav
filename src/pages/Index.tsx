import Navbar from "../components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-20 container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mt-8">Welcome to the Conference</h1>
      </main>
    </div>
  );
};

export default Index;