import ApiTestComponent from '../components/ApiTestComponent';

export default function ApiTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          MedConnect API Integration Test
        </h1>
        <ApiTestComponent />
      </div>
    </div>
  );
}