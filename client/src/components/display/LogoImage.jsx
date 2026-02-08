import { useState } from 'react';

function LogoImage({ src, alt, className = '' }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      {!loaded && <div className="absolute inset-0 bg-gray-200/40 animate-pulse" />}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}

export default LogoImage;
