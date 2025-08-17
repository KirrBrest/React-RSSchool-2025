'use client';

import { useRouter } from 'next/navigation';
import './Page404.css';

const Page404: React.FC = () => {
  const router = useRouter();
  return (
    <div className="page404__container">
      <div className="page404__content">
        <h1 className="page404__content_title">404</h1>
        <h2 className="page404__content_subtitle">Oops! Page not found</h2>
        <p className="page404__content_text">
          It seems you are lost in the space of the Internet...
        </p>
        <button
          className="page404__content_button"
          onClick={() => router.push('/')}
        >
          Back
        </button>
      </div>
      <div className="page404__astronaut">👨‍🚀</div>
    </div>
  );
};

export default Page404;
