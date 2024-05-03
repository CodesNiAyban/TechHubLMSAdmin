"use client"
import React from 'react';
import Lottie from 'react-lottie';
import Link from 'next/link';
import animationData from '../../../public/assets/boxing.json';

const ErrorCard: React.FC = () => {
    return (
        <div className="h-screen flex bg-gray-50 justify-center items-center">
            <div className="w-4/5 md:w-1/2 max-w-lg relative bg-white shadow-lg rounded-lg p-8">
                <Lottie
                    options={{
                        loop: true,
                        autoplay: true,
                        animationData: animationData,
                        rendererSettings: {
                            preserveAspectRatio: 'xMidYMid slice'
                        }
                    }}
                    height={300} // Adjust the height as needed
                    width={300} // Adjust the width as needed
                    style={{
                        zIndex: 0,
                    }}
                />
                <h4 className="text-center mt-6 text-gray-700">
                    Sorry, this email is already in use. Please try another email or contact our technical support team for assistance.
                </h4>
                <div className="flex justify-center mt-6">
                    <Link className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-300" href="/auth/login">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ErrorCard;
