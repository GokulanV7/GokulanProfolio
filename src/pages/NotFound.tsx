import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-8">Page not found</p>
            <Link
                to="/"
                className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
                Go Home
            </Link>
        </div>
    );
};

export default NotFound;
