import React from 'react';

export function SalamiPage() {
  const scriptUrl = "https://script.google.com/macros/s/AKfycbxrBZ9EGkIrbrdAyC5f-SSfQkY8HYdN_I745ZcccfJWrJbV0pu6GmVYycQD7hrf5lPJTg/exec";

  return (
    <div className="fixed inset-0 w-screen h-screen m-0 p-0 overflow-hidden bg-white z-50">
      <iframe
        src={scriptUrl}
        title="Eid Salami Tracker"
        className="w-full h-full border-0 block"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; payment"
      />
    </div>
  );
}
export default SalamiPage;
