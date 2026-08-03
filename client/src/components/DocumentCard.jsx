import { useRef } from "react";
import { uploadDocument } from "../services/api";

function DocumentCard({
  title,
  documentType,
  filePath,
  customerId,
  refreshCustomer,
}) {
  const fileInputRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await uploadDocument(customerId, documentType, formData);

      await refreshCustomer();

      alert(`${title} uploaded successfully`);
    } catch (err) {
      console.log(err);
      alert("Upload failed");
    }

    e.target.value = "";
  };

  return (
    <div className="flex items-center justify-between border rounded-xl p-4 hover:bg-gray-50 transition">

      <div>
        <h3 className="font-semibold text-lg">{title}</h3>

        {filePath ? (
          <p className="text-green-600 font-medium mt-1">
            ✅ Uploaded
          </p>
        ) : (
          <p className="text-gray-500 text-sm mt-1">
            Not Uploaded
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleUpload}
        />

        {filePath ? (
          <>
            <a
              href={`http://localhost:5000/${filePath}`}
              target="_blank"
              rel="noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
            >
              View
            </a>

            <button
              onClick={() => fileInputRef.current.click()}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
            >
              Replace
            </button>
          </>
        ) : (
          <button
            onClick={() => fileInputRef.current.click()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
          >
            Upload
          </button>
        )}

      </div>

    </div>
  );
}


export default DocumentCard;
