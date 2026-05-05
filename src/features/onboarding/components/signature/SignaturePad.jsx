import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const SignatureBox = () => {
  const sigCanvas = useRef({});
  const [imageURL, setImageURL] = useState(null);

  // Function to clear the signature pad
  const clear = () => sigCanvas.current.clear();

  // Function to save the signature as an image
  const save = () => {
    const dataURL = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
    setImageURL(dataURL);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h3>Sign Here</h3>
      <div style={{ border: '2px solid #000', width: 500, margin: 'auto' }}>
        <SignatureCanvas
          ref={sigCanvas}
          canvasProps={{
            width: 500,
            height: 200,
            className: 'sigCanvas'
          }}
        />
      </div>
      
      <div style={{ marginTop: '10px' }}>
        <button onClick={clear}>Clear</button>
        <button onClick={save}>Save Signature</button>
      </div>

      {imageURL ? (
        <div style={{ marginTop: '20px' }}>
          <h4>Preview:</h4>
          <img src={imageURL} alt="Your Signature" style={{ border: '1px solid #ccc' }} />
        </div>
      ) : null}
    </div>
  );
};

export default SignatureBox;