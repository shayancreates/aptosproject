import { useState } from "react";

export default function CertificationForm() {
  const [certifications, setCertifications] = useState([
    {
      id: 1,
      name: "Organic Certification",
      issuer: "USDA",
      issueDate: "2023-01-15",
      expiryDate: "2024-01-15",
      status: "Valid",
      documentUrl: "https://example.com/cert1.pdf",
    },
    {
      id: 2,
      name: "Fair Trade Certification",
      issuer: "Fair Trade International",
      issueDate: "2023-03-20",
      expiryDate: "2024-03-20",
      status: "Valid",
      documentUrl: "https://example.com/cert2.pdf",
    },
  ]);

  const [newCert, setNewCert] = useState({
    name: "",
    issuer: "",
    issueDate: "",
    expiryDate: "",
    documentUrl: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cert = {
      id: Date.now(),
      ...newCert,
      status: "Pending",
    };
    setCertifications([...certifications, cert]);
    setNewCert({
      name: "",
      issuer: "",
      issueDate: "",
      expiryDate: "",
      documentUrl: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white text-black p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Add New Certification</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Certification Name
              </label>
              <input
                type="text"
                value={newCert.name}
                onChange={(e) =>
                  setNewCert({ ...newCert, name: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Issuing Authority
              </label>
              <input
                type="text"
                value={newCert.issuer}
                onChange={(e) =>
                  setNewCert({ ...newCert, issuer: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Issue Date
              </label>
              <input
                type="date"
                value={newCert.issueDate}
                onChange={(e) =>
                  setNewCert({ ...newCert, issueDate: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                value={newCert.expiryDate}
                onChange={(e) =>
                  setNewCert({ ...newCert, expiryDate: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Document URL
            </label>
            <input
              type="url"
              value={newCert.documentUrl}
              onChange={(e) =>
                setNewCert({ ...newCert, documentUrl: e.target.value })
              }
              className="w-full p-2 border rounded"
              placeholder="https://example.com/certificate.pdf"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Add Certification
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Current Certifications</h2>
        <div className="space-y-4">
          {certifications.map((cert) => (
            <div key={cert.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{cert.name}</h3>
                  <p className="text-sm text-gray-600">
                    Issued by: {cert.issuer}
                  </p>
                  <p className="text-sm text-gray-600">
                    Valid: {cert.issueDate} to {cert.expiryDate}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    cert.status === "Valid"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {cert.status}
                </span>
              </div>
              {cert.documentUrl && (
                <a
                  href={cert.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-sm mt-2 inline-block"
                >
                  View Certificate
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
