'use client';

import React from 'react';

export default function BootstrapTestPage() {
  return (
    <div className="container py-5">
      <h1 className="mb-4">Bootstrap Test Page</h1>
      
      {/* Bootstrap Grid */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="p-3 bg-primary text-white">Column 1</div>
        </div>
        <div className="col-md-4">
          <div className="p-3 bg-success text-white">Column 2</div>
        </div>
        <div className="col-md-4">
          <div className="p-3 bg-danger text-white">Column 3</div>
        </div>
      </div>
      
      {/* Bootstrap Buttons */}
      <div className="mb-4">
        <button className="btn btn-primary me-2">Primary Button</button>
        <button className="btn btn-secondary me-2">Secondary Button</button>
        <button className="btn btn-success me-2">Success Button</button>
        <button className="btn btn-danger me-2">Danger Button</button>
      </div>
      
      {/* Bootstrap Alert */}
      <div className="alert alert-info" role="alert">
        This is a Bootstrap alert to test if Bootstrap is loaded properly!
      </div>
      
      {/* Link to go back to the homepage */}
      <a href="/" className="btn btn-outline-primary mt-3">Back to Home</a>
    </div>
  );
} 