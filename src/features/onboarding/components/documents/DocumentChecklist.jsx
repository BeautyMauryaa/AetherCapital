import { useState } from "react";

const docs = [
  "Certificate of Incorporation",
  "Tax Registration",
  "Proof of Address",
];

const DocumentChecklist = () => {
  const [uploaded, setUploaded] = useState({});

  const upload = (doc) => {
    setUploaded({ ...uploaded, [doc]: true });
  };

  return (
    <div className="space-y-3">
      {docs.map((doc) => (
        <div key={doc} className="flex justify-between p-3 bg-white/10 rounded">
          <span>{doc}</span>

          {uploaded[doc] ? (
            <span className="text-green-400">Uploaded</span>
          ) : (
            <button onClick={() => upload(doc)}>Upload</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default DocumentChecklist;